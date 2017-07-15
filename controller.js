var express = require('express');
var Influx = require('influx');
var fs = require('fs');
var moment = require('moment');
var dht = require('dht-sensor');
var config = require('./public/config');
var Promise = require("bluebird");
var bhttp = require("bhttp");
var PythonShell = require('python-shell');


//Configuration de la base de donnes
var db = new Influx.InfluxDB({
    host: config.host,
    database: config.database,
    tags: config.tags
});

var catchError = function(e) {
    console.error(e)
}



//Fonction de rendu de l'index (route /)
var indexCreation = function(req, res) {


    res.render('index', function(err, html) {
        //fonctions executées lors de la demande de l'index
        
        queryData();
        res.send(html);
        if (err) throw err;
    });
};

const DHT = function() {
    return new Promise((resolve, reject) => {
        console.log("[Mesure de temperature]");

        var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python',
            pythonOptions: ['-u'],
            scriptPath: '/home/pi/partage_samba/jardin/Adafruit_Python_DHT/examples/',
            args: ['11', '4']
                // make sure you use an absolute path for scriptPath
        }

        PythonShell.run('AdafruitDHT.py', options, function(err, results) {
            if (err) reject(err);

            temp = parseInt(results.toString().substr(0, 4));
            hum = parseInt(results.toString().substr(5, 9));
            console.log('-- Temperature : ' + temp);
            console.log('-- Humidite : ' + hum);
            resolve([temp, hum]);

        });
    }).catch(catchError)

}

var flag = 0;

var niveauCuve = function() {
    if (flag == 0) {
        return new Promise((resolve, reject) => {
            Promise.try(function() {
                flag = 1;
                return bhttp.get("http://192.168.1." + config.ippi0 + ":8080/niveaucuve");
            }).then(function(response) {

                var levelCuve = response.body.toString();
                resolve(levelCuve)
                console.log('-- Niveau Cuve : ' + levelCuve);

            }).then(function() {

                flag = 0;

            }).catch(catchError);

        })
    }
}


var makeData = function(req, res) { //DHT vers Base de données
    return Promise.try(function() {
        return Promise.all([
            DHT(),
            niveauCuve()
        ])
    }).then(([dht, level]) => {
        var temp = dht[0];
        var hum = dht[1];
        var level2 = 100 - parseInt(level)
        console.log(level2);



        if (temp && temp != 0 && hum && hum != 0 && level > 10 && level < 100) {
            console.log("*** Ajout BD [" + temp + "°C - " + hum + "% - " + level2 + "cm] ***");
            db.writePoints([{
                "measurement": "meteo",

                "fields": {
                    "temperature": temp,
                    "humidity": hum,
                    "niveauEau": level2
                }
            }]);

        } else {
            console.log("Impossible d'ajouter les valeurs de temp [ " + temp + " ], humidité [ " + hum + " ] et le niveau d'eau (" + level2 + ") dans la base de donnees.");
        }

    }).catch(catchError)
}


var queryData = function(req, res) { //Base de données vers JSON
    db.query('select * from meteo order by time desc limit 1000').then(results => {

        var data = JSON.stringify({ results }); //object javascript avec ses proprietes.

        fs.writeFile('./public/message.json', data, (err) => {
            if (err) throw err;
            console.log('DB ---> Message.json');
        });
    });

    db.query('select * from arrosage order by time desc limit 10').then(results => {

        var data = JSON.stringify({ results }); //object javascript avec ses proprietes.

        fs.writeFile('./public/arrosage.json', data, (err) => {
            if (err) throw err;
            console.log('DB ---> Arrosage.json');
        });
    });
};

var arrosage = function(req, res) {

    Promise.try(function() {
        return bhttp.get("http://192.168.1." + config.ippi0 + ":8080/arrosage/"+req.params.time);
    }).then(function(response) {
        res.send("Le temps d'arrosage est de " + response.body.toString());
    });

}

var arrosagePuits = function(req, res) {


        gpio.BCM_GPIO = true;

        Promise.try(() => {
            return gpio.output(0, 1)
        }).then(() => {
            console.log("*** Arrosage en cours de préparation ... ***");

            return gpio.write(0, 0)
        }).then(() => {
            console.log("*** Arrosage activé ***");

            return Promise.delay(60000);
        }).then(() => {
            
            return gpio.output(0, 0)
        }).then(() => {
            console.log("*** Arrosage terminé ***");

            
        })

}

exports.Arrosage = arrosage;
exports.ArrosagePuits = arrosagePuits;
exports.Index = indexCreation;
exports.MakeData = makeData;
exports.niveauCuve = niveauCuve;
