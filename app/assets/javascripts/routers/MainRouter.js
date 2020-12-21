AppClasses.Routers.Main = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("*path", "default"); // default route (404)
		this.route("logs", "logs");
		this.route("notifs", "notifs");
		this.route("", "index");

		// profile routes
		App.routers.profile = new AppClasses.Routers.Profile();
		// guilds routes
		App.routers.guilds = new AppClasses.Routers.GuildsRouter();
		// game routes
		App.routers.game = new AppClasses.Routers.GameRouter();
		
		// Chat : Room & Messages
		App.routers.rooms = new AppClasses.Routers.RoomRouter();
		App.routers.messages = new AppClasses.Routers.DirectMessagesRouter();

		// friends routes
		App.routers.friends = new AppClasses.Routers.FriendsRouter();
		// admin routes
		App.routers.admin = new AppClasses.Routers.AdminRouter();
		// tournaments routes
		App.routers.tournament = new AppClasses.Routers.TournamentRouter();
		// rules routes
		App.routers.rules = new AppClasses.Routers.RulesRouter();

		// create all models needed by multiple routes
		this.models.user = new AppClasses.Models.User(App.data.user);
		this.models.last_seen = new AppClasses.Models.User(App.data.user);
		this.collections.allUsers = new AppClasses.Collections.AllUsers();
		this.collections.tournaments = new AppClasses.Collections.Tournament();
		this.collections.tournaments.fetch();

		const seconds = 10; // update every N seconds, to see users status
		setInterval(() => {
			if (location.hash == "#friends") {
				this.models.last_seen.updateLastSeen(this.models.last_seen);
			}
		}, 1000 * seconds);
	}
	index() {
		this.basicView("home", "Home", {model: this.models.user});
	}
	default() {
		this.mainDiv.html(`Page not found, <a href="#">return to home page</a>`)
	}
	logs() {
		this.basicView("logs", "Logs", {});
	}
	notifs() {
		this.basicView("notifs", "Notifs", {});
	}
}
