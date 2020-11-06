AppClasses.Routers.Main = class extends Backbone.Router {
	constructor(options) {
		super(options);
		this.views = App.views;
		this.models = App.models;
		// routes
		this.route("*path", "default"); // default route (404)
		this.route("", "index");
		this.route("profile", "profile");
		this.route("test", "test");
		this.route("salut/:name", "salut");

		this.mainDiv = $("#app");

		// create all models needed by multiple routes
		this.models.user = new AppClasses.Models.User(App.data.user);
	}
	index() {
		if (!this.views.index) {
			this.views.index = new AppClasses.Views.Index();
		}
		this.mainDiv.html(this.views.index.render().el);
	}
	test() {
		this.mainDiv.html("test");
	}
	salut(name) {
		this.mainDiv.html(`salut ${name}`);
	}
	profile() {
		if (!this.views.profile) {
			this.views.profile = new AppClasses.Views.ProfileView({
				model: this.models.user
			});
		}
		this.mainDiv.html(this.views.profile.render().el);
	}
	default() {
		this.mainDiv.html(`Page not found, <a href="#">return to home page</a>`)
	}
}
