import './style.css'

var map;
var lat = 63.5
var lon = 25
var latstep = 0
var marker = []
var infowindow = {}

var nroitems = 120

var stationdata
var stationskeys = []
var tripdata
var stationview = 0
var pagerange

document.getElementById('stationvstrip').addEventListener("click", stationTripView);

const filterStations = document.getElementById('filterStations')



filterStations.addEventListener("input", () => {
    update2stations(stationdata)
})


document.querySelector(".openpopup").addEventListener("click", () => {
   
   // openCalendarWindow(currentYear, startMonth, endMonth)
    openCalendarWindow(2021, 4, 7)
})

document.querySelector(".run").addEventListener("click", () => {
    
  
    var dates = document.getElementById("calendar2").innerHTML
    //alert(dates)
    getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=2021-05-22', 3)


});


document.querySelector("#goUp").addEventListener("click", function () {
    pagerange = 0;
    showtripdata()
});
document.querySelector("#scrollUp").addEventListener("click", function () {
    pagerange -= 1000;
    if (pagerange < 0) { pagerange == 0 }
    showtripdata()
});
document.querySelector("#scrollDown").addEventListener("click", function () {
    if (pagerange > Object.entries(tripdata).length) { pagerange == Object.entries(tripdata).length }
    pagerange += 1000;
    showtripdata()
});
document.querySelector("#goDown").addEventListener("click", function () {
    pagerange = Object.entries(tripdata).length;
    showtripdata()
});


function gettripdata(data) {

    tripdata = data 
    pagerange = Math.round(Object.entries(tripdata).length / 2)
    showtripdata()
}
function showtripdata() {    
   // alert(tripdata)
    const listt = document.getElementById('list-t');
    listt.innerHTML = '';

    var lenlen = 500
    //alert(lenlen)
    for (let i = Math.max((pagerange - lenlen), 0); i < Math.min((pagerange + lenlen), Object.entries(tripdata).length); i++) {
     const li = document.createElement('li');

        li.innerHTML = ` <div>
                    <p id="col1">${tripdata[i]["Departure"].substring(11, 16)}</p>
                    <p id="col2">${stationdata[tripdata[i]["Departure station id"]]["Nimi"]}</p>
                    <p id="col3">${stationdata[tripdata[i]["Return station id"]]["Nimi"]}</p>
                    <p id="col4">${(0.1 * Math.round(tripdata[i]["Covered distance (m)"] / 100)).toFixed(1) }</p>
                    <p id="col5">${(tripdata[i]["Duration (sec.)"] / 60).toFixed(0) }</p>
                </div>
                `;
        listt.appendChild(li);
    }

   //listt.selectedIndex = select.options.length - 1;
   // listt.scrollTop = 1000;
  // addTrip2Listener()

}

function addTrip2Listener() {
    const listItems = document.querySelectorAll('#list-t li');
    listItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            alert(index)
            //document.getElementById('stationName').innerHTML = 'llll'
            //document.getElementById('stationAddress').innerHTML = 'kk'
        });
    });
}





let departure_dropdown = document.getElementById("departure_dropdown");
let return_dropdown = document.getElementById("return_dropdown");





function openCalendarWindow(currentYear, startMonth, endMonth) {
    const calendarWindow = window.open("", "", "left=500, top=500, width=400,height=700");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var startend = document.getElementById("calendar2").innerHTML.split(' - ');
   // alert(startend[0])
    let colcol = '#ffffff'
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
            <th></th>
          <th colspan="5">${monthNames[currentMonth]} ${currentYear}</th>
            <th><button onclick="closeCalendarWindow()">X</button></th>
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

            var thisdate = currentDay + '.' + (currentMonth + 1) + '.'  + currentYear          
            if (thisdate == startend[0]) { colcol = '#999999' }
            calendarHTML += `<td style="background-color: ${colcol};" id='${thisdate}' onclick="saveDate('${thisdate}',${startMonth},${endMonth},${currentYear})">${currentDay}</td>`;
 
            if (thisdate == startend[1]) { colcol = '#ffffff' }
            firstDayOfWeek++;
            currentDay++;
        }

        calendarHTML += `
        </tr>
      </tbody>
    </table>`

    }

calendarHTML += `
              <script>
        function saveDate(day,startM, endM, thisY) {

            var howmanyclicks=browsecalendar(0,startM, endM, thisY, day)
            if (howmanyclicks==1) {
                if (document.getElementById(day).style.backgroundColor === "rgb(153, 153, 153)") {
                window.opener.document.getElementById("calendar2").innerHTML = day + ' - ' + day
                return
            }
                document.getElementById(day).style.backgroundColor = '#999999';
                browsecalendar(1,startM, endM, thisY, day)}
            if (howmanyclicks>1) {
            window.opener.document.getElementById("calendar2").innerHTML = day + ' - ' + day
            browsecalendar(2,startM, endM, thisY, day)}
            
            document.getElementById(day).style.backgroundColor = '#999999';
        }

        function browsecalendar(mode,startM, endM, thisY, day) { 
            var howmanyclicks=0
            var thismonth = startM + 1
            var numberOfDaysInMonth = new Date(thisY, thismonth, 0).getDate()
            var i = 0  

            while (thismonth<=endM) {
            i++         
            var temp= i + '.' + (thismonth) + '.' + thisY
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
                i = 0
                thismonth++
                numberOfDaysInMonth = new Date(thisY, thismonth, 0).getDate()
            }
            }
            return howmanyclicks
        }
       
        function closeCalendarWindow() { window.close(); }
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
            if (mode == 3) { gettripdata(data) }
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



function popupstations(stationdata, tempkeys) {
    departure_dropdown.options.length = 0;
    return_dropdown.options.length = 0;
    for (let i = -1; i < tempkeys.length; i++) {
        let option = document.createElement("option");
        if (i > -1) { option.text = stationdata[tempkeys[i]]["Nimi"]; }
        else { option.text = 'All Stations' }
        
        departure_dropdown.add(option);
        return_dropdown.add(option.cloneNode(true));
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
    popupstations(stationdata, tempkeys)
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







document.querySelector(".down").addEventListener("click", () => {

    alert('ddddd')
});


document.querySelector(".left").addEventListener("click", () => {
   
});

document.querySelector(".right").addEventListener("click", () => {
    stepX -= 1
    
});

