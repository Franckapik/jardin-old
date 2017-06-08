var express = require('express');
var Influx = require('influx');
var fs = require('fs');
var moment = require('moment');
var dht = require('dht-sensor');

//Configuration de la base de donnes
var db = new Influx.InfluxDB({
    host: 'localhost',
    database: 'mydb',
    tags: 'jardin'
});





//Fonction de rendu de l'index (route /)
var indexCreation = function(req, res) {


    res.render('index', function(err, html) {
        //fonctions executées lors de la demande de l'index
        makeData();
        queryData();
        res.send(html);
        if (err) throw err;
    });
};

var makeData = function(req, res) { //DHT vers Base de données


    var current = dht.read(11, 4); // 11 : DHT11, 18 : BCM GPIO   
    if (current.temperature && current.temperature != 0 && current.humidity && current.humidity != 0) {
        console.log("La température (" + current.temperature + "°C) et l'humidité (" + current.humidity + "%) actuelles sont ajoutées à la base de donnée");

        db.writePoints([{
            "measurement": "meteo",

            "fields": {
                "temperature": current.temperature,
                "humidity": current.humidity
            }
        }]);

    } else {
        console.log("Impossible d'ajouter les valeurs de temp [ " + current.temperature + " ] / humidité [ " + current.humidity + " ] dans la base de donnees.") ;

    }


};



var queryData = function(req, res) { //Base de données vers JSON
    db.query('select * from meteo order by time desc limit 1000').then(results => {

        var data = JSON.stringify({ results }); //object javascript avec ses proprietes.

        fs.writeFile('./public/message.json', data, (err) => {
            if (err) throw err;
            console.log('Consultation de la base de donnée meteo et édition du fichier message.json');
        });
    });
};


exports.Index = indexCreation;
exports.MakeData = makeData;
