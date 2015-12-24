import irc from 'irc';

export default class IRCClient {
	constructor({ nick, server, channels }) {
		const client = new irc
			.Client(server, nick, {
				channels,
				username: nick,
				realname: nick
			});

		client.addListener('error', (error) => this.notify({
			type: 'error',
			error
		}));

		client.addListener('registered', () => this.notify({
			type: 'registered'	
		}));

		client.addListener('join', (channel, nick) => this.notify({
			type: 'join',
			channel,
			nick
		}));

		client.addListener('quit', (nick, reason, channels) => this.notify({
			type: 'quit',
			nick,
			reason,
			channels
		}));

		client.addListener('kick', (channel, nick, by, reason) => this.notify({
			type: 'kick',
			channel,
			nick,
			by,
			reason
		}));

		client.addListener('invite', (channel, by) => this.notify({
			type: 'invite',
			channel,
			by
		}));

		client.addListener('message', (nick, to, message) => this.notify({
			type: 'message',
			nick,
			to,
			message
		}));

		this.client = client;
		this.state = {
			callbacks: []
		}
	}

	notify = (message) => {
		const { callbacks } = this.state;

		callbacks.forEach(c => c(message));
	}

	on = (cb) => {
		this.state = Object.assign({}, this.state, {
			callbacks: [...this.state.callbacks, cb]
		});

		return this.remove(this.state.callbacks.length);
	}

	remove = (index) => () => {
		const { callbacks } = this.state;

		this.state = Object.assign({}, this.state, {
			callbacks: [
				...callbacks.slice(0, index - 1),
				...callbacks.slice(index + 1)]
		});
	}

	send = ({ type, ...rest }) => {
		console.log(type, rest);
		switch(type) {
			case 'message':
				this.client.say(rest.channel, rest.message);
				break;
			case 'join':
				this.client.join(rest.channel);
				break;
		}
	}
}