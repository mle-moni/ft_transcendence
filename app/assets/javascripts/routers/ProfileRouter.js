AppClasses.Routers.Profile = class extends Backbone.Router {
	constructor(options) {
		super(options);
		this.views = App.views;
		this.models = App.models;
		// routes
		this.route("profile", "profile");

		this.mainDiv = $("#app");
	}
	profile() {
		if (!this.views.profile) {
			this.views.profile = new AppClasses.Views.Profile({
				model: this.models.user
			});
		}
		this.mainDiv.html(this.views.profile.render().el);
	}
}
