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

windoids = new Array();

function windoid (url, name, width, height, props, autoClose) {
	var winProps;
	
	// If the props argument isn't specified, make the window resizable and scrollable
	if (props == null)
		winProps = 'resizable=1,scrollbars=1';
	else
		winProps = props;
	
	if (width != null && width != '') {
		// Try not to open a window wider than the screen
		if (window.screen && width > window.screen.availWidth)
			winProps += ',outerWidth=' + window.screen.availWidth;
		else
			winProps += ',width=' + width;
	}
	
	if (height != null && height != '') {
		// Try not to open a window taller than the screen
		if (window.screen && height > window.screen.availHeight)
			winProps += ',outerHeight=' + window.screen.availHeight;
		else
			winProps += ',height=' + height;
	}
	
	if (winProps.charAt(0) == ',')
		winProps = winProps.substring(1);

	var winName;

	if (name == null || name == '')
		winName = '_blank';
	else
		winName = name;
	
	var win = window.open(url, winName, winProps);
	if (win.focus && winName != '_blank') {
		// Bug in AOL 5.0 causes javascript error when
		// window.focus() is called before the page loads.
		if (navigator.appVersion.indexOf('AOL') < 0) {
			win.focus();
		}
	}
	
	if (autoClose == true) {
		var addedToList = false;
		for (var i=0; i<windoids.length; i++) {
			if (windoids[i].closed) {
				windoids[i] = win;
			}
		}
		
		if (!addedToList) {
			windoids[windoids.length++] = win;
		}
	}
}


function closeWindoids () {
	for (var i=0; i<windoids.length; i++) {
		var win = windoids[i];
		if (!win.closed) {
			win.close();
		}
	}
}


function loadParent (url) {
	if (window.top.opener && !window.top.opener.closed) {
		var win = window.top.opener;
		win.location = url;
		if (win.focus) {
			win.focus();
		}
	} else {
		window.open(url, '_blank', '');	
	}
}


window.onunload = closeWindoids;


}
/*
     FILE ARCHIVED ON 20:06:14 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:55 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.776
  exclusion.robots: 0.038
  exclusion.robots.policy: 0.022
  esindex: 0.021
  cdx.remote: 42.569
  LoadShardBlock: 236.181 (3)
  PetaboxLoader3.datanode: 279.842 (5)
  PetaboxLoader3.resolve: 212.732 (3)
  load_resource: 318.842 (2)
*/