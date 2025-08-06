function getOverlayPokemonTemplate(pokemon, typesHTML, bgColor) {
    return `
        <div class="pokemon-overlay-content" style="--bg-color: ${bgColor}">
            ...
            <div class="image">
                <img src="${pokemon.image}" alt="${pokemon.name}" />
            </div>
            ...
        </div>
    `;
}
