var express = require('express');
var Influx = require('influx');
var fs = require('fs');
var moment = require('moment');
var dht = require('dht-sensor');
var config = require('./config');
var Promise = require("bluebird");
var bhttp = require("bhttp");
var PythonShell = require('python-shell');

//Configuration de la base de donnes
var db = new Influx.InfluxDB({
    host: config.host,
    database: config.database,
    tags: config.tags
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

var DHT = function(temp, hum) {

    console.log("Mesure de temperature/humidite en cours...");

    var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'],
        scriptPath: '/home/pi/partage_samba/jardin/Adafruit_Python_DHT/examples/',
        args: ['11', '4']
            // make sure you use an absolute path for scriptPath
    }

    return PythonShell.run('AdafruitDHT.py', options, function(err, results) { //a finir
        if (err) throw err;
        console.log(results);
        temp = parseInt(results.toString().substr(0, 4));
        hum = parseInt(results.toString().substr(5, 9));
        console.log(temp);
        console.log(hum);

        return [temp, hum];

    });
}



var niveauCuve = function(req, res) {

    return Promise.try(function() {
        return bhttp.get("http://192.168.1.46:8080/niveauCuve");
    }).then(function(response) {
        var niveauCuve = response.body.toString();
        return niveauCuve;
    });
}




var makeData = function(req, res) { //DHT vers Base de données
    Promise.try(function() {

        return DHT();
       
    }).then(function(values) {
        console.log(values);


    });
}

/**
    Promise.try(function() {
        return bhttp.get("http://192.168.1.46:8080/niveauCuve");
    }).then(function(response) {

        DHT();

        var capteurs = DHT();
        var temp = capteurs[0];
        var hum = capteurs[1];

        var niveauCuve = response.body.toString();

        if (temp && temp != 0 && hum && hum != 0) {
            console.log("La température (" + temp + "°C), l'humidité (" + hum + "%), et le niveau d'eau (" + niveauCuve + ") sont ajoutées à la base de donnée");

            db.writePoints([{
                "measurement": "meteo",

                "fields": {
                    "temperature": temp,
                    "humidity": hum,
                    "niveauEau": niveauCuve
                }
            }]);

        } else {
            console.log("Impossible d'ajouter les valeurs de temp [ " + temp + " ], humidité [ " + hum + " ] et le niveau d'eau (" + niveauCuve + ") dans la base de donnees.");

        }


    });
};

*/

var queryData = function(req, res) { //Base de données vers JSON
    db.query('select * from meteo order by time desc limit 1000').then(results => {

        var data = JSON.stringify({ results }); //object javascript avec ses proprietes.

        fs.writeFile('./public/message.json', data, (err) => {
            if (err) throw err;
            console.log('Consultation de la base de donnée meteo et édition du fichier message.json');
        });
    });
};

var arrosage = function(req, res) {

    Promise.try(function() {
        return bhttp.get("http://192.168.1.46:8080/arrosage");
    }).then(function(response) {
        res.send("Le temps d'arrosage est de " + response.body.toString());
    });

}


exports.Arrosage = arrosage;
exports.Index = indexCreation;
exports.MakeData = makeData;
