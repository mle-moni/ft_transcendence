AppClasses.Views.TournamentCreate = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #createTournament": "submit"
		};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["tournaments/create"];
		this.listenTo(this.model, "change", this.render);
	}

	submit(e) {
		e.preventDefault();
		App.utils.formAjax("/api/tournaments.json", "#createTournament")
		.done(res => {
			App.toast.success("Tournament successfully created !", { duration: 2000, style: App.toastStyle });
			location.hash = `#tournaments`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
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
