import axios from 'axios';

async function fetchImages(name, page, perPage) {
    
    const API_KEY = '31367220-5a96f337331fc9bdf5943a9df';
    const BASE_URL = 'https://pixabay.com/api/';

    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    return response.data;
    } catch (error) {
        console.log('ERROR: ', error);
    }
}

export { fetchImages };