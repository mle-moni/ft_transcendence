AppClasses.Models.DirectMessages = Backbone.Model.extend({
	defaults: {
		user1_id: null,
        user2_id: null,
    }
});

AppClasses.Collections.DirectMessages = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.DirectMessages;
		this.url = '/api/direct_chats.json';
	}
}