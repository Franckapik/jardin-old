var tableauTime = [];
var tableauTemp = [];
var tableauHumi = [];
var tableauEau = [];

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


    });


};

var makeChart = function(Time, Temp, Humi, Eau) { //Construction du graphique
    graph = document.getElementById('graphique');

    var trace1 = {
        x: Time,
        y: Temp,
        type: 'scatter',
        name: 'Température',
        fill: 'tozeroy',
        line: {
            color: 'rgb(255,69,0)',
            width: '2'

        }
    };

    var trace2 = {
        x: Time,
        y: Humi,
        type: 'scatter',
        name: 'Humidité',
        fill: 'tonexty',
        line: {
            color: 'rgb(30,144,255)',
            width: '2'

        }
    };

    var trace3 = {
        x: Time,
        y: Eau,
        type: 'scatter',
        name: 'Niveau Cuve',
        line: {
            color: 'rgb(30,144,25)',
            width: '2'

        }
    };

    var layout = {

        xaxis: {
            visible: false,
            showgrid: false
        },
        yaxis: {
            visible: true,
            gridcolor: 'rgba(159, 198, 214, 0.8)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };


    var donnees = [trace1, trace2, trace3];

    Plotly.plot(graph, donnees, layout);
};

var makeCircle = function(Time, Temp, Humi, Eau) { //Température actuelle
    var TempAct = document.getElementById('divTemp');
    TempAct.innerHTML = "Température : " + Temp[0] + " °C";
    TempAct.style.fontSize = "1.5em";
    //Humidité  actuelle
    var HumiAct = document.getElementById('divHumi');
    HumiAct.innerHTML = "Humidité: " + Humi[0] + " % ";
    HumiAct.style.fontSize = "1.5em";
    //Niveau Eau  actuel
    var EauAct = document.getElementById('divEau');
    EauAct.innerHTML = "Niveau Cuve : " + Eau[0] + " %";
    EauAct.style.fontSize = "1.5em";


};


parseJSON(tableauTime, tableauTemp, tableauHumi, tableauEau);
makeChart(tableauTime, tableauTemp, tableauHumi, tableauEau);
makeCircle(tableauTime, tableauTemp, tableauHumi, tableauEau);
