function getPokemonTypesTemplate(type) {
    return `<div class="pokemon-type">${capitalizeFirstLetter(type.type.name)}</div>`;
}
function getOverlayPokemonTemplate(pokemon, typesHTML, bgColor) {
    return `
        <div class="pokemon-overlay-content" style="--bg-color: ${bgColor}">
            <div class="overlay-top">
                <div class="overlay-close-icon-container">
                    <img src="./assets/icons/close-icon.png" class="overlay-close-icon" onclick="closeOverlay()" />
                </div>
                <div class="top-header">
                    <span>${capitalizeFirstLetter(pokemon.name)}</span>
                    <span>#${pokemon.id.toString().padStart(3, '0')}</span>
                </div>
                <div class="top-content">
                    <div class="types">${typesHTML}</div>
                    <div class="image">
                        <img src="${pokemon.image}" alt="${pokemon.name}" />
                    </div>
                </div>
            </div>
            <div class="overlay-menu">
                <div class="overlay-menu-buttons">
                    <button onclick="toggleOverlaySection('about')">About</button>
                    <button onclick="toggleOverlaySection('stats')">Stats</button>
                </div>
            </div>
            <div class="overlay-bottom">
                <div class="overlay-bottom-content" id="overlay-bottom-content-table"></div>
                <div class="overlay-bottom-nav">
                    <img src="./assets/icons/left-arrow.png" class="nav-icon" onclick="changePokemon(-1)" />
                    <img src="./assets/icons/right-arrow.png" class="nav-icon" onclick="changePokemon(1)" />
                </div>
            </div>
        </div>
    `;
}
