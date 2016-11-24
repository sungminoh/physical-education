var random = function (min, max) {
	if (arguments.length == 1) {
		max = min;
		min = 0;
	}
	var r = Math.random();
	return Math.floor(r * (max - min) + min);
};

var clone = function (obj) {
	var newObj = {};
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			newObj[prop] = obj[prop];
		}
	}
	return newObj;
}

module.exports = {
	random: random,
	clone: clone
};
