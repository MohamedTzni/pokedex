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
