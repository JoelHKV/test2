import './style.css'

var map;
var lat = 63.5
var lon = 25
var latstep = 0
var marker = []
var infowindow = {}

var nroitems = 120


document.getElementById('openpopup').addEventListener("click", openTableWindow);
document.getElementById('stationvstrip').addEventListener("click", stationTripView);
//document.getElementById('filterStations').addEventListener("click", updateStationList);

const filterStations = document.getElementById('filterStations')

filterStations.addEventListener("input", () => {
    update2stations(stationdata)
})




var stationdata
//var stationkeys
var stationskeys = []
var tripdata
var stationview = 0

function openffffTableWindow() {
 
    const calendarWindow = window.open("", "", "width=400,height=300");
    const today = new Date();
    const currentMonth = 6 //today.getMonth();
    const currentYear = 2022 //today.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let calendarHTML = `
        <table>
          <thead>
            <tr>
              <th colspan="7">${monthNames[currentMonth]} ${currentYear}</th>
            </tr>
            <tr>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
              <th>Sun</th>
            </tr>
          </thead>
          <tbody>
            <tr>
      `;

    let dayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    let currentDay = 1;

    while (currentDay <= numberOfDaysInMonth) {
        if (dayOfWeek === 1) {
            calendarHTML += "</tr><tr>";
        }
        calendarHTML += `<td>${currentDay}</td>`;
        dayOfWeek = (dayOfWeek + 1) % 7;
        currentDay++;
    }

    calendarHTML += `
            </tr>
          </tbody>
        </table>
      `;

    calendarWindow.document.write(calendarHTML);
}

//const popupButton = document.getElementById("popup-button");
//const popup = document.getElementById("popup");
//const close = document.getElementsByClassName("close")[0];
//const calendar = document.getElementById("calendar");



stationTripView()

function getdata(thisaddress, mode) {

    // document.getElementById('info').innerHTML = 'Wait for data..'
    fetchThis(thisaddress, mode)
        .then((data) => {
            if (mode == 1) { update2stations(data) }
            if (mode == 2) { updatetripdata(data) }
        })
        .catch(error => { nodice() })
    //    .then(() => { //document.getElementById('info').innerHTML = '' 
    //     });



    async function fetchThis(thislocation, mode) {

        let response = await fetch(thislocation,
            {
                method: 'GET'
            });
       
        if (response.headers.get('Content-Type').includes('application/json')) {
            return await response.json();
        }
        else {
            return await response.text();
        }

    }

}



function update2stations(data) {
    const filterValue = filterStations.value.toLowerCase();
    stationdata = data

    

    let sortedData = Object.entries(stationdata).sort((a, b) => {
        if (a[1].Nimi > b[1].Nimi) {
            return 1;
        } else {
            return -1;
        }
    });

    var tempkeys = sortedData.map(item => item[0]);

    const list = document.getElementById('list');
    list.innerHTML = '';
    stationskeys = []
    for (let i = 0; i < tempkeys.length; i++) {
        var thisname = stationdata[tempkeys[i]]["Nimi"]
        if (thisname.toLowerCase().startsWith(filterValue) == true) {
            const li = document.createElement('li');
            li.innerHTML = thisname;
            list.appendChild(li);
            stationskeys.push(tempkeys[i]);
        }
        else {}
    }
    addStationListener()


}


function updatetripdata(data) {
    tripdata = data
    const list = document.getElementById('list');
    list.innerHTML = '';
   
    for (let i = 0; i < 53; i++) {
        const li = document.createElement('li');
        li.innerHTML = tripdata[i][0] + '.' + tripdata[i][1] + '.' + tripdata[i][2];
        list.appendChild(li);
    }
    addTripListener()

}


function nodice() {
    alert('fdfd')
    
}


function addStationListener() {
    const listItems = document.querySelectorAll('#list li');
    listItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            document.getElementById('stationName').innerHTML = stationdata[stationskeys[index]]["Nimi"]    
            document.getElementById('stationAddress').innerHTML = stationdata[stationkeys2[index]]["Osoite"]
        });
    });
}

function addTripListener() {
    const listItems = document.querySelectorAll('#list li');
    listItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            document.getElementById('stationName').innerHTML = stationdata[tripdata[index][3]]["Nimi"] + ' ' + stationdata[tripdata[index][4]]["Nimi"]
            document.getElementById('stationAddress').innerHTML = tripdata[index][5]
        });
    });
}

function stationTripView() {
    stationview = -stationview
    if (stationview == 0) {
        document.getElementById('stationvstrip').innerHTML = 'Stations:'
        getdata('https://jsonhandler-c2cjxe2frq-lz.a.run.app/?action=stations', 1)
        stationview = 1
    }

    if (stationview == 1) {
        document.getElementById('stationvstrip').innerHTML = 'Stations:'
        update2stations(stationdata)
    }
    if (stationview == -1) {
        document.getElementById('stationvstrip').innerHTML = 'Trips:'
        getdata('https://jsonhandler-c2cjxe2frq-lz.a.run.app/?action=datashort', 2)
    }
    
}



//let element = document.getElementById("map");
//let style = window.getComputedStyle(element);
//let marginTop = style.getPropertyValue("margin-top");




document.querySelector(".up").addEventListener("click", () => {
  
    
});



document.querySelector(".down").addEventListener("click", () => {

  
});


document.querySelector(".left").addEventListener("click", () => {
   
});

document.querySelector(".right").addEventListener("click", () => {
    stepX -= 1
    
});

