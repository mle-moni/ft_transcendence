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

		// create all models needed by multiple routes
		this.models.user = new AppClasses.Models.User(App.data.user);
	}
	index() {
		this.basicView("home", "Home");
	}
	salut(name) {
		this.mainDiv.html(`salut ${name}`);
	}
	default() {
		this.mainDiv.html(`Page not found, <a href="#">return to home page</a>`)
	}
}
