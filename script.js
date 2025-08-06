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
