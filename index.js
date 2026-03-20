// ...existing code...

const heroes = {
  Arien: { complexity: 1 },
  Brogan: { complexity: 1 },
  Tigerclaw: { complexity: 1 },
  Wasp: { complexity: 1 },
  Sabina: { complexity: 1 },
  Xargatha: { complexity: 1 },
  Dodger: { complexity: 1 },
  Rowenna: { complexity: 2 },
  Garrus: { complexity: 2 },
  Bain: { complexity: 2 },
  Whisper: { complexity: 2 },
  Misa: { complexity: 2 },
  Ursafar: { complexity: 2 },
  Silverarrow: { complexity: 2 },
  Min: { complexity: 2 },
  Mrak: { complexity: 3 },
  Cutter: { complexity: 3 },
  Trinkets: { complexity: 3 },
  Tali: { complexity: 3 },
  Swift: { complexity: 3 },
  Wuk: { complexity: 3 },
  Hanu: { complexity: 3 },
  Brynn: { complexity: 3 },
  Mortimer: { complexity: 3 },
  Widget: { complexity: 3 },
  Snorri: { complexity: 4 },
  Razzle: { complexity: 4 },
  Gydion: { complexity: 4 },
  Nebkher: { complexity: 4 },
  Ignatia: { complexity: 4 },
  Takahide: { complexity: 4 },
  Emmitt: { complexity: 4 }
};

(() => {


  // Helper: get hero list as array of {name, complexity}
  function getHeroList() {
    return Object.entries(heroes).map(([name, data]) => ({ name, complexity: data.complexity }));
  }

  // Helper: shuffle array (Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // DOM elements

  const form = document.getElementById('draftForm');
  const draftTypeRadios = Array.from(document.querySelectorAll('input[name="draftType"]'));
  const complexityGroup = document.getElementById('complexityGroup');
  const numHeroesGroup = document.getElementById('numHeroesGroup');
  const numPlayersGroup = document.getElementById('numPlayersGroup');
  const numPlayersSelect = document.getElementById('numPlayers');
  const singleNumPlayersGroup = document.getElementById('singleNumPlayersGroup');
  const singleNumPlayersSelect = document.getElementById('singleNumPlayers');
  const resultsDiv = document.getElementById('draftResults');

  // Show/hide controls based on draft type
  function getDraftType() {
    const checked = draftTypeRadios.find(r => r.checked);
    return checked ? checked.value : 'random';
  }

  function updateDraftTypeUI() {
    const type = getDraftType();
    if (type === 'oneEach') {
      complexityGroup.style.display = 'none';
      numHeroesGroup.style.display = 'none';
      numPlayersGroup.style.display = '';
      singleNumPlayersGroup.style.display = 'none';
    } else if (type === 'single') {
      complexityGroup.style.display = 'none';
      numHeroesGroup.style.display = 'none';
      numPlayersGroup.style.display = 'none';
      singleNumPlayersGroup.style.display = '';
    } else {
      complexityGroup.style.display = '';
      numHeroesGroup.style.display = '';
      numPlayersGroup.style.display = 'none';
      singleNumPlayersGroup.style.display = 'none';
    }
  }

  // Helper: clear results
  function clearResults() {
    resultsDiv.innerHTML = '';
  }

  draftTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateDraftTypeUI();
      clearResults();
    });
  });

  // Clear results on any form input change
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('change', clearResults);
  });

  // Ensure correct UI state on load
  updateDraftTypeUI();

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const draftType = getDraftType();
    if (draftType === 'oneEach') {
      // One from each complexity, for each player
      const numPlayers = parseInt(numPlayersSelect.value, 10);
      const heroList = getHeroList();
      // Build pools for each complexity
      const pools = {
        1: heroList.filter(h => h.complexity === 1),
        2: heroList.filter(h => h.complexity === 2),
        3: heroList.filter(h => h.complexity === 3),
        4: heroList.filter(h => h.complexity === 4)
      };
      // Check if enough heroes in each pool
      for (let c = 1; c <= 4; c++) {
        if (pools[c].length < numPlayers) {
          resultsDiv.innerHTML = `<span style="color:#b00; font-weight:500;">Error: Only ${pools[c].length} hero${pools[c].length === 1 ? '' : 'es'} available for complexity ${c}, but you requested ${numPlayers}.</span>`;
          return;
        }
      }
      // Draft for each player
      let playerDrafts = [];
      // Make copies so we can remove as we go
      let poolCopies = {
        1: [...pools[1]],
        2: [...pools[2]],
        3: [...pools[3]],
        4: [...pools[4]]
      };
      for (let p = 0; p < numPlayers; p++) {
        let playerHeroes = [];
        for (let c = 1; c <= 4; c++) {
          let pool = poolCopies[c];
          let idx = Math.floor(Math.random() * pool.length);
          let hero = pool.splice(idx, 1)[0];
          playerHeroes.push(hero);
        }
        // Sort by complexity for each player
        playerHeroes = playerHeroes.sort((a, b) => a.complexity - b.complexity);
        playerDrafts.push(playerHeroes);
      }
      // Output
      let html = '<h2>Results</h2>';
      html += '<div class="player-columns">';
      playerDrafts.forEach((heroes, i) => {
        html += `<div class="player-block"><strong>Player #${i+1}</strong><ul>` +
          heroes.map(h => `<li>${h.name} <span class="star">${'⭐'.repeat(h.complexity)}</span></li>`).join('') +
          `</ul></div>`;
      });
      html += '</div>';
      resultsDiv.innerHTML = html;
      return;
    }

    if (draftType === 'single') {
      // Single draft: assign 3 unique random heroes to each player
      const numPlayers = parseInt(singleNumPlayersSelect.value, 10);
      const heroList = getHeroList();
      if (heroList.length < numPlayers * 3) {
        resultsDiv.innerHTML = `<span style="color:#b00; font-weight:500;">Error: Only ${heroList.length} heroes available, but you requested ${numPlayers * 3}.</span>`;
        return;
      }
      let pool = shuffle([...heroList]);
      let playerDrafts = [];
      for (let p = 0; p < numPlayers; p++) {
        let playerHeroes = pool.splice(0, 3);
        playerHeroes = playerHeroes.sort((a, b) => a.complexity - b.complexity);
        playerDrafts.push(playerHeroes);
      }
      // Output
      let html = '<h2>Results</h2>';
      html += '<div class="player-columns">';
      playerDrafts.forEach((heroes, i) => {
        html += `<div class="player-block"><strong>Player #${i+1}</strong><ul>` +
          heroes.map(h => `<li>${h.name} <span class="star">${'⭐'.repeat(h.complexity)}</span></li>`).join('') +
          `</ul></div>`;
      });
      html += '</div>';
      resultsDiv.innerHTML = html;
      return;
    }

    // Random draft (original logic)
    const numHeroes = parseInt(document.getElementById('numHeroes').value, 10);
    const checkedComplexities = Array.from(form.querySelectorAll('input[name="complexity"]:checked')).map(cb => parseInt(cb.value, 10));
    const eligibleHeroes = getHeroList().filter(h => checkedComplexities.includes(h.complexity));
    if (eligibleHeroes.length < numHeroes) {
      resultsDiv.innerHTML = `<span style="color:#b00; font-weight:500;">Error: Only ${eligibleHeroes.length} hero${eligibleHeroes.length === 1 ? '' : 'es'} available for your selection, but you requested ${numHeroes}.</span>`;
      return;
    }
    let drafted = shuffle([...eligibleHeroes]).slice(0, numHeroes);
    drafted = drafted.sort((a, b) => a.complexity - b.complexity);
    resultsDiv.innerHTML = `<h2>Results</h2><ul>` +
      drafted.map(h => `<li>${h.name} <span style='color:#e0b100;'>${'⭐'.repeat(h.complexity)}</span></li>`).join('') +
      `</ul>`;
  });

})();