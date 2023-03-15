import { apiKey } from "./api.js";

const listaDeFilmes = document.querySelector('.filmes');
const barraPesquisa = document.getElementById('buscar-filme');
const btnPesquisa = document.querySelector('.fa-magnifying-glass');
const checkbox = document.querySelector('.buscar__input-checkbox');

checkbox.addEventListener('change', () => filtraPorFavorito());
btnPesquisa.addEventListener('click', () => pesquisarFilmesPopulares())
barraPesquisa.addEventListener('keyup', (e) => e.key == 'Enter' ? pesquisarFilmesPopulares() : e);

function buscarListaFilmesPopulares() {
  return JSON.parse(localStorage.getItem('filmesFavoritos'));
}

function filtraPorFavorito() {
  limparListaFilmes();
  if (checkbox.checked) {
    checkbox.style.opacity = "1";
    const filmes = buscarListaFilmesPopulares() || [];
    filmes.forEach(filme => listarFilmes(filme));
  } else {
    checkbox.style.opacity = "0";
    listarTodosFilmes();
  }
}

async function pesquisarFilmesPopulares() {
  const valor = barraPesquisa.value;
  if (valor != '') {
    limparListaFilmes();
    const filmes = await pesquisarFilmesPeloNome(valor);
    filmes.forEach(filme => listarFilmes(filme));
  }
}

function limparListaFilmes() {
  listaDeFilmes.innerHTML = "";
}

async function pesquisarFilmesPeloNome(nome) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${nome}&language=en-US&page=1`;
  const lista = await fetch(url)
  const { results } = await lista.json();
  return results;
}

async function buscarFilmesPopulares() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  const lista = await fetch(url)
  const { results } = await lista.json();
  return results;
}

function mudarFavorito(evento, filme) {
  let elemento = evento.target;

  if (!elemento.classList.contains('fa-heart')) {
    elemento = elemento.querySelector('i');
  }

  if (elemento.classList.contains('fa-regular')) {
    elemento.classList.add('fa-solid');
    elemento.classList.remove('fa-regular');
    salvarFilmeFavoritoLocalStorage(filme);
  } else {
    elemento.classList.add('fa-regular');
    elemento.classList.remove('fa-solid');
    removerFilmeFavoritoLocalStorage(filme.id);
  }
}

function salvarFilmeFavoritoLocalStorage(filme) {
  const filmes = buscarListaFilmesPopulares() || [];
  filmes.push(filme);
  localStorage.setItem('filmesFavoritos', JSON.stringify(filmes));
}

function removerFilmeFavoritoLocalStorage(id) {
  const filmes = buscarListaFilmesPopulares() || [];
  const filmeEncontrado = filmes.find(filme => filme.id == id);
  const novaLista = filmes.filter(filme => filme.id != filmeEncontrado.id);
  localStorage.setItem('filmesFavoritos', JSON.stringify(novaLista));
}

function filmeEhFavorito(id) {
  const filmes = buscarListaFilmesPopulares() || [];
  return filmes.find(filme => filme.id == id);
}

async function listarTodosFilmes() {
  const filmes = await buscarFilmesPopulares();
  filmes.forEach(filme => listarFilmes(filme));
}

window.onload = async function () {
  listarTodosFilmes();
}

function listarFilmes(filme) {
  const { id, title, poster_path, vote_average, release_date, overview } = filme;
  const favorito = filmeEhFavorito(id);
  let ehFavorito = 'regular';
  const year = new Date(release_date).getFullYear();
  const imagem = `https://image.tmdb.org/t/p/w500${poster_path}`;

  if (favorito) {
    ehFavorito = 'solid';
  }

  const divFilme = document.createElement('div');
  divFilme.classList.add('filme');
  listaDeFilmes.appendChild(divFilme);

  const imgFilme = document.createElement('img');
  imgFilme.src = imagem;
  imgFilme.alt = `${title} ${year} poster`;
  imgFilme.classList.add('filme__banner');
  divFilme.appendChild(imgFilme);

  const divInfos = document.createElement('div');
  divInfos.classList.add('filme__informacoes');
  divFilme.appendChild(divInfos);

  const tituloFilme = document.createElement('h2');
  tituloFilme.classList.add('filme__informacoes__titulo');
  tituloFilme.textContent = `${title} ${year}`;
  divInfos.appendChild(tituloFilme);

  const infoNotaFilme = document.createElement('span');
  infoNotaFilme.classList.add('filme__informacoes__nota');
  divInfos.appendChild(infoNotaFilme);
  const iconeNotaFilme = document.createElement('i');
  iconeNotaFilme.classList.add('fa-solid', 'fa-star');
  infoNotaFilme.appendChild(iconeNotaFilme);
  infoNotaFilme.innerHTML += `${vote_average.toFixed(1)}`;

  const infoFavorito = document.createElement('span');
  infoFavorito.classList.add('filme__informacoes__favorito');
  divInfos.appendChild(infoFavorito);
  const iconeFavorito = document.createElement('i');
  iconeFavorito.classList.add(`fa-${ehFavorito}`, `fa-heart`);
  infoFavorito.addEventListener('click', (evento) => mudarFavorito(evento, filme));
  infoFavorito.appendChild(iconeFavorito);
  infoFavorito.innerHTML += `Favoritar`;

  const textoFilme = document.createElement('p');
  textoFilme.classList.add('filme__descricao');
  textoFilme.textContent = `${overview}`;
  divFilme.appendChild(textoFilme);
}