import { base } from './config'
import distance from 'euclidean-distance'


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

function pxToMm(pixel){
  var dpi = document.getElementById('dpi').offsetHeight;
  return 24.5 * pixel / dpi
}

function dist(p1, p2){
  return distance([pxToMm(p1[0]), pxToMm(p1[1])], [pxToMm(p2[0]), pxToMm(p2[1])]);
}

module.exports = {
	random: random,
	clone: clone,
  makeUrl: makeUrl,
  distance: dist,
  pxToMm: pxToMm
};
