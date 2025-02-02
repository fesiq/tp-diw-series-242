const JSON_SERVER_FAVORITAS = `${CONFIG.JSON_SERVER_URL}/favoritas`;
const TMDB_API_KEY = CONFIG.TMDB_API_KEY;
const TMDB_BASE_URL = CONFIG.TMDB_BASE_URL;
const TMDB_IMAGE_URL = CONFIG.TMDB_IMAGE_URL;


// Elemento onde os detalhes serão exibidos
const detailsContainer = document.getElementById("details");

// Função para obter o ID da série da URL
function getSeriesIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id_tmdb");
}

// Função para buscar detalhes da série na API
async function fetchSeriesDetails(seriesId) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar detalhes da série:", error);
        return null;
    }
}

// Função para exibir os detalhes da série
async function displaySeriesDetails(series) {
    if (!series) {
        detailsContainer.innerHTML = `<p class="text-center">Erro ao carregar os detalhes da série.</p>`;
        return;
    }

    const { name, overview, poster_path, genres, number_of_seasons, number_of_episodes, credits } = series;
    const cast = credits.cast.slice(0, 5).map(actor => actor.name).join(", ");

    const favoriteButton = createFavoriteButton(series);
    const unfavoriteButton = createUnfavoriteButton(series);

    detailsContainer.innerHTML = `
        <div class="col-md-4">
            <img src="${poster_path ? TMDB_IMAGE_URL + poster_path : './assets/img/no-image.png'}" class="img-fluid rounded" alt="${name}">
        </div>
        <div class="col-md-8">
            <h2>${name}</h2>
            <p><strong>Gêneros:</strong> ${genres.map(genre => genre.name).join(", ")}</p>
            <p><strong>Descrição:</strong> ${overview || "Sem descrição disponível."}</p>
            <p><strong>Número de Temporadas:</strong> ${number_of_seasons}</p>
            <p><strong>Número de Episódios:</strong> ${number_of_episodes}</p>
            <p><strong>Elenco Principal:</strong> ${cast || "Informação não disponível."}</p>
        </div>
    `;
    const response = await fetch(`${JSON_SERVER_FAVORITAS}?id_tmdb=${series.id}`);
    const data = await response.json();

    if (data.length > 0) {
        detailsContainer.querySelector(".col-md-8").appendChild(unfavoriteButton);
        return;
    } else {
        detailsContainer.querySelector(".col-md-8").appendChild(favoriteButton);
        return;
    }

    
}

// Carregar detalhes ao abrir a página
async function loadSeriesDetails() {
    const seriesId = getSeriesIdFromUrl();

    if (!seriesId) {
        detailsContainer.innerHTML = `<p class="text-center">ID da série não encontrado na URL.</p>`;
        return;
    }

    const series = await fetchSeriesDetails(seriesId);
    displaySeriesDetails(series);
}   


// Função para favoritar a série no JSON Server
async function favoriteSeries(series) {
    try {
        // Checar se a série já está nos favoritos
        const response = await fetch(`${JSON_SERVER_FAVORITAS}?id_tmdb=${series.id}`);
        const data = await response.json();

        if (data.length > 0) {
            alert("Essa série já está nos favoritos!");
            return;
        }

        // Salvar nos favoritos
        await fetch(JSON_SERVER_FAVORITAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_tmdb: series.id,
                name: series.name,
                poster_path: series.poster_path,
            }),
        });

        alert("Série adicionada aos favoritos!");
        window.location.reload();
    } catch (error) {
        console.error("Erro ao favoritar a série:", error);
        alert("Erro ao favoritar a série.");
    }
}

async function removerFavorito(idTmdb) {
    const resposta = confirm("Tem certeza de que quer remover a série dos favoritos?");
    if(!resposta)
    {
        return;
    }
    try {
        const buscaId = await fetch(`${JSON_SERVER_FAVORITAS}?id_tmdb=${idTmdb}`);
        const favoritos = await buscaId.json();
        
        if (!buscaId.ok || favoritos.length === 0) {
            alert("Erro: Série não encontrada nos favoritos.");
            return;
        }
        
        const id_json_server = favoritos[0].id;

        const response = await fetch(`${JSON_SERVER_FAVORITAS}/${id_json_server}`, {
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

// Função para criar o botão de favoritar
function createFavoriteButton(series) {

    const button = document.createElement("button");
    button.className = "btn btn-primary mt-3";
    button.innerText = "Favoritar Série";

    button.addEventListener("click", () => favoriteSeries(series));

    return button;
}

// e o de desfavoritar
function createUnfavoriteButton(series) {

    const button = document.createElement("button");
    button.className = "btn btn-secondary mt-3";
    button.innerText = "Remover dos Favoritos";

    button.addEventListener("click", () => removerFavorito(series.id));

    return button;
}

// Inicializar
loadSeriesDetails();