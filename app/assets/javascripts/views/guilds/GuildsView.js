AppClasses.Views.Guilds = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["guilds/index"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();
	}
	updateRender() {
		const guilds = this.model.toJSON().sort((a, b) => {
			return (b.points - a.points);
		});
		for (let i = 0; i < guilds.length; i++) {
			guilds[i].rank = i + 1;
		}
		this.$el.html(this.template({
			guilds
		}));
		return (this);
	}
	render() {
		this.model.fetch();
		return (this);
	}
}
