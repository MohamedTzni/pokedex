// script.js
const pokemonArray = [];
const currentPokemon = [];
const loadedPokemonIds = new Set();
let offset = 0;
const limit = 20;
let renderedCount = 0;
let selectedPokemonIndex = 0;

async function init() {
    toggleBtnLoading();
    loadSavedPokemons();

    if (pokemonArray.length === 0) {
        await loadPokemon();
    }

    updateAndRenderCurrentPokemon();
    toggleBtnLoading();
}

async function loadMore() {
    toggleBtnLoading();
    document.getElementById("search-input").value = "";

    // Store current scroll position
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    if (renderedCount >= pokemonArray.length) {
        await loadPokemon();
    }

    updateAndRenderCurrentPokemon();
    toggleBtnLoading();
    
    // Restore scroll position after rendering
    window.scrollTo(0, scrollPosition);
}

async function loadPokemon() {
    try {
        await loadPokemonData();
        savePokemons();
    } catch (error) {
        console.error("Fehler beim Laden:", error);
        alert("Etwas ist schiefgelaufen. Bitte später erneut versuchen.");
    }
}

async function loadPokemonData() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetchData(url);
    await buildPokemonArray(response.results);
    offset += limit;
}

async function buildPokemonArray(pokemonList) {
    for (const entry of pokemonList) {
        const data = await fetchData(entry.url);

        if (!loadedPokemonIds.has(data.id)) {
            loadedPokemonIds.add(data.id);
            const pokemon = buildPokemonData(data);
            pokemonArray.push(pokemon);
        }
    }
}

function buildPokemonData(data) {
    const stats = correctAndCompleteStats(data.stats);

    return {
        id: data.id,
        name: data.name,
        types: data.types,
        image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
        abilities: data.abilities,
        stats: stats,
        height: correctUnit(data.height),
        weight: correctUnit(data.weight)
    };
}

function correctAndCompleteStats(stats) {
    const total = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    stats.push({ base_stat: total, stat: { name: "total" } });

    stats[0].stat.name = "HP";
    stats[3].stat.name = "Sp. Atk.";
    stats[4].stat.name = "Sp. Def.";

    return stats;
}

function renderPokemonCards() {
    const container = document.getElementById("pokemons");
    container.innerHTML = "";

    currentPokemon.forEach((pokemon, index) => {
        const typesHTML = pokemon.types.map(type =>
            `<div class="pokemon-type">${capitalizeFirstLetter(type.type.name)}</div>`
        ).join("");

        const bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "#777";

        container.innerHTML += `
            <div class="pokemon-card" 
                 style="--bg-color: ${bgColor}"
                 onclick="openOverlay(${index})">
                <div class="name-id">
                    <h4 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h4>
                    <span class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</span>
                </div>
                <div class="pokemon-types">${typesHTML}</div>
                <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy" />
            </div>
        `;
    });
}

function savePokemons() {
    localStorage.setItem("pokemonArray", JSON.stringify(pokemonArray));
    localStorage.setItem("loadedPokemonIds", JSON.stringify([...loadedPokemonIds]));
    localStorage.setItem("offset", offset);
}

function loadSavedPokemons() {
    const savedArray = localStorage.getItem("pokemonArray");
    const savedIds = localStorage.getItem("loadedPokemonIds");

    currentPokemon.push(...JSON.parse(savedArray || "[]"));
    JSON.parse(savedIds || "[]").forEach(id => loadedPokemonIds.add(id));

    offset = parseInt(localStorage.getItem("offset") || "0", 10);
}

function resetPokedex() {
    localStorage.clear();
    location.reload();
}

function handleSearch(event) {
    const value = event.target.value.toLowerCase();
    const actionButtons = document.querySelector(".action-buttons");

    if (value.length < 3) {
        currentPokemon.length = 0;
        currentPokemon.push(...pokemonArray.slice(0, renderedCount));
        actionButtons.style.display = "flex";
        renderPokemonCards();
        return;
    }

    currentPokemon.length = 0;
    currentPokemon.push(...filterPokemon(value));
    actionButtons.style.display = "none";

    if (currentPokemon.length === 0) {
        searchNotFoundMessage();
    } else {
        renderPokemonCards();
    }
}

function filterPokemon(value) {
    return pokemonArray.filter(pokemon => {
        const name = pokemon.name.toLowerCase();
        const id = String(pokemon.id);
        const types = pokemon.types.map(t => t.type.name.toLowerCase());

        return (
            name.includes(value) ||
            id.includes(value) ||
            types.some(type => type.includes(value))
        );
    });
}

function searchNotFoundMessage() {
    const container = document.getElementById("pokemons");
    container.innerHTML = '<h3 class="not-found">No Pokémon found matching your search!</h3>';
}

function openOverlay(index) {
    selectedPokemonIndex = index;
    renderOverlayPokemon(currentPokemon[selectedPokemonIndex]);
    document.getElementById("overlay").classList.remove("d-none");
    document.body.classList.add("overflow-y-hidden");
}

function closeOverlay() {
    document.getElementById("overlay").classList.add("d-none");
    document.body.classList.remove("overflow-y-hidden");
}

function preventBubbling(event) {
    event.stopPropagation();
}

function changePokemon(direction) {
    selectedPokemonIndex = (selectedPokemonIndex + direction + currentPokemon.length) % currentPokemon.length;
    renderOverlayPokemon(currentPokemon[selectedPokemonIndex]);
}

function renderOverlayPokemon(pokemon) {
    const typesHTML = pokemon.types.map(t => getPokemonTypesTemplate(t)).join("");
    const bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "#777";
    const overlay = document.getElementById("pokemon-overlay");

    overlay.innerHTML = getOverlayPokemonTemplate(pokemon, typesHTML, bgColor);
    toggleOverlaySection("about");
}

function toggleOverlaySection(section) {
    const pokemon = currentPokemon[selectedPokemonIndex];
    const abilities = pokemon.abilities.map(a => capitalizeFirstLetter(a.ability.name)).join(", ");
    const content = document.getElementById("overlay-bottom-content-table");
    const bottom = document.querySelector(".overlay-bottom");

    toggleOverlayMenuButtonActive(section);

    if (section === "about") {
        content.innerHTML = getOverlayAboutTemplate(pokemon, abilities);
        bottom.classList.remove("scrollable");
    } else if (section === "stats") {
        content.innerHTML = getOverlayStatsTemplate(pokemon.stats);
        bottom.classList.add("scrollable");
    }
}

function toggleOverlayMenuButtonActive(section) {
    document.querySelectorAll(".overlay-menu button").forEach(button => {
        const isActive = button.textContent.toLowerCase().includes(section);
        button.classList.toggle("active", isActive);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function correctUnit(unit) {
    return unit / 10;
}

function toggleBtnLoading() {
    const buttons = document.querySelectorAll(".action-buttons .seville");
    const loader = document.getElementById("loading");

    buttons.forEach(btn => {
        const disabled = btn.style.pointerEvents === "none";
        btn.style.pointerEvents = disabled ? "auto" : "none";
        btn.style.opacity = disabled ? "1" : "0.5";
    });

    loader.classList.toggle("d-none");
}

async function fetchData(url = "") {
    const response = await fetch(url);
    return response.json();
}

function debounce(callback, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), delay);
    };
}

function updateAndRenderCurrentPokemon() {
    const end = renderedCount + limit;
    const newPokemons = pokemonArray.slice(renderedCount, end);
    currentPokemon.push(...newPokemons);
    renderedCount += limit;
    renderPokemonCards();
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", debounce(handleSearch, 250));
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeOverlay();
        const overlayEl = document.getElementById("overlay");
        if (!overlayEl.classList.contains("d-none")) {
            if (event.key === "ArrowRight") changePokemon(1);
            if (event.key === "ArrowLeft") changePokemon(-1);
        }
    });
});