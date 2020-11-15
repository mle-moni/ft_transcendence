AppClasses.Views.ShowRoom = class extends Backbone.View {
	constructor(opts) {

        super(opts);

        this.room_id = opts.room_id;
		this.tagName = "div";
        this.template = App.templates["room/show"];
        
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();
		
		this.messages = null;
		this.updateRender();

    }
    
	updateRender() {
		const { attributes } = App.models.user;
		this.messages = this.model;
		var messageJSON = this.messages ? this.messages.toJSON() : null;

		this.$el.html(this.template({
			tab: messageJSON,
			user: attributes
		}));
		return (this);
    }
    
	render(room_id) {
		this.model.fetch();
		return (this);
    }
    
}
