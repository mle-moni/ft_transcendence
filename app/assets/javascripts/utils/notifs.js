App.utils.wobble = () => {
	const notifEl = document.getElementById("notifs");
	notifEl.classList.add("wobble-ver-left");
	setTimeout(() => {
		notifEl.classList.remove("wobble-ver-left");
	}, 400);
}
