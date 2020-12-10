AppClasses.Views.TournamentList = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit .registerTournament": "registerTournament",
			"submit .unregisterTournament": "unregisterTournament",
			"submit .deleteTournament": "deleteTournament"
		};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["tournaments/list"];
		
		this.tournaments = opts.tournaments;
		this.allUsers = opts.allUsers;
		this.listenTo(this.tournaments, "change reset add remove", this.updateRender);
		this.listenTo(this.model, "change", this.updateRender);
		this.listenTo(this.allUsers, "change reset add remove", this.updateRender);
		this.tournaments.fetch();
		this.allUsers.myFetch();
		// TODO listen to tournaments collection
	}

	registerTournament(e) {
		e.preventDefault();
		if (e.target.children.length < 2) return (false);
		const tournamentID = e.target.children[1].value;
		const selectorFormID = "#registerTournament-" + tournamentID;
		App.utils.formAjax("/api/tournaments/register/" + tournamentID + ".json", selectorFormID)
		.done(res => {
			App.toast.success("Tournament Joined !", { duration: 2000, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	unregisterTournament(e) {
		e.preventDefault();
		if (e.target.children.length < 2) return (false);
		const tournamentID = e.target.children[1].value;
		const selectorFormID = "#unregisterTournament-" + tournamentID;
		App.utils.formAjax("/api/tournaments/unregister/" + tournamentID + ".json", selectorFormID)
		.done(res => {
			App.toast.success("Tournament left !", { duration: 2000, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	deleteTournament(e) {
		e.preventDefault();
		if (e.target.children.length < 2) return (false);
		const tournamentID = e.target.children[1].value;
		const selectorFormID = "#deleteTournament-" + tournamentID;
		App.utils.formAjax("/api/tournaments/" + tournamentID + ".json", selectorFormID)
		.done(res => {
			App.toast.success("Tournament Deleted !", { duration: 2000, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	updateRender() {

		var tournaments = this.tournaments.toJSON();
		if (tournaments.length > 0)
		{
			tournaments.sort(function(a,b){
				return new Date(a.start) - new Date(b.start);
			});
	
			for (var count = 0; count < tournaments.length; count++)
			{
				var formatedDate = new Date(tournaments[count].start);
				tournaments[count].start = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(formatedDate);
				tournaments[count].page_id = (count + 1);
			}
		}
		this.$el.html(this.template({
			tournaments: tournaments,
			currentUser: this.model.toJSON(),
			allUsers: this.allUsers.toJSON(),
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
	}

	render() {
		this.updateRender();
		return (this);
	}

}
