import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotos } from './js/fetchImages.js';
import { createMarkup } from './js/createmarkup.js';

let page = 1;
const per_page = 40;

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMorePosts);

async function onSubmit(evt) {
  evt.preventDefault();
  refs.loadMoreBtn.style.display = 'block';
  const isActive = true;
  if (isActive === true || refs.loadMoreBtn.classList.contains('is-active')) {
    refs.gallery.innerHTML = '';
    page = 1;
    refs.loadMoreBtn.classList.replace('is-active', 'is-hidden');
  }
  const query = evt.target.elements.searchQuery.value.trim();
  try {
    if (query === '') {
      refs.loadMoreBtn.style.display = 'none';
      Notify.warning('No data!');
      return;
    }
    const photos = await getPhotos(query, page, per_page);
    if (photos.hits.length === 0) {
      refs.loadMoreBtn.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    createMarkup(photos.hits);
    lightbox.refresh();
    refs.loadMoreBtn.classList.replace('is-active', 'is-hidden');

    Notify.success(`Hooray! We found ${photos.totalHits} images.`);
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMorePosts() {
  const query = refs.form.elements.searchQuery.value.trim();
    try {
    page += 1;
    const photos = await getPhotos(query, page, per_page);
    const totalPage = Math.round(photos.totalHits / per_page);
    if (page > totalPage) {
      Notify.warning(
        'We are sorry,but you have reached the end of search results.');
      refs.loadMoreBtn.classList.replace('is-active', 'is-hidden');
      return;
    }
    createMarkup(photos.hits);
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}