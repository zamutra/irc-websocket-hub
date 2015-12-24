import socket from 'socket.io';

import IRCClient from './IRCClient';

const {
	irc: {
		server,
		nick,
		channels
	}
} = require('../../config.json');

const irc = new IRCClient({
	server,
	nick,
	channels
});

const io = socket(9009);

io.on('connection', sock => {
	console.log('socket opened');

	const remove = irc.on(message =>
		sock.send(message));

	sock.on('message', message => {
		if (message.type === 'socket-reg') {
			console.log(message.message);
			return;
		}

		irc.send(message);
	});

	sock.on('disconnect', () => {
		console.log('socket disconnected');

		remove();
	});
});

