AppClasses.Routers.Main = class extends Backbone.Router {
	constructor(options) {
		super(options);
		this.views = App.views;
		this.models = App.models;
		// routes
		this.route("*path", "default"); // default route (404)
		this.route("", "index");
		this.route("salut/:name", "salut");

		// #profile routes
		App.routers.profile = new AppClasses.Routers.Profile();

		this.mainDiv = $("#app");

		// create all models needed by multiple routes
		this.models.user = new AppClasses.Models.User(App.data.user);
	}
	index() {
		if (!this.views.home) {
			this.views.home = new AppClasses.Views.Home();
		}
		this.mainDiv.html(this.views.home.render().el);
	}
	salut(name) {
		this.mainDiv.html(`salut ${name}`);
	}
	default() {
		this.mainDiv.html(`Page not found, <a href="#">return to home page</a>`)
	}
}
