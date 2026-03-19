const heroes = {
  Arien: {
    complexity: 1
  },
  Brogan: {
    complexity: 1
  },
  Tigerclaw: {
    complexity: 1
  },
  Wasp: {
    complexity: 1
  },
  Sabina: {
    complexity: 1
  },
  Xargatha: {
    complexity: 1
  },
  Dodger: {
    complexity: 1
  },
  Rowenna: {
    complexity: 2
  },
  Garrus: {
    complexity: 2
  },
  Bain: {
    complexity: 2
  },
  Whisper: {
    complexity: 2
  },
  Misa: {
    complexity: 2
  },
  Ursafar: {
    complexity: 2
  },
  Silverarrow: {
    complexity: 2
  },
  Min: {
    complexity: 2
  },
  Mrak: {
    complexity: 3
  },
  Cutter: {
    complexity: 3
  },
  Trinkets: {
    complexity: 3
  },
  Tali: {
    complexity: 3
  },
  Swift: {
    complexity: 3
  },
  Wuk: {
    complexity: 3
  },
  Hanu: {
    complexity: 3
  },
  Brynn: {
    complexity: 3
  },
  Mortimer: {
    complexity: 3
  },
  Widget: {
    complexity: 3
  },
  Snorri: {
    complexity: 4
  },
  Razzle: {
    complexity: 4
  },
  Gydion: {
    complexity: 4
  },
  Nebkher: {
    complexity: 4
  },
  Ignatia: {
    complexity: 4
  },
  Takahide: {
    complexity: 4
  },
  Emmitt: {
    complexity: 4
  }
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
  const resultsDiv = document.getElementById('draftResults');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get number of heroes to draft
    const numHeroes = parseInt(document.getElementById('numHeroes').value, 10);

    // Get selected complexities
    const checkedComplexities = Array.from(form.querySelectorAll('input[name="complexity"]:checked')).map(cb => parseInt(cb.value, 10));


    // Filter heroes by selected complexities
    const eligibleHeroes = getHeroList().filter(h => checkedComplexities.includes(h.complexity));

    if (eligibleHeroes.length < numHeroes) {
      resultsDiv.innerHTML = `<span style="color:#b00; font-weight:500;">Error: Only ${eligibleHeroes.length} hero${eligibleHeroes.length === 1 ? '' : 'es'} available for your selection, but you requested ${numHeroes}.</span>`;
      return;
    }

    // Shuffle and pick N
    let drafted = shuffle([...eligibleHeroes]).slice(0, numHeroes);
    // Sort by complexity, lowest first
    drafted = drafted.sort((a, b) => a.complexity - b.complexity);

    // Output
    resultsDiv.innerHTML = `<strong>Drafted Heroes:</strong><ul>` +
      drafted.map(h => `<li>${h.name} <span style='color:#e0b100;'>${'★'.repeat(h.complexity)}</span></li>`).join('') +
      `</ul>`;
  });

})();