import './style.css'
//import './style_grid_areas.css'
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
    
  
    var dates = document.getElementById("calendar2").innerHTML.split('.')
    var datestr = dates[2].toString() + '-' + dates[1].toString().padStart(2, '0') + '-' + dates[0].toString().padStart(2, '0')
    getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=' + datestr, 3)


});

document.querySelector(".down").addEventListener("click", () => {
    document.getElementById("map-container").style.zIndex=31
    var dep_loc = [64, 24]
    var ret_loc = [66, 26]
    addPolyline(dep_loc, ret_loc)
});

document.querySelector(".left").addEventListener("click", () => {
    document.getElementById("map-container").style.zIndex = -1
});



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


//initMap()

function openCalendarWindow(currentYear, startMonth, endMonth) {
    const calendarWindow = window.open("", "", "left=500, top=500, width=400,height=700");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var startend = document.getElementById("calendar2").innerHTML
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

            var thisdate = currentDay + '.' + (currentMonth + 1) + '.'  + currentYear          
            if (thisdate == startend) { colcol = '#999999' }
            calendarHTML += `<td style="background-color: ${colcol};" id='${thisdate}' onclick="saveDate('${thisdate}')">${currentDay}</td>`;
 
            if (thisdate == startend) { colcol = '#ffffff' }
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
        function saveDate(day) {
            var oldselection = window.opener.document.getElementById("calendar2").innerHTML
            document.getElementById(oldselection).style.backgroundColor = '#ffffff';
            document.getElementById(day).style.backgroundColor = '#999999';
            window.opener.document.getElementById("calendar2").innerHTML = day
            
            setTimeout(() => {
                window.close()
                }, "400")


        }

       
        function closeCalendarWindow() { window.close(); }
        </script>
  `;

    calendarWindow.document.write(calendarHTML);

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

    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }


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
  //  const list = document.getElementById('list');
  //  list.innerHTML = '';
    stationskeys = []
    for (let i = 0; i < tempkeys.length; i++) {
        var thisname = stationdata[tempkeys[i]]["Nimi"]
        if (thisname.toLowerCase().startsWith(filterValue) == true) {

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
     
            //    var dep_loc = [stationdata[tripdata[thisitemnro]["did"]]["y"], stationdata[tripdata[thisitemnro]["did"]]["x"]]
            //    var ret_loc = [stationdata[tripdata[thisitemnro]["rid"]]["y"], stationdata[tripdata[thisitemnro]["rid"]]["x"]]


              //  document.getElementById("map-container").style.zIndex = 31
              //  addPolyline(dep_loc, ret_loc)
                alert(thisitemnro)
            });










            menu.appendChild(item)
       //     const li = document.createElement('li');
        //    li.innerHTML = thisname;
        //    list.appendChild(li);
        //    stationskeys.push(tempkeys[i]);
        }
        
    }
   // addStationListener()


}




function nodice() {
    alert('fdfd')
    
}



function stationTripView() {

    stationview = -stationview
 
    if (stationview == 1) {
        document.getElementById('stationvstrip').innerHTML = 'Stations:'
        update2stations(stationdata)
    }
    if (stationview == -1) {
        document.getElementById('stationvstrip').innerHTML = 'Trips:'
        var dates = document.getElementById("calendar2").innerHTML.split('.')
        var datestr = dates[2].toString() + '-' + dates[1].toString().padStart(2, '0') + '-' + dates[0].toString().padStart(2, '0')
        getdata('https://readlocalcsvdeliverjson-c2cjxe2frq-lz.a.run.app/?action=' + datestr, 3)

    }
    
}







