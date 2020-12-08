AppClasses.Views.TournamentList = class extends Backbone.View {
	constructor(opts) {
		opts.events = {};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["tournaments/list"];
		this.listenTo(this.model, "change", this.render);
		// TODO listen to tournaments collection
	}
	render() {
		this.delegateEvents();
		this.$el.html(this.template({
			tournaments: this.model.toJSON(),
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
	}
}
