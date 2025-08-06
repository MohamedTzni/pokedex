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
function getOverlayAboutTemplate(pokemon, abilities) {
    return `
        <table id="overlay-bottom-content-table">
            <tr><td>Height:</td><td>${pokemon.height} m</td></tr>
            <tr><td>Weight:</td><td>${pokemon.weight} kg</td></tr>
            <tr><td>Abilities:</td><td>${abilities}</td></tr>
        </table>
    `;
}
function getOverlayStatsTemplate(stats) {
    const statBars = stats.map(...).join("");
    return `<table id="overlay-bottom-content-table">${statBars}</table>`;
}
