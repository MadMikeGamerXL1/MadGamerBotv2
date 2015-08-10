var twitchirc = require('twitch-irc');
var whisperirc = require('tmi.js');
var path = require("path"),
    fs = require('fs');

var csv = require('csv');

var testdata = ['madgamerbot'];
var testlist = [];
var botpass = fs.readFileSync("oauth.txt");
var config = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
    identity: {
        username: 'madgamerbot',
        password: botpass
    },
    
    channels: ['#madgamerbot'],
    
};
var whisperconfig = {
    channels: ["#madgamerbot"],
    server: "199.9.253.119",
    port: 443,
    secure:false,
    nick: "madgamerbot",
    password: botpass
}

var client = new twitchirc.client(config);

var whisper = new whisperirc.client(whisperconfig);
client.connect();
whisper.connect();
var today = new Date();
var theTime1 = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


client.addListener('connected', function (address, port) {
   
    console.log('Connected to: ' + address + ":" + port);
    client.say("#madmikegamerxl1", 'Connected at: ' + Date.now);


});
var exitCount = 0;
client.addListener('chat', function (channel, user, message) {
    var todaymessage = new Date();
    var fullmsg = message.substr(0);
    cmd = fullmsg.split(' ');
    var seconds = todaymessage.getSeconds();
    var minutes = todaymessage.getMinutes();
    var hours = todaymessage.getHours();
    var milestone = fs.readFileSync("milestone.txt");
    var theTime = hours + ":" + minutes + ":" + seconds;
    console.log("[" + theTime + "]" + "< " + user.color + " | " + user.username + " | " + user.special + "> <" + channel + ">" + message);
    //if (cmd[0] == 'hello') {
     //   client.say('#madmikegamerxl1', 'Hello, ' + user.username + " and welcome to " + channel);

    //}
    if (cmd[0] == '!say') {
        client.say(channel, cmd[1]);
    }
    if (cmd[0] == '`bot') {
        var botver = "0.12";
        client.say(channel, "The bot is here, connected at " + theTime1 + " (ver " + botver + ")");
    }
    if (cmd[0] == "!turbocheck") {
        if (user.special.indexOf('turbo') >= 0) {
            client.say(channel, user.username + " currently has Turbo!");
        }
        else {
            client.say(channel, "Sorry you don't have turbo! What a scrub. <3 ");
        }
    }
    if (cmd[0] == "!join") {
        if (cmd[1] == null) {
            client.say(channel, "Please add the channel to join, with a #");
        }
        else {
            client.join(cmd[1]);
        }
    }
    if (cmd[0] == "!turbogang") {
        if (user.special.indexOf('turbo') >= 0) {
            client.say(channel, "Yay! We're part of the turbo gang!");
        }
        else {
            client.say(channel, user.username + ", scrub. Get turbo. Unsubbed. Unfollowed. Unhosted.");
        }
    }
    if (cmd[0] == '`leave') {
        if (cmd[1] == null) {
            console.log("Leaving channel: " + channel);
            client.part(channel);
            console.log("Left channel: " + channel + " successfully.");
        }
        else {
            var toLeave = cmd[1];
            console.log("Leaving channel: " + toLeave);
            client.part(toLeave);
            console.log("Left channel: " + toLeave + " successfully.");
        }
    }
    
    if (cmd[0] == '`exit') {
        var exitCalc = exitCount + 1;
        if (exitCount == 0) {
            client.say(channel, "Are you sure? Type `exit again to confirm.");
            console.log(user.username + " tried to exit the bot in the channel: " + channel);
            exitCount = 1;
        }

        else if (exitCount == 1) {
            client.say(channel, "Leaving " + channel);
            console.log("Leaving channel: " + channel + " [Requested by user: " + user.username + "]");
            client.part(channel);
            console.log("Left channel: " + channel + " successfully... Exiting bot...");
            process.exit()
        }
    }
    if (cmd[0] == "!listtest") {
        var usercheck = testdata.indexOf(user.username);
        if (usercheck != -1) {
            client.say(channel, "You're in the list (Your Place: " + usercheck + ")");
        }
        else {
            client.say(channel, "You're not in the list!");
        }
    }
    if (cmd[0] == "!adduser") {
        if (cmd[1] != null) {
           
            testdata.push(cmd[1]);
            var toSave = cmd[1] + "\r\n";

            fs.appendFile('watched.txt', toSave, function (err) {
                if (err) throw err;
                console.log(cmd[1] + "Added to Watched list.");
            });
            client.say(channel, "Watching " + cmd[1]);
            
        }
        else {
            client.say(channel, "Specify a name!")
        }
    }

    fs.readFile('watched.txt', function(err, data) {
        if(err) throw err;
        
        var readArray = fs.readFileSync("watched.txt").toString().toLowerCase().split("\r\n");
        var usercheck = readArray.indexOf(user.username);

        if (usercheck != -1) {
            console.log("Watched user communicated in " + channel + "with message: " + message);

            var watchedChat = "[" + theTime + "]" + "<" + channel + ">" + "<" + user.username + ">" + message + "\r\n";

            fs.appendFile("watchedMsg.txt", watchedChat, function(err) {
                if (err) throw err;
                console.log("[" + theTime + "]" + "Saving Watched chatter's message to watchedMsg.txt");
            });
        }
    });
    if (cmd[0] == "`help") {
        if (cmd[1] == "loot") {
            client.say(channel, "Loot is the currency system in the bot. You can use it in bankheists, to earn more points! (Or lose them). You can also use them in upcoming giveaways, or buying slots on future game servers! (More info on this will be available when these servers are planned to happen!");
        }
        else if (cmd[1] == "bankheist") { client.say(channel, "Bank Heists are a minigame in the bot. You can deposit a certain amount of Loot (which the 'team' use for weapons and such for the heist, and if the heist is successful, you will earn that Loot back, with interest!"); }
        else if (cmd[1] == "rps") { client.say(channel, "RPS is a minigame in the bot, which stands for 'Rock Paper Scissors'. It works exactly as the real game works. This minigame costs 1 loot to play, and you have 1/3 of a chance of winning (because there's 3 outcomes). If you win the round, you will earn 10 Loot!"); }
        else if (cmd[1] == "arena") { client.say(channel, "The arena is a minigame in the bot. You fight creatures, and gain XP (Type [!arena stats] to check your level, as well as your total health and strength. If you win the battle in the arena, you will earn 10XP. Don't worry though, if you lose the battle, you still scavenge 1 XP! The arena is in Alpha stage, meaning it is brand new, and will take a lot of work. Because of this, it also means that there might be issues. Disclaimer: BECAUSE IT IS IN ALPHA, THERE IS NO GUARANTEE THAT THESE STATS WILL BE FINAL. BE PREPARED FOR IF YOUR STATS NEED TO BE RESET!!"); }
    }
    if (cmd[0] == "!milestone") {
        //file location-   F:\Docs\Livestreaming\TwitchAlerts\total_follower_count.txt
        // bot location-   F:\Programs\nodejs\bot.js
        var followPath = path.join("..", "TwitchAlerts", "total_follower_count.txt");
        var followers = fs.readFile(followPath, function (err, data) {
            var milestonecalc = milestone - data;
            if (err) throw err;
            client.say(channel, "The Target is currently: " + milestone + " followers! We need " +  milestonecalc + " more! [Current: " + data + "]");
            
        });
        
    }
    if (cmd[0] == "!setmilestone") {
        if (cmd[1] != null) {
            
            fs.writeFile("milestone.txt", cmd[1], function (err) {
                if (err) { return console.log(err); }
                client.say(channel, "Milestone updated to "+ cmd[1] + "!");
                console.log("Milestone set successfully by <" + user.username + ">");
            });

            
        } else { console.log("Parameter not specified! - Milestone could not be updated.") }
    }

    if (cmd[0] == "`addword") {
        if (user.special.indexOf('broadcaster') >= 0) {
            var refPath = path.join("refs", "blacklisted.txt");
            var toWrite = cmd[1] + "\r\n";
            fs.writeFile(refPath, toWrite, function (err) {
                if (err) {
                    console.log(err);
                    client.say(channel, err);
                    return
                }
                client.say(channel, "Word added to blacklisted database.");
                console.log("Word '" + cmd[1] + "' added to blacklisted database successfully. Any users will be timed out if this is mentioned in chat (excludes moderators, broadcaster, and regs if this is set).");
            });
        }
        else { client.say(channel, "You're not the channel owner! Nice try though, love! <3 ") }
    }
    
    // Checking if a message contains a blocked word.
    function count(arrayObj) {
        return arrayObj.length;
    }

    var blacklistpath = path.join("refs", "blacklisted.txt");
    var readBlacklistFile = fs.readFileSync(blacklistpath).toString().toLowerCase().split("\n"); // Array of blacklisted words
    var userWords = message.toLowerCase().split(" "); //Array of user chat message.

    
    
    function checkForWord(word) {
        if (message.indexOf(word) >= 0) {
            console.log(user.username + "'s message contains " + word);
            client.say(channel, "No use of blacklisted words! [" + word + "]");
        } else { console.log("DEBUG: " + word + " not in blacklisted."); }
      
    }

    function wordCheck() {
        var wordCount = count(readBlacklistFile);
        var currentCount = 0;
        
        while (currentCount < wordCount) {

            console.log("[" + currentCount + "] This is a test. Current word is " + readBlacklistFile[currentCount]);
            checkForWord(readBlacklistFile[currentCount]);
            currentCount++;
        }
        
    }
    if (cmd[0] == "`punch" && cmd[1] != null) {
        var punches = fs.readFileSync("punchCount.txt");
        var toAdd = 1;
        var newPunch = punches++;
        fs.writeFile("punchCount.txt", newPunch, function (err) {
            if (err) { return console.log(err); }
            console.log("Wrote to punchCount.txt successfully setting current number to: " + newPunch);

        });
        client.say(channel, user.username + " punches " + cmd[1] + " in the face! This is the " + newPunch + "th time someone has been punched! :O ");
    }
    if (cmd[0] == "!songrequest" || cmd[0] == "!requestSong") {
        client.say(channel, user.username + " > Sorry, no Song Request here! [Don't worry, it was just a Purge!]");
        client.say(channel, "/timeout " + user.username + " 1");
    }
    if (cmd[0] == "`trolls") {
        client.say(channel, "Aww guys! The trolls have moved because their bridge was lost in the door giveaway! :(  ");
        console.log("TROLLS INBOUND! TAKE COVER! ");
    }
    if (cmd[0] == "!spam") {
        client.say(channel, "Spam? No thanks, I'm a bot... I don't eat.");
    }
    if (cmd[0] == "!bankheist" && cmd[1] == null) {
        client.say(channel, user.username + " > To enter a bankheist, use !bankheist AND the amount of loot you wish to enter with. To see your current Loot, type !loot")
    }
    if (cmd[0] == "`derp" || cmd[0] == "~derp" || cmd[0] == "¬derp" && cmd[1] != null) {
        client.say(channel, cmd[1] + " is a derp, according to " + user.username + " ! BrokeBack ");
    }
    if (cmd[0] == "!specs") {
        client.say(channel, "The Current specs are: " + fs.readFileSync("specs.txt"));
    }
    if (cmd[0] == "!so" && cmd[1] != null) {
        if (user.special.indexOf('broadcaster') >= 0) {
            client.say(channel, "Go check out " + cmd[1] + " over at http://www.twitch.tv/" + cmd[1] + " because they're awesome! <3 <3 <3" );
        }
    }
    if (cmd[0] == "!renyay") {
        client.say(channel, "YAYYYYY!! http://gyazo.com/63c34879482110305bda260030702140");

    }
    if (cmd[0] == "!jadethegamermc") {
        client.say(channel, "'Always care for your D' - JadeTheGamerMC 2k15 - 10/10 IGN");
    }
    if (cmd[0] == "!guncheck") {
        client.say(channel, "Gun check enabled... *Robot noises*... We're ready to steal from the patrol officers!");
        console.log(user.username + " checked their gun! Will their luck pay off? Nah, my name's MadGamerBot, the biggest bully to roam Earth... So of course not....");
    }
});

client.addListener('unhost', function (channel, viewers) {
    if (channel == "madmikegamerxl1") {
        console.log("Unhosted from: " + channel + " | with: " + viewers + " viewers.");
        client.say(channel, "Unhosted for : " + viewers + " viewers");
    }
    else {
        console.log("Channel <" + channel + "> unhosted for " + viewers);
    }
});

client.addListener('hosting', function (channel, targetchan, viewers) {
    
        
        client.say(channel, "Now hosting " + targetchan + " for : " + viewers + " viewers");
        console.log("Channel <" + channel + "> is hosting for " + viewers);
});
whisper.addListener('whisper', function (username, message) {
    console.log("Received whisper from: " + username + "with text: " + message);
});
client.addListener('clearchat', function (channel) {
    if (channel == "#madmikegamerxl1") {
        client.say(channel, "chat in " + channel + " cleared by moderator.");

    }
    else {
        console.log("Cleared chat in " + channel);
    }
   
});
        // chat event
whisper.on('connecting', function (address, port) {
    console.log("Connecting to " + address + ":" + port);
    whisper.join("#madmikegamerxl1");

});
whisper.on('connected', function (address, port) {
    console.log("connected to " + address + ":" + port);

});
whisper.on("roomstate", function (channel, state) {
    console.log(state);
});
