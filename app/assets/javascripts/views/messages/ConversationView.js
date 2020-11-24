AppClasses.Views.Conversations = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #sendRoomMessageForm": "submit",
		}
		super(opts);

		this.user = opts.user;
		this.chatID = opts.chatID;
		this.model = opts.model; //.findWhere({id: this.room_id});
        this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();
		
		this.tagName = "div";
        this.template = App.templates["messages/show"];

		this.updateRender();

	}
	
	submit(e) 
	{
		e.preventDefault();
		if (e.currentTarget.message.value == "") {
			// App.toast.message("You cannot send empty message", { duration: 2000, style: App.toastStyle });
			return ;
		}
		App.utils.formAjax("/api/chat_messages.json", "#sendRoomMessageForm")
		.done(res => {
			App.toast.success("Message sent", { duration: 1000, style: App.toastStyle });
			this.model.fetch();
			location.hash = `#messages/` + this.chatID;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

    updateRender() {



		this.$el.html(this.template({
			chatID: this.chatID,
			currentUser: this.user,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
    }
    
	render() {
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }

}
    
