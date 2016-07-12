var Eris = require('eris');
var schedule = require("node-schedule");

var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");


beaver.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

beaver.on("messageCreate", (msg) => {
    /*
    if(msg.content === "!ping") {
        beaver.createMessage(msg.channel.id, "Pangcake!");
		console.log(msg.content);
    }
    */

});

beaver.connect();

var timerRule = new schedule.RecurrenceRule();
timerRule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

var job = schedule.scheduleJob(timerRule, function() {
    var msg = new Date();

    beaver.createMessage("202272875447582729", msg);
})

/*
* KC FUNCTIONS
* */

var pvpTimer = new schedule.RecurrenceRule();
pvpTimer.hour = 11, 23;
