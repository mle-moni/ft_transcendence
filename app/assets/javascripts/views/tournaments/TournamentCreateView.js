AppClasses.Views.TournamentCreate = class extends Backbone.View {
	constructor(opts) {
		opts.events = {};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["tournaments/create"];
		this.listenTo(this.model, "change", this.render);
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
