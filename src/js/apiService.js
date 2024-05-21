import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import fetchImages from './randomImg';
import fetchRandomQuote from './randomQuote';
import renderOneDayWeather from './timenow';
import fetchMoreInfo from './more-info.js';
import renderCurrentWeather from './today';
import test from './fiveDays';

function seachCityApi(e) {
  // console.dir(e.target);
  if (e.target.nodeName === 'A') {
    console.dir(e.target.innerText);
    let city = e.target.innerText;
    fetchWeather(city);
  }
}

const formRef = document.querySelector('.search-city');
const inputRef = document.querySelector('.search-form');
// const button = document.querySelector('.search-city__form-btn');***
const geoBtn = document.querySelector('.geo-btn');

formRef.addEventListener('submit', onSearch);
geoBtn.addEventListener('click', getLocationByIP);
// button.addEventListener('click', onClickAddFavor)
navigator.geolocation.getCurrentPosition(success, onError);

function onSearch(event) {
  event.preventDefault();
  const query = inputRef.value;
  fetchWeather(query);
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherByCoords(lat, lon);
}

function onError() {
  const query = 'Manila';
  fetchWeather(query);
}

async function getLocationByIP() {
  const response = await axios.get(`https://ipapi.co/json/`);
  const locationByIP = await response.data;
  const query = locationByIP.city;
  inputRef.value = query;

  fetchWeather(query);
}

//fetching weather data from the OpenWeatherMap API based on  latitude and longitude coordinates.*
async function fetchWeatherByCoords(lat, lon) {
  // const output = document.querySelector('.output');***
  const response = await axios.get(
    `https://api.openweathermap.org/data/2./forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=c32df37628577b1447329bd64ef99bea`
  );

  const weather = await response.data;
  renderCurrentWeather(weather);

  renderOneDayWeather(weather);
  fetchMoreInfo(weather);
  fetchImages(weather);
  fetchRandomQuote();
  test(weather);
}
//fetching weather data from the OpenWeatherMap API*
async function fetchWeather(query) {
  let response;

  try {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&lang=en&appid=c32df37628577b1447329bd64ef99bea`
    );

    const weather = response.data;
    renderCurrentWeather(weather);
    fetchImages(weather);
    renderOneDayWeather(weather);
    fetchMoreInfo(weather);
    fetchRandomQuote();
    test(weather);
  } catch (error) {
    Notify.failure(`Sorry! This city doesn't exist. Enter valid city name`);
  }
}

const seachInput = document.querySelector('.search-form');
const seachFavList = document.querySelector('.seach-favorite-list');
const favorBtn = document.querySelector('.search-city__form-btn');
favorBtn.addEventListener('click', addToFav);
const seachBackBtn = document.querySelector('.back-btn');
seachBackBtn.addEventListener('click', prevSeachElem);
const seachFrwBtn = document.querySelector('.frw-btn');
seachFrwBtn.addEventListener('click', nextSeachElem);

//Add city in favorite list
let favoritItems = [];
function addToFav() {
  if (localStorage.getItem('favor')) {
    favoritItems = JSON.parse(localStorage.getItem('favor'));
    if (
      seachInput.value.length > 0 &&
      !favoritItems.includes(seachInput.value)
    ) {
      favoritItems.push(seachInput.value);
    } else if (favoritItems.includes(seachInput.value)) {
      alert('The city is already in your favorites list');
    }

    localStorage.setItem('favor', JSON.stringify(favoritItems));
  } else {
    if (seachInput.value.length > 0) {
      favoritItems.push(seachInput.value);
    }
    localStorage.setItem('favor', JSON.stringify(favoritItems));
  }
  countFav();
}

// Display the favorite list
async function renderFavList(render) {
  let renderFavItem = render
    .map(
      item => `<li id="${item}" class="seach-favorite-item">
        <a class="seach-favorite-link" href="#">${item}</a>
        <div class="close-btn"></div>

      </li>`
    )
    .join('');

  seachFavList.innerHTML = await renderFavItem;
  if (JSON.parse(localStorage.getItem('favor')).length) {
    renderFwdBackBtn();
  }
}

// Forward button for favorite list
function renderFwdBackBtn() {
  let favoritItems = JSON.parse(localStorage.getItem('favor'));

  if (
    favoritItems.indexOf(seachFavList.lastChild.id) ===
      favoritItems.length - 1 &&
    !seachFrwBtn.classList.contains('visually-hidden')
  ) {
    seachFrwBtn.classList.add('visually-hidden');
  }

  if (
    favoritItems.indexOf(seachFavList.lastChild.id) !==
    favoritItems.length - 1
  ) {
    seachFrwBtn.classList.remove('visually-hidden');
  }

  if (favoritItems.indexOf(seachFavList.firstChild.id) === 0) {
    seachBackBtn.classList.add('visually-hidden');
  } else if (seachBackBtn.classList.contains('visually-hidden')) {
    seachBackBtn.classList.remove('visually-hidden');
  }

  if (!seachBackBtn.classList.contains('visually-hidden')) {
    seachFavList.style.marginLeft = '10px';
  } else {
    seachFavList.style.marginLeft = '51px';
  }
}

// Managing favorite items or fetching weather information
function action(e) {
  console.log(e.target.nodeName);
  let favoritItems = JSON.parse(localStorage.getItem('favor'));
  if (e.target.nodeName === 'DIV') {
    console.log(e.currentTarget.id);
    let idxOfDelElem = favoritItems.indexOf(`${e.currentTarget.id}`);

    favoritItems.splice(idxOfDelElem, 1);
    localStorage.setItem('favor', JSON.stringify(favoritItems));

    countFav();
  } else {
    fetchWeather(e.currentTarget.id);
  }
}

//Updating the count of favorite items and rendering the list of favorites accordingly.
async function countFav() {
  if (localStorage.getItem('favor')) {
    let favoritItems = JSON.parse(localStorage.getItem('favor'));

    if (window.outerWidth <= 767 && favoritItems.length > 2) {
      favoritItems.splice(2);
    } else if (window.outerWidth > 767 && favoritItems.length > 4) {
      favoritItems.splice(4);
    }

    await renderFavList(favoritItems);

    const FavElem = document.querySelectorAll('.seach-favorite-item');

    FavElem.forEach(x => x.addEventListener('click', action));
  }
}

// Handle navigation to the next set of favorite items in the list.
async function nextSeachElem() {
  let favoritItems = JSON.parse(localStorage.getItem('favor'));

  if (
    favoritItems.indexOf(seachFavList.lastChild.id) !==
    favoritItems.length - 1
  ) {
    if (window.outerWidth <= 767) {
      favoritItems = favoritItems.splice(
        favoritItems.indexOf(seachFavList.lastChild.id),
        2
      );
    } else if (window.outerWidth > 767) {
      favoritItems = favoritItems.splice(
        favoritItems.indexOf(seachFavList.lastChild.id) - 2,
        4
      );
    }
  } else {
    console.log('test1');
  }
  await renderFavList(favoritItems);
  const FavElem = document.querySelectorAll('.seach-favorite-item');

  FavElem.forEach(x => x.addEventListener('click', action));
}

async function prevSeachElem() {
  let favoritItems = JSON.parse(localStorage.getItem('favor'));

  if (window.outerWidth <= 767) {
    favoritItems = favoritItems.splice(
      favoritItems.indexOf(seachFavList.firstChild.id) - 1,
      2
    );
  } else if (window.outerWidth > 767) {
    favoritItems = favoritItems.splice(
      favoritItems.indexOf(seachFavList.firstChild.id) - 1,
      4
    );
  }

  await renderFavList(favoritItems);
  const FavElem = document.querySelectorAll('.seach-favorite-item');

  FavElem.forEach(x => x.addEventListener('click', action));
}

countFav();
