var CronJob = require('cron').CronJob;
var controller = require('./controller');
var config = require ('./config');



var job = new CronJob('*/' + config.timeCycle + ' * * * *', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
console.log("*** Cycle de recherche de donnée [" + config.timeCycle + " minutes] ***");
controller.MakeData();


  }, null, true
);

exports.job = job;
