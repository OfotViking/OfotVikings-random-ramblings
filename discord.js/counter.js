// an attempt to count number of occurrences of a string of text, in this example :beer: emoji. Also counts :beer: reactions

var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require("fs");

var text_to_look_for = "🍺";
var get_count_command = "beercount";


function MessageCounter(msg, countValue) {
	msg.channel.send("**" + countValue + "**" + text_to_look_for + " recieved");
}

function IncrementCounter(msg, countValue) {
	fs.writeFile("./counter.txt", countValue, function read (error) {
		if (error) {
			console.error("write error:  " + error.message);
			} else {
			//MessageCounter(msg, countValue);
			console.log(get_count_command + " = " + countValue);
		}
	});
}

function IncrementCounterReaction(countValue) {
	fs.writeFile("./counter.txt", countValue, function read (error) {
		if (error) {
			console.error("write error:  " + error.message);
			} else {
			console.log(get_count_command + " = " + countValue);
		}
	});
}



bot.on("messageReactionAdd", (reaction, user) => {
	if (reaction.emoji.name == text_to_look_for) {
		fs.access("./counter.txt", (err) => {
			if (!err) {
				//console.log('counting file exists. read the content, increment the value and write back the file');
				fs.readFile("./counter.txt", "utf8", function read (error, countValue) {
					if (error) {
						console.error("read error:  " + error.message);
						} else {
						var countValue = Number(countValue)
						countValue++;
						IncrementCounterReaction(countValue);
					}
				});
			} else {
				//console.log('counting file does not exist, first run? set counter to 0 and write the file');
				var countValue = 0
				IncrementCounterReaction(countValue);
			}
		});
	};
});

bot.on("messageReactionRemove", (reaction, user) => {
	if (reaction.emoji.name == text_to_look_for) {
		fs.access("./counter.txt", (err) => {
			if (!err) {
				//console.log('counting file exists. read the content, increment the value and write back the file');
				fs.readFile("./counter.txt", "utf8", function read (error, countValue) {
					if (error) {
						console.error("read error:  " + error.message);
						} else {
						var countValue = Number(countValue)
						countValue--;
						IncrementCounterReaction(countValue);
					}
				});
			} else {
				//console.log('counting file does not exist, first run? set counter to 0 and write the file');
				var countValue = 0
				IncrementCounterReaction(countValue);
			}
		});
	};
});





bot.on("message", msg => {
	// Ignore DM
	if(msg.channel.type == "dm") return;

	// Set the prefix
	let prefix = "!";

	//ignore bot accounts including itself
	if(msg.author.bot) return;

	var input = msg.content.toLowerCase();
	
	if (input.includes(text_to_look_for)) {
		var re = new RegExp(text_to_look_for, 'g');
		var count = (input.match(re) || []).length;
		console.log("+ " + count);
		fs.access("./counter.txt", (err) => {
			if (!err) {
				//console.log('counting file exists. read the content, increment the value and write back the file');
				fs.readFile("./counter.txt", "utf8", function read (error, countValue) {
					if (error) {
						console.error("read error:  " + error.message);
						} else {
						var countValue = Number(countValue) + count;
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
	if (input.startsWith(prefix + get_count_command)) {
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
