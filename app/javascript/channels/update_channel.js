import consumer from "./consumer"

let connected = false;

window.socket = consumer.subscriptions.create({
	channel: "UpdateChannel"
	}, {
	connected() {
		connected = true;
	},
	disconnected() {
		connected = false;
	},
	received(event) {
		switch (event.target) {
			case "guilds":
				_.each(App.collections.guilds.models, g => {
					let war = g.attributes.active_war;
					if (war) {
						g.set("active_war.war_times", []);	
					}
				});
				App.collections.guilds.fetch();
				break;
			case "users":
				App.collections.allUsers.myFetch();
				App.models.user.update(App.models.user);
				break;
			case "last_seen":
				App.models.last_seen.updateLastSeen(App.models.last_seen);
				break;
			case "tournaments":
				App.collections.tournaments.fetch()
				break;
		}
	}
});

window.addEventListener("beforeunload", e=>{
	if (connected) {
		window.socket.send({action: "bye"});
	}
});

setInterval(e=>{
	if (connected) {
		window.socket.send({action: "alive"});
	}
}, 1000)
