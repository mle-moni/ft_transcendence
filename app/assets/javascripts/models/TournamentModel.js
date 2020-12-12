AppClasses.Models.Tournament = Backbone.DeepModel.extend({});

AppClasses.Collections.Tournament = class extends Backbone.Collection {
	constructor(opts) {
		super(opts);
		this.model = AppClasses.Models.Tournament;
		this.url = '/api/tournaments.json';
	}
}
