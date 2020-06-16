//global variables
let activePosition = [];
let chance;
const scrollSize = window.innerWidth - document.body.clientWidth;


//add listeners for containers
const clickableField = [...document.querySelectorAll('.mail')];
clickableField.forEach(el => el.addEventListener('click', Lotery));

requestIP(); //start checking the clientIP
previousPlay(); //check if client previously visited and play here

//Opening tryies (not winner) + Opening win container (if it has already checked)
function previousPlay() {

  let tempActivePosition = JSON.parse(localStorage.getItem('activePosition'));
  if (tempActivePosition !== null) {
    activePosition = tempActivePosition;
    renderActive(activePosition);
  }

  let winPosition = localStorage.getItem('winposition');
  if (winPosition !== null) {
    renderWin(winPosition);
  } else {
    let tempChance = JSON.parse(localStorage.getItem('chance'));
    tempChance !== null ? chance = tempChance : chance = 3;
    document.querySelector('#try').innerText = `${chance}`;
  }
}

//main
function Lotery(ev) {
  let checked = false;
  const injectImg = ev.target.parentElement;

  let input = this.classList;

  input.forEach(el => {
    el == 'active' ? checked = true : null;
  });

  if (checked === false) {

    if (chance == 1) {
      let win = document.createElement('img');
      win.src = './img/iphone.png';
      win.alt = "you are winner";
      win.classList.add("mail__iphone");
      injectImg.append(win);

      setTimeout(addClass, 100, this);
      setTimeout(youAreWinner, 700);
      setTimeout(openAll, 1500);
      setTimeout(winPopup, 2500);

      localStorage.setItem('winposition', this.dataset.id);

      chance = chance - 1;
      localStorage.setItem('chance', chance);
    } else {
      addClass(this);
      activePosition.push(this.dataset.id);

      localStorage.setItem('activePosition', JSON.stringify(activePosition));
      chance = chance - 1;
      setTimeout(chancePopup, 500);
      setTimeout(tries, 350);
      localStorage.setItem('chance', JSON.stringify(chance));
    }
  }
}

//add class for opening
function addClass(obj) {
  obj.classList.add('active');
}

//text you are winner
function youAreWinner() {
  document.querySelector('.title__lotery').innerText = `You are winner`;
}

//text about how many tries do you have
function tries() {
  document.querySelector('#try').innerText = `${chance}`;
}

//open all not opening container (for demonstration that iphone was only in 1 container)
function openAll() {
  const notOpenYet = [...document.querySelectorAll('.mail:not(active)')];
  notOpenYet.forEach(el => el.classList.add('active'));
}

//open previously opened container (if client refresh the page)
function renderActive(arr) {

  arr.forEach(el => {
    clickableField.forEach(element => {
      element.dataset.id == el ? element.classList.add('active') : null;
    });
  });
}

//open previoudly opened win position (with injected iphone)
function renderWin(item) {
  clickableField.forEach(el => {

    if (el.dataset.id == item) {

      let win = document.createElement('img');
      win.src = './img/iphone.png';
      win.alt = "you are winner";
      win.classList.add("mail__iphone");

      el.childNodes[1].childNodes[1].append(win);
      setTimeout(addClass, 100, el);

      youAreWinner();
      setTimeout(openAll, 1000);
      setTimeout(winPopup, 2000);
    }
  });
}

//request Client IP if needed
function requestIP() {

  let clientIp = localStorage.getItem('clientIp');

  if (clientIp === null) {
    fetch(
      'https://api.ipify.org?format=json',
      { method: 'GET' }
    )
      .then(req => {
        return req.json();
      })
      .then(data => {
        localStorage.setItem('clientIp', data.ip);
      });
  }

}

//If clint win - show the popup for receiving the prize
function winPopup() {
  let injectField = document.querySelector('body');
  let clientIp = localStorage.getItem('clientIp');
  let clientIpString;

  clientIp !== null ? clientIpString = `<div class="popup__ip"><h3 class="popup__ip-data">${clientIp}</h3><p class="popup__ip-text">IP adress of Winner</p></div>` : clientIpString = `<div class="popup__ip" style="display:none"></div>`;

  let injection = document.createElement('div');
  injection.classList.add('popup');
  injection.innerHTML =
    `<div class="popup__body">
    <div class="popup__animation--win"></div>
        ${clientIpString}
        <div class="popup__text">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestias voluptatibus distinctio quo impedit fugit, neque tempora tempore suscipit officia eos odit porro illum, aperiam voluptate pariatur repudiandae. Ratione illo sunt omnis provident necessitatibus aliquam dolore similique. Nesciunt
        </div>
        <button class="popup__button">
          <a href="https://google.com" class="popup__link">Claim your Iphone</a>
        </button>
     </div>`;
  injectField.append(injection);

  //= ./animation-win

  //fixed main container of the page
  const body = document.querySelector('body');
  body.style.overflow = "hidden";
  body.style.paddingRight = `${scrollSize}px`;
}


function chancePopup() {
  let injectField = document.querySelector('body');

  let injection = document.createElement('div');
  injection.classList.add('popup--chance');
  injection.innerHTML =
    `<div class="popup__body popup__body--chance">
        <div class="popup__text popup__text--chance">
        <div class="popup__animation"></div>
          <div class="popup__oopss">Oopss..</div> But you have ${chance} extra throw
        </div>
        <button class="popup__button popup__button--tryonemore">Try one more</button>
     </div>`;
  injectField.append(injection);

  //= ./animation

  document.querySelector('body > .container').style.pointerEvents = 'none';
  document.querySelector('.popup__body--chance').addEventListener('click', closeChangePopup);
}



function closeChangePopup() {
  document.querySelector('.popup--chance').remove();
  document.querySelector('body > .container').style.pointerEvents = 'all';
}
