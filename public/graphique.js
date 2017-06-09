var tableauTime = [];
var tableauTemp = [];
var tableauHumi = [];
var tableauEau = [];

var makeChart = function(Time, Temp, Humi, Eau) { //Construction du graphique
    graph = document.getElementById('graphique');

    var trace1 = {
        connectgaps: true,
        x: Time,
        y: Temp,
        type: 'scatter',
        name: 'Température',
        fill: 'tonexty',
        fillcolor: 'rgba(209, 79, 62, 1)',

        line: {
            color: 'rgba(209, 79, 62, 1)',
            width: '3',
            shape: 'spline'

        }
    };

    var trace2 = {
        x: Time,
        y: Humi,
        type: 'scatter',
        name: 'Humidité',
        fill: 'tonexty',
        fillcolor: 'rgba(59, 158, 191,1)',

        line: {
            color: 'rgba(59, 158, 191, 1)',
            width: '3',
            shape: 'spline'

        }
    };

    var trace3 = {
        x: Time,
        y: Eau,
        
        name: 'Cuve eau',
        mode: 'markers',
        marker: {
            color: 'rgba(192, 232, 141, 1)',
            size: 2
        },


        line: {
            color: 'rgba(192, 232, 141, 1)',
            width: '3',
            shape: 'spline'

        }
    };

    var layout = {
        autosize: true,
        margin: {
    l: 50,
    r: 10,
    b: 50,
    t: 10,
    pad: 4
  },
        font: {
            family: 'Courier New, monospace',
            size: 22,
            color: 'rgba(220, 220, 221, 1)'
        },
        xaxis: {
            visible: false,
            showgrid: false,
            color: 'rgba(217, 222, 216, 0.91)'
        },
        yaxis: {
            visible: true,
            gridcolor: 'rgba(220, 220, 221, 0.2)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false
    };


    var donnees = [trace1, trace2, trace3];

    Plotly.plot(graph, donnees, layout, { displayModeBar: false });
};

var makeCircle = function(Time, Temp, Humi, Eau) { //Température actuelle
    /**var TempAct = document.getElementById('divTemp');
    TempAct.innerHTML = "Température : " + Temp[0] + " °C";
    TempAct.style.fontSize = "1.5em";
    //Humidité  actuelle
    /**var HumiAct = document.getElementById('circleHumi');
    HumiAct.innerHTML = "Humidité: " + Humi[0] + " % ";
    HumiAct.style.fontSize = "1.5em";
    //Niveau Eau  actuel
    var EauAct = document.getElementById('divEau');
    EauAct.innerHTML = "Niveau Cuve : " + Eau[0] + " %";
    EauAct.style.fontSize = "1.5em";*/


    $('#circleEau').circleProgress({
        value: Eau[0] / 100,
        size: 100,
        startAngle: 0,
        thickness: 20,
        emptyFill: 'rgba(217, 222, 216, 0.8)',
        fill: {
            gradient: ["rgba(192, 232, 141, 1)", "rgba(73, 72, 81, 1)"]
        }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').text((stepValue * 100).toFixed(2).substr(1));;
    });


    $('#circleTemp').circleProgress({
        value: Temp[0] / 40,
        size: 100,
        startAngle: 0,
        thickness: 20,
        emptyFill: 'rgba(217, 222, 216, 0.8)',
        fill: {
            gradient: ["rgba(209, 79, 62, 1)", "rgba(73, 72, 81, 1)"]
        }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').text(stepValue.toFixed(2).substr(1));;
    });
    $('#circleHumi').circleProgress({
        value: Humi[0] / 100,
        size: 100,
        startAngle: 0,
        thickness: 20,
        emptyFill: 'rgba(217, 222, 216, 0.8)',
        fill: {
            gradient: ["rgba(59, 158, 191,1)", "rgba(73, 72, 81, 1)"]
        }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').text(stepValue.toFixed(2).substr(1));;
    });
};


var parseJSON = function(Time, Temp, Humi, Eau) {

    $.getJSON('./public/message.json', function(data) {

        for (var i = 0; i < data.results.length; i++) {

            moment.locale('fr');
            var timeFormat = moment(data.results[i].time).format('MMMM Do, h:mm a');

            Time.push(timeFormat);
            Temp.push(data.results[i].temperature);
            Humi.push(data.results[i].humidity);
            Eau.push(data.results[i].niveauEau);

        }

        makeChart(Time, Temp, Humi, Eau);
        makeCircle(Time, Temp, Humi, Eau);


    });
};

var sendConfig = function() {

$('#nbcycles').text(config.timeCycle + " minutes");

};

parseJSON(tableauTime, tableauTemp, tableauHumi, tableauEau);
/**makeChart(tableauTime, tableauTemp, tableauHumi, tableauEau);
makeCircle(tableauTime, tableauTemp, tableauHumi, tableauEau);*/

