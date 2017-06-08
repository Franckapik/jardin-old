var CronJob = require('cron').CronJob;
var controller = require('./controller');



var job = new CronJob('*/1 * * * *', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
console.log("***Automatisme réglé sur 30 minute***");
controller.MakeData();


  }, null, true
);

exports.job = job;
