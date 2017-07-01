var CronJob = require('cron').CronJob;
var controller = require('./controller');
var config = require('./config');

console.log(' -- Automatisme Arrosage/Sensors (required) --')

//---------------------
//Ajout hum/temp/cuve la BASE DE DONNEES
var jobniveau = new CronJob({

    cronTime: '*/'+config.addSensors+' * * * *',

    onTick: function() {

        console.log("*** Auto DB [ Toutes les " + config.timeCycle + " minutes] ***");
        controller.MakeData();

    },

    start: true,
    timeZone: 'Europe/Paris'
});

jobniveau.start();

//----------------------
//Arrosage Automatique
var jobarrosage = new CronJob({

    cronTime: '00 17 14 * * *',

    onTick: function() {

        console.log("***Processus Automatique [" + config.timeCycleHours + config.timeCycleMinutes + " ] ***");
    controller.Arrosage();

    },

    start: true,
    timeZone: 'Europe/Paris'
});

jobarrosage.start();

// ----------------------

exports.jobArrosage = jobarrosage;
exports.jobNiveau = jobniveau;
