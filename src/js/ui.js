import { countries, elements } from './config';

// add options to datalist
export const renderDataList = () => {
  elements.dataList.innerHTML = '';
  Object.keys(countries).forEach(country => {
    elements.dataList.insertAdjacentHTML(
      'beforeend',
      `<option value="${country}"></option>`
    );
  });
};

// render results of search country
export const renderCityList = citiesNames => {
  elements.citiesList.innerHTML = '';
  citiesNames.forEach(cityTitle => {
    elements.citiesList.innerHTML += `
      <div class="list__item" data-city="${cityTitle[0]}">
            <div class="list__item__top-bar">
                <h4 class="list__item__city-name">
                    ${cityTitle[0]}
                    <span class="list__item__value">
                        PM<sub>2.5</sub>: ${cityTitle[1].toFixed(2)} µg/m³
                    </span>
                </h4>
            </div>
            <div class="list__item__city-info">
            </div>
        </div>
      `;
  });
};

// render description of specific city
export const renderCityInfo = (parent, info) => {
  parent.innerHTML = `
        <img src="${info.thumbnail.source}" alt="${
    info.title
  }" class="list__item__image" />
        <p class="list__item__desc">
            ${info.extract.replace(' (listen)', '')}
            <br />
            <span>Read more: <a href="${info.fullurl}" target="_blank"
              rel="noopener noreferrer">Wikipedia.org</a></span>
        </p>
        `;
};

// render loader
export const renderLoader = parent => {
  const loader = `<div class="loader"></div>`;
  if (!parent.querySelector('.loader')) {
    parent.insertAdjacentHTML('afterbegin', loader);
  }
};

// remove loader
export const clearLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) loader.remove();
};

// the name speaks for itself
export const hideElement = element => {
  if (!element.classList.contains('is-hidden')) {
    element.classList.add('is-hidden');
  }
};

// show only if element is hidden
export const unhideElement = element => {
  if (element.classList.contains('is-hidden')) {
    element.classList.remove('is-hidden');
  }
};
