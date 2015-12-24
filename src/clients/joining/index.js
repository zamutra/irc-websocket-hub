import socket from 'socket.io-client';

const io = socket('http://localhost:9009');

io.on('connect', () => {
	io.send({
		type: 'socket-reg',
		message: 'Started joining client'
	});

	io.on('message', ({ type, ...rest }) => {
		if (type !== 'invite')
			return;

		const { channel } = rest;

		io.send({
			type: 'join',
			channel
		});
	});
});