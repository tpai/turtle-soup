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

//濾出圖片與連結
var contentParser = function(str) {
	str = str.replace(/:(\d{1,})/, "<a href='#$1' class='anchor'>:$1</a>")
	str = str.replace(/\[([^\]]*)\]/ig, "<span class='tag_name quick_name'>$1</span>")
	if(str.match(/(jpg|png|gif|jpeg|bmp)/) === null)
		return str.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1' target='_blank'>$1</a>");
	else
		return str.replace(/(https?:\/\/[\w\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[\w])+\.(?:jpg|png|gif|jpeg|bmp))/ig, "<a href='$1' target='_blank'><img src='$1' /></a>");
};

//高亮TAG行
var highlight_tag_line = function(line) {

	var tr = $("a[name='"+line+"']").parent().parent()
	var offset = $(tr).offset()
	var width = $(tr).css("width")
	var height = $(tr).css("height")

	$("#highlight")
		.css("width", width)
		.css("height", height)
		.css("top", offset.top)
		.css("left", offset.left)
		.show()
};
//換行字元轉換
var nl2br = function(str) {
	return str.replace(/\n/g, "<br />")
};
