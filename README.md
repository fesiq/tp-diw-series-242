# 📺 Projeto de Catálogo de Séries

Este projeto é um catálogo de séries que permite visualizar informações detalhadas sobre séries de TV, favoritar e remover favoritos. Ele consome dados da API do TMDB e armazena os favoritos localmente usando o JSON Server. Originalmente é um projeto de um trabalho na disciplina de desenvolvimento Web, mas com alguns incrementos (remoção de favoritos por exemplo).

## ⚙ Funcionalidades

- Exibir carrosel de séries populares
- Pesquisar séries
- Ver detalhes de uma série (gêneros, elenco, temporadas, episódios)
- Adicionar séries aos favoritos
- Remover séries dos favoritos

## 🛠️ Tecnologias Utilizadas

- HTML, CSS e JavaScript
- Bootstrap para estilização
- Fetch API para consumo de dados do TMDB
- JSON Server para armazenamento local de favoritos
- Git para controle de versão

## 🔧 Como Executar o Projeto

### 1️⃣ Clonar o repositório:

```sh
 git clone <URL_DO_REPOSITORIO>
 cd <NOME_DO_PROJETO>
```

### 2️⃣ Instalar e rodar o JSON Server:

Utilize o node.js para rodar o json-server, com as isntruções da  [nodejs.org](https://nodejs.org/), onde você pode baixar o instalador (Windows). Caso você use um sistema que possua gerenciamento de pacotes, como Linux, nesta página você também pode encontrar as instruções de instalação.

Instale o Json Server:

```sh
npm install json-server
```

Agora, inicie o servidor com seu arquivo db.json:

```sh
json-server --watch data/db.json --port 3000
```

O JSON Server rodará em `http://localhost:3000/`

### 3️⃣ Obter uma API Key do TMDB e configurar a API do TMDB:


Para utilizar a API do TMDB, você precisa obter uma chave de API (API Key):

- Acesse [TMDB.org](https://www.themoviedb.org/) e crie uma conta (caso ainda não tenha).
- Após fazer login, vá até as configurações do seu perfil e clique em API.
- Solicite uma API Key e copie o valor gerado.
- Crie um arquivo `config.js` no diretório `/public/assets/js` e adicione sua chave da API: 

```js
const CONFIG = {
    TMDB_API_KEY: "sua_chave_aqui",
    TMDB_BASE_URL: "https://api.themoviedb.org/3",
    JSON_SERVER_URL: "http://localhost:3000",
    IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500"
};
```

> ⚠ **Importante**: Não compartilhe sua API Key publicamente!

### 4️⃣ Abrir o projeto no navegador:

Basta abrir o arquivo `index.html` no navegador digitando o endereço do json-server (http://localhost:3000).

## 📌 Observações

- Certifique-se de que o JSON Server esteja rodando antes de tentar adicionar/remover favoritos.
- Quando você edita manualmente o arquivo db.json enquanto o json-server está rodando, pode dar crash, e neste caso, basta fazer Ctrl + C para interromper a instância atual e iniciar de novo com `json-server data/db.json` .
- O json-server gera ids automaticamente para os registros dentro do db.json, que ***são diferentes*** dos ids no TMDB.

## 📄 Licença
Este projeto é de livre uso para estudo e aprendizado.

---
Feito com 💙 por Fernando Siqueira

