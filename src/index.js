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

function onSearch(e){
    e.preventDefault();
    galleryRef.innerHTML = '';
    loadMoreBtn.style.display = 'none';
    
    page = 1;
    name = e.currentTarget.elements.searchQuery.value;

    fetchImages(name, page, perPage)
    .then(name => {
        if(name.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
            createGalleryItem(name);
        } else {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            
        }
        let totalPages = name.totalHits / perPage;
        if (page < totalPages) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
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
        const { height: cardHeight } = galleryRef.firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
    };

loadMoreBtn.addEventListener('click', (e) => {
    
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
},true);