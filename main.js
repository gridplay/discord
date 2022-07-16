/* Packages */
const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');
const http = require("http");
var url = require('url');
require('dotenv').config();

/* custom functions */
function parsedata(data) {
	try {
		return JSON.parse(data);
	} catch(err) {
		return null;
	}
	return null;
}
function sendtosite(com, message, poster) {
	const qq = 'msg='+com+'&poster='+poster+'&channel='+message.channel.id;
	https.get(process.env.GPURL+'?'+qq, res => {
		res.setEncoding("utf8");
		let body = "";
		res.on('data', d => {
			body += d;
		})
		res.on("end", () => {
			body = JSON.parse(body);
			if (body.hasOwnProperty('msg')) {
				message.reply(body.msg);
			}
		});
	});
}
/* Discord Bot */
client.on('ready', () => {
	client.user.setActivity("Second Life");
	console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', message => {
	if (!message.guild || message.author.bot) return;
	const cmsg = message.content;
	const poster = message.member.displayName;
	if (cmsg.startsWith(`!`)) {
		sendtosite(cmsg, message, poster);
	}
});

client.login(process.env.BOT_TOKEN);

/* http-in data*/
const inhost = process.env.BOT_URL;
const inport = process.env.BOT_PORT;
const requestListener = function (inreq, inres) {
    inres.setHeader("Content-Type", "application/json");
    inres.writeHead(200);
    var q = url.parse(inreq.url, true).query;
    if (q.type == "ventalkie") {
    	var chan = client.channels.cache.get(q.dchan);
    	chan.send(q.msg);
    }
    inres.end(`{"status": "SENT"}`);
};
const server = http.createServer(requestListener);
server.listen(inport, inhost, () => {
    console.log(`Server is running on http://${inhost}:${inport}`);
});