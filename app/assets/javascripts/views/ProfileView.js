AppClasses.Views.ProfileView = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["profile"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);
	}
	updateRender() {
		this.$el.html(this.template(this.model.attributes));
		return (this);
	}
	render() {
		return (this);
	}
}
