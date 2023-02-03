import './style4.css'

var map;
var regulargooglemarker
var polyline;


var lat = 63.5
var lon = 25
var latstep = 0
var marker = []
var infowindow = {}

var nroitems = 120

var stationdata
var stationskeys = []
var tripdata
var stationview = 1
var pagerange
var activestationid = 0

var displaymap = 1




var name = 'Nimi'
var address = 'Osoite'
var city = 'Kaupunki'
var helsinki = 'Helsinki' 

var placeitems = [['stationvstrip', 0, 0, 100, 10],
    ['menu', 10, 30, 70, 70],
    ['menutitleb', 10, 25, 70, 4],
    ['menutitle', 10, 25, 70, 4],
    ['map-container', 10, 25, 70, 70],
    ['innercalendar', 10, 30, 70, 70],
    ['departure_dropdown', 10, 18, 30, 6],
    ['return_dropdown', 50, 18, 30, 6],
    ['infoboard', 10, 15, 30, 10],
    ['infoboard2', 40, 15, 20, 10],
    ['infoboard3', 61, 15, 30, 10],
    ['goUp', 82, 36, 16, 10],
    ['scrollUp', 82, 48, 16, 10],
    ['currentdate', 82, 60, 16, 10],
    ['scrollDown', 82, 72, 16, 10],
    ['goDown', 82, 84, 16, 10],
    ['stationdetails', 70, 15, 10, 5],
    ['closemap', 70, 25, 10, 5],
['language', 5, 4, 6, 6]]



fixitemsize(placeitems)

function fixitemsize(placeitems) {

    const containerelement = document.querySelector("#container");
    var containerwidth = parseInt(window.getComputedStyle(containerelement).width)
    var containerheight = parseInt(window.getComputedStyle(containerelement).height)

    for (let i = 0; i < placeitems.length; i++) {

        const element = document.getElementById(placeitems[i][0])
        element.style.left = containerwidth * placeitems[i][1] / 100 + 'px'
        element.style.top = containerheight * placeitems[i][2] / 100 + 'px'
        element.style.width = containerwidth * placeitems[i][3] / 100 + 'px'
        element.style.height = containerheight * placeitems[i][4] / 100 + 'px'

    }
    document.getElementById('filterStations').style.width = containerwidth * 20 / 100 + 'px'
}

function stacknHide(stackElements,startZ,hideElements) {
    for (let i = 0; i < stackElements.length; i++) {
        document.getElementById(stackElements[i]).style.zIndex = startZ + 30 - i
        document.getElementById(stackElements[i]).style.visibility = "visible"
    }
    for (let i = 0; i < hideElements.length; i++) {
        document.getElementById(hideElements[i]).style.visibility = "hidden"
    }
}


stacknHide([], 1, ['departure_dropdown', 'return_dropdown','infoboard3', 'infoboard2', 'closemap', 'stationdetails', 'map-container'])


document.getElementById('stationvstrip').addEventListener("click", stationTripView);
document.getElementById('currentdate').addEventListener("click", changeDate);


const filterStations = document.getElementById('filterStations')


filterStations.addEventListener("input", () => {
    update2stations(stationdata)
})


document.querySelector("#goUp").addEventListener("click", function () {
    if (stationview == 1) { menu.scrollTop = 0; return }
    pagerange = 0;
    showtrip3data(-1)
});
document.querySelector("#scrollUp").addEventListener("click", function () {
    if (stationview == 1) { menu.scrollTop -= menu.scrollHeight / 20; return }
    pagerange -= 1000;
    if (pagerange < 0) { pagerange == 0 }
    showtrip3data(0)
});
document.querySelector("#scrollDown").addEventListener("click", function () {
    if (stationview == 1) { menu.scrollTop += menu.scrollHeight/20; return }
    if (pagerange > Object.entries(tripdata).length) { pagerange == Object.entries(tripdata).length }
    pagerange += 1000;
    showtrip3data(0)
});
document.querySelector("#goDown").addEventListener("click", function () {
    if (stationview == 1) { menu.scrollTop = menu.scrollHeight; return }
    pagerange = Object.entries(tripdata).length;
    
    showtrip3data(1)
});

document.querySelector("#stationdetails").addEventListener("click", function () {

    getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=D' + activestationid.toString(), 4)

});

document.querySelector("#closemap").addEventListener("click", function () {
    if (stationview == 1) {
        stacknHide(['menutitleb'], 1, ['infoboard3', 'infoboard2','closemap', 'stationdetails', 'map-container', 'infoboard'])
        if (regulargooglemarker) {
            regulargooglemarker.setMap(null);
        }
    }
    else {
        stacknHide(['menutitle'], 1, ['infoboard3', 'infoboard2','closemap', 'stationdetails', 'map-container', 'infoboard'])
    }

    if (polyline) {
        polyline.setMap(null);
    }


});

function changeDate() {

    if (stationview == 1) { return }
    var thisdate = document.getElementById("currentdate").innerHTML
    var generatedHTML = openCalendarWindow(2021, 4, 7, thisdate)
    document.getElementById("innercalendar").innerHTML = generatedHTML;
    let generatedCells = document.getElementsByClassName("generatedCell");
    document.getElementById("innercalendar").style.zIndex = 10
    for (let i = 0; i < generatedCells.length; i++) {
        generatedCells[i].addEventListener('click', function () {
            let param = this.getAttribute("data-param");
            document.getElementById("currentdate").innerHTML = param
            document.getElementById(thisdate).style.backgroundColor = '#ffffff'
            document.getElementById(param).style.backgroundColor = '#999999'
            var dates = document.getElementById("currentdate").innerHTML.split('.')
            var datestr = dates[2].toString() + '-' + dates[1].toString().padStart(2, '0') + '-' + dates[0].toString().padStart(2, '0')
            getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=' + datestr, 3)

            setTimeout(() => {
                document.getElementById("innercalendar").style.zIndex = -1
            }, 400)

        });
    }

}

document.querySelector("#language").addEventListener("click", function () {

    var thislanguage = document.getElementById('language').innerHTML
    var newlanguage
    if (thislanguage == 'FI') { newlanguage = 'SV'; name = 'Namn'; address = 'Adress'; helsinki = 'Helsingfors' }
    if (thislanguage == 'SV') { newlanguage = 'EN'; name = 'Name'; address = 'Osoite'; helsinki = 'Helsinki' }
    if (thislanguage == 'EN') { newlanguage = 'FI'; name = 'Nimi'; address = 'Osoite'; helsinki = 'Helsinki' }

    document.getElementById('language').innerHTML = newlanguage

    popupstations(stationdata, tempkeys)

    if (stationview == 1) { update2stations(stationdata) }
  
    if (stationview == 1) {
        writeinfoboard(activestationid, 'station')
    }
    if (stationview == -1) {
        writeinfoboard(activestationid, 'trip')
    }
    
});


function gettripdata(data) {

    tripdata = data 
    pagerange = Math.round(Object.entries(tripdata).length / 2)
    showtrip3data(0)
}

const menu = document.querySelector("#menu");

function additemtopulldown(text,mode) {
    const item = document.createElement("div");
    item.classList.add("menu-item");
    const col = document.createElement("div");
    col.classList.add(`col`, `col-1`);
    col.style.width = `100%`;
    col.style.border = '1px solid black'
    col.style.backgroundColor = '#A5A5A5'

    col.style.textAlign = "center";
    col.textContent=text
    item.appendChild(col);
    

    item.addEventListener("click", function () {
        if (mode == 1) { pagerange -= 1000; showtrip3data(1) }
        if (mode == -1) { pagerange += 1000; showtrip3data(-1) }
    });
    menu.appendChild(item)

}


function stationDetailMap(tempstatdata) {

    stacknHide(['infoboard3', 'infoboard2'], 1, [])
    var nroTrips = Object.entries(tempstatdata).length
    var distArray = []
    var timeArray = []
    var stationCount = new Array(1000).fill(0); // init array for station id count
 
    for (let i = 0; i < nroTrips; i++) {
        let distnum = parseFloat(tempstatdata[i]["dis"]);
        if (isFinite(distnum)) { distArray.push(distnum) }
        let timenum = parseInt(tempstatdata[i]["time"]);
        if (isFinite(timenum)) { timeArray.push(timenum) }
        let statnum = parseInt(tempstatdata[i]["rid"]);

        stationCount[statnum] ++ // increment if dep/ret is founf

    }
    const averageDist = Math.round(10 * (distArray.reduce((a, b) => a + b, 0) / distArray.length)) / 10;
    const averageTime = Math.round(1 * (timeArray.reduce((a, b) => a + b, 0) / timeArray.length)) / 1;
    document.getElementById('infoboard3').innerHTML = nroTrips + '<BR>' + averageDist + ' km<BR>' + averageTime + ' min'

    
    var indices = new Array(1000);
    for (var i = 0; i < 1000; ++i) indices[i] = i;
    indices.sort(function (a, b) { return stationCount[a] < stationCount[b] ? -1 : stationCount[a] > stationCount[b] ? 1 : 0; });

    var this_loc = [stationdata[activestationid]["y"], stationdata[activestationid]["x"]]

    for (var i = 999; i > 995; i--) {
  
        var other_loc = [stationdata[indices[i]]["y"], stationdata[indices[i]]["x"]]
         addPolyline(this_loc, other_loc,1000-i,'markersnocenter')

    }


}

function showtrip3data(scroll) {

    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }

    const columnWidths = [20, 25, 25, 10, 10];
   // for (let i = 0; i < 1000; i++) {
    var lenlen = 500

    additemtopulldown('Next Up', 1)
    var startoffset = Math.max((pagerange - lenlen), 0)

    for (let i = startoffset; i < Math.min((pagerange + lenlen), Object.entries(tripdata).length); i++) {

    const item = document.createElement("div");
    item.classList.add("menu-item");
    
        for (let j = 1; j <= 5; j++) {
            const col = document.createElement("div");
            col.classList.add(`col`, `col-${i}`);
            col.style.width = `${columnWidths[j - 1]}%`;
            col.style.textAlign = "left";
            if (j == 1) { col.textContent = tripdata[i]["Departure"].substring(8, 10) + '.' + tripdata[i]["Departure"].substring(5, 7) + ' ' + tripdata[i]["Departure"].substring(11, 16) };
            if (j == 2) { col.textContent = stationdata[tripdata[i]["did"]][name].substring(0, 12) };
            if (j == 3) { col.textContent = stationdata[tripdata[i]["rid"]][name].substring(0, 12) };
            if (j == 4) { col.textContent = tripdata[i]["dis"] };
            if (j == 5) { col.textContent = tripdata[i]["time"] };
            item.appendChild(col);
        }

        item.addEventListener("click", function () {
            const items = menu.querySelectorAll(".menu-item");
           for (const it of items) {
                it.style.backgroundColor = "";
            }
            this.style.backgroundColor = "gray";
            var thisitemnro = startoffset + Array.from(items).indexOf(this) - 1
      
           var dep_loc = [stationdata[tripdata[thisitemnro]["did"]]["y"], stationdata[tripdata[thisitemnro]["did"]]["x"]]
           var ret_loc = [stationdata[tripdata[thisitemnro]["rid"]]["y"], stationdata[tripdata[thisitemnro]["rid"]]["x"]]
            let temphtml = 'From: ' + stationdata[tripdata[thisitemnro]["did"]][name] + '<BR>To: '
            temphtml += stationdata[tripdata[thisitemnro]["rid"]][name] + '<BR>'
            temphtml += 'Dist: ' + tripdata[thisitemnro]["dis"] + ' km Time: ' + tripdata[thisitemnro]["time"] + ' min'
    
            activestationid = tripdata[thisitemnro]
            writeinfoboard(activestationid, 'trip')
            showmap([dep_loc, ret_loc], 2)

        });

        menu.appendChild(item);
    }

    additemtopulldown('Next Down', -1)

    if (scroll == 1) { menu.scrollTop = menu.scrollHeight; }
    if (scroll == 0) { menu.scrollTop = menu.scrollHeight / 2; }
    if (scroll == -1) { menu.scrollTop = 0; }
}



let departure_dropdown = document.getElementById("departure_dropdown");
let return_dropdown = document.getElementById("return_dropdown");

departure_dropdown.onchange = function () {
    //alert(departure_dropdown.value);
    let regex = /\(([^)]+)\)/;
    let stationid = regex.exec(departure_dropdown.value)[1];  
    getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=D' + stationid.toString(), 3)
}

return_dropdown.onchange = function () {
    //alert(departure_dropdown.value);
    let regex = /\(([^)]+)\)/;
    let stationid = regex.exec(return_dropdown.value)[1];
    getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=R' + stationid.toString(), 3)
}




function initMap() {
    // The location of Uluru
    const uluru = { lat: 64, lng: 26 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: uluru,
    });


}





function addmarker(coords,labeltext) {
    regulargooglemarker = new google.maps.Marker({
        position: { lat: coords[0], lng: coords[1] },
        map: map,
        label: {
            text: labeltext,
            color: 'black',
            fontSize: "24px",
            fontWeight: 'bold'
        },
        labelOrigin: new google.maps.Point(125, 30),
        optimized: false,
    });

}


function showmap(coords, mode) {
 
    stacknHide(['closemap', 'stationdetails', 'map-container', 'infoboard'], 1, ['departure_dropdown', 'return_dropdown', 'menutitle', 'menutitleb'])

    if (displaymap == 0) { return }



    if (mode == 1) {
        map.setCenter({ lat: coords[0], lng: coords[1] });
        addmarker(coords,' ')


        fitMapToBounds([
            { lat: coords[0] + 0.005, lng: coords[1] + 0.005 },
            { lat: coords[0] - 0.005, lng: coords[1] - 0.005 },
        ]);
    }

    if (mode == 2) {
        addPolyline(coords[0], coords[1], ' ', 'fittobounds')
    }



}



function addPolyline(dep_loc, ret_loc,markerlabel,mode) {


    
    var start = { lat: dep_loc[0], lng: dep_loc[1] };
    var end = { lat: ret_loc[0], lng: ret_loc[1] };

    if (mode == 'fittobounds') {
        map.setCenter({ lat: (dep_loc[0] + ret_loc[0]) / 2, lng: (dep_loc[1] + ret_loc[1]) / 2 });
        fitMapToBounds([
            { lat: Math.max(dep_loc[0], ret_loc[0]), lng: Math.max(dep_loc[1], ret_loc[1]) },
            { lat: Math.min(dep_loc[0], ret_loc[0]), lng: Math.min(dep_loc[1], ret_loc[1]) },
        ]);

        stacknHide([], 1, ['stationdetails'])

       // addmarker(dep_loc, ' ')
      //  addmarker(ret_loc, ' ')
    }

    if (mode == 'markersnocenter') {
        addmarker(ret_loc, markerlabel.toString())
    }

    polyline = new google.maps.Polyline({
        path: [start, end],
        geodesic: true,
        strokeColor: "#ff0000",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        icons: [{
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            offset: "100%",
        }],
        map: map
    });
  
}



function fitMapToBounds(latLngArray) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < latLngArray.length; i++) {
        bounds.extend(latLngArray[i]);
    }
    map.fitBounds(bounds);
}

if (displaymap == 1) { initMap()  }




function openCalendarWindow(currentYear, startMonth, endMonth, graydate) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


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

            var thisdate = currentDay + '.' + (currentMonth + 1) + '.' + currentYear
            if (thisdate == graydate) { colcol = '#999999' }
            calendarHTML += `<td style="cursor: pointer; background-color: ${colcol};" id='${thisdate}' class="generatedCell" data-param='${thisdate}'>${currentDay}</td>`;
            colcol = '#ffffff'

            firstDayOfWeek++;
            currentDay++;
        }
        calendarHTML += `
        </tr>
      </tbody>
    </table>`

    }
    return calendarHTML
}


//stationTripView()
getdata('https://jsonhandler-c2cjxe2frq-lz.a.run.app/?action=stations', 1)


function getdata(thisaddress, mode) {

    // document.getElementById('info').innerHTML = 'Wait for data..'
    fetchThis(thisaddress, mode)
        .then((data) => {
            if (mode == 1) { update2stations(data) }
        //    if (mode == 2) { updatetripdata(data) }
            if (mode == 3) { gettripdata(data) }
            if (mode == 4) { stationDetailMap(data) }
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
        if (i > -1) { option.text = stationdata[tempkeys[i]][name] + ' (' + tempkeys[i] + ')' }
        else { option.text = 'All Stations' }
        
        departure_dropdown.add(option);
        return_dropdown.add(option.cloneNode(true));
    }

}


function update2stations(data) {


    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }

    const filterValue = filterStations.value.toLowerCase();
    stationdata = data

    let sortedData = Object.entries(stationdata).sort((a, b) => {
        if (a[1][name] > b[1][name]) {
            return 1;
        } else {
            return -1;
        }
    });
    
    var tempkeys = sortedData.map(item => item[0]);
    popupstations(stationdata, tempkeys)
    
    stationskeys = []
    let filteredkeys = []  
    for (let i = 0; i < tempkeys.length; i++) {
        var thisname = stationdata[tempkeys[i]][name]
        if (thisname.toLowerCase().startsWith(filterValue) == true) {
            filteredkeys.push(tempkeys[i]) // we need this to make a shorted index list for filtered stations
            const item = document.createElement("div");
            item.classList.add("menu-item");
            const col = document.createElement("div");
            col.classList.add(`col`, `col-1`);
            col.style.width = `100%`;
            col.style.textAlign = "left";
            col.textContent = thisname
            item.appendChild(col);

            item.addEventListener("click", function () {
                const items = menu.querySelectorAll(".menu-item");
                for (const it of items) {
                    it.style.backgroundColor = "";
                }
                this.style.backgroundColor = "gray";
                var thisitemnro = Array.from(items).indexOf(this)

                writeinfoboard(filteredkeys[thisitemnro], 'station')

               var coords = [stationdata[filteredkeys[thisitemnro]]["y"], stationdata[filteredkeys[thisitemnro]]["x"]]
                activestationid = filteredkeys[thisitemnro]
                showmap(coords, 1)              
          
            });

            menu.appendChild(item)
            
        }
        
    }

}

function writeinfoboard(stationid, mode) {
    if (mode == 'trip') {
        let temphtml = 'From: ' + stationdata[stationid["did"]][name] + '<BR>To: '
        temphtml += stationdata[stationid["rid"]][name] + '<BR>Dist: '
        temphtml += stationid["dis"] + ' km Time: ' + stationid["time"] + ' min'
        document.getElementById("infoboard").innerHTML = temphtml
    }

    if (mode == 'station') {

        let temphtml = stationdata[stationid][name] + '<BR>'
        temphtml += stationdata[stationid][address] + '<BR>'

        if (stationdata[stationid][city].length > 1) {
            temphtml += stationdata[stationid][city]
        }
        else {
            temphtml += helsinki
        }

        document.getElementById("infoboard").innerHTML = temphtml
    }

}

function nodice() {
    alert('fdfd')
    
}

function stationTripView() {

    stationview = -stationview
 
    if (stationview == 1) {
        document.getElementById('stationvstrip').innerHTML = 'Stations:'
        stacknHide(['menutitleb'], 1, ['menutitle', 'departure_dropdown', 'return_dropdown','infoboard3', 'infoboard2', 'closemap', 'stationdetails', 'map-container'])
        document.getElementById("currentdate").style.cursor = "default"
        document.getElementById("filterStations").style.zIndex = 1
        document.getElementById("currentdate").style.opacity = 0.4;
        
        update2stations(stationdata)
    }
    if (stationview == -1) {
        document.getElementById('stationvstrip').innerHTML = 'Trips:'
        stacknHide(['menutitle','departure_dropdown', 'return_dropdown'], 1, ['menutitleb','infoboard3', 'infoboard2', 'closemap', 'stationdetails', 'map-container'])
        document.getElementById("currentdate").style.cursor = "pointer"
      
        var dates = document.getElementById("currentdate").innerHTML.split('.')
        var datestr = dates[2].toString() + '-' + dates[1].toString().padStart(2, '0') + '-' + dates[0].toString().padStart(2, '0')
        getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=' + datestr, 3)
        
    }
    
}


