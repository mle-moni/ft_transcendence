AppClasses.Models.Message = Backbone.Model.extend({
	defaults: {
		message: "",
        user_id: null,
        room_id: null
    }
});

AppClasses.Collections.Message = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.Message;
		this.url = '/api/room_messages.json';
	}
}