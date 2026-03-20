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

document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("draftForm") ||
    document.getElementById("draft-form");

  const resultsDiv =
    document.getElementById("draftResults") ||
    document.getElementById("results");

  const draftTypeRadios = Array.from(
    document.querySelectorAll('input[name="draftType"]')
  );

  const complexityGroup =
    document.getElementById("complexityGroup") ||
    document.querySelector(".complexity-group");

  const numHeroesGroup = document.getElementById("numHeroesGroup");
  const numPlayersGroup = document.getElementById("numPlayersGroup");
  const singleNumPlayersGroup = document.getElementById("singleNumPlayersGroup");

  const numHeroesSelect = document.getElementById("numHeroes");
  const numPlayersSelect = document.getElementById("numPlayers");
  const singleNumPlayersSelect = document.getElementById("singleNumPlayers");

  if (
    !form ||
    !resultsDiv ||
    !draftTypeRadios.length ||
    !complexityGroup ||
    !numHeroesGroup ||
    !numPlayersGroup ||
    !singleNumPlayersGroup ||
    !numHeroesSelect ||
    !numPlayersSelect ||
    !singleNumPlayersSelect
  ) {
    console.error("Drafts of Atlantis: required page elements were not found.");
    return;
  }

  function getHeroList() {
    return Object.entries(heroes).map(([name, data]) => ({
      name,
      complexity: data.complexity
    }));
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function starMarkup(complexity) {
    return `<span class="text-xs ml-1 text-amber-500 dark:text-amber-400">${"⭐".repeat(
      complexity
    )}</span>`;
  }

  function renderError(message) {
    return `
      <div class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
        ${message}
      </div>
    `;
  }

  function renderResultsHeader() {
    return '<h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Results</h2>';
  }

  function renderPlayerDrafts(playerDrafts) {
    return `
      ${renderResultsHeader()}
      <div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-10">
        ${playerDrafts
          .map(
            (heroesForPlayer, index) => `
          <section class="">
            <strong class="block text-base font-semibold text-sky-800 dark:text-amber-400">Player #${
              index + 1
            }</strong>
            <ul class="mt-3 space-y-1">
              ${heroesForPlayer
                .map(
                  (hero) => `
                <li class="flex items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <span class="font-medium">${hero.name}</span>
                  ${starMarkup(hero.complexity)}
                </li>
              `
                )
                .join("")}
            </ul>
          </section>
        `
          )
          .join("")}
      </div>
    `;
  }

  function renderHeroList(heroesToShow) {
    return `
      ${renderResultsHeader()}
      <ul class="mt-4 space-y-2">
        ${heroesToShow
          .map(
            (hero) => `
          <li class="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <span class="font-medium">${hero.name}</span>
            ${starMarkup(hero.complexity)}
          </li>
        `
          )
          .join("")}
      </ul>
    `;
  }

  function getDraftType() {
    const checked = draftTypeRadios.find((radio) => radio.checked);
    return checked ? checked.value : "random";
  }

  function setVisibility(element, isVisible) {
    element.classList.toggle("hidden", !isVisible);
  }

  function clearResults() {
    resultsDiv.innerHTML = "";
  }

  function updateDraftTypeUI() {
    const type = getDraftType();
    if (type === "oneEach") {
      setVisibility(complexityGroup, false);
      setVisibility(numHeroesGroup, false);
      setVisibility(numPlayersGroup, true);
      setVisibility(singleNumPlayersGroup, false);
    } else if (type === "single") {
      setVisibility(complexityGroup, true);
      setVisibility(numHeroesGroup, false);
      setVisibility(numPlayersGroup, false);
      setVisibility(singleNumPlayersGroup, true);
    } else if (type === "allRandom") {
      setVisibility(complexityGroup, true);
      setVisibility(numHeroesGroup, false);
      setVisibility(numPlayersGroup, true);
      setVisibility(singleNumPlayersGroup, false);
    } else {
      setVisibility(complexityGroup, true);
      setVisibility(numHeroesGroup, true);
      setVisibility(numPlayersGroup, false);
      setVisibility(singleNumPlayersGroup, false);
    }
  }

  draftTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateDraftTypeUI();
      clearResults();
    });
  });

  form.querySelectorAll("input, select").forEach((element) => {
    element.addEventListener("change", clearResults);
  });

  updateDraftTypeUI();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const draftType = getDraftType();
    const heroList = getHeroList();
    // Get selected complexities for filtering
    const checkedComplexities = Array.from(
      form.querySelectorAll('input[name="complexity"]:checked')
    ).map((checkbox) => parseInt(checkbox.value, 10));

    if (draftType === "oneEach") {
      const numPlayers = parseInt(numPlayersSelect.value, 10);
      const pools = {
        1: heroList.filter((hero) => hero.complexity === 1),
        2: heroList.filter((hero) => hero.complexity === 2),
        3: heroList.filter((hero) => hero.complexity === 3),
        4: heroList.filter((hero) => hero.complexity === 4)
      };

      for (let complexity = 1; complexity <= 4; complexity += 1) {
        if (pools[complexity].length < numPlayers) {
          resultsDiv.innerHTML = renderError(
            `Error: Only ${pools[complexity].length} hero${
              pools[complexity].length === 1 ? "" : "es"
            } available for complexity ${complexity}, but you requested ${numPlayers}.`
          );
          return;
        }
      }

      const poolCopies = {
        1: [...pools[1]],
        2: [...pools[2]],
        3: [...pools[3]],
        4: [...pools[4]]
      };

      const playerDrafts = [];

      for (let playerIndex = 0; playerIndex < numPlayers; playerIndex += 1) {
        const playerHeroes = [];

        for (let complexity = 1; complexity <= 4; complexity += 1) {
          const pool = poolCopies[complexity];
          const index = Math.floor(Math.random() * pool.length);
          const hero = pool.splice(index, 1)[0];
          playerHeroes.push(hero);
        }

        playerDrafts.push(
          playerHeroes.sort((a, b) => a.complexity - b.complexity)
        );
      }

      resultsDiv.innerHTML = renderPlayerDrafts(playerDrafts);
      return;
    }

    if (draftType === "single") {
      const numPlayers = parseInt(singleNumPlayersSelect.value, 10);
      const eligibleHeroes = heroList.filter((hero) => checkedComplexities.includes(hero.complexity));
      if (eligibleHeroes.length < numPlayers * 3) {
        resultsDiv.innerHTML = renderError(
          `Error: Only ${eligibleHeroes.length} heroes available for the selected complexities, but you requested ${numPlayers * 3}.`
        );
        return;
      }
      const pool = shuffle([...eligibleHeroes]);
      const playerDrafts = [];
      for (let playerIndex = 0; playerIndex < numPlayers; playerIndex += 1) {
        const playerHeroes = pool.splice(0, 3).sort((a, b) => a.complexity - b.complexity);
        playerDrafts.push(playerHeroes);
      }
      resultsDiv.innerHTML = renderPlayerDrafts(playerDrafts);
      return;
    }

    if (draftType === "allRandom") {
      const numPlayers = parseInt(numPlayersSelect.value, 10);
      const eligibleHeroes = heroList.filter((hero) => checkedComplexities.includes(hero.complexity));
      if (eligibleHeroes.length < numPlayers) {
        resultsDiv.innerHTML = renderError(
          `Error: Only ${eligibleHeroes.length} heroes available for the selected complexities, but you requested ${numPlayers}.`
        );
        return;
      }
      const pool = shuffle([...eligibleHeroes]);
      const playerDrafts = [];
      for (let playerIndex = 0; playerIndex < numPlayers; playerIndex += 1) {
        const hero = pool.shift();
        playerDrafts.push([hero]);
      }
      resultsDiv.innerHTML = renderPlayerDrafts(playerDrafts);
      return;
    }

    const numHeroes = parseInt(numHeroesSelect.value, 10);
    const eligibleHeroes = heroList.filter((hero) =>
      checkedComplexities.includes(hero.complexity)
    );

    if (eligibleHeroes.length < numHeroes) {
      resultsDiv.innerHTML = renderError(
        `Error: Only ${eligibleHeroes.length} hero${
          eligibleHeroes.length === 1 ? "" : "es"
        } available for your selection, but you requested ${numHeroes}.`
      );
      return;
    }

    const draftedHeroes = shuffle([...eligibleHeroes])
      .slice(0, numHeroes)
      .sort((a, b) => a.complexity - b.complexity);

    resultsDiv.innerHTML = renderHeroList(draftedHeroes);
  });
});