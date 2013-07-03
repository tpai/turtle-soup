/**
 * Sorts an array of json objects by some common property, or sub-property.
 * @param {array} objArray
 * @param {array|string} prop Dot-delimited string or array of (sub)properties
 */
function sortJsonArrayByProp(objArray, prop){
	if (arguments.length<2){
		throw new Error("sortJsonArrayByProp requires 2 arguments");
	}
	if (objArray && objArray.constructor===Array){
		var propPath = (prop.constructor===Array) ? prop : prop.split(".");
		objArray.sort(function(a,b){
			for (var p in propPath){
				if (a[propPath[p]] && b[propPath[p]]){
					a = a[propPath[p]];
					b = b[propPath[p]];
				}
			}
			// convert numeric strings to integers
			a = a.match(/^\d+$/) ? +a : a;
			b = b.match(/^\d+$/) ? +b : b;
			return ( (a < b) ? -1 : ((a > b) ? 1 : 0) );
		});
	}
}

var nl2br = function(str) {
	return str.replace(/\n/g, "<br />")
};