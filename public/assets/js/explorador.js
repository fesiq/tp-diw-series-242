const TMDB_API_KEY = "2f10809f73d8fa55a72552fcb4d21da2";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");

async function fetchSeries(query) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=pt-BR&query=${query}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar séries:", error);
        return [];
    }
}


function displayResults(series) {
    
    resultsContainer.innerHTML = "";

    if (series.length === 0) {
        resultsContainer.innerHTML = `<p class="text-center">Nenhuma série encontrada.</p>`;
        return;
    }

    series.forEach(serie => {
        const card = document.createElement("div");
        card.classList.add("col");
        card.innerHTML = `
            <div class="card h-100 bg-dark text-white">
                <img src="${serie.poster_path ? TMDB_IMAGE_URL + serie.poster_path : './assets/img/no-image.png'}" class="card-img-top" alt="${serie.name}">
                <div class="card-body bg-dark">
                    <h5 class="card-title">${serie.name}</h5>
                    <p class="card-text">${serie.overview ? serie.overview.substring(0, 100) + '...' : 'Sem descrição disponível.'}</p>
                    <a href="detalhes.html?id_tmdb=${serie.id}" class="btn btn-primary">Ver Detalhes</a>
                </div>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();

    if (query === "") {
        alert("Por favor, insira um termo de busca.");
        return;
    }

    const series = await fetchSeries(query);
    displayResults(series);
});
