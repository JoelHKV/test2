import './style.css'

var map;
var lat = 63.5
var lon = 25
var latstep = 0
var marker = []
var infowindow = {}

var nroitems = 120

var daterange = 32223

var stationdata
//var stationkeys
var stationskeys = []
var tripdata
var stationview = 0
var calendardates = []
var startMonth = 4
var endMonth = 7
var currentYear = 2022

//document.getElementById('openpopup').addEventListener("click", openCalendarWindow);
document.getElementById('stationvstrip').addEventListener("click", stationTripView);
//document.getElementById('filterStations').addEventListener("click", updateStationList);

const filterStations = document.getElementById('filterStations')
//const showcalendar = document.getElementById('calendar')



filterStations.addEventListener("input", () => {
    update2stations(stationdata)
})






document.querySelector(".openpopup").addEventListener("click", () => {
   
    openCalendarWindow(currentYear, startMonth, endMonth)

})


function openCalendarWindow(currentYear, startMonth, endMonth) {
    const calendarWindow = window.open("", "", "left=500, top=500, width=400,height=700");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
      }</style>`

    for (let currentMonth = startMonth; currentMonth < endMonth; currentMonth++) {
        const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
 
        calendarHTML += `
 
    <table>
      <thead>
        <tr>          
          <th colspan="7">${monthNames[currentMonth]} ${currentYear}</th>        
        </tr>
<tr>
<th colspan="7">&nbsp;</th>
</tr>
        <tr>
          <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
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
            calendarHTML += `<td id='${currentYear}-${currentMonth + 1}-${currentDay}' onclick="saveDate('${currentYear}-${currentMonth + 1}-${currentDay}',${startMonth},${endMonth},${currentYear})">${currentDay}</td>`;
        
            firstDayOfWeek++;
            currentDay++;
        }

        calendardates.push(currentDay)

        calendarHTML += `
        </tr>
      </tbody>
    </table>`

    }

calendarHTML += `
    <button onclick="closeCalendarWindow()">Close</button>
              <script>
        function saveDate(day,startM, endM, thisY) {

            var howmanyclicks=browsecalendar(0,startM, endM, thisY, day)
            if (howmanyclicks==1) {
                document.getElementById(day).style.backgroundColor = '#999999';
                browsecalendar(1,startM, endM, thisY, day)}
            if (howmanyclicks>1) {browsecalendar(2,startM, endM, thisY, day)}
            
            document.getElementById(day).style.backgroundColor = '#999999';
        }

        function browsecalendar(mode,startM, endM, thisY, day) { 
            var howmanyclicks=0
            var thismonth = startM + 1
            var numberOfDaysInMonth = new Date(thisY, thismonth, 0).getDate()
            var i = 0  
            while (thismonth<=endM) {
            i++
            var temp= thisY + '-' + (thismonth) + '-' + i
            var tempstart
           if (mode==-1 && document.getElementById(temp).style.backgroundColor === "rgb(153, 153, 153)" ) {
                mode=-2
                window.opener.document.getElementById("calendar2").innerHTML = tempstart + ' - ' + temp

            }


            if (mode==1 && document.getElementById(temp).style.backgroundColor === "rgb(153, 153, 153)") {
                mode=-1
                tempstart = temp
            }
 
          
            if (mode==-1) {
                document.getElementById(temp).style.backgroundColor = '#999999';
            }
   
            if (mode==0 && document.getElementById(temp).style.backgroundColor === "rgb(153, 153, 153)") {
            howmanyclicks++
            }
            if (mode==2) {document.getElementById(temp).style.backgroundColor = '#ffffff';}
            
            if (i>=numberOfDaysInMonth) {
                i = 1
                thismonth++
                numberOfDaysInMonth = new Date(thisY, thismonth, 0).getDate()
            }
            }
            return howmanyclicks

        }

        
        function closeCalendarWindow(monthstep) {
        window.opener.document.getElementById("calendar2").innerHTML = 'ggg'
        //window.opener.receiveData('hh')
          window.close();
        }
        </script>
  `;

    
  
    calendarWindow.document.write(calendarHTML);

}




stationTripView()

function closeCalendarWindow() {
    document.getElementById("calendar2").innerHTML = 'ggfffggg'
}


function receiveData(daterange) {
    // code to process the data received from the popup
    alert(daterange);
}

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

