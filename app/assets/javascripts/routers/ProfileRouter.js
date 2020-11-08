AppClasses.Routers.Profile = class extends Backbone.Router {
	constructor(options) {
		super(options);
		this.views = App.views;
		this.models = App.models;
		// routes
		this.route("profile", "profile");
		this.route("profile/edit", "edit");
		this.route("profile/auth", "authInfos");

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
	edit() {
		if (!this.views.profileEdit) {
			this.views.profileEdit = new AppClasses.Views.ProfileEdit({
				model: this.models.user
			});
		}
		this.mainDiv.html(this.views.profileEdit.render().el);
	}
	authInfos() {
		if (!this.views.authInfos) {
			this.views.authInfos = new AppClasses.Views.AuthInfos({
				model: this.models.user
			});
		}
		this.mainDiv.html(this.views.authInfos.render().el);
	}
}
