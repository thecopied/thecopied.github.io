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

(function ($) {
	var baseurl = 'https://web.archive.org/web/20121025015705/http://qa.ps.newsinc.com/';
	
	$.playerServicesCall = function (trackingGroup, widgetID, callback) {
		var url = baseurl + 'players/showjson/'+trackingGroup+'/'+widgetID+'.xml';
		$.getXML(url, callback);
	};

	$.playlistServicesCall = function (trackingGroup, widgetID, playlistID, callback) {
		var url = baseurl + 'Playlist/showjson/'+trackingGroup+'/'+widgetID+'/'+playlistID+'.xml';
		$.getXML(url, callback);
	};	
	
	$.catalogServicesCall = function (videoID, callback) {
		var url = baseurl + 'Catalog/'+videoID+'.xml';
		$.getXML(url, callback);
	};	
	
    $.getXML = function (url, callback) {
		$.GetCrossDomainXML(url, callback);
    };
	
	$.GetCrossDomainXML = function (url, callback) {
		$.GetDataFromURL(url, function(data) {
			callback(data.xmlfile);
		});
	};
	
	$.GetDataFromURL = function (url, callback) {
		if(isInform == false){
			$.getJSON(url+'?callback=?', callback);
		}else{

			var separator = '?';
    		if(url.indexOf('?') >= 0) {
      			separator = '&';
    		}
    		var targetUrl = url + separator + 'callback=?';
			$.getJSON(targetUrl, callback);   	
		}
	};
})(jQuery);

}
/*
     FILE ARCHIVED ON 01:57:05 Oct 25, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:43:54 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.758
  exclusion.robots: 0.047
  exclusion.robots.policy: 0.03
  esindex: 0.018
  cdx.remote: 6.994
  LoadShardBlock: 89.298 (3)
  PetaboxLoader3.datanode: 185.755 (5)
  load_resource: 214.388 (2)
  PetaboxLoader3.resolve: 68.206
*/