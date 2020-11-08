AppClasses.Models.User = Backbone.Model.extend({
	defaults: {
		id: -1,
		nickname: "",
		email: "",
		image: "",
		two_factor: false
	}
});

// we do not need a user collection for now
// class UserCollection extends Backbone.Collection {
// 	constructor(opts) {
// 		super(opts);
// 		this.model = AppClasses.Models.User;
// 	}
// }