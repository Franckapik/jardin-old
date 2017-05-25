var tableauTime = [];
var tableauTemp = [];

var graphique = function (abscisse, ordonnee){
    TESTER = document.getElementById('graphique');
    Plotly.plot( TESTER, [{
    x: abscisse,
    y: ordonnee }], {
    margin: { t: 0 } } );
};

var parseJSON = function(tableauTime, tableauTemp) {

    $.getJSON('./public/message.json', function(data, tableauTime, tableauTemp) {
        for (var i = 0; i < 10; i++) {
            var timeFormat = moment(data.results[i].time).format('MMMM Do YYYY, h:mm a');

            tableauTime.push(timeFormat);
            tableauTemp.push(data.results[i].temperature);
        }



    });


};



parseJSON(tableauTime, tableauTemp);
graphique(tableauTime, tableauTemp);





/**

//Ouverture du fichier JSON de données

const req = new XMLHttpRequest();
var rep = null;

//Variables des tableaux
var tableauTime = [];
var tableauTemp = [];

//Methode XMLHttp
req.onreadystatechange = function(event) {
    if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
            rep = JSON.parse(this.responseText);
            for (var i =0; i < 1000; i++) {
                var timeFormat= moment(rep.results[i].time).format('MMMM Do YYYY, h:mm a');
                tableauTime.push(timeFormat);
                tableauTemp.push(rep.results[i].valeur);
                console.log("hey");
            }
            console.log('tbleau' + tableauTime);
            graphique();
        } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
        }
    }
};


/**
//création du graphique via Chartjs
var makeGraph = function(){
    var ctx = document.getElementById("graphique");
//    Chart.defaults.global.responsive = false;
    Chart.defaults.global.animation.onComplete = function () {
        console.log('Animation terminée');
    };
    Chart.defaults.global.animation.duration =500;

    var graphique = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tableauTime,
            datasets: [{
                label: "Temperature exterieure",
                fill: true,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: tableauTemp,
                spanGaps: false,
            }]
        },
        options: {

            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        min:tableauTemp[0] - 10,
                        max:tableauTemp[0] + 3,
                        stepSize: 2
                    }
                }],
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        unit : 'hour'
                    }
                }]
            }
        }
    });
}
**/