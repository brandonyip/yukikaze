/*
 * YUKIKAZE KAI
 * a beaver for various things
 * Author: Eternith
 */

console.log("STARTO");
console.log(process.env.OPENSHIFT_DATA_DIR);
console.log("ENDO");

var Eris = require('eris');
var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");

// modules
var schedule = require("node-schedule");
var moment = require("moment");
var jsonfile = require("jsonfile");

// Load database
var filePath = "./db.json";
if (process.env.OPENSHIFT_DATA_DIR != undefined)
    filePath = process.env.OPENSHIFT_DATA_DIR + "db.json";

console.log('reading from' + filePath);

var db = jsonfile.readFileSync(filePath);
console.log(getTimestamp() + " Loaded db from " + filePath);

// custom modules
var kancolle = require("./kancolle.js")(beaver, db);
var msgCounting = require("./msgCounting")(beaver, db);



beaver.on("ready", () => { // When the bot is ready
    console.log(getTimestamp() + " On duty!");
});
beaver.on("error", (err) => {
   console.log(getTimestamp() + " Error: " + err);
});
beaver.on("connect", () => {
    console.log(getTimestamp() + " Connected.");
});
beaver.on("disconnect", () => {
    console.log(getTimestamp() + " Disconnected.");
});


beaver.connect();
kancolle.pvpTimer();    // start pvp timer


beaver.on("messageCreate", (msg) => {

    // ignore PMs for now
    if (msg.channel.guild === undefined) return;

    // Message Count
    msgCounting.count(msg);

    // COMMAND: Count update
    if (msg.author.id === "105167204500123648" || isAdminFounder(msg.member.roles)) {
        if (msg.content === "~counts") {
            msgCounting.requestCounts(msg.channel.id);
        }
    }

    // COMMAND: eter only comamands
    if (msg.author.id === "105167204500123648") {
        if (msg.content === "~beaver") {
            beaver.createMessage(msg.channel.id, "Yukikaze改 on duty!");
            var logmsg = msg.author.username + " used " + msg.content;
            console.log("[" + moment().format() + "]" + logmsg);
        }

        // under testing
        if (msg.content === "~waopvp") {
            var pvpMembers = ["105167204500123648",
                "175012017290084352"];
            var notify = "DO YOUR GODDAMN PVP: ";
            for (var i = 0; i < pvpMembers.length; i++) {
                var user = beaver.users.find(function(u) {return u.id === pvpMembers[i]});
                notify += user.mention + " ";
            }
            beaver.createMessage(msg.channel.id, notify);
        }

        // KC Wikia Search
        if (msg.content.startsWith("~kc")) {
            kancolle.kcWikia(msg);
        }

        if (msg.content === "~test") {
            /*var server = beaver.guilds.find(function(g) {return g.id === "107915021203304448"});
             var adminrole = server.roles.find(function (r) {return r.name === "Admin"})
             console.log(adminrole);
             */
            console.log(msg.member.roles);
        }
    }
});

// Save db to json file every 5 mins
var dbSaveRule = new schedule.RecurrenceRule();
dbSaveRule.minute = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59];
schedule.scheduleJob(dbSaveRule, function() {
    console.log(getTimestamp() + "saving db to file");
    jsonfile.writeFileSync(filePath, db, {spaces: 2});
})


/*
***************************
* HELPER FUNCTIONS
* **************************
 */

// get the current timestamp for logging
function getTimestamp() {
    return "[" + moment().format() + "]";
}


// helper function to check if a member is an admin or founder
function isAdminFounder(roles) {
    if (roles.indexOf(db.etc.adminRoleID) != -1 ||
        roles.indexOf(db.etc.founderRoleID) != -1)
        return true;
    else
        return false;
}



