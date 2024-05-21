import Chart from 'chart.js/auto'; //link to chart.js
let myChart = 0;
const jsHiden = document.querySelector('.js-hiden');
const chartBtnHide = document.querySelector('.chart--btn__show'); //excess with the text show Chart
const hideChart = document.querySelector('.hidden_title'); //excess with text hide Chart
const showChart = document.querySelector('.chart--btn'); //link to the show graph button
const hidenBtn = document.querySelector('.hidden_btn'); //link to hide chart button
const chartView = document.querySelector('.chart--view'); //link to the block with the chart itself
const ctx = document.querySelector('.myChart').getContext('2d');
chartBtnHide.addEventListener('click', onShowBox);
showChart.addEventListener('click', onShowBox);
hideChart.addEventListener('click', onHideBox);
hidenBtn.addEventListener('click', onHideBox);
//The function shows a graphic block with a link to the canvas
function onShowBox(e) {
  jsHiden.classList.add('hidden') & chartView.classList.remove('hidden');
}
//The function removes the chart block
function onHideBox(e) {
  chartView.classList.add('hidden') & jsHiden.classList.remove('hidden');
}

export default function runChart(data) {
  onHideBox();
  if (myChart) {
    myChart.destroy();
  }
  const sliceDaily = data.slice(0, 5);
  const dataToChart = processedData(sliceDaily);

  chartRender(dataToChart, ctx);
}

// Takes an array of objects as input (obj).
const processedData = obj => {
  const getDateTxt = data => new Date(data.dt * 1000).toDateString();
  const proData = {
    data: obj.map(elem => getDateTxt(elem).slice(4, getDateTxt(elem).length)),
    temp: obj.map(elem => elem.temp.day),
    humidity: obj.map(elem => elem.humidity),
    speed: obj.map(elem => elem.wind_speed),
    pressure: obj.map(elem => elem.pressure),
  };
  return proData;
};

// The function accepts an array of objects (ready data) and a link to the chart
function chartRender(labels, link) {
  const configChart = {
    type: 'line',
    data: {
      labels: labels.data,
      datasets: [
        {
          label: '— Temperature, C°' + resize(),
          data: labels.temp,
          tension: 0.2,
          fill: false,
          backgroundColor: 'rgba(255, 107, 9, 1)',
          borderColor: 'rgba(255, 107, 9, 1)',
          borderWidth: 1,
        },
        {
          label: '— Humidity, %' + resize(),
          data: labels.humidity,
          tension: 0.2,
          fill: false,
          backgroundColor: 'rgba(9, 6, 235, 1)',
          borderColor: 'rgba(9, 6, 235, 1)',
          borderWidth: 1,
        },
        {
          label: '— Wind Speed, m/s' + resize(),
          data: labels.speed,
          tension: 0.2,
          fill: false,
          backgroundColor: ['rgba(234, 154, 5, 1)'],
          borderColor: ['rgba(234, 154, 5, 1)'],
          borderWidth: 1,
        },
        {
          label: '— Atmosphere Pressure, m/m',
          data: labels.pressure,
          tension: 0.2,
          fill: false,
          backgroundColor: 'rgba(6, 120, 6, 1)',
          borderColor: 'rgba(6, 120, 6, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 0,
          bottom: 20,
        },
      },
      plugins: {
        legend: {
          display: true,
          align: 'start',
          labels: {
            boxWidth: 15,
            boxHeight: 12,
            defaultFontColor: 'rgb(5, 120, 6)',
            color: 'rgba(247, 242, 242, 1)',
            padding: 10,
          },
          // For Clickable
          onClick: function (e, legendItem) {
            const index = legendItem.datasetIndex;
            const chart = this.chart;
            const meta = chart.getDatasetMeta(index);

            meta.hidden =
              meta.hidden === null ? !chart.data.datasets[index].hidden : null;

            chart.update();
          },
        },
        title: {
          display: false,
          text: 'Value of indicators',
          position: 'left',
          padding: 0,
          fullSize: false,
        },
      },

      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 1)',
          },
          ticks: {
            padding: 18,
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 1)',
          },
          ticks: {
            padding: 18,
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2,
    },
  };

  myChart = new Chart(link, configChart);
}

function resize() {
  if (window.outerWidth <= 767) {
    return '                                       ';
  } else {
    return '';
  }
}

export {
  jsHiden,
  chartBtnHide,
  hideChart,
  showChart,
  hidenBtn,
  chartView,
  ctx,
  onShowBox,
  onHideBox,
  processedData,
  chartRender,
  resize,
};
