import socket from 'socket.io-client';

const io = socket('http://localhost:9009');

io.on('connect', () => {
	io.send({
		type: 'socket-reg',
		message: 'Started logging client'
	});

	io.on('message', message => {
		console.log({
			timestamp: (new Date()).toJSON(),
			message
		});
	});
});