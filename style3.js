/* Set the size of the div element that contains the map */

.container {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    width: 200px;
    height: 700px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: solid
}



.image {
    width: 100%;
    height: 100%;
    position: relative;
}


#stationvstrip {
    text-align: center;
    grid-row: 1 / 2;
    grid-column: 2 / 6;
    font-size: 2.6rem;
    padding: 1rem 1rem;
    font-weight: bold
}


#language {
    text-align: center;
    grid-row: 1 / 2;
    grid-column: 8 / 9;
    font-size: 1.6rem;
    padding: 1rem 1rem;
    font-weight: bold
}

#menu {
    overflow: scroll;
    background-color: white;
    border: 1px solid gray;
    grid-row: 4 / 8;
    grid-column: 2 / 6;
    
}


#map-container {
    grid-row: 4/ 5;
    grid-column: 3 / 6;
    overflow: hidden;
    z-index: -1;
}



#filterStations {
    text-align: center;
    grid-row: 3 / 4;
    grid-column: 2 / 3;
    font-size: 1.6rem;
    padding: 1rem 1rem;
    font-weight: bold;
    z-index: -1;
}


#infoboard {
    text-align: left;
    grid-row: 3 / 4;
    grid-column: 3 / 5;
    font-size: 1.2rem;
    padding: 1rem 1rem;
    font-weight: bold;
    z-index: -1;
    opacity: 1;
    background-color: #eeeeee;
}

.closemap {
    grid-row: 3 / 4;
    grid-column: 5 / 6;
    
    z-index: -1;
    
}





#calendar2 {
    text-align: center;
    grid-row: 2 / 3;
    grid-column: 3 / 5;
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
}


#departure_dropdown {
    text-align: center;
    grid-row: 3 / 4;
    grid-column: 1 / 3;
   
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    z-index: 11;
}

#return_dropdown {
    text-align: center;
    grid-row: 3 / 4;
    grid-column: 4 / 5;
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    z-index: -1;
}

#innercalendar {
    overflow: scroll;
    background-color: white;
    border: 1px solid gray;
    grid-row: 4/ 5;
    grid-column: 3 / 6;
    z-index: -1;
}


.menu-item {
    display: flex;
}

.col {
    width: 20%;
    padding: 8px;
    text-align: left;
}


.browse {
    grid-row: 4 / 5;
    grid-column: 6 / 8;
    font-size: 1.6rem;
    padding: 1rem 1rem;
    font-weight: bold;
    align-items: center;
    height: 100%;

}

#goUp, #goDown, #scrollUp, #scrollDown, #currentdate {
    display: block;
    width: 80%;
    padding: 1rem 1rem;
}


