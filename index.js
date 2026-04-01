const heroes = {
  Arien: { complexity: 1, expansion: 'Base' },
  Brogan: { complexity: 1, expansion: 'Base' },
  Tigerclaw: { complexity: 1, expansion: 'Base' },
  Wasp: { complexity: 1, expansion: 'Base' },
  Sabina: { complexity: 1, expansion: 'Base' },
  Xargatha: { complexity: 1, expansion: 'Base' },
  Dodger: { complexity: 1, expansion: 'Base' },
  Rowenna: { complexity: 2, expansion: 'Arcane' },
  Garrus: { complexity: 2, expansion: 'Defiant' },
  Bain: { complexity: 2, expansion: 'Defiant' },
  Whisper: { complexity: 2, expansion: 'Devoted' },
  Misa: { complexity: 2, expansion: 'Devoted' },
  Ursafar: { complexity: 2, expansion: 'Devoted' },
  Silverarrow: { complexity: 2, expansion: 'Devoted' },
  Min: { complexity: 2, expansion: 'Renown' },
  Mrak: { complexity: 3, expansion: 'Arcane' },
  Cutter: { complexity: 3, expansion: 'Defiant' },
  Trinkets: { complexity: 3, expansion: 'Defiant' },
  Tali: { complexity: 3, expansion: 'Devoted' },
  Swift: { complexity: 3, expansion: 'Renown' },
  Wuk: { complexity: 3, expansion: 'Renown' },
  Hanu: { complexity: 3, expansion: 'Renown' },
  Brynn: { complexity: 3, expansion: 'Wayward' },
  Mortimer: { complexity: 3, expansion: 'Wayward' },
  Widget: { complexity: 3, expansion: 'Wayward' },
  Snorri: { complexity: 4, expansion: 'Arcane' },
  Razzle: { complexity: 4, expansion: 'Arcane' },
  Gydion: { complexity: 4, expansion: 'Arcane' },
  Nebkher: { complexity: 4, expansion: 'Defiant' },
  Ignatia: { complexity: 4, expansion: 'Renown' },
  Takahide: { complexity: 4, expansion: 'Wayward' },
  Emmitt: { complexity: 4, expansion: 'Wayward' }
};

document.addEventListener("DOMContentLoaded", () => {
  // --- Persistence helpers ---
  const FORM_STORAGE_KEY = 'draftsOfAtlantisFormSettings';
  const heroNames = Object.keys(heroes).sort((a, b) => a.localeCompare(b));

  function getFormSettings() {
    const settings = {};
    // Draft type
    const draftType = draftTypeRadios.find((radio) => radio.checked);
    settings.draftType = draftType ? draftType.value : '';
    // Complexities
    settings.complexity = Array.from(form.querySelectorAll('input[name="complexity"]')).map(cb => cb.checked);
    // Expansions
    settings.expansion = Array.from(form.querySelectorAll('input[name="expansion"]')).map(cb => cb.checked);
    settings.heroSelection = Array.from(form.querySelectorAll('input[name="heroSelection"]')).map(cb => cb.checked);
    settings.heroSelectionExpanded = heroSelectionDetails.open;
    // Selects
    settings.numHeroes = numHeroesSelect.value;
    settings.numPlayers = numPlayersSelect.value;
    settings.singleNumPlayers = singleNumPlayersSelect.value;
    return settings;
  }

  function setFormSettings(settings) {
    // Draft type
    if (settings.draftType) {
      const radio = form.querySelector(`input[name="draftType"][value="${settings.draftType}"]`);
      if (radio) radio.checked = true;
    }
    // Complexities
    if (Array.isArray(settings.complexity)) {
      const cbs = form.querySelectorAll('input[name="complexity"]');
      cbs.forEach((cb, i) => { cb.checked = !!settings.complexity[i]; });
    }
    // Expansions
    if (Array.isArray(settings.expansion)) {
      const cbs = form.querySelectorAll('input[name="expansion"]');
      cbs.forEach((cb, i) => { cb.checked = !!settings.expansion[i]; });
    }
    if (Array.isArray(settings.heroSelection)) {
      const cbs = form.querySelectorAll('input[name="heroSelection"]');
      cbs.forEach((cb, i) => { cb.checked = settings.heroSelection[i] !== false; });
    }
    heroSelectionDetails.open = settings.heroSelectionExpanded === true;
    // Selects
    if (settings.numHeroes) numHeroesSelect.value = settings.numHeroes;
    if (settings.numPlayers) numPlayersSelect.value = settings.numPlayers;
    if (settings.singleNumPlayers) singleNumPlayersSelect.value = settings.singleNumPlayers;
  }

  function saveFormSettings() {
    const settings = getFormSettings();
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(settings));
  }

  function restoreFormSettings() {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return;
    try {
      const settings = JSON.parse(raw);
      setFormSettings(settings);
    } catch (e) {
      console.warn("Could not restore form settings:", e);
    }
  }
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
  const expansionGroup = document.getElementById("expansionGroup");
  const heroSelectionDetails = document.getElementById("heroSelectionDetails");
  const heroSelectionList = document.getElementById("heroSelectionList");
  const addAllHeroesButton = document.getElementById("addAllHeroesButton");

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
    !heroSelectionDetails ||
    !heroSelectionList ||
    !addAllHeroesButton ||
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
      complexity: data.complexity,
      expansion: data.expansion.toLowerCase()
    }));
  }

  function populateHeroSelectionList() {
    heroSelectionList.innerHTML = heroNames
      .map(
        (name) => `
          <label class="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <input type="checkbox" name="heroSelection" value="${name}" checked class="h-4 w-4 accent-sky-700 dark:accent-amber-400">
            <span class="grow font-medium">${name}</span>
            ${starMarkup(heroes[name].complexity)}
          </label>
        `
      )
      .join("");
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

  function getIncludedHeroNames() {
    return new Set(
      Array.from(form.querySelectorAll('input[name="heroSelection"]:checked')).map(
        (checkbox) => checkbox.value
      )
    );
  }

  function renderResults(markup) {
    resultsDiv.innerHTML = markup;
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });
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


  // --- Attach change listeners for persistence ---
  draftTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateDraftTypeUI();
      clearResults();
      saveFormSettings();
    });
  });

  form.querySelectorAll("input, select").forEach((element) => {
    element.addEventListener("change", () => {
      clearResults();
      saveFormSettings();
    });
  });

  heroSelectionList.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement && event.target.name === "heroSelection") {
      clearResults();
      saveFormSettings();
    }
  });

  heroSelectionDetails.addEventListener("toggle", saveFormSettings);

  addAllHeroesButton.addEventListener("click", () => {
    form.querySelectorAll('input[name="heroSelection"]').forEach((checkbox) => {
      checkbox.checked = true;
    });
    clearResults();
    saveFormSettings();
  });

  // Restore settings on load
  populateHeroSelectionList();
  restoreFormSettings();
  updateDraftTypeUI();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const draftType = getDraftType();
    const heroList = getHeroList();
    // Get selected complexities for filtering
    const checkedComplexities = Array.from(
      form.querySelectorAll('input[name="complexity"]:checked')
    ).map((checkbox) => parseInt(checkbox.value, 10));
    // Get selected expansions for filtering
    const checkedExpansions = Array.from(
      form.querySelectorAll('input[name="expansion"]:checked')
    ).map((checkbox) => checkbox.value);
    const includedHeroNames = getIncludedHeroNames();
    const expansionFilteredHeroes = heroList.filter(
      (hero) =>
        includedHeroNames.has(hero.name) &&
        checkedExpansions.includes(hero.expansion)
    );

    if (draftType === "oneEach") {
      const numPlayers = parseInt(numPlayersSelect.value, 10);
      const pools = {
        1: expansionFilteredHeroes.filter((hero) => hero.complexity === 1),
        2: expansionFilteredHeroes.filter((hero) => hero.complexity === 2),
        3: expansionFilteredHeroes.filter((hero) => hero.complexity === 3),
        4: expansionFilteredHeroes.filter((hero) => hero.complexity === 4)
      };

      for (let complexity = 1; complexity <= 4; complexity += 1) {
        if (pools[complexity].length < numPlayers) {
          renderResults(
            renderError(
            `Error: Only ${pools[complexity].length} hero${
              pools[complexity].length === 1 ? "" : "es"
            } available for complexity ${complexity}, but you requested ${numPlayers}.`
            )
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

      renderResults(renderPlayerDrafts(playerDrafts));
      return;
    }

    if (draftType === "single") {
      const numPlayers = parseInt(singleNumPlayersSelect.value, 10);
      const eligibleHeroes = expansionFilteredHeroes.filter((hero) =>
        checkedComplexities.includes(hero.complexity)
      );
      if (eligibleHeroes.length < numPlayers * 3) {
        renderResults(
          renderError(
            `Error: Only ${eligibleHeroes.length} heroes available for the selected complexities, but you requested ${numPlayers * 3}.`
          )
        );
        return;
      }
      const pool = shuffle([...eligibleHeroes]);
      const playerDrafts = [];
      for (let playerIndex = 0; playerIndex < numPlayers; playerIndex += 1) {
        const playerHeroes = pool.splice(0, 3).sort((a, b) => a.complexity - b.complexity);
        playerDrafts.push(playerHeroes);
      }
      renderResults(renderPlayerDrafts(playerDrafts));
      return;
    }

    if (draftType === "allRandom") {
      const numPlayers = parseInt(numPlayersSelect.value, 10);
      const eligibleHeroes = expansionFilteredHeroes.filter((hero) =>
        checkedComplexities.includes(hero.complexity)
      );
      if (eligibleHeroes.length < numPlayers) {
        renderResults(
          renderError(
            `Error: Only ${eligibleHeroes.length} heroes available for the selected complexities, but you requested ${numPlayers}.`
          )
        );
        return;
      }
      const pool = shuffle([...eligibleHeroes]);
      const playerDrafts = [];
      for (let playerIndex = 0; playerIndex < numPlayers; playerIndex += 1) {
        const hero = pool.shift();
        playerDrafts.push([hero]);
      }
      renderResults(renderPlayerDrafts(playerDrafts));
      return;
    }

    const numHeroes = parseInt(numHeroesSelect.value, 10);
    const eligibleHeroes = expansionFilteredHeroes.filter((hero) =>
      checkedComplexities.includes(hero.complexity)
    );

    if (eligibleHeroes.length < numHeroes) {
      renderResults(
        renderError(
          `Error: Only ${eligibleHeroes.length} hero${
            eligibleHeroes.length === 1 ? "" : "es"
          } available for your selection, but you requested ${numHeroes}.`
        )
      );
      return;
    }

    const draftedHeroes = shuffle([...eligibleHeroes])
      .slice(0, numHeroes)
      .sort((a, b) => a.complexity - b.complexity);

    renderResults(renderHeroList(draftedHeroes));
  });
});
