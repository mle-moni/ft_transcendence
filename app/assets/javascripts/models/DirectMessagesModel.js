AppClasses.Models.DirectMessages = Backbone.Model.extend({
	defaults: {
		message: "",
        from_id: null,
        dmchat_id: null
    }
});

AppClasses.Collections.DirectMessages = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.DirectMessages;
		this.url = '/api/chat_messages.json';
	}
}