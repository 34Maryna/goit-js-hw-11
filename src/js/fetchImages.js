const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35600398-8cc2fc770019a3351d5451c00';

export const getPhotos = async function getPhotos(query, page, per_page) {
  const params = {
    key: API_KEY,
    q: `${query}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: `${per_page}`,
    page: `${page}`,
  };

  const response = await axios.get(BASE_URL, { params,  });
  const photos = await response.data;
  console.log(photos);
  return photos;
};