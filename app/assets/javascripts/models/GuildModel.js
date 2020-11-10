AppClasses.Models.Guild = Backbone.Model.extend({
	defaults: {
		name: "",
		anagram: ""
	}
});

AppClasses.Collections.Guild = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.Guild;
		this.url = '/api/guilds.json';
	}
}
