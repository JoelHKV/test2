import './style2.css'

var map;
var polyline;
var textOverlay;
var textOverlay2;
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

var name = 'Nimi'
var address = 'Osoite'
var city = 'Kaupunki'
var helsinki = 'Helsinki' 


//var rigiditems = ['menu', 'departure_dropdown', 'departure_dropdown' ]
var rigiditems = ['menu', 'departure_dropdown']

//fixitemsize(rigiditems, 1)
function fixitemsize(rigiditems, rigid) {

    for (let i = 0; i < rigiditems.length; i++) {
        const element = document.querySelector('#' + rigiditems[0]);


        if (rigid == 1) {
            element.style.width = window.getComputedStyle(element).width
            element.style.height = window.getComputedStyle(element).height;
        }
        else {
            element.style.width = ""
            element.style.height = ""
        }
    }
}




document.getElementById('stationvstrip').addEventListener("click", stationTripView);
document.getElementById('language').addEventListener("click", changeLanguage);
document.getElementById('currentdate').addEventListener("click", changeDate);


const filterStations = document.getElementById('filterStations')



filterStations.addEventListener("input", () => {
    update2stations(stationdata)
})



document.querySelector("#goUp").addEventListener("click", function () {
    pagerange = 0;
    showtrip3data(-1)
});
document.querySelector("#scrollUp").addEventListener("click", function () {
    pagerange -= 1000;
    if (pagerange < 0) { pagerange == 0 }
    showtrip3data(0)
});
document.querySelector("#scrollDown").addEventListener("click", function () {
    if (pagerange > Object.entries(tripdata).length) { pagerange == Object.entries(tripdata).length }
    pagerange += 1000;
    showtrip3data(0)
});
document.querySelector("#goDown").addEventListener("click", function () {
    pagerange = Object.entries(tripdata).length;
    
    showtrip3data(1)
});


function changeDate() {
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


function changeLanguage() {
    var thislanguage = document.getElementById('language').innerHTML
    var newlanguage

    if (thislanguage == 'FI') { newlanguage = 'SV'; name = 'Namn'; address = 'Adress'; helsinki = 'Helsingfors' }
    if (thislanguage == 'SV') { newlanguage = 'EN'; name = 'Name'; address = 'Osoite'; helsinki = 'Helsinki' }
    if (thislanguage == 'EN') { newlanguage = 'FI'; name = 'Nimi'; address = 'Osoite'; helsinki = 'Helsinki' }

    document.getElementById('language').innerHTML = newlanguage
    if (stationview == 1) { update2stations(stationdata) }

}

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

function showtrip3data(scroll) {

    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }

   

    const columnWidths = [10, 30, 30, 10, 10];
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
            if (j == 1) { col.textContent = tripdata[i]["Departure"].substring(11, 16) };
            if (j == 2) { col.textContent = stationdata[tripdata[i]["did"]]["Nimi"].substring(0, 12) };
            if (j == 3) { col.textContent = stationdata[tripdata[i]["rid"]]["Nimi"].substring(0, 12) };
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
           // alert(stationdata[tripdata[thisitemnro]["did"]]["Nimi"])

           // alert(tripdata[thisitemnro]["Departure"])

           var dep_loc = [stationdata[tripdata[thisitemnro]["did"]]["y"], stationdata[tripdata[thisitemnro]["did"]]["x"]]
           var ret_loc = [stationdata[tripdata[thisitemnro]["rid"]]["y"], stationdata[tripdata[thisitemnro]["rid"]]["x"]]
            

            document.getElementById("map-container").style.zIndex = 31
            addPolyline(dep_loc, ret_loc)
           // alert('sss')
           // selectedItem.textContent = `Selected item: ${Array.from(items).indexOf(this) + 1}`;
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

    var dep_loc = [63.9, 25]
    var ret_loc = [65, 24]

    textOverlay = new TextOverlay({
        position: { lat: 10, lng: 10 },
        text: "T",
        map: map,
    });
    textOverlay2 = new TextOverlay({
        position: { lat: 10, lng: 10 },
        text: "S",
        map: map,
    });

    
    addPolyline(dep_loc, ret_loc)



}

function addPolyline(dep_loc, ret_loc) {
    if (polyline) {
        polyline.setMap(null);
    }
    var start = { lat: dep_loc[0], lng: dep_loc[1] };
    var end = { lat: ret_loc[0], lng: ret_loc[1] };
    map.setCenter({ lat: (dep_loc[0] + ret_loc[0]) / 2, lng: (dep_loc[1] + ret_loc[1]) / 2 });

    fitMapToBounds([
        { lat: Math.max(dep_loc[0], ret_loc[0]), lng: Math.max(dep_loc[1], ret_loc[1]) },
        { lat: Math.min(dep_loc[0], ret_loc[0]), lng: Math.min(dep_loc[1], ret_loc[1]) },
    ]);

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
   // var newLatLng = new google.maps.LatLng(57.7749, 24);
  //  textOverlay.latLng = newLatLng
   // textOverlay.text = 'Kodira';
  //  textOverlay2.latLng = { lat: ret_loc[0], lng: ret_loc[1] }
  //  textOverlay2.text = 'Kissa';

  //  textOverlay.setMap(null);
  //  textOverlay2.setMap(null);


   // textOverlay.draw();
   // alert(textOverlay)
  //  alert('dddd')
  //  textOverlay2.draw();
   textOverlay = new TextOverlay({
        position: { lat: dep_loc[0], lng: dep_loc[1] },
        text: "This Station",
        map: map,
    });
    textOverlay2 = new TextOverlay({
        position: { lat: ret_loc[0], lng: ret_loc[1] },
        text: "This Station",
        map: map,
    });




}




function TextOverlay(options) {
    this.setValues(options);
}

TextOverlay.prototype = new google.maps.OverlayView();

TextOverlay.prototype.onAdd = function () {
    var div = document.createElement("div");
    div.style.border = "solid";
    div.style.borderWidth = "2px";
    div.style.borderRadius = '3px';
    div.style.position = "absolute";
    div.style.textAlign = 'center';
    div.style.width = '100px';
    div.style.marginLeft = '-50px'
    div.style.backgroundColor = "white";
    div.style.color = 'red';
    div.style.fontSize = '20px';
    div.innerHTML = this.get("text");

    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

TextOverlay.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get("position"));
    var div = this.div_;
    div.style.left = position.x + "px";
    div.style.top = position.y + "px";
};

function fitMapToBounds(latLngArray) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < latLngArray.length; i++) {
        bounds.extend(latLngArray[i]);
    }
    map.fitBounds(bounds);
}




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
            calendarHTML += `<td style="background-color: ${colcol};" id='${thisdate}' class="generatedCell" data-param='${thisdate}'>${currentDay}</td>`;
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
//getdata('https://jsonhandler-c2cjxe2frq-lz.a.run.app/?action=stations', 1)


function getdata(thisaddress, mode) {

    // document.getElementById('info').innerHTML = 'Wait for data..'
    fetchThis(thisaddress, mode)
        .then((data) => {
            if (mode == 1) { update2stations(data) }
        //    if (mode == 2) { updatetripdata(data) }
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
        if (i > -1) { option.text = stationdata[tempkeys[i]]["Nimi"] + ' (' + tempkeys[i] + ')' }
        else { option.text = 'All Stations' }
        
        departure_dropdown.add(option);
        return_dropdown.add(option.cloneNode(true));
    }

   
}


function update2stations(data) {

    const element = document.querySelector("#menu");
    const elementWidth = window.getComputedStyle(element).width;

 

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


                let temphtml = stationdata[filteredkeys[thisitemnro]][name] + '<BR>'
                temphtml += stationdata[filteredkeys[thisitemnro]][address]

                if (stationdata[filteredkeys[thisitemnro]][city].length > 1) {
                    temphtml += stationdata[filteredkeys[thisitemnro]][city]
                }
                else {
                    temphtml += helsinki
                }
                

                

                document.getElementById("infoboard").innerHTML = temphtml
                document.getElementById("infoboard").style.zIndex = 10
                document.getElementById("closemap").style.zIndex = 11
            //    var dep_loc = [stationdata[tripdata[thisitemnro]["did"]]["y"], stationdata[tripdata[thisitemnro]["did"]]["x"]]
            //    var ret_loc = [stationdata[tripdata[thisitemnro]["rid"]]["y"], stationdata[tripdata[thisitemnro]["rid"]]["x"]]


              //  document.getElementById("map-container").style.zIndex = 31
              //  addPolyline(dep_loc, ret_loc)
              //  alert(thisitemnro)
            });

            menu.appendChild(item)
            

        }
        
    }

   
 //   element.style.width = elementWidth;
    
}




function nodice() {
    alert('fdfd')
    
}



function stationTripView() {

    stationview = -stationview
 
    if (stationview == 1) {
        document.getElementById('stationvstrip').innerHTML = 'Stations:'
        document.getElementById("departure_dropdown").style.zIndex = -1
        document.getElementById("return_dropdown").style.zIndex = -1
        document.getElementById("filterStations").style.zIndex = 1
        update2stations(stationdata)
    }
    if (stationview == -1) {

        document.getElementById("departure_dropdown").style.zIndex = 1
        document.getElementById("return_dropdown").style.zIndex = 1
        document.getElementById("filterStations").style.zIndex = -1

        document.getElementById('stationvstrip').innerHTML = 'Trips:'
        var dates = document.getElementById("currentdate").innerHTML.split('.')
        var datestr = dates[2].toString() + '-' + dates[1].toString().padStart(2, '0') + '-' + dates[0].toString().padStart(2, '0')
        getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=' + datestr, 3)

    }
    
}







