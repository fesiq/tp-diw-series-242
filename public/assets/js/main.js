const JSON_SERVER_URL = CONFIG.JSON_SERVER_URL;
const TMDB_API_KEY = CONFIG.TMDB_API_KEY;
const TMDB_BASE_URL = CONFIG.TMDB_BASE_URL;
const TMDB_IMAGE_URL = CONFIG.TMDB_IMAGE_URL;

// Função para facilitar requisições HTTP
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.error("Erro ao buscar dados:", response.status);
        return null;
    }
    return response.json();
}

async function loadPopularSeries() {
    const url = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`;
    const data = await fetchData(url);

    if (data && data.results) {
        const popularSeries = document.getElementById("popular-series");
        data.results.slice(0, 5).forEach((serie, index) => {
            popularSeries.innerHTML += `
                    <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <a href="detalhes.html?id_tmdb=${serie.id}">
                        <img src="${TMDB_IMAGE_URL}${serie.poster_path}" class="d-block w-100" alt="${serie.name}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${serie.name}</h5>
                            <p>${serie.overview}</p>
                        </div>
                        </a>
                    </div>
            `;
        });
    }
}
async function loadNewSeries() {
    const url = `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`;
    const data = await fetchData(url);

    if (data && data.results) {
        const newSeriesContainer = document.getElementById("new-series");
        data.results.slice(0, 6).forEach(serie => {
            newSeriesContainer.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 bg-dark text-white">
                        <img src="${TMDB_IMAGE_URL}${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                        <div class="card-body">
                            <h5 class="card-title">${serie.name}</h5>
                            <p class="card-text">${serie.overview.slice(0, 100)}...</p>
                        </div>
                        <div class="card-footer">
                            <a href="detalhes.html?id_tmdb=${serie.id}" class="btn btn-primary">Saiba Mais</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

async function loadAuthorInfo() {
    const url = `${JSON_SERVER_URL}/perfil`;
    const author = await fetchData(url);

    if (author) {
        const authorInfo = document.getElementById("info-autor");
        authorInfo.innerHTML = `
            <h2>Sobre o autor</h2>
            <img src="${author.avatar}">
            <h4>${author.nome}</h4>
            <p>${author.bio}</p>
            <p><strong>Email:</strong> ${author.email}</p>
        `;
    }
}
async function loadFavoriteSeries() {
    const url = `${JSON_SERVER_URL}/favoritas`;
    const favorites = await fetchData(url);
    const favoriteSeriesContainer = document.getElementById("favorite-series");

    if(favorites == "") {
        favoriteSeriesContainer.innerHTML += `
        <div>
            <p>Não há séries favoritas. Procure pelos seus favoritos agora mesmo!</p>
        </div>`;
    }

    if (favorites) {
        favorites.forEach(serie => {
            favoriteSeriesContainer.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card bg-dark text-white">
                        <img src="${TMDB_IMAGE_URL}${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                        <div class="card-body">
                            <h5 class="card-title">${serie.name}</h5>
                        </div>
                        <div class="card-footer">
                            <a href="detalhes.html?id_tmdb=${serie.id_tmdb}" class="btn btn-primary">Saiba Mais</a>
                            <a href="#favorite-series" class="btn btn-secondary btn-desfavoritar" serie-id-tmdb="${serie.id_tmdb}">Remover dos favoritos</a>
                        </div>
                    </div>
                </div>
            `;
        });
        adicionaEventListenerDesfavoritar();
    }
}

async function removerFavorito(idTmdb) {
    const resposta = confirm("Tem certeza de que quer remover a série dos favoritos?");
    if(!resposta)
    {
        return;
    }
    try {
        const buscaId = await fetch(`${JSON_SERVER_URL}/favoritas?id_tmdb=${idTmdb}`);
        const favoritos = await buscaId.json();
        
        if (!buscaId.ok || favoritos.length === 0) {
            alert("Erro: Série não encontrada nos favoritos.");
            return;
        }
        
        const id_json_server = favoritos[0].id;

        const response = await fetch(`${JSON_SERVER_URL}/favoritas/${id_json_server}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Série removida dos favoritos!");
            window.location.reload();       
        } else {
            alert("Erro ao remover dos favoritos.");
        }
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
    }
}

function adicionaEventListenerDesfavoritar() {
    const botoesRemover = document.querySelectorAll(".btn-desfavoritar");

    botoesRemover.forEach(botao => {
        botao.addEventListener("click", () => {
            const serieId = botao.getAttribute("serie-id-tmdb");
            if (serieId) {
                removerFavorito(serieId);
            }
        });
    });
}



document.addEventListener("DOMContentLoaded", () => {
    loadPopularSeries();
    loadNewSeries();
    loadAuthorInfo();
    loadFavoriteSeries();
});

