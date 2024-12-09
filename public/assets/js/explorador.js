const API_KEY = "2f10809f73d8fa55a72552fcb4d21da2";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");

async function fetchSeries(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}`);
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
                <img src="${serie.poster_path ? IMAGE_BASE_URL + serie.poster_path : './assets/img/no-image.png'}" class="card-img-top" alt="${serie.name}">
                <div class="card-body bg-dark">
                    <h5 class="card-title">${serie.name}</h5>
                    <p class="card-text">${serie.overview ? serie.overview.substring(0, 100) + '...' : 'Sem descrição disponível.'}</p>
                    <a href="detalhes.html?id=${serie.id}" class="btn btn-primary">Ver Detalhes</a>
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
