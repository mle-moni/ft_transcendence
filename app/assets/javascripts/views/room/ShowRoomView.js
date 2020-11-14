AppClasses.Views.ShowRoom = class extends Backbone.View {
	constructor(opts) {

        super(opts);

        console.log("Show Room Page");
        
        // TODO : opts events et protect url from users which aren't is the room
        
        this.room_id = opts.room_id;
		this.tagName = "div";
        this.template = App.templates["room/show"];
        
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();
		this.room = null;
		this.updateRender();

    }
    
	updateRender() {

        this.room = this.model.findWhere({id: this.room_id});
        const roomJSON = this.room ? this.room.toJSON() : null;
        const { attributes } = App.models.user;
        
		this.$el.html(this.template({
            room: roomJSON,
            user: attributes
			// token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
    }
    
	render() {
		this.model.fetch();
		return (this);
    }
    
}
