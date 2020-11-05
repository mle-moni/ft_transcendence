AppClasses.Routers.Main = class extends Backbone.Router {
	constructor(options) {
		super(options);
		this.views = App.views;
		this.models = App.models;
		// routes
		this.route("", "index");
		this.route("test", "test");
		this.route("salut/:name", "salut");

		this.mainDiv = $("#app");
	}
	index() {
		if (!this.models.user) {
			this.models.user = new AppClasses.Models.User(App.data.user);
		}
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
}