import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const KEY = '32364781-afe6a31ab003614a69c7e9194';
const refs = {
    inputSearch: document.querySelector('#search-box'),
    buttonSearch: document.querySelector('.search-button'),
    listImg: document.querySelector('.gallery'),
    formSearch: document.querySelector('.search-form'),
    loadMore: document.querySelector('.load-more'),
    container: document.querySelector('.container'),
    messageContainer: document.querySelector('.end-loading'),
    
}
const PageSize = 40;
let currentPage = 1;
let totalPages = 0;


refs.formSearch.addEventListener("submit", e => {
  e.preventDefault();
  currentPage = 1;
  refs.listImg.innerHTML = '';
  getImgAxios({
       query: refs.inputSearch.value
  }).then(images => {
      const elements = createElementsImages(images);
      refs.listImg.insertAdjacentHTML('beforeend', elements);
    })
});

refs.loadMore.addEventListener("click", e => {
    getImgAxios({
       query: refs.inputSearch.value
    }).then(images => {
      const elements = createElementsImages(images);
       refs.listImg.insertAdjacentHTML('beforeend', elements);
    })
});

async function getImgAxios({ query }) {
const params = {
    key: KEY,
    q:encodeURIComponent(query),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: PageSize,
}
  
  const urlAPI = `https://pixabay.com/api/`;
  try {
   return await axios.get(urlAPI, { params })
      .then(res => res.data)
      .then(({ hits, totalHits }) => {
       
        calcPagination(totalHits);
        messageNotiflix(totalHits);
        makeVisibleLoadMoreButton();
        currentPage += 1;
        return hits;
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.log(error);
  }
}

function messageNotiflix(total) {
  if ((total > 0) && (currentPage === 1)) {
    Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    return;
  } else if (total === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
}

function makeVisibleLoadMoreButton() {
   refs.messageContainer.innerHTML = "";
  if ((totalPages>0) && (currentPage < totalPages)) {
    refs.loadMore.classList.remove("is-hidden");
  } else if((totalPages>0) && (currentPage === totalPages)) {
    refs.messageContainer.innerHTML = "We're sorry, but you've reached the end of search results.";
    refs.loadMore.classList.add("is-hidden");
  } else {
    refs.loadMore.classList.add("is-hidden");
  }
  
  }

function createElementsImages(images) {
    return images.map(({ id, pageURL, webformatURL, largeImageURL, likes, views, comments, downloads,tags }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="307" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
       <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;
    }).join("");

}
function calcPagination(totalHits) {
  totalPages = Math.ceil(totalHits / PageSize);
}