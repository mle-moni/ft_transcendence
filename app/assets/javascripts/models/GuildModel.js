AppClasses.Models.Guild = Backbone.DeepModel.extend({
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
