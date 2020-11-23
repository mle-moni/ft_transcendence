AppClasses.Models.User = Backbone.Model.extend({
	defaults: {
		nickname: "",
		email: "",
		image: "",
		two_factor: false,
		guild_id: null,
		blocked: null
	},
	isOwner: (guild) => {
		if (!guild) {
			return (false);
		}
		const userID = App.models.user.get("id");
		if (guild.toJSON().owner.id == userID) {
			return (true);
		}
		return (false);
	},
	isOfficer: (guild) => {
		if (!guild) {
			return (false);
		}
		const userID = App.models.user.get("id");
		const officers = guild.toJSON().officers;
		if (_.findWhere(officers, {id: userID})) {
			return (true);
		}
		return (false);
	},
	isInGuild: (guild) => {
		if (!guild) {
			return (false);
		}
		return (guild.toJSON().id == App.models.user.get("guild_id"));
	},
	update: (model) => {
		if (!model) {
			console.error("You must pass a valid user");
			return (false);
		}
		let data = {authenticity_token: $('meta[name="csrf-token"]').attr('content')};
		jQuery.post("/api/profile/get.json", data)
		.done(userData => {
			model.set(userData);
		})
		.fail(e => {
			console.error(e);
		})
	}
});

AppClasses.Collections.AllUsers = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.comparator = "nickname";
		this.myFetch();
	}
	myFetch() {
		let data = {authenticity_token: $('meta[name="csrf-token"]').attr('content')};
		jQuery.post("/api/friends/get_all.json", data)
		.done(usersData => {
			this.set(usersData);
		})
		.fail(e => {
			console.error(e);
		})
	}
}
