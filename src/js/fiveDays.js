import fetchMoreInfo from './more-info';
import runChart from './chart';
const fiveDayList = document.querySelector('.fiveDays__list');
const fiveDayCitiesName = document.querySelector('.fiveDays__citiesName');
const fiveDayContainer = document.querySelector('.fiveDays--container');
const weatherInfo = document.querySelector('.more-info');
let latForFiveDays = '';
let lonForFiveDays = '';
let nameForFiveDays = '';
let countryForFiveDays = '';
let listForMore = {};

export default async function test(testList) {
  let infoAboutCity = testList.city;

  latForFiveDays = infoAboutCity.coord.lat;
  lonForFiveDays = infoAboutCity.coord.lon;
  nameForFiveDays = infoAboutCity.name;
  countryForFiveDays = infoAboutCity.country;
  openFiveDays();

  listForMore = testList;
}

function openFiveDays() {
  creatingFiveDays();
  changeNameForFiveDays();
}

async function fetchWeatherForFiveDays() {
  try {
    const APIKey = 'daa3c03c1253f276d26e4e127c34d058';
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latForFiveDays}&lon=${lonForFiveDays}&exclude=hourly,minutely&units=metric&appid=${APIKey}`
    );
    const weatherList = await response.json();
    return weatherList.daily;
  } catch (error) {
    // Notify.failure("Sorry, there are no cyties matching your search query. Please try again.")
  }
}

// creating markup
async function creatingFiveDays() {
  await fetchWeatherForFiveDays().then(daily => {
    createMarkupFiveDays(daily);
    runChart(daily);
  });
}

async function createMarkupFiveDays(weathers) {
  fiveDayList.innerHTML = '';
  let MarkupFiveDays = await weathers
    .slice(1, 6)
    .map(weather => {
      const dateForFiveDays = createDateForFiveDays(weather);
      const iconFiveDays = weather.weather[0].icon;
      const altFiveDays = weather.weather[0].description;

      return ` <li class="fiveDays__item">
        <span class="fiveDays__weekDay">${dateForFiveDays[0]}</span>
    
        <span class="fiveDays__date">${dateForFiveDays[1]} ${
        dateForFiveDays[2]
      }</span>
        <div class="fiveDays__div"><img class="fiveDays__img" src="https://openweathermap.org/img/wn/${iconFiveDays}@2x.png" 
   width="50px" height="50px" alt="${altFiveDays}"></div>
        <div class="fiveDays__range--common">
            <div class="fiveDays__range fiveDays__range--border">
                <span class="fiveDays__range--limit">min</span>
                <span class="fiveDays__range--limitNumber">${Math.round(
                  weather.temp.min
                )}&#176</span>
            </div>
            <div class="fiveDays__range">
                <span class="fiveDays__range--limit">max</span>
                <span class="fiveDays__range--limitNumber">${Math.round(
                  weather.temp.max
                )}&#176</span>
            </div>
        </div>
        <button type="button" class="fiveDays__btn" id="${
          dateForFiveDays[1]
        }">more info</button>
    </li>`;
    })
    .join('');

  return await fiveDayList.insertAdjacentHTML('beforeend', MarkupFiveDays);
}

// working with dates
function createDateForFiveDays(weather) {
  const date = new Date(weather.dt * 1000);
  const day = date.getDate();

  const indexMonth = date.getMonth();
  const arrayOfMonthes = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = arrayOfMonthes[indexMonth];

  const indexWeekDay = date.getDay();
  const arrayOfWeekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const weekDay = arrayOfWeekDays[indexWeekDay];

  return [weekDay, day, month];
}

// change of city and country that return from the very first call to back
function changeNameForFiveDays() {
  fiveDayCitiesName.innerHTML = '';
  fiveDayCitiesName.textContent = `${nameForFiveDays}, ${countryForFiveDays}`;
}

// container display 5 days
export function showFiveDays() {
  fiveDayContainer.classList.remove('is-hidden');
  clearColorWeekDay();
}

// hide container for 5 days - add to button today
function hideFiveDays() {
  fiveDayContainer.classList.add('is-hidden');
}

// change the color of the day by clicking on moreinfo

fiveDayList.addEventListener('click', changeColorWeekDay);
let isChosenWeekDay = null;
function changeColorWeekDay(evt) {
  if (evt.target.nodeName !== 'BUTTON') {
    return;
  }
  clearColorWeekDay();
  fetchMoreInfo(listForMore, evt.target.id);
  weatherInfo.classList.remove('is-hidden');

  const chosenWeekDay = evt.target.parentNode.firstElementChild;
  chosenWeekDay.classList.add('fiveDays--selected');

  if (!evt.target || !isChosenWeekDay) {
    return;
  }
  if (evt.target.parentNode === isChosenWeekDay.parentNode) {
    chosenWeekDay.classList.remove('fiveDays--selected');
    weatherInfo.classList.add('is-hidden');
  }
}

function clearColorWeekDay() {
  isChosenWeekDay = document.querySelector('.fiveDays--selected');
  if (isChosenWeekDay) {
    isChosenWeekDay.classList.remove('fiveDays--selected');
  }
}
