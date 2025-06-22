const apiKey = "2054c03cc790162d88a0f2f731eb2921";
const movieId = 1000837;
const baseUrl = "https://api.themoviedb.org/3";
const language = "pt-BR";

const titleEl = document.getElementById("movie-title");
const posterEl = document.getElementById("movie-poster");
const synopsisEl = document.getElementById("movie-synopsis");
const genresEl = document.getElementById("movie-genres");
const directorEl = document.getElementById("movie-director");
const writersEl = document.getElementById("movie-writers");
const revenueEl = document.getElementById("movie-revenue");
const castListEl = document.getElementById("cast-list");
const reviewsSectionEl = document.getElementById("reviews-section");
const videosListEl = document.getElementById("videos-list");
const postersListEl = document.getElementById("posters-list");
const backdropsListEl = document.getElementById("backdrops-list");
let resizeTimeout;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    getMedia();
  }, 100);
});

function enableDragScroll(container) {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('active');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('active');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('active');
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
}

async function getMovieDetails() {
  const res = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=${language}`);
  const data = await res.json();

  document.getElementById("movie-title-text").innerText = data.title;
  const movieYearEl = document.getElementById("movie-year");
  movieYearEl.innerText = `(${data.release_date.slice(0, 4)})`;
  movieYearEl.classList.add("movie-year");
  posterEl.src = `https://image.tmdb.org/t/p/w300${data.poster_path}`;
  synopsisEl.innerText = data.overview;
  genresEl.innerText = data.genres.map(g => g.name).join(", ");
  revenueEl.innerText = `$ ${(data.revenue || 0).toLocaleString('pt-BR')}`;

  const statusTranslations = {
    "Released": "Lançado",
    "Post Production": "Pós-produção",
    "In Production": "Em produção",
    "Planned": "Planejado",
    "Canceled": "Cancelado"
  };
  const translatedStatus = statusTranslations[data.status] || data.status;

  document.getElementById("movie-status").innerText = translatedStatus;
  document.getElementById("movie-language").innerText = data.original_language.toUpperCase();
  document.getElementById("movie-budget").innerText = `$ ${(data.budget || 0).toLocaleString('pt-BR')}`;
}

async function getCredits() {
  const res = await fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}&language=${language}`);
  const data = await res.json();

  const diretor = data.crew.find(p => p.job === "Director");
  const roteiristas = data.crew.filter(p => ["Writer", "Screenplay"].includes(p.job));

  if (diretor) {
    directorEl.innerText = diretor.name;
  }

  if (roteiristas.length > 0) {
    writersEl.innerText = roteiristas.map(p => p.name).join(", ");
  }

  castListEl.innerHTML = "";

  const mainCast = data.cast.slice(0, 10);

  mainCast.forEach(actor => {
    const colDiv = document.createElement("div");
    colDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="Foto de ${actor.name}">
      <p class="mb-0"><strong>${actor.name}</strong></p>
      <small>${actor.character}</small>
    `;
    castListEl.appendChild(colDiv);
  });

  const slider = castListEl;
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}

async function getReviews() {
  const res = await fetch(`${baseUrl}/movie/${movieId}/reviews?api_key=${apiKey}&language=${language}`);
  const data = await res.json();

  reviewsSectionEl.innerHTML = "";

  data.results.slice(0, 2).forEach(review => {
    const div = document.createElement("div");
    div.classList.add("col-md-6");

    const dataFormatada = new Date(review.created_at).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    div.innerHTML = `
  <div class="review review-box d-flex flex-column justify-content-between">
    <p class="review-content">${review.content}</p>
    <div class="review-footer">
      <div class="review-author mb-2">
        por <span class="text-primary font-weight-bold">${review.author}</span>
      </div>
      <div class="review-date-rating d-flex justify-content-between">
        <div class="review-date">${dataFormatada}</div>
        <div class="review-rating">
          Nota: <span class="text-primary font-weight-bold">${review.author_details.rating || "N/A"}</span>/10
        </div>
      </div>
    </div>
  </div>
`;

    reviewsSectionEl.appendChild(div);
  });
}

function isTablet() {
  return window.innerWidth <= 744;
}

function enableDragScroll(container) {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('active');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('active');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('active');
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
}

function setupMediaDragScroll() {
  const containers = [
    document.getElementById('videos-list'),
    document.getElementById('posters-list'),
    document.getElementById('backdrops-list'),
  ];

  if (isTablet()) {
    containers.forEach(container => {
      container.classList.remove('row');
      container.classList.add('media-slider');
      container.style.display = 'flex';
      container.style.flexDirection = 'row';
      container.style.overflowX = 'auto';
      container.style.scrollBehavior = 'smooth';
      container.style.gap = '1rem';
      container.style.paddingBottom = '1rem';
      container.style.scrollSnapType = 'x mandatory';

      enableDragScroll(container);
    });
  } else {
    containers.forEach(container => {
      container.classList.add('row');
      container.classList.remove('media-slider');
      container.style.display = '';
      container.style.flexDirection = '';
      container.style.overflowX = '';
      container.style.scrollBehavior = '';
      container.style.gap = '';
      container.style.paddingBottom = '';
      container.style.scrollSnapType = '';
    });
  }
}

async function getMedia() {
  const [videosRes, imagesRes] = await Promise.all([
    fetch(`${baseUrl}/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`),
    fetch(`${baseUrl}/movie/${movieId}/images?api_key=${apiKey}`)
  ]);

  const videosData = await videosRes.json();
  const imagesData = await imagesRes.json();

  const trailers = videosData.results.filter(v => v.type === "Trailer" && v.site === "YouTube");

  document.getElementById("videos-count").innerText = `(${trailers.length})`;
  document.getElementById("posters-count").innerText = `(${imagesData.posters.length})`;
  document.getElementById("backdrops-count").innerText = `(${imagesData.backdrops.length})`;


  const videoLimit = 3;
  const posterLimit = 4;
  const backdropLimit = 2;

  videosListEl.innerHTML = "";
  postersListEl.innerHTML = "";
  backdropsListEl.innerHTML = "";

  trailers.slice(0, videoLimit).forEach(video => {
    const div = document.createElement("div");
    div.className = "media-box";
    div.innerHTML = `
      <iframe width="100%" height="200" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allowfullscreen></iframe>
    `;
    videosListEl.appendChild(div);
  });

  imagesData.posters.slice(0, posterLimit).forEach(img => {
    const div = document.createElement("div");
    div.className = "media-box";
    div.innerHTML = `<img src="https://image.tmdb.org/t/p/w300${img.file_path}" alt="Pôster do filme" class="img-fluid">`;
    postersListEl.appendChild(div);
  });

  imagesData.backdrops.slice(0, backdropLimit).forEach(img => {
    const div = document.createElement("div");
    div.className = "media-box";
    div.innerHTML = `<img src="https://image.tmdb.org/t/p/w780${img.file_path}" alt="Imagem de fundo" class="img-fluid rounded">`;
    backdropsListEl.appendChild(div);
  });

  videosListEl.classList.add("media-list", "videos-list");
  postersListEl.classList.add("media-list", "posters-list");
  backdropsListEl.classList.add("media-list", "backdrops-list");

  [videosListEl, postersListEl, backdropsListEl].forEach(container => {
    enableDragScroll(container);
  });
}

async function getRecommendations() {
  const res = await fetch(`${baseUrl}/movie/${movieId}/recommendations?api_key=${apiKey}&language=${language}`);
  const data = await res.json();

  const section = document.createElement("section");
  section.classList.add("container-fluid", "text-white", "pt-3");
  section.style.backgroundColor = "#102C57";

  section.innerHTML = `
    <div class="container position-relative">
      <h2 style="color: #F8F0E5; font-weight: bold;">Recomendações</h2>
      
      <!-- Scroll horizontal (mobile/tablet) + fade fixo -->
      <div class="recommendations-wrapper d-md-none position-relative">
        <div id="recommendations-scroll" class="recommendations-scroll"></div>
        <div class="fade-right"></div>
      </div>

      <!-- Grid layout (desktop) -->
      <div id="recommendations-grid" class="row d-none d-md-flex"></div>
    </div>
  `;

  const footerAside = document.querySelector('.footer-aside');
  document.body.insertBefore(section, footerAside);

  const scrollContainer = section.querySelector("#recommendations-scroll");
  const gridContainer = section.querySelector("#recommendations-grid");

  data.results.slice(0, 6).forEach(movie => {
    const rating = Math.round((movie.vote_average || 0) * 10);
    const cardHTML = `
      <div style="text-align: center; font-size: 24px;">
        <img 
          src="https://image.tmdb.org/t/p/w300${movie.poster_path}" 
          alt="${movie.title}" 
          class="img-fluid rounded mb-2"
          style="box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%;">
        <div>
          <p class="mb-0 movie-title-section" style="font-weight: bold;">${movie.title}</p>
          <small>${rating}%</small>
        </div>
      </div>
    `;

    const scrollItem = document.createElement("div");
    scrollItem.classList.add("recommendation-card");
    scrollItem.innerHTML = cardHTML;
    scrollContainer.appendChild(scrollItem);

    const gridItem = document.createElement("div");
    gridItem.classList.add("col-md-2", "col-6", "mb-3");
    gridItem.innerHTML = cardHTML;
    gridContainer.appendChild(gridItem);
  });
}

function applyMediaSliderOnTablet() {
  if (window.innerWidth <= 744) {
    document.getElementById("videos-list")?.classList.add("media-slider");
    document.getElementById("posters-list")?.classList.add("media-slider");
    document.getElementById("backdrops-list")?.classList.add("media-slider");
  }
}

applyMediaSliderOnTablet();

window.addEventListener("resize", applyMediaSliderOnTablet);

getMovieDetails();
getCredits();
getReviews();
getMedia();
getRecommendations();
setupMediaDragScroll();

window.addEventListener('resize', () => {
  setupMediaDragScroll();
});