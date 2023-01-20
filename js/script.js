'use strict'


let mainInput = document.querySelector('.header__input');
let mainButton = document.querySelector('.header__button');
let ipAddress = document.querySelector('#ipAdress');
let locationIp = document.querySelector('#location');
let timezoneIP = document.querySelector('#Timezone');
let OperatorIp = document.querySelector('#Operator');
let header = document.querySelector('.header');
let informationBlock = document.querySelector('.main-information');
let errorDiv = document.querySelector('.error');
let div;



let mainMap;
let mainFlag;

fetch('https://ipapi.co/json/')
.then(function(response) {
  response.json().then(jsonData => {
    showAddress (jsonData);
    transferFlag(jsonData.latitude, jsonData.longitude);
  });
})
.catch(function() {
  console.log('error');
});

function showAddress (jsonData) {
  ipAddress.innerHTML = jsonData.ip;
  locationIp.innerHTML = jsonData.city + ', ' + jsonData.country + ', ' + jsonData.postal;
  timezoneIP.innerHTML = 'UTC' + jsonData.utc_offset;
  OperatorIp.innerHTML = jsonData.org;

}
mainButton.addEventListener('click', function() {
  if ((mainInput.value == '') || (mainInput.value == ' ')) {
    return;
  } else {
    fetch(`https://ipapi.co/${mainInput.value}/json/`)
    .then(function(response) {
      response.json().then(jsonData => {
        console.log(jsonData);
        if (jsonData.reason == "Invalid IP Address" || jsonData.error == 'true') {
          informationBlock.style.opacity = '0';
          showError ();
        } else {
          if (div) {
            div.style.display = 'none';
          }
          showAddress (jsonData);
          informationBlock.style.opacity = '1';
          doMap ();
          transferFlag(jsonData.latitude, jsonData.longitude);
          return jsonData;
        }

      });
    })
    .catch(function(error) {
      console.log(error);
    });
  }
} )

function showError () {
  div = document.createElement("div");
  div.classList.add('error');
  header.prepend(div);
  div.appendChild(document.createTextNode('Произошла ошибка.Возможно введен не корректный ip.'));
}


function doMap () {

  ymaps.ready(function(latitude, long){
    mainMap = new ymaps.Map(document.querySelector('.map'), {
        center: [55.76, 37.64],
        zoom: 15,
        type: 'yandex#map'
    });
    mainFlag = new ymaps.Placemark(mainMap.getCenter(), {
      hintContent: '',
      balloonContent: ''

    }, {
      iconLayout: 'default#image',
      iconImageHref: 'icon/flag.png',
    });
});
}
doMap ();


function transferFlag (x, y) {
    mainMap.panTo([x, y], {
      delay: 3500
  });
    mainFlag.geometry.setCoordinates([x, y], 10);
  mainMap.geoObjects.add(mainFlag);
}







