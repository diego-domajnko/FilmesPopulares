import { apiKey } from "./api.js"

const listaDeFilmes = document.querySelector('.filmes');

async function buscarFilmesPopulares() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  const lista = await fetch(url)
  const { results } = await lista.json();
  return results;
} 

window.onload = async function() {
  const filmes = await buscarFilmesPopulares();
  filmes.forEach(filme => listarFilems(filme));
}

function listarFilems(filme) {

  const { title, poster_path, vote_average, release_date, overview } = filme;
  const favorito = false;
  let ehFavorito = 'regular';

  if (favorito) {
    ehFavorito = 'solid';
  }

  const year = new Date(release_date).getFullYear();
  const image = `https://image.tmdb.org/t/p/w500${poster_path}`;

  listaDeFilmes.innerHTML += `
    <div class="filme">
      <img src="${image}" class="filme__banner" alt="${title} ${year} poster">
      <div class="filme__informacoes">
        <h2 class="filme__informacoes__titulo">${title} ${year}</h2>
        <span class="filme__informacoes__nota"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</span>
        <span class="filme__informacoes__favorito"><i class="fa-${ehFavorito} fa-heart"></i>Favoritar</span>
      </div>
      <p class="filme__descricao">${overview}</p>
    </div>
  `;
}