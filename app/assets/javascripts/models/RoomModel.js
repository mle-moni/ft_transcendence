AppClasses.Models.Room = Backbone.Model.extend({
	defaults: {
		name: "",
		privacy: "",
		password: "",
		owner_id: null,
		members: null,
		admins: null,
		bans: null,
		mutes: null
    }
});

AppClasses.Collections.Room = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.Room;
		this.url = '/api/rooms.json';
	}
}