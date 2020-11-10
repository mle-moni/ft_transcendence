AppClasses.Routers.Profile = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("profile", "profile");
		this.route("profile/edit", "edit");
		this.route("profile/auth", "authInfos");
	}
	profile() {
		this.basicView("profile", "Profile", {model: this.models.user});
	}
	edit() {
		this.basicView("profileEdit", "ProfileEdit", {model: this.models.user});
	}
	authInfos() {
		this.basicView("authInfos", "AuthInfos", {model: this.models.user});
	}
}
