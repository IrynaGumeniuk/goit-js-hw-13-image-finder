import cardsImgsTpl from './templates/cardTpl.hbs';
import ApiService from './apiService';
import LoadMoreBtn from './loadmore';

import { inform, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    imageContainer: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();

    apiService.query = e.currentTarget.elements.query.value;

    if (apiService.query === '') {
        return inform({
            text: 'Enter the value!',
            delay: 1500,
            closerHover: true,
        });
    }

    loadMoreBtn.show();
    apiService.resetPage();
    clearImagesContainer();
    fetchImages();
};

function fetchImages() {
    loadMoreBtn.disable();

    return apiService.fetchImages().then(images => {
        appendImagesMarkup(images);
        loadMoreBtn.enable();
        if (images.length === 0) {
            loadMoreBtn.hide();
            error({
                text: 'No matches found!',
                delay: 1500,
                closerHover: true,
            });
        }
    });
}

function appendImagesMarkup(images) {
    refs.imageContainer.insertAdjacentHTML('beforeend', cardsImgsTpl(images));
}

function clearImagesContainer() {
    refs.imageContainer.innerHTML = '';
}

function onLoadMore() {
    fetchImages()
        .then(
            setTimeout(() => {
                window.scrollBy({
                    top: document.documentElement.clientHeight - 100,
                    behavior: 'smooth',
                });
            }, 1500),
        )
        .catch(err => console.log(err));
}
