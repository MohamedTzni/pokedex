function getPokemonTypesTemplate(type) {
    return `<div class="pokemon-type">${capitalizeFirstLetter(type.type.name)}</div>`;
}
