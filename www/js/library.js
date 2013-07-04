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

function strip_tags (input, allowed) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Luke Godfrey
  // +      input by: Pul
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +      input by: Alex
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Marc Palau
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Eric Nagel
  // +      input by: Bobby Drake
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Tomasz Wesolowski
  // +      input by: Evertjan Garretsen
  // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
  // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
  // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
  // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
  // *     returns 2: '<p>Kevin van Zonneveld</p>'
  // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
  // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
  // *     example 4: strip_tags('1 < 5 5 > 1');
  // *     returns 4: '1 < 5 5 > 1'
  // *     example 5: strip_tags('1 <br/> 1');
  // *     returns 5: '1  1'
  // *     example 6: strip_tags('1 <br/> 1', '<br>');
  // *     returns 6: '1  1'
  // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
  // *     returns 7: '1 <br/> 1'
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

//濾出圖片與連結
var content_parser = function(str) {
	str = str.replace(/:(\d{1,})/, "<a href='#$1' class='anchor'>:$1</a>")
	str = str.replace(/\[([^\]]*)\]/ig, "<span style='background-color: #D2DFF6; padding: 2px; border:#bdc7d8 1px solid;'>$1</span>")
	if(str.match(/(jpg|png|gif|jpeg|bmp)/) === null)
		return str.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1' target='_blank'>$1</a>");
	else
		return str.replace(/(http:\/\/[\w\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[\w])+\.(?:jpg|png|gif|jpeg|bmp))/ig, "<a href='$1' target='_blank'><img src='$1' /></a>");
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

var nl2br = function(str) {
	return str.replace(/\n/g, "<br />")
};