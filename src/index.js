import renderCountries from './templates/list-countries.hbs'
import renderCountry from './templates/one-country.hbs';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';


import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
let foundedCountry = '';

const refs = {
    container: document.querySelector('.js-countries'),
    input: document.querySelector('.countryInput')
};

refs.input.addEventListener('input', debounce(() => {
    onSearch();
}, 500));

function onSearch() {
    resetSearch();
    foundedCountry = refs.input.value;
    fetchCountries(foundedCountry)
        .then(contentOutput)
        .catch(err => console.log(err));
}

function resetSearch() {
    refs.container.innerHTML = '';
}

// функция отрисовки контента

function contentOutput(countries) {
    if (countries.length === 1) {
        resetSearch();
        markupContries(renderCountry, countries);
    } else if (countries.length > 1 && countries.length <= 10) {
        resetSearch();
        markupContries(renderCountries, countries);
    } else if (countries.length > 10) {
        resultMessage(
            error,
            'To many matches found. Please enter a more specific query!',
        );
    } else {
        resultMessage(info, 'No matches found!');
    }
};

function resultMessage(typeInfo, textInfo) {
    typeInfo({
        text: `${textInfo}`,
        delay: 1000,
        closerHover: true,
    });
}

function markupContries(tpl, countries) {
    refs.container.insertAdjacentHTML('beforeend', tpl(countries));
}