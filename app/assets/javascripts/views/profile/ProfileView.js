AppClasses.Views.Profile = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["profile/index"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);
	}
	updateRender(changes) {
		if (changes && App.utils.onlyThoseAttrsChanged(changes.changed, ["last_seen"])) {
			return (this);
		}
		this.$el.html(this.template(this.model.attributes));
		return (this);
	}
	render() {
		return (this);
	}
}
