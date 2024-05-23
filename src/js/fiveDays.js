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
    Notify.failure(
      'Sorry, there are no cities matching your search query. Please try again.'
    );
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

function changeNameForFiveDays() {
  fiveDayCitiesName.innerHTML = '';
  fiveDayCitiesName.textContent = `${nameForFiveDays}, ${countryForFiveDays}`;
}

fiveDayList.addEventListener('click', changeColorWeekDay);
let isChosenWeekDay = null;
function changeColorWeekDay(evt) {
  if (evt.target.nodeName !== 'BUTTON') {
    return;
  }

  const chosenWeekDay = evt.target.parentNode.firstElementChild;
  const isAlreadySelected =
    chosenWeekDay.classList.contains('fiveDays--selected');

  clearColorWeekDay();

  // If the clicked button corresponds to the already selected day,
  // toggle the visibility of the more info section.
  if (isAlreadySelected) {
    weatherInfo.classList.toggle('is-hidden');
    adjustMarginTop();
    return;
  }

  // Otherwise, proceed with selecting the clicked day and showing more info.
  clearColorWeekDay();
  chosenWeekDay.classList.add('fiveDays--selected');

  // Update opacity of "more info" buttons
  updateMoreInfoButtonsOpacity(evt.target);

  fetchMoreInfo(listForMore, evt.target.id);
  weatherInfo.classList.remove('is-hidden');
  adjustMarginTop(true);

  // const moreInfoVisible = !weatherInfo.classList.contains('is-hidden');
  // const btnMargin = document.querySelector('.today__button__list');
  // btnMargin.style.marginTop = moreInfoVisible ? '68px' : ''; // Adjust margin based on visibility
}

function updateMoreInfoButtonsOpacity(selectedButton) {
  const allButtons = document.querySelectorAll('.fiveDays__btn');
  const isHidden = weatherInfo.classList.contains('is-hidden');
  allButtons.forEach(button => {
    if (button === selectedButton) {
      button.style.opacity = 1; // Set opacity to 1 for selected button
    } else {
      button.style.opacity = 0.3; // Set opacity to 0.3 for other buttons
    }
  });
}

function adjustMarginTop(visible = false) {
  const btnMargin = document.querySelector('.today__button__list');
  if (visible) {
    btnMargin.style.marginTop = '68px'; // Set margin when more info is visible
  } else {
    btnMargin.style.marginTop = ''; // Reset margin when more info is hidden
  }
}

function clearColorWeekDay() {
  isChosenWeekDay = document.querySelector('.fiveDays--selected');
  if (isChosenWeekDay) {
    isChosenWeekDay.classList.remove('fiveDays--selected');
  }
}
