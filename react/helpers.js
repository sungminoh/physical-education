import { base } from './config'

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

var makeUrl = function (path) {
  var url = base + '/' + path;
  return url.replace(/\/+/g, '/');
}

module.exports = {
	random: random,
	clone: clone,
  makeUrl: makeUrl
};
