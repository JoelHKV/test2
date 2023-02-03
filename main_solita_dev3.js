import './style.css'

var map;
var lat = 63.5
var lon = 25
var latstep = 0
var marker = []
var infowindow = {}

var nroitems = 120

var currentYear = 2022
var currentMonth = 5

//document.getElementById('openpopup').addEventListener("click", openCalendarWindow);
document.getElementById('stationvstrip').addEventListener("click", stationTripView);
//document.getElementById('filterStations').addEventListener("click", updateStationList);

const filterStations = document.getElementById('filterStations')
const showcalendar = document.getElementById('calendar')



filterStations.addEventListener("input", () => {
    update2stations(stationdata)
})


document.querySelector(".calendar").addEventListener("click", () => {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let calendarHTML = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }

      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        cursor: pointer;
      }

        .arr {
        cursor: pointer;
        
        }


    </style>
    <table>
      <thead>
        <tr>
            <th class="arr" >Prev</th>
          <th colspan="5">${monthNames[currentMonth]} ${currentYear}</th>
            <th class="arr" >Next</th>
        </tr>
<tr>
<th colspan="7">&nbsp;</th>
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

    let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let firstDayOfWeek = firstDayOfMonth.getDay() || 7;
    let currentDay = 1;

    for (let i = 1; i < firstDayOfWeek; i++) {
        calendarHTML += `<td></td>`;
    }

    while (currentDay <= numberOfDaysInMonth) {
        if (firstDayOfWeek === 8) {
            calendarHTML += "</tr><tr>";
            firstDayOfWeek = 1;
        }
        calendarHTML += `<td onclick="saveDate('${currentYear}-${currentMonth + 1}-${currentDay}')">${currentDay}</td>`;
        firstDayOfWeek++;
        currentDay++;
    }

    calendarHTML += `
        </tr>
      </tbody>
    </table>
    <button onclick='closeCalendarWindow2()'>Close</button>
     <script>
     
        
        function closeCalendarWindow2() {
          alert('dddd')

        }
        </script>

  `;

    document.getElementById('calendar2').innerHTML = calendarHTML

});



document.querySelector(".openpopup").addEventListener("click", () => {
    openCalendarWindow(currentYear, currentMonth)

});


var stationdata
//var stationkeys
var stationskeys = []
var tripdata
var stationview = 0

function openCalendarWindow(currentYear, currentMonth) {
    const calendarWindow = window.open("", "", "left=500, top=500, width=400,height=300");
   // const today = new Date();
   // const currentMonth = today.getMonth();
   // const currentYear = today.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let calendarHTML = `
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }

      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        cursor: pointer;
      }

        .arr {
        cursor: pointer;
        font-size: 1.6rem;
        }


    </style>
    <table>
      <thead>
        <tr>
            <th class="arr" onclick="closeCalendarWindow(-1)" >Prev</th>
          <th colspan="5">${monthNames[currentMonth]} ${currentYear}</th>
            <th class="arr" onclick="closeCalendarWindow(1)" >Next</th>
        </tr>
<tr>
<th colspan="7">&nbsp;</th>
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

    let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let firstDayOfWeek = firstDayOfMonth.getDay() || 7;
    let currentDay = 1;

    for (let i = 1; i < firstDayOfWeek; i++) {
        calendarHTML += `<td></td>`;
    }

    while (currentDay <= numberOfDaysInMonth) {
        if (firstDayOfWeek === 8) {
            calendarHTML += "</tr><tr>";
            firstDayOfWeek = 1;
        }
        calendarHTML += `<td id='${currentYear}-${currentMonth + 1}-${currentDay}' onclick="saveDate('${currentYear}-${currentMonth + 1}-${currentDay}')">${currentDay}</td>`;
        firstDayOfWeek++;
        currentDay++;
    }

    calendarHTML += `
        </tr>
      </tbody>
    </table>
    <button onclick="closeCalendarWindow()">Close</button>
              <script>
        function saveDate(day, month, year) {
            document.getElementById(day).style.backgroundColor = '#999999';
        }
        
        function closeCalendarWindow(monthstep) {
          window.close();

            thismonth=thismonth+monthstep
            openCalendarWindow(thisyear, thismonth)
        }
        </script>
  `;

    
  
    calendarWindow.document.write(calendarHTML);

}




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

