import Data from './Data';
import * as UI from './ui';
import { countries, elements } from './config';

// make instance of Data class and add options to dataset
const data = new Data();
UI.renderDataList();

// handle search input and make request if it pass validation
const controlSearch = input => {
  // make regex validation with given countries
  const regex = new RegExp(`${Object.keys(countries).join('|')}`);
  if (input.match(regex)) {
    UI.renderLoader(elements.citiesParent);
    UI.hideElement(elements.citiesWrapper);
    // if input pass validation save it to local storage
    localStorage.setItem('country', input);
    // handle async request
    data
      .getCities(countries[input])
      .then(cities => {
        UI.renderCityList(cities);
        elements.citiesCountry.innerText = input;
        UI.clearLoader();
        UI.unhideElement(elements.citiesWrapper);
      })
      .catch(err => console.log(err));
  }
};

// listen to search form
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const input = elements.searchForm.country.value.trim();
  controlSearch(input);
});

// autocomplete input
let isCompleted = true;
const autoComp = input => {
  const output = [];
  // compare each country with form input -> add it to new array
  Object.keys(countries).forEach(country => {
    if (
      country.indexOf(input) === 0 ||
      country.toLowerCase().indexOf(input) === 0
    ) {
      output.push(country);
    }
  });

  // if new array has only 1 country enter it to input field
  // let autocomplete to work only if new array has >1 elements first
  if (output.length === 1 && isCompleted) {
    isCompleted = false;
    // eslint-disable-next-line prefer-destructuring
    elements.searchInput.value = output[0];
  } else if (output.length > 1) {
    isCompleted = true;
  }
};

// listen to every typed character by user
elements.searchInput.addEventListener('keyup', e => {
  if (e.which === 13) elements.searchInput.blur();
  const value = elements.searchInput.value.toLowerCase().trim();
  autoComp(value);
});

// handle dropdown (accordion)
elements.citiesList.addEventListener('click', e => {
  if (e.target.matches('.list__item__top-bar')) {
    e.target.parentElement.classList.toggle('active');
    // don't make to many unnecessary requests
    if (e.target.nextElementSibling.childElementCount < 2) {
      UI.renderLoader(e.target.nextElementSibling);
      data
        .getInfo(e.target.parentElement.dataset.city)
        .then(info => {
          UI.renderCityInfo(e.target.nextElementSibling, info);
          UI.clearLoader(e.target.nextElementSibling);
        })
        .catch(err => console.log(err));
    }
  }
});

// scroll to top
elements.backToTop.addEventListener('click', e => {
  e.preventDefault();
  window.scroll({
    behavior: 'smooth',
    left: 0,
    top: 0,
  });
});

// if country is on local storage, send it to make new request
if (localStorage.getItem('country')) {
  elements.searchInput.value = localStorage.country;
  controlSearch(localStorage.country);
}
