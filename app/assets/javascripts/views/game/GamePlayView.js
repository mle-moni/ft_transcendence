AppClasses.Views.GamePlay = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["game/show"];
	}
	updateRender(room_id) {
		this.$el.html(this.template({ 
			room_id
		}));

		return (this);
	}
	render(room_id) {
		this.updateRender(room_id); // generates HTML
		return (this);
	}
}
