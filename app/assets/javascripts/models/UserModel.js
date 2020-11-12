AppClasses.Models.User = Backbone.Model.extend({
	defaults: {
		nickname: "",
		email: "",
		image: "",
		two_factor: false,
		guild_id: null
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
	}
});
