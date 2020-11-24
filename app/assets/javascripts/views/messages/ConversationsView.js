AppClasses.Views.Conversations = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #sendRoomMessageForm": "submit",
		}
		super(opts);

		this.user = opts.user;
		this.chatID = opts.chatID;
		this.model = opts.model; //.findWhere({id: this.room_id});
		this.lala = opts.messages;
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.listenTo(this.lala, "change reset add remove", this.updateRender);
		
		this.lala.fetch();
		this.model.fetch();

		console.log("====");
		console.log(this.model)
		console.log(this.chatID);
		console.log("====");
		
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
			location.reload();// = `#messages/` + this.chatID;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

    updateRender() {


		var test = this.model.findWhere({id: this.chatID});
		console.log("---- test -----");
		console.log(test)
		if (test)
			console.log(test.direct_messages);
		console.log("---- lala -----");
		console.log(this.lala)

		console.log("---- current -----");
		var pp = this.model;
		var currentRoom = pp ? pp.toJSON() : null;
		currentRoom = _.filter(currentRoom, m => {
			return m.id === this.chatID;
		})[0] || null;

		if (currentRoom)
			console.log(currentRoom.direct_messages)








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
    
