
// utility to check if only certain fields changed
// usage: 
// onlyThoseAttrsChanged({"attribute_1": "I changed"}, ["attribute_1"])
// should return true
// onlyThoseAttrsChanged({"attribute_2": "I changed"}, ["attribute_1"])
// should return false

App.utils.onlyThoseAttrsChanged = (changedObj, arr) => {
	if (_.isEmpty(changedObj)) { // changedObj is empty when a new object is added into a collection
		return (false);
	}
	for (let key in changedObj) {
		if (_.findIndex(arr, attr => attr == key) == -1) {
			return (false); // some attribute not specified in arr changed
		}
	}
	return (true); // only attributes specified in arr changed
}
