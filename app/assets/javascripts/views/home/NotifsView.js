AppClasses.Views.Notifs = class extends Backbone.View {
	constructor(opts) {
		opts.events = {};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/notifs"];
		this.render();
	}
	render() {
		window.App.notifs.count = 0;
        $("#notifsCount").text(window.App.notifs.count);
		let notifs = App.notifs.arr;
		this.$el.html(this.template({notifs}));
		this.delegateEvents();
		return (this);
	}
}
