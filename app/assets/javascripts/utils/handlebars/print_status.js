Handlebars.registerHelper('print_status', function () {
	if (this.in_game) {
		return ("In game");
	}
	const online = false;
	const secondsToBeOffline = 2; // user is considered offline after N scd
	if (!this.last_seen) {
		return ("Offline");
	}
	if (new Date - new Date(this.last_seen) > (secondsToBeOffline * 1000)) {
		return ("Offline");
	}
    return ("Online");
});

Handlebars.registerHelper('getDateValue', function(date) {
	let strBase = date.toLocaleString("fr", {timeZone: "Europe/Paris"});
	let strDateRaw = strBase.slice(0,10);
	let strDate = strDateRaw.split("/").reverse().join("-");	
	strDate += "T" + strBase.slice(11,16);
	return (strDate);
});

Handlebars.registerHelper('dateStr', function(dateRaw) {
	return (new Date(dateRaw).toLocaleString("en", {timeZone: "Europe/Paris"}));
});