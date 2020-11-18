AppClasses.Routers.Profile = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("profile", "profile");
		this.route("profiles", "allProfiles");
		this.route("profiles/:user_id", "showUser");
		this.route("profile/edit", "edit");
		this.route("profile/auth", "authInfos");
	}
	profile() {
		this.basicView("profile", "Profile", {model: this.models.user});
	}
	allProfiles() {
		this.basicView("allProfiles", "AllProfiles", {model: this.collections.allUsers});
	}
	showUser(user_id) {
		const usr_id = parseInt(user_id);
		this.viewWithRenderParam("showUser", "ShowUser", usr_id, {
			model: this.collections.allUsers,
			user_id: usr_id
		});
	}
	edit() {
		this.basicView("profileEdit", "ProfileEdit", {model: this.models.user});
	}
	authInfos() {
		this.basicView("authInfos", "AuthInfos", {model: this.models.user});
	}
}
