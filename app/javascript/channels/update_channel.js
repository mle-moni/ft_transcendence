import consumer from "./consumer"

let connected = false;

window.socket = consumer.subscriptions.create({
	channel: "UpdateChannel"
	}, {
	connected() {
		connected = true;
		window.socket.send({action_str: "alive"});
	},
	disconnected() {
		connected = false;
	},
	received(event) {
		if (event.action == "update") {
			switch (event.target) {
				case "guilds":
					_.each(App.collections.guilds.models, g => {
						let war = g.attributes.active_war;
						if (war) {
							g.set("active_war.war_times", []);	
						}
					});
					let opts = {};
					if (event.hasOwnProperty("reset")) {
						opts = {reset: true};
					}
					App.collections.guilds.fetch(opts);
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
				case "block":
					App.collections.allUsers.myFetch();
					break;
			}
		} else if (event.action == "notice") {
			window.App.toast.success(event.notice, { duration: 3000, style: window.App.toastStyle });
		}
	}
});

window.addEventListener("beforeunload", e=>{
	if (connected) {
		window.socket.send({action_str: "bye"});
	}
});

setInterval(e=>{
	if (connected) {
		window.socket.send({action_str: "alive"});
	}
}, 1000)
