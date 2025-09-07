var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");


var textsizeCookieVal = readCookie('textSize'),
currentSize = textsizeCookieVal != null ? parseInt(textsizeCookieVal) :  3;

function textSize(type) {
	var sizes = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'],
	sizeVal,
	defaultSize,
	d = document,
	x;

	if (currentSize > 6 || currentSize < 0) return;

	if (type == 'increase') {
		if (currentSize > 5) return;
		currentSize++;
	} else if (type == 'decrease') {
		if (currentSize < 1) return;
		currentSize--;
	}

	sizeVal = sizes[currentSize];
	defaultSize = currentSize == 3;

	if (defaultSize && !type) return;

	if ((x = d.getElementById('story-body-text') || d.getElementById('story-body'))) {
		x.className = sizeVal;
	}
	if ((x = d.getElementById('story-body2'))) {
		x.className = sizeVal;
	}
	if ($$('.galleryModule')) {
		$$('.galleryModule p').each(function(s) {
			if (s.hasClassName('date')) {
				s.className = 'date' + (defaultSize ? '' : ' ' + sizeVal);  
			} else {
				s.className = sizeVal;
			}
		});
		$$('.galleryModule h3').each(function(s) {
			s.className = defaultSize ? '' : sizeVal; 
		});
	}

	if (typeof resetInlineAds != 'undefined') {
		resetInlineAds();
	}

	if (type) {
		eraseCookie('textSize');
		createCookie('textSize', currentSize, 365);
	}
}

}
/*
     FILE ARCHIVED ON 07:17:40 Oct 25, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:53 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.879
  exclusion.robots: 0.026
  exclusion.robots.policy: 0.016
  esindex: 0.012
  cdx.remote: 44.256
  LoadShardBlock: 291.063 (3)
  PetaboxLoader3.datanode: 379.554 (5)
  load_resource: 351.232 (2)
  PetaboxLoader3.resolve: 161.456 (2)
*/