AppClasses.Routers.Main = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("*path", "default"); // default route (404)
		this.route("", "index");
		this.route("salut/:name", "salut");

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

		// create all models needed by multiple routes
		this.models.user = new AppClasses.Models.User(App.data.user);
		this.models.last_seen = new AppClasses.Models.User(App.data.user);
		this.collections.allUsers = new AppClasses.Collections.AllUsers();

		const seconds = 10; // update every N seconds
		/*setInterval(() => {
			$.ajax({
				url:  '/api/active',
				data: { "authenticity_token": $('meta[name="csrf-token"]').attr('content') },
				type: 'POST'
			});
			this.models.user.update(this.models.user);
			this.models.last_seen.updateLastSeen(this.models.last_seen);
			this.collections.allUsers.myFetch();
			this.collections.guilds.fetch();
		}, 1000 * seconds);*/
	}
	index() {
		this.basicView("home", "Home", {model: this.models.user});
	}
	salut(name) {
		this.mainDiv.html(`salut ${name}`);
	}
	default() {
		this.mainDiv.html(`Page not found, <a href="#">return to home page</a>`)
	}
}
