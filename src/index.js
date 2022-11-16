import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSearch);

const API_KEY = '31367220-5a96f337331fc9bdf5943a9df';
const BASE_URL = 'https://pixabay.com/api/';
counter = 1;
let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
})

const options = {
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: 1,
    per_page: 40,
};

function onSearch(e){
    e.preventDefault();
    galleryRef.innerHTML = '';
    fetchPictures.searchQuery = e.currentTarget.elements.searchQuery.value;
    console.log(searchQuery);
    startPage();
    resetQuery();
    fetchPictures(fetchPictures.searchQuery)
        .then(data => {
            createGalleryItem(data);
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        });
}

async function fetchPictures(searchQuery){
    try {
        
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}`, { options },);
        options.per_page += response.data.hits.length;
        return response.data;
    } catch(error) {
        console.log(error);
    }
}


function createGalleryItem(data) {
    if (data.hits.length === 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return
    } else {
    const markup = data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
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
        </div>`}).join("");

        galleryRef.insertAdjacentHTML("beforeend", markup);
        gallery.refresh();

        const { height: cardHeight } = document
        .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });

    if (data >= data.totalHits) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        return
    }
    }}


    window.addEventListener('scroll', () => {
        const {scrollHeight, scrollTop, clientHeight} = document.documentElement
        if(scrollHeight - clientHeight === scrollTop){
        createGalleryItem()
        }
    })