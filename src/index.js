import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.addEventListener('click', onClickLoadMore);
formRef.addEventListener('submit', onSearch);

loadMoreBtn.style.display = 'none';

const API_KEY = '31367220-5a96f337331fc9bdf5943a9df';
const BASE_URL = 'https://pixabay.com/api/';

const options = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: 1,
};

let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

let maxQuery = 0;

function onClickLoadMore(){
    loadMoreBtn.style.display = "none";
    fetchPictures(fetchPictures.searchQuery)
    .then(createGalleryItem);
}
function onSearch(e){
    e.preventDefault();
    galleryRef.innerHTML = '';
    maxQuery = 0;
    options.page = 1;
    fetchPictures.searchQuery = e.currentTarget.elements.searchQuery.value;
    fetchPictures(fetchPictures.searchQuery)
    .then(data => {
        createGalleryItem(data);
        
    });
}

async function fetchPictures(searchQuery){
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}`, { options } );
        options.page +=1;
        return response.data;
    } catch(error) {
        console.log(error);
    }
}

function createGalleryItem(data) {

    if ((searchQuery.length === 0)) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return
    }
    else {
    const markup = data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>${likes}
            </p>
            <p class="info-item">
                <b>Views</b>${views}
            </p>
            <p class="info-item">
                <b>Comments</b>${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>${downloads}
            </p>
        </div>`}).join("");

        galleryRef.insertAdjacentHTML("beforeend", markup);
        lightbox.refresh();
        loadMoreBtn.style.display = "block";
        maxQuery += 40;
        if (maxQuery >= data.totalHits) {
            Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.style.display = "none";
            return
        }
    };
}
