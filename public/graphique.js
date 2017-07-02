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

var makeCircle = function(Time, Temp, Humi, Eau) {
    $('#circleTemp').circleProgress({
        value: Temp[0] / 40,
        size: 250,
        startAngle: 0,
        thickness: 40,
        emptyFill: 'rgba(217, 222, 216, 0.8)',
        fill: {
            gradient: ["rgba(209, 79, 62, 1)", "rgba(73, 72, 81, 1)"]
        }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').text(stepValue.toFixed(1).substr(1)*40 + '°C');;
    });



    $('#circleHumi').circleProgress({
        value: Humi[0] / 100,
        size : 200,
        startAngle: 0,
        thickness: 40,
        emptyFill: 'rgba(217, 222, 216, 0.8)',
        fill: {
            gradient: ["rgba(59, 158, 191,1)", "rgba(73, 72, 81, 1)"]
        }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').text(stepValue.toFixed(1).substr(1)*100 + '%');;
    });

    $('#circleEau').circleProgress({
        value: Eau[0] / 82,
        size: 250,
        startAngle: 0,
        thickness: 40,
        emptyFill: 'rgba(217, 222, 216, 0.8)',
        fill: {
            gradient: ["rgba(192, 232, 141, 1)", "rgba(73, 72, 81, 1)"]
        }
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('strong').text(stepValue.toFixed(2).substr(1)*1000 + 'litres');;
    });

};

var dataDOM = function(Time, Temp, Humi, Eau) {
$('.temp-bar').css('height', Temp[0]*1.5 + '%')
$('#tempData').find('#value').html(Temp[0] + '°C');
$('#tempData').find('#max').html('max ' + Math.max.apply(Math, Temp) + '°C');
$('#tempData').find('#min').html('min ' +Math.min.apply(Math, Temp) + '°C');


$('.hum-bar').css('height', Humi[0]*0.65 + '%')
$('#humData').find('#value').html(Humi[0] + '%');
$('#humData').find('#max').html('max ' + Math.max.apply(Math, Humi) + '%');
$('#humData').find('#min').html('min ' +Math.min.apply(Math, Humi) + '%');

$('.cuve-bar').css('height', Eau[0]*0.8 + '%')
$('#eauData').find('#value').html(Eau[0]*10 + 'Litres');
$('#eauData').find('#max').html('max ' + Math.max.apply(Math, Eau) *10 + 'l');
$('#eauData').find('#min').html('min ' +Math.min.apply(Math, Eau)*10  + 'l');

diffT = Temp[0] - Temp[2];
diffH = Humi[0] - Humi[2];
diffE = Eau[0] - Eau[2];


if (diffT < 0) {
    $('#tempData').find('#arrow').attr("src", "public/down.png");
}
if (diffT > 0) {
    $('#tempData').find('#arrow').attr("src", "public/up.png");
}
if (diffT == 0) {
    $('#tempData').find('#arrow').attr("src", "public/egal.png");
}
if (diffH < 0) {
    $('#humData').find('#arrow').attr("src", "public/down.png");
}
if (diffH > 0) {
    $('#humData').find('#arrow').attr("src", "public/up.png");
}
if (diffH == 0) {
    $('#humData').find('#arrow').attr("src", "public/egal.png");
}

if (diffT < 0) {
    $('#eauData').find('#arrow').attr("src", "public/down.png");
}
if (diffT > 0) {
    $('#eauData').find('#arrow').attr("src", "public/up.png");
}
if (diffT == 0) {
    $('#eauData').find('#arrow').attr("src", "public/egal.png");
}

}

var parseJSON = function() {
    moment.locale('fr');
    return $.getJSON('./public/message.json').then(({ results }) => {    
        return results.reduce(({ time, temp, humi, eau }, result) => {
            return {
                time: time.concat([moment(result.time).format('MMMM Do, h:mm a')]),
                temp: temp.concat([result.temperature]),
                humi: humi.concat([result.humidity]),
                eau: eau.concat([result.niveauEau]),
            }
        }, { time: [], temp: [], humi: [], eau: [] })
    });
};

// used like this:

parseJSON().then((results) => {
    const { time, temp, humi, eau } = results;
    makeChart(time, temp, humi, eau);
    dataDOM(time, temp, humi, eau);
})


/*
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
        
        /**makeChart(Time, Temp, Humi, Eau);
        
        dataDOM(Time, Temp, Humi, Eau);


    })
    .done(
        console.log(Humi[0])
        );
};

var sendConfig = function() {

    $('#nbcycles').text(config.timeCycle + " minutes");

};

parseJSON(tableauTime, tableauTemp, tableauHumi, tableauEau);
*/
