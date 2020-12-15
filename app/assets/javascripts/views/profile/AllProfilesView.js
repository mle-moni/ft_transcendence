AppClasses.Views.AllProfiles = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit .blockUnBlockForm": "blockUnBlockForm",
			
		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["profile/profilesList"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.myFetch();
	}

	blockUnBlockForm(e) {
		e.preventDefault();
		if (e.target.children.length < 3) return (false);
		const targetID = e.target.children[1].value
		const action = e.target.children[2].value
		var selectorFormID = "#blockUnBlockForm-" + targetID
		App.utils.formAjax("/api/handleBlock.json", selectorFormID)
		.done(res => {
			App.toast.success("Done", { duration: 2000, style: App.toastStyle });
			this.model.myFetch();
		})
		.fail((e) => {
			App.utils.toastError(e);
			this.model.myFetch();
		});
		return (false);
	}

	updateRender() {
		const { attributes } = App.models.user;
		var data = this.model.toJSON();
		var blockByCurrentUser = [];
		this.model.toJSON().forEach(user => {
			if (user.blocked) {
				user.blocked.forEach(block => {
					if (block.user_id == attributes.id)
						blockByCurrentUser.push(block);
				})
			}
		});
		var blockedTabIDs = [];
		blockByCurrentUser.forEach(block => {
			blockedTabIDs.push(block.toward_id);
		})
		data = data.sort((a, b) => {
			return (b.elo - a.elo);
		});
		for (let i = 0; i < data.length; i++) {
			data[i].rank = i + 1;
		}
		this.$el.html(this.template({
			currentUser: attributes,
			users: data,
			blockedTabIDs: blockedTabIDs,
			token: $('meta[name="csrf-token"]').attr('content'),
			formBlock: {
				method: "POST",
				url: "/api/handleBlock.json"
			}
		}));
		return (this);
	}
	render() {
		this.delegateEvents();
		this.model.myFetch();
		return (this);
	}
}
