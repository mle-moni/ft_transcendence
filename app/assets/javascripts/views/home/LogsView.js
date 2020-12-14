AppClasses.Views.Logs = class extends Backbone.View {
	constructor(opts) {
		opts.events = {};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/logs"];
		this.render();
	}
	render() {
		let errors = App.errorLogs.map(el => {
			let newEl = {date: el.date, from: el.from};
			newEl.content = "This error did not send formatted content";
			if (el.err.hasOwnProperty("responseJSON")) {
				newEl.status = el.err.status;
				if (el.err.responseJSON.hasOwnProperty("alert")) {
					newEl.content = el.err.responseJSON.alert;
				}
			}
			return newEl;
		});
		this.$el.html(this.template({errors}));
		this.delegateEvents();
		return (this);
	}
}
