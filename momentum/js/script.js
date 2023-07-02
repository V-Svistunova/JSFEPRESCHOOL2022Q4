import playList from './playList.js';

const time = document.querySelector('.time');
const dateBlock = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const body = document.querySelector('.body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.humidity');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const playListContainer = document.querySelector('.play-list');


let city = document.querySelector('.city');
let timeOfDay = '';
let name = document.querySelector('.name');
let randomNum = 20;
let isPlay = false;
let playNum = 0;


function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;

  showDate();
  getTimeOfDay();

  setTimeout(showTime, 1000);
}

function showDate() {
  const date = new Date();
  const options = {month: 'long', day: 'numeric', timeZone: 'UTC'};
  const currentDate = date.toLocaleDateString('en-US', options);

  let dayOfWeekArrow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayOfWeek = dayOfWeekArrow[date.getDay()];

  dateBlock.textContent = dayOfWeek + ", " + currentDate;
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  let timeOfDayArrow = ['night', 'morning', 'afternoon', 'evening', 'day'];

  if ( hours >= 0 && hours < 6) {
    timeOfDay = timeOfDayArrow[0];
  } else if (hours >= 6 && hours < 12) {
    timeOfDay = timeOfDayArrow[1];
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = timeOfDayArrow[2];
  } else if (hours >= 18 && hours < 24) {
    timeOfDay = timeOfDayArrow[3];
  } else {
    timeOfDay = timeOfDayArrow[4];
  }

  greeting.textContent = `Good ${timeOfDay},`;
  return timeOfDay;

}


// save name
function setLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', city.value);
}

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
  if(localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
}

window.addEventListener('load', getLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);


showTime();


function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

function setBg() {
  randomNum = getRandomNum(20);
  randomNum = String(randomNum).padStart(2, "0");
 
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/` + `${randomNum}` + `.jpg`;
  img.onload = () => {      
    document.body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/` + `${randomNum}` + `.jpg')`;
  }; 

}

setBg();

slideNext.addEventListener('click', setBg);
slidePrev.addEventListener('click', setBg);



async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp}°C`;
  weatherDescription.textContent = data.weather[0].description;
  windSpeed.textContent = `Wind speed: ${data.wind.speed}m/s`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
}
getWeather()

city.addEventListener('change', getWeather);



async function getQuotes() {  
  const quotes = 'data.json';
  const res = await fetch(quotes);
  const data = await res.json(); 

  let length = Object.keys(data).length;
  let randomNumber = getRandomNum(length);

  quote.textContent = data[randomNumber].text;
  author.textContent = data[randomNumber].author;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);


const audio = new Audio();
const playBtn = document.querySelector('.play');
const playBtnNext = document.querySelector('.play-next');
const playBtnPrev = document.querySelector('.play-prev');

function toggleBtn() {
  playBtn.classList.toggle('pause');
}
function playsAudio() {
  playBtn.classList.add('pause');
  isPlay = true;

  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  audio.play();
}
function pauseAudio() {
  playBtn.classList.remove('pause');

  audio.pause();
  isPlay = false;
}

function playAudio() {
  if(!isPlay) {
    playsAudio()
  }else {
    pauseAudio()
  }
};

function playNext() {
  if (playNum != (playList.length - 1)) {
    playNum = playNum + 1;
  } else {
    playNum = 0;
  }
  createList();
  playsAudio();
}

function playPrev() {
  if (playNum != 0) {
    playNum = playNum - 1;
  }else {
    playNum = (playList.length - 1);
  }
  createList();
  playsAudio();
}


playBtn.addEventListener('click', playAudio);
playBtnPrev.addEventListener('click', playPrev);
playBtnNext.addEventListener('click', playNext);


function createList() {
  playListContainer.innerHTML = '';
  for(let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    if (playNum == i) {
      li.classList.add('item-active');
    } else {
      li.classList.remove('item-active');
    }
    li.textContent = playList[i].title;
    playListContainer.append(li);
  }
}
createList();


