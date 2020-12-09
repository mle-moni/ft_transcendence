AppClasses.Views.TournamentList = class extends Backbone.View {
	constructor(opts) {
		opts.events = {};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["tournaments/list"];
		
		this.tournaments = opts.tournaments;
		this.listenTo(this.tournaments, "change reset add remove", this.updateRender);
		this.listenTo(this.model, "change", this.updateRender);
		this.tournaments.fetch();
		// TODO listen to tournaments collection
	}

	updateRender() {

		console.log(this.tournaments);
		this.$el.html(this.template({
			tournaments: this.tournaments,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
	}

// 	render() {
// 		this.delegateEvents();

// 		console.log(this.tournaments);
// 		this.$el.html(this.template({
// 			tournaments: this.tournaments,
// 			token: $('meta[name="csrf-token"]').attr('content')
// 		}));
// 		return (this);
// 	}

	render() {
		this.updateRender();
		return (this);
	}

}
