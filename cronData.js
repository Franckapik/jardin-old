var CronJob = require('cron').CronJob;
var controller = require('./controller');



var job = new CronJob('* * * * *', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
console.log("hey");
controller.MakeData();


  },
  true
);

exports.job = job;