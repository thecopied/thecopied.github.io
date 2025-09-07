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

var inTextAdsReady=false;
var inTextSiteName="";
var inTextSiteURL="";
var baseClass="taxInTextAdHover";

function hasClass(target, theClass) {
	var pattern = new RegExp("(^| )" + theClass + "( |$)");
	if (pattern.test(target.className)) {
		return true;
	}
	return false;
};

function isSafari() {
	return (navigator.userAgent.toLowerCase().indexOf("safari") != -1);	
}

function elementY(obj) {
	if(isSafari() && obj.tagName=='TR') {
		obj=obj.firstChild;
	}
	var top=obj.offsetTop;
	var op=obj.offsetParent;
	while (obj.parentNode && document.body != obj.parentNode) {
		obj=obj.parentNode;
		if (!isNaN(obj.scrollTop)) {
			top -= obj.scrollTop;
		}
		if (op == obj) {
			if (isSafari() && obj.tagName=='TR') {
				top += obj.firstChild.offsetTop;
			} else {
				top += obj.offsetTop;
			}
			op=obj.offsetParent;
		}
	}
	return top;
}

function elementX(obj) {
	if (isSafari() && obj.tagName=='TR') {
		obj=obj.firstChild;
	}
	var left=obj.offsetLeft;
	var op=obj.offsetParent;
	while (obj.parentNode && document.body != obj.parentNode) {
		obj=obj.parentNode;
		left -= obj.scrollLeft;
		if (op == obj) {
			if (isSafari() && obj.tagName=='TR') {
				left += obj.firstChild.offsetLeft;
			} else {
				left += obj.offsetLeft;
			}
			op=obj.offsetParent;
		}
	}
	return left;
}

function pageScrollY() {
	return document.body.scrollTop || document.documentElement.scrollTop;
}

function getHovers(){
	var elementArray = document.getElementsByTagName("div");
	var matchedArray = [];
	var pattern = new RegExp("(^| )" + baseClass + "( |$)");

	for (var i = 0; i < elementArray.length; i++) {
		if (pattern.test(elementArray[i].className)) {
			matchedArray[matchedArray.length] = elementArray[i];
		}
	}
	return matchedArray;
}

function resetInlineAds() {
	var hovs=getHovers();
	for (var i=0; i<hovs.length; i++) {
		hovs[i].setAttribute("recalc","true");	
	}
}

function trackClick(linkName) {
	if ( typeof s_gi != 'undefined' ) { 
		var s=s_gi('tribglobal'); 
		s.linkTrackVars='eVar23,server'; 
		s.eVar23=inTextSiteURL + ':' + linkName + ' Taxonomy Ad'; 
		s.server=inTextSiteURL; 
		s.tl(true,'o', linkName + ' Taxonomy Ad' );
	}	
}

var hideInText=0;
var resizeTimer=0;
var resizingInProgress=false;
var lastAd=null;

document.onclick=function(){taxInTextOut(null);};
window.onresize=function(){
	if (resizingInProgress)
		return;
	resizingInProgress=true;
	resizeTimer=setTimeout(function(){
			resizingInProgress=false;
			clearTimeout(resizeTimer);
			resizeTimer=0;
			resetInlineAds();
		},1000);
	};

function upOrDown(pos) {
	return (pos) <= pageScrollY();
}

function taxInTextOver(e,obj) {
	if (document.all && !inTextAdsReady)
		return;
	if (lastAd==null || lastAd == obj) {
		clearTimeout(hideInText);
		hideInText=0;
		if (lastAd==obj)
			return;
	} else {
		hideAd(lastAd);
	}
	lastAd=obj;
	var hov=document.getElementById('inText_'+obj.id);
	var up=true;
	if (hov && hov.getAttribute("recalc") != "true") {
		if (upOrDown(hov.getAttribute("dn"))) {
			hov.className = baseClass + " up";
			hov.style.top=hov.getAttribute("up")+"px";
		} else {
			up=false;
			hov.className = baseClass + " dn";
			hov.style.top=hov.getAttribute("dn")+"px";
		}
		hov.style.display="block";
		if (document.all && !window.opera) {
			hov.firstChild.firstChild.firstChild.firstChild.style.visibility=up?"visible":"hidden";
			hov.firstChild.firstChild.firstChild.lastChild.style.visibility=up?"hidden":"visible";
		}
	} else {
		var spn = obj.nextSibling;
		
		if (!spn.hasChildNodes()
			|| (spn.childNodes.length==1 && spn.firstChild.nodeType == 8)) { // if span is emtpy or only contains a comment
			return false;
		}
		
		// BAQ-539
		var elemY=elementY(obj);
		if (navigator.userAgent.indexOf("MSIE") > 0) {
			if (navigator.userAgent.indexOf("MSIE 6") > 0) {
				elemY-=588;
			} else {
				elemY-=603;
			}
		}
		var elemX=elementX(obj);
		
		if (!hov) { // this stuff happens only once, even for recalcs
			var hov=document.createElement("div");
			hov.setAttribute("id","inText_"+obj.id);
			
			var notAd = spn.innerHTML.match(/-- no\sad --/ig);
			
			// added for non-ad promotional floats
			var spanInner = notAd ? spn.innerHTML : spn.innerHTML.replace(/(href=\"[^\"]*\")/ig,"$1 onclick=\"trackClick('"+obj.title+"');\"");
			var sponsored = notAd ? '' : '<div class="inTextAdDisclaimer">Sponsored Link</div>';
	
			var hoverInner = '<div class="taxInTextShadow2"><div class="taxInTextShadow3">';
			hoverInner += '<div class="taxInTextAdBlock"><div class="inTextArrowUp">&nbsp;</div>';
			hoverInner += '<div class="inTextTop"><a href="'+obj.href+'">'+obj.innerHTML+'</a><br/>';
			hoverInner += inTextSiteName + ' topic gallery</div>';
			hoverInner += '<div class="inTextBottom">' + sponsored;
			hoverInner += '<div class="inTextAdContent">' + spanInner + '</div></div>';
			hoverInner += '<div class="inTextArrowDn">&nbsp;</div></div>';
			hoverInner += '</div></div>';
			hov.innerHTML=hoverInner;
			hov.className=baseClass;
			
			var con = document.getElementsByTagName('body')[0];
			con.appendChild(hov);
			
			hov.onmouseover=function(e){taxInTextOver(e,obj);};
			hov.onmouseout=function(e){taxInTextOut(e,obj);};
			hov.onclick=function(e){
					if (!e) 
						window.event.cancelBubble=true;
					else 
						e.stopPropagation();
				};
			obj.onclick=function(e){
					if (!e) 
						window.event.cancelBubble=true;
					else 
						e.stopPropagation();	
					taxInTextOver(e,obj);
					return false;
				};
		} else {
			hov.style.visibility="hidden";
			hov.style.display="block";	
		}

		var aWidth=obj.offsetWidth;
		var aHeight=obj.offsetHeight;
		var hWidth=hov.offsetWidth;
		var hHeight=hov.offsetHeight;
		
		if (aHeight > 25) { // for links that wrap
			hov.setAttribute("recalc","true");
			var elemXPar=elementX(obj.parentNode);
			var posx = 0;
			if (!e) var e = window.event;
			if (e.pageX) {
				posx = e.pageX;
			} else if (e.clientX) {
				posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			}
			hov.style.left = posx - hWidth/2  + "px";
			if (posx > (elemXPar + obj.parentNode.offsetWidth/2)) { // on right
				var dnVal = elemY - hHeight - 10;
				var upVal = elemY + aHeight/2 + 14;
			} else { // on left
				var dnVal = elemY - hHeight + aHeight/2 - 10;
				var upVal = elemY + aHeight + 14;
			}
		} else {
			hov.setAttribute("recalc","false");
			hov.style.left=(elemX + aWidth/2 - hWidth/2) + "px";
			var dnVal=elemY - hHeight - 10;
			var upVal=elemY + aHeight + 14;
		}
		
		hov.setAttribute("up",upVal);
		hov.setAttribute("dn",dnVal);
		
		if (upOrDown(dnVal)) {
			hov.className = baseClass + " up";
			hov.style.top=upVal+"px";
		} else {
			hov.className = baseClass + " dn";
			hov.style.top=dnVal+"px";
		} 
		
		hov.style.visibility="visible";
	}
}


function taxInTextOut(e,obj) {
	if ((document.all && !inTextAdsReady) || (obj==null && lastAd==null))
		return;
	var timeOut=400;
	if (obj==null) {
		obj=lastAd;	
		timeOut=30;
	}
	hideInText=setTimeout(function(){hideAd(obj);},timeOut);
}

function hideAd(obj) {
	clearTimeout(hideInText);
	hideInText=0;
	var hov=document.getElementById('inText_'+obj.id);
	if (hov) {
		hov.style.display="none";
		lastAd=null;
	}
}

function taxInTextClick(e,obj) {
	// show ad, but if the ad content is empty, taxInTextOver will return false and instead we'll follow the link.
	if ((document.all && !inTextAdsReady) || taxInTextOver(e,obj)==false)
		window.location=obj.href;
	return false;
}



/////////////////////



function coreIntextInitLoad() {
	// quit if this function has already been called
	if (arguments.callee.done) return;
	
	// flag this function so we don't do the same thing twice
	arguments.callee.done = true;
	
	// kill the timer
	if (_timer) {
		clearInterval(_timer);
		_timer = null;
	}
	
	inTextAdsReady=true;
}

/* for Mozilla */
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", coreIntextInitLoad, false);
}

/* for Internet Explorer */
	/*@cc_on @*/
	/*@if (@_win32)
		var dummy = (location.protocol == "https:") ? "//:" : "javascript:void(0)";
		document.write("<script id=__ie_onload defer src=" + dummy + "><\/script>");
		var script = document.getElementById("__ie_onload");
		script.onreadystatechange = function() {
			if (this.readyState == "complete") {
				coreIntextInitLoad(); // call the onload handler
			}
		};
	/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
	var _timer = setInterval(function() {
		if (/loaded|complete/.test(document.readyState)) {
			coreIntextInitLoad(); // call the onload handler
		}
	}, 10);
}


/* for other browsers */
//window.onload = coreIntextInitLoad;




}
/*
     FILE ARCHIVED ON 20:06:13 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:57 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.829
  exclusion.robots: 0.038
  exclusion.robots.policy: 0.021
  esindex: 0.014
  cdx.remote: 5.149
  LoadShardBlock: 550.55 (6)
  PetaboxLoader3.datanode: 519.101 (8)
  PetaboxLoader3.resolve: 132.168 (3)
  load_resource: 161.894 (2)
*/