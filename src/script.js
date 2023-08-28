import './styles.css';
import { ref, set, onValue, get, child, query, limitToLast, orderByChild, equalTo } from 'firebase/database';
import { 
    hidePlotError,
    showPlotError
  } from './ui'

//db: realtime database ref; path: node name where the data entries will be fetch; date: entries for the date are fetched; numOfElts: the maximum number of to entries fetched
export function plotFetchedEntriesOnDate(db, path, date, numOfElts){
    const reference = ref(db, path);
    console.log(`fetch date on the given date: ${date}`);

    const resRef = query(reference, orderByChild('date'), equalTo(date))
    onValue(query(reference, orderByChild('date'), equalTo(date), limitToLast(numOfElts)), (snapshot) => {
    //get(resRef).then((snapshot) =>{  //also works
    //onValue(resRef, (snapshot) => {   //works
        
        //empty arrays to get keys(date, time, temperature, humidity, and pressure) and corresponding values
        let dataval = [];  //array for the sensor data
        let keyval = [];   //array for the keys

        snapshot.forEach((childSnapshot) =>{
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            //console.log(childKey, childData); 
            keyval = Object.keys(childData);  //obtain all 5 keys
            var values = Object.values(childData);  //obtain the values corresponding to each key, i.e. humidity, pressure, temperature, date, time
            //console.log(values);
            dataval.push(values);
        });

        if (keyval.length <= 0) { //if there is no data available for the date, display error 
            showPlotError();
        }
        else {  //otherwise show the plots
            hidePlotError();
            showMyPlots(keyval, dataval, date);
        }
    });
}

//diplay plots for given data. keyval: the keys for each field; dataval: an array of data; date: on which sensor data was collected
function showMyPlots(keyval, dataval, date){
    console.log(keyval);
    const tsindex = keyval.indexOf('time'); //obtain the index of key 'time' so that we know which column in dataval is correspoinding to 'time'
    const dtindex = keyval.indexOf('date'); //obtain the index of key 'date' so that we know which column in dataval is date info
    //console.log(tsindex);  
    console.log(dataval);
    const timesp = dataval.map(function(value,index) {return value[tsindex]});
    //const dates = dataval.map(function(value,index) {return value[dtindex]});
    //console.log(timesp);
    //console.log(date);
    const temperature = dataval.map(function(value,index) {return value[2]});
    const pressure = dataval.map(function(value,index) {return value[1]});
    const humidity = dataval.map(function(value,index) {return value[0]});
    console.log(temperature);

    // Get a reference to the DOM node that welcomes the plot drawn by Plotly.js:
    const myPlotDiv = document.getElementById('myPlot');

    // We generate x and y data necessited by Plotly.js to draw the plot
    // and its layout information as well:
    // See https://plot.ly/javascript/getting-started/
    var trace0 = {
        x:timesp,
        y:temperature,
        type: 'scatter'
    };

    var trace1 = {
        x:timesp,
        y:pressure,
        xaxis: 'x',
        yaxis: 'y2',
        type: 'scatter'
    };

    var trace2 = {
        x:timesp,
        y:humidity,
        xaxis: 'x',
        yaxis: 'y3',
        type: 'scatter'
    };

    var data =[trace0, trace1, trace2];

    /*var data = [{
        x: timesp,
        y: temperature
    }]; */

    const layout = {
        title: '<b>Sensor Monitoring on Date:  '.concat(date)+'<b>',
        titlefont: {
            family: 'sans-serif',
            size: 16,
            color: '#000'
        },
        xaxis: {
            automargin: true,
            title:{
                text: "Time",
                standoff: 20
            },
            linecolor: 'black',
            linewidth: 1
        },
        yaxis: {
            title: keyval[2], 
            linecolor: 'black',
            linewidth: 1,
        },
        yaxis2: {
            title: keyval[1], 
            linecolor: 'black',
            linewidth: 1,
        },
        yaxis3:{
            title: keyval[0], 
            linecolor: 'black',
            linewidth: 1,
        },
        margin: {
            r: 50,
            pad: 0
        },
        grid:{
            rows: 3,
            columns: 1, 
            subplots:['xy','xy2', 'xy3'],
            roworder: 'top to bottom'
        },
        showlegend: false
    }
    
    Plotly.newPlot(myPlotDiv, data, layout, { responsive: true });
}

//write data to realtime database
function writeUserData(date, time, tempvalue){
    const reference = ref(db, 'test');
    console.log(`write user data`)
    set(reference, {
        date: date,
        time: time,
        temperature: tempvalue
    })
    .then(function(){   //check if failed using Promise?
      console.log(`set: write data successfully`);
    })
    .catch(function(error){
      console.log(`set: write data error: ${error}`);
    });
  }
  
  //listen on value and return the entry under path
  function listOnValueEvent(db, path){
    const reference = ref(db, path);
    console.log(`listen on test`);
    onValue(reference, (snapshot) =>{
      const data = snapshot.val();
      console.log(data);
    })
  }
  
  //fetch all children
  function fetchChildren(db, path){
    const reference = ref(db, path);
    console.log(`fetch all children`);
    onValue(reference, (snapshot) => {
      snapshot.forEach((childSnapshot) =>{
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childData);
      });
    }, {
      onlyOnce: true
    });
  }
  
  //fetch the limitToLast # of childern
  function fetchChildrenLimitToLast(db, path, limitNum){
    const reference = ref(db, path);
    console.log(`fetch limit to last # of children`);
    //const recentDataRef = query(reference, limitToLast(limitNum));
    onValue(query(reference, limitToLast(limitNum)), (snapshot) => {
      snapshot.forEach((childSnapshot) =>{
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childData);
      });
    }, {
      onlyOnce: true
    });
  }
  
  //fetch data on a specific date
  function fetchEntriesOnDate(db, path, date){
    const reference = ref(db, path);
    console.log(`fetch date on the given date: ${date}`);
  
    const resRef = query(reference, orderByChild('date'), equalTo(date))
    onValue(query(reference, orderByChild('date'), equalTo(date)), (snapshot) => {
    //get(resRef).then((snapshot) =>{  //also works
    //onValue(resRef, (snapshot) => {   //works
      snapshot.forEach((childSnapshot) =>{
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey, childData); 
      });
    }, {
      onlyOnce: true
    });
  }