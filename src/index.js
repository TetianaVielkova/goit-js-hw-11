import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';


const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const searchBtn = document.querySelector('button');

const API_KEY = '31367220-5a96f337331fc9bdf5943a9df';
const BASE_URL = 'https://pixabay.com/api/';
const options = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: 40,
    per_page: 1,
};

async function fetchPictures(inputValue){
    try {
        const url = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}`, { options },);
        options.page += 1;
        return url.data;
    } catch(error) {
        console.log(error);
    }
}

let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
})


formRef.addEventListener('submit', onSearch);
galleryRef.insertAdjacentHTML('beforeend', createGalleryItem);


function onSearch(e){
    e.preventDefault();
    galleryRef.innerHTML = '';
    const searchQuery = e.currentTarget.elements.query.value;
    fetchPictures(searchQuery)
        .then(data => {
            createGalleryItem(data);
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        });
}


function createGalleryItem(data) {
    const markup =  data.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
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
        </div>
        </div>`}).join("")};
