import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './fetchImages';


const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


formRef.addEventListener('submit', onSearch);

loadMoreBtn.style.display = 'none';

let perPage = 40;
let page = 0;
let name = '';

let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

async function onSearch(e){
    e.preventDefault();
    galleryRef.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    
    page = 1;
    name = e.currentTarget.elements.searchQuery.value.trim();

    fetchImages(name, page, perPage)
    .then(name => {
        let totalPages = name.totalHits / perPage;

        if(name.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
            createGalleryItem(name);
        
        if (page < totalPages) {
            loadBtn.style.display = 'block';
        } else {
            loadBtn.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } 
        }else {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            gallery.innerHTML = '';
        }
        })
        .catch(error => console.log('ERROR: ', error));
}


function createGalleryItem(name) {
    const markup = name.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
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
    };

loadMoreBtn.addEventListener('click', (name) => {
    name = e.currentTarget.elements.searchQuery.value.trim();
    page +=1;
    fetchImages(name, page, perPage)
    .then(name => {
        let totalPages = name.totalHits / perPage;
        createGalleryItem(name);
        if (page >= totalPages) {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
            );
        }
    });
}, true);