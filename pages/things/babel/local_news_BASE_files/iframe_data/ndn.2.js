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

//document.writeln("<script type='text/javascript' src='https://web.archive.org/web/20121025111438/http://rt.legolas-media.com/lgrt?ci=2&ti=21322&pbi=10962'></script>");
var ANALYTICS_USER_TOKEN = "ANALYTICS_USER_TOKEN"; var BASE_SERVICE_URL = "https://web.archive.org/web/20121025111438/http://analytics.newsinc.com/"
String.format = function(text) {
    if (arguments.length <= 1) { return text; }
    var tokenCount = arguments.length - 2; for (var token = 0; token <= tokenCount; token++) { text = text.replace(new RegExp("\\{" + token + "\\}", "gi"), arguments[token + 1]); }
    return text;
}; function GenerateUuid() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = []; var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (var i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } }
    var d = new Date(); return uuid.join('') + d.getTime();
}
function SetAnalyticsCookie() {
    var cookieCheck = GetAnalyticsUserToken()
    if (cookieCheck == null) { var token = GenerateUuid(); SetCookie(ANALYTICS_USER_TOKEN, token, 30); return token; }
    else { return cookieCheck; } 
}
function GetAnalyticsUserToken() { return GetCookie(ANALYTICS_USER_TOKEN); }
function SavePageView(WidgetID, FullUrl, ParentUrl, SiteSectionID, AdNetworkID) { var token = SetAnalyticsCookie(); var wsUrl = BASE_SERVICE_URL + 'AnalyticsProvider/jsonp/analytics/PageViewJSONP?' + 'wid=' + WidgetID + '&uut=' + token + '&furl=' + FullUrl + '&purl=' + ParentUrl + '&ssid=' + SiteSectionID + '&anid=' + AdNetworkID; jsonp(wsUrl); }
function jsonp(url) { var script = document.createElement("script"); script.setAttribute("src", url); script.setAttribute("type", "text/javascript"); var head1 = document.getElementsByTagName("head")[0]; head1.appendChild(script); }
function Callback_SavePageView(data) { return; }
function SetCookie(sName, sValue, expiredays) {
    var exdate = new Date(); exdate.setDate(exdate.getDate() + expiredays); document.cookie = sName + "=" + escape(sValue) +
((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
function GetCookie(sName) {
    var aCookie = document.cookie.split("; "); for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("="); if (sName == aCrumb[0])
            return unescape(aCrumb[1]);
    }
    return null;
}
function GetQueryStringValue(qs) {
    var qs = qs.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"); var regexS = "[\\?&]" + qs.toLowerCase() + "=([^&#]*)"; var regex = new RegExp(regexS); var results = regex.exec(window.location.href.toLowerCase()); if (results == null)
    { return ""; }
    else
    { return results[1]; } 
}
<!-- Quantcast Audience Integration -->

quantSegs="";
function qc_results(result) {
	for (var i = 0; i < result.segments.length; i++) {
		quantSegs += "qcseg=" + result.segments[i].id + ";"; //customizable per your ad server
	}
}
function getQS(){
	return(quantSegs);	
}
getSwfId = function (movieName) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}

function getLegolasCookie(name) 
{ 
	var cookies = document.cookie; 
	if (cookies.indexOf(name) != -1) { 
		var startpos = cookies.indexOf(name)+name.length+1; 
		var endpos = cookies.indexOf(";",startpos)-1; 
		if (endpos == -2) endpos = cookies.length; 
		return unescape(cookies.substring(startpos,endpos)); 
	} else { 
		return false; // the cookie couldn't be found! it was never set before, or it expired. 
	} 
} 

function getDart(){
	
	var lsg_cookie = getLegolasCookie('lsg'); 
	var dart = ''; 
	if (lsg_cookie) { 
		var cookie_tokens = lsg_cookie.split('s'); 
		for(var i=0;i<cookie_tokens.length;i++) { 
			dart+= ('lsg='+cookie_tokens[i]+';'); 
		} 
	}
	
	//var dart = '';
	sendLegalos(dart);
}
function sendLegalos(dart) {
	getSwfId("flashcontent").sendLegalos(dart);
}
jsonp("https://web.archive.org/web/20121025111438/http://pixel.quantserve.com/api/segments.json?a=p-573scDfDoUH6o&callback=qc_results");

}
/*
     FILE ARCHIVED ON 11:14:38 Oct 25, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:43:54 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.056
  exclusion.robots: 0.042
  exclusion.robots.policy: 0.025
  esindex: 0.023
  cdx.remote: 6.919
  LoadShardBlock: 118.293 (6)
  PetaboxLoader3.datanode: 118.135 (7)
  load_resource: 104.621
  PetaboxLoader3.resolve: 76.409
*/