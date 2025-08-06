let currentPokemon = 1;
let allPokemon = [];
let filteredPokemon = [];
let isLoading = false;

async function init() {
  toggleLoading(true);
  await loadPokemon(20);
  renderPokemon();
  toggleLoading(false);
}
async function loadMore() {
  if (isLoading) return;
  toggleLoading(true);
  await loadPokemon(20);
  renderPokemon();
  toggleLoading(false);
}

async function loadPokemon(amount) {
  isLoading = true;
  for (let i = 0; i < amount; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`;
    let response = await fetch(url);
    let data = await response.json();
    allPokemon.push(data);
    currentPokemon++;
  }
  isLoading = false;
}
function renderPokemon() {
  let container = document.getElementById("pokemon-grid");
  container.innerHTML = "";
  let list = filteredPokemon.length ? filteredPokemon : allPokemon;
  list.forEach((pokemon, index) => {
    let card = getPokemonCardTemplate(pokemon, index);
    container.innerHTML += card;
  });
}
function handleSearch(event) {
  let value = event.target.value.toLowerCase();
  filteredPokemon = allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(value));
  renderPokemon();
  toggleResetButton(value.length > 0);
  toggleNotFoundMessage(filteredPokemon.length === 0 && value.length > 0);
}

function resetSearch() {
  document.getElementById("search-input").value = "";
  filteredPokemon = [];
  renderPokemon();
  toggleResetButton(false);
  toggleNotFoundMessage(false);
}
function toggleResetButton(show) {
  document.querySelector(".reset-btn").classList.toggle("d-none", !show);
}

function toggleNotFoundMessage(show) {
  document.querySelector(".not-found").classList.toggle("d-none", !show);
}

function toggleLoading(show) {
  document.getElementById("loading").classList.toggle("d-none", !show);
}
function showPokemon(index) {
  let list = filteredPokemon.length ? filteredPokemon : allPokemon;
  let pokemon = list[index];
  let typesHTML = pokemon.types.map(t => `<span class="pokemon-overlay-type">${t.type.name}</span>`).join("");
  let bgColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-color");

  let overlay = getOverlayPokemonTemplate(pokemon, typesHTML, bgColor);
  document.getElementById("pokemon-overlay").innerHTML = overlay;
  document.getElementById("overlay").classList.remove("d-none");

  renderAbout(pokemon);
}
function showTab(tabName) {
  let list = filteredPokemon.length ? filteredPokemon : allPokemon;
  let index = parseInt(document.getElementById("pokemon-overlay").getAttribute("data-index"));
  let pokemon = list[index];

  let content = "";
  if (tabName === "about") {
    let abilities = pokemon.abilities.map(a => a.ability.name).join(", ");
    content = getOverlayAboutTemplate(pokemon, abilities);
  } else if (tabName === "stats") {
    content = getOverlayStatsTemplate(pokemon.stats);
  }

  document.getElementById("overlay-bottom-content").innerHTML = content;

  document.querySelectorAll(".pokemon-overlay-tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(`tab-${tabName}`).classList.add("active");
}
