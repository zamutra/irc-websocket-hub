import socket from 'socket.io-client';

const {
	irc: {
		nick: bot
	}
} = require('../../../config.json');

const io = socket('http://localhost:9009');

io.on('connect', () => {
	io.send({
		type: 'socket-reg',
		message: 'Started meme client'
	});

	io.on('message', ({ type, ...rest }) => {
		if (type !== 'message')
			return;

		const { nick, to, message } = rest;

		if (message.indexOf('.meme') < 0)
			return;

		const channel = to === bot ? nick : to;
		const reply = 'manga can\'t melt steel beams';

		io.send({
			type: 'message',
			channel,
			message: reply
		});
	});
});