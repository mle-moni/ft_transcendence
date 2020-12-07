import consumer from "./consumer"

consumer.subscriptions.create({
	channel: "UpdateChannel"
	}, {
	connected() {},
	disconnected() {},
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
				App.models.last_seen.updateLastSeen(App.models.last_seen);
				break;
		}
	}
});
