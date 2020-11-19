Handlebars.registerHelper('print_status', function () {
	const online = false;
	const secondsToBeOffline = 30; // user is considered offline after 30 scd
	if (!this.last_seen) {
		return ("Offline");
	}
	if (new Date - new Date(this.last_seen) > (secondsToBeOffline * 1000)) {
		return ("Offline");
	}
    return ("Online");
});
