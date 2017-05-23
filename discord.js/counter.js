// an attempt to count number of occurrences of a string of text

var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require("fs");

function MessageCounter(msg, countValue) {
	msg.channel.sendMessage("Text has now occured " + countValue + " times.");
}

function IncrementCounter(msg, countValue) {
	fs.writeFile("./counter.txt", countValue, function read (error) {
		if (error) {
			console.error("write error:  " + error.message);
			} else {
			MessageCounter(msg, countValue);
		}
	});
}

bot.on("message", msg => {
	// Ignore DM
	if(msg.channel.type == "dm") return;

	// Set the prefix
	let prefix = "!";

	//ignore bot accounts including itself
	if(msg.author.bot) return;

	var input = msg.content.toLowerCase();
	
	if (input.includes("count occurrences of this text")) {
		fs.access("./counter.txt", (err) => {
			if (!err) {
				//console.log('counting file exists. read the content, increment the value and write back the file');
				fs.readFile("./counter.txt", "utf8", function read (error, countValue) {
					if (error) {
						console.error("read error:  " + error.message);
						} else {
						var countValue = Number(countValue);
						countValue++;
						IncrementCounter(msg, countValue);
					}
				});
			} else {
				//console.log('counting file does not exist, first run? set counter to 0 and write the file');
				var countValue = 0
				IncrementCounter(msg, countValue);
			}
		});
	}

	// End here if no prefix
	if(!msg.content.startsWith(prefix)) return;

	//display the current counter value with !counter command
	if (input.startsWith(prefix + "counter")) {
		fs.readFile("./counter.txt", "utf8", function read (error, countValue) {
			if (error) {
				console.error("read error:  " + error.message);
				} else {
				var countValue = Number(countValue);
				MessageCounter(msg, countValue);
			}
		});
	}
});

bot.on('ready', () => {
	console.log('I am ready!');
});

bot.login("****discord-bot-token***");
