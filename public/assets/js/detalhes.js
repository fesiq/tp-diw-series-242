const JSON_SERVER_URL = "http://localhost:3000/favoritas";
const API_KEY = "2f10809f73d8fa55a72552fcb4d21da2";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


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
        const response = await fetch(`${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar detalhes da série:", error);
        return null;
    }
}

// Função para exibir os detalhes da série
function displaySeriesDetails(series) {
    if (!series) {
        detailsContainer.innerHTML = `<p class="text-center">Erro ao carregar os detalhes da série.</p>`;
        return;
    }

    const { name, overview, poster_path, genres, number_of_seasons, number_of_episodes, credits } = series;
    const cast = credits.cast.slice(0, 5).map(actor => actor.name).join(", ");

    const favoriteButton = createFavoriteButton(series);

    detailsContainer.innerHTML = `
        <div class="col-md-4">
            <img src="${poster_path ? IMAGE_BASE_URL + poster_path : './assets/img/no-image.png'}" class="img-fluid rounded" alt="${name}">
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
    detailsContainer.querySelector(".col-md-8").appendChild(favoriteButton);
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
        const response = await fetch(`${JSON_SERVER_URL}?id_tmdb=${series.id}`);
        const data = await response.json();

        if (data.length > 0) {
            alert("Essa série já está nos favoritos!");
            return;
        }

        // Salvar nos favoritos
        await fetch(JSON_SERVER_URL, {
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
    } catch (error) {
        console.error("Erro ao favoritar a série:", error);
        alert("Erro ao favoritar a série.");
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

// Inicializar
loadSeriesDetails();