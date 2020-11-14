AppClasses.Views.Room = class extends Backbone.View {
	constructor(opts) {

		super(opts);

		this.tagName = "div";
		this.template = App.templates["room/index"];
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		
		this.model.fetch();

		this.rooms = null;
		this.updateRender();

    }
    
	updateRender() {

		const { attributes } = App.models.user;
		this.$el.html(this.template({
			rooms: this.model.toJSON(),
			user: attributes
		}));
		this.delegateEvents();
		return (this);
    }
    
	render() {
		this.model.fetch();
		return (this);
    }
    
}
