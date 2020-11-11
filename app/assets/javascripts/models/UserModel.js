AppClasses.Models.User = Backbone.Model.extend({
	defaults: {
		nickname: "",
		email: "",
		image: "",
		two_factor: false,
		guild_id: null
	}
});
