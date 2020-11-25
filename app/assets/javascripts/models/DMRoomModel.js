AppClasses.Models.DirectMessagesRoom = Backbone.Model.extend({
	defaults: {
		user1_id: null,
        user2_id: null,
    }
});

AppClasses.Collections.DirectMessagesRoom = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.DirectMessagesRoom;
		this.url = '/api/direct_chats.json';
	}
}