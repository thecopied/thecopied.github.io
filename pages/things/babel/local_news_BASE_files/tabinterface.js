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

var currentTab = new Array();
var playing = new Array();
var delayTime = 5000; // seconds*1000=delayTime
var timeOutFunction = new Array();
var maxTabs = new Array();
var galleryMax;

//example: 'popular', 'tab01', 'popular-tab01.jsp'
function tabPress(group, tabId, file) {

	
	var skipDate = true;
	if(!currentTab[group]) {
		currentTab[group] = group + "-tab01";
	}
	
	document.getElementById(currentTab[group]).className = "";
	document.getElementById(group + "-" + tabId).className = "current";
	currentTab[group] = group + "-" + tabId;
	var div = document.getElementById(group + "-tabs");
	if(file=="main-tab01.front" || file=="main-tab02.front" || file=="main-tab03.front"|| file=="main-tab04.front"  || file=="main-tab05.front") {
		skipDate = false;
	}
	
	// Begin AJAX request
	var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
       http_request = new XMLHttpRequest();
       if (http_request.overrideMimeType) {
       	  http_request.overrideMimeType('text/xml');
       }
    } 
	else if (window.ActiveXObject) { // IE
      try {
           http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } 
	  catch (e) {
          try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
          } 
		  catch (e) {
		  }
      }
    }
    
    if (!http_request) {
       return false;
    }
    http_request.onreadystatechange = function() { printContent(http_request, div, skipDate); };
    
	var now = new Date();
	var timestamp = now.getTime();
	if(file.indexOf("?") == -1 ) {
    	var filenamed = "/modules/mostpopular/" + file + "?time=" + timestamp;
	} else {
		var filenamed = "/modules/mostpopular/" + file + "&time=" + timestamp;
	}
		    	
    http_request.open('GET', filenamed, true);
    http_request.send(null);

}

function printContent(http_request, div, skipDate) {
	if (http_request.readyState == 4) {
        if (http_request.status == 200) {
            div.innerHTML = http_request.responseText;
			if(!skipDate){
				getTheDate("last-updated");
				getTheDate("last-updated-related");
			}
        } else {
            alert('There was a problem with the request.');
        }
    }
}


function playTab(div) {
    if(!playing[div]){
        playing[div] = true;
        slideShow(div);
    }
}

function pauseTab(div) {
    if(playing[div]){
        playing[div] = false;
        clearTimeout(timeOutFunction[div]);
    }
}

function slideShow(div) {
    var finalNextTab;
    var finalNextFile;
	    
    for(var i=1; i<=maxTabs[div]; i++) {
        var thisTabNum = "tab0" + i;
        var thisTab = div + "-" + thisTabNum;
        
        var nextI = i + 1;
        if(nextI > maxTabs[div]) {
            nextI = 1;
        }
        var nextTab = "tab0" + nextI;
        var nextFile = div + "-tab0" + nextI + ".front";
        
        if(currentTab[div] == thisTab){
            finalNextTab = nextTab;
            finalNextFile = nextFile;
        }
    }
    
    tabPress(div, finalNextTab, finalNextFile);
    
    if(playing[div]){
        timeOutFunction[div] = setTimeout('slideShow(\''+div+'\')', delayTime);
    }
}

function setTab(tabId, group, tabs) {
    currentTab[group] = group + "-" + tabId;
	maxTabs[group] = tabs;
}

// divNameRoot = "last-updated" or "last-updated-related"
function getTheDate(divNameRoot) {
    var i=1;
    for (i=1; i<16; i++) {
        var divString = divNameRoot + "-" + i;
        var dateContent =  document.getElementById(divString);
        if(dateContent == null) {
                        break;
        }
        var lastModTime = (new Date(dateContent.innerHTML)).getTime();
        var nowTime = (new Date()).getTime();
        var minutesAgo = Math.round(((nowTime - lastModTime)/1000)/60);
        if (minutesAgo < 60 && minutesAgo > 0) {
            if (minutesAgo <= 1) {
                document.getElementById(divString).innerHTML = '<p class="last-updated">Updated: less than a minute ago<p>';
				document.getElementById(divString).className = "";
            } else {
                document.getElementById(divString).innerHTML = '<p class="last-updated">Updated: ' + minutesAgo + ' minutes ago</p>';
				document.getElementById(divString).className = "";
            }
        }
        else if (minutesAgo <= 180 && minutesAgo > 0){
            var lastModTime = (new Date(dateContent.innerHTML));
            var hours = lastModTime.getHours();
            var minutes = lastModTime.getMinutes();
            var dateString = "";
            if(minutes < 10) {
                minutes = '0' + minutes;
            }
            if(hours == 0) {
                dateString = dateString + '12:' + minutes + ' a.m.';
            }
            else if(hours == 12) {
                dateString = dateString + '12:' + minutes + ' p.m.';
            }
            else if(hours > 12) {
                dateString = dateString + hours-12 + ':' + minutes + ' p.m.';
            }            
            else {
                dateString = dateString + hours + ':' + minutes + ' a.m.';
            }
            document.getElementById(divString).innerHTML = '<p class="last-updated">Updated: ' + dateString + ' </p>';
			document.getElementById(divString).className = "";
        }
        
    }
}

function generateDate(fullDate, shortDate, text, timestampAlways) {
	var lastModTime = (new Date(fullDate)).getTime();
    var nowTime = (new Date()).getTime();
    var minutesAgo = Math.round(((nowTime - lastModTime)/1000)/60);
    if (minutesAgo < 60 && minutesAgo > 0 && timestampAlways != 'true') {
        if (minutesAgo <= 1) {
            document.write('<span>' + text + ' less than a minute ago</span>');
        } else {
            document.write('<span>' + text + ' ' + minutesAgo + ' minutes ago</span>');
        }
    } else if ( (minutesAgo <= 180 && minutesAgo > 0 && shortDate != "") || timestampAlways == 'true') {
		var dateLength = shortDate.length;
    	var shortDateSub = shortDate.substring(0, dateLength-2);
   		    		
   		if (shortDate.substring(dateLength-2) == 'AM')
   		    document.write('<span>' + text + ' ' + shortDateSub + 'a.m.' + '</span>');
   		else
   		    document.write('<span>' + text + ' ' + shortDateSub + 'p.m.' + '</span>');
	}
}
function generateDateShort(fullDate, shortDate) {
	var lastModTime = (new Date(fullDate)).getTime();
    var nowTime = (new Date()).getTime();
    var minutesAgo = Math.round(((nowTime - lastModTime)/1000)/60);
    if (minutesAgo < 60 && minutesAgo > 0) {
        if (minutesAgo <= 1) {
            document.write('<span class="short-date">less than a min</span>');
        } else {
            document.write('<span class="short-date">' + minutesAgo + ' mins ago</span>');
        }
    }
	else if (minutesAgo <= 180 && minutesAgo > 0) {
		if(shortDate != "") {	
    		var dateLength = shortDate.length;
    		var shortDateSub = shortDate.substring(0, dateLength-2);
    		    		
    		if (shortDate.substring(dateLength-2) == 'AM')
    		    document.write('<span class="short-date">' + shortDateSub + 'a.m.' + '</span>');
    		else
    		    document.write('<span class="short-date">' + shortDateSub + 'p.m.' + '</span>');
	    }
	}
}

function generateDateShowAlways(fullDate, shortDate, printDate, text, timeStampAlways) {
	var lastModTime = (new Date(fullDate)).getTime();
    var nowTime = (new Date()).getTime();
    var minutesAgo = Math.round(((nowTime - lastModTime)/1000)/60);
    if (minutesAgo < 60 && minutesAgo > 0 && timeStampAlways != 'true') {
        if (minutesAgo <= 1) {
            document.write('<span>' + text + ' less than a minute ago</span>');
        } else {
            document.write('<span>' + text + ' ' + minutesAgo + ' minutes ago</span>');
        }
    }
	else if (minutesAgo <= 720 && minutesAgo > 0 && shortDate != "" && timeStampAlways != 'true') {
		var dateLength = shortDate.length;
    	var shortDateSub = shortDate.substring(0, dateLength-2);
   		    		
   		if (shortDate.substring(dateLength-2) == 'AM')
   		    document.write('<span>' + text + ' ' + shortDateSub + 'a.m.' + '</span>');
   		else
   		    document.write('<span>' + text + ' ' + shortDateSub + 'p.m.' + '</span>');
	} else if (minutesAgo <= 1440 && minutesAgo > 0 && timeStampAlways != 'true') {
		var hoursAgo = Math.round(minutesAgo/60);
		document.write('<span>' + text + ' ' + hoursAgo + ' hours ago</span>');
	} else if (minutesAgo > 1440 && printDate != "") {
	 	document.write('<span>' + text + ' ' + printDate + '</span>');
	} else if(minutesAgo <= 1440 && minutesAgo > 0 && timeStampAlways == 'true' && shortDate != ""){
		var shortDateSub = shortDate.substring(0, shortDate.length-2);		
   		if (shortDate.substring(shortDate.length-2) == 'AM')
   		    shortDateSub = shortDateSub + 'a.m.';
   		else
   		    shortDateSub = shortDateSub + 'p.m.';
		document.write('<span>' + text + ' ' + shortDateSub + '</span>');
	}
}
//Lead Content Rotating
var currentStory = 0;
var playingRotation = false;
var totalItems = 0;
var rotations = 0;

function storyRotationLoad(itemIndex) {
	
	// Begin AJAX request
	var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
       http_request = new XMLHttpRequest();
       if (http_request.overrideMimeType) {
       	  http_request.overrideMimeType('text/xml');
       }
    } 
	else if (window.ActiveXObject) { // IE
      try {
           http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } 
	  catch (e) {
          try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
          } 
		  catch (e) {
		  }
      }
    }    
    if (!http_request) {
       return false;
    }	
    http_request.onreadystatechange = function() { printContent(http_request, document.getElementById('module-lead-content'), false); };
    
	var now = new Date();
	var timestamp = now.getTime();
	var filenamed = "story-rotation.front?index=" + itemIndex + "&time=" + timestamp + "&coll=" + itemColl;
			
    http_request.open('GET', filenamed, true);
    http_request.send(null);
}

function nextStoryRotation() {
	currentStory++;
	if(currentStory > totalItems) {
		currentStory = 1
		rotations+=1;
	}
	storyRotationLoad(currentStory);
}
function previousStoryRotation() {
	currentStory--;
	if(currentStory <= 0) {
		currentStory = totalItems
	}
	storyRotationLoad(currentStory);
}
function rotationPrev() {
	clearTimeout(rotationTimeout);
	previousStoryRotation();
}
function rotationStart(items, collection) {
	totalItems = items;
	itemColl = collection;
	if(currentStory == 1 || currentStory == 0){
		rotations = 0;
	} else {
		rotations = -1;
	}
	if(playingRotation) {
		clearTimeout(rotationTimeout);
	}
	rotateStory();
}
function rotateStory() {
	if(rotations<3){
		nextStoryRotation()
		rotationTimeout = setTimeout('rotateStory()', 10000);
		playingRotation = true;
	}
}
function rotationStop() {
	clearTimeout(rotationTimeout);
}

//functions for promo rotation

var promoMax;

function promoRotationNext(promoIndex, promoColl) {
	promoIndex++;
	if(promoIndex > promoMax) {
		promoIndex = 1;
	}
	promoRotationLoad(promoIndex, promoColl);
}

function promoRotationPrev(promoIndex, promoColl) {
	promoIndex--;
	if(promoIndex <= 0) {
		promoIndex = promoMax;
	}
	promoRotationLoad(promoIndex, promoColl);
}

function promoRotationLoad(promoItemIndex, promoItemColl) {
	
	// Begin AJAX request
	var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
       http_request = new XMLHttpRequest();
       if (http_request.overrideMimeType) {
       	  http_request.overrideMimeType('text/xml');
       }
    } 
	else if (window.ActiveXObject) { // IE
      try {
           http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } 
	  catch (e) {
          try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
          } 
		  catch (e) {
		  }
      }
    }    
    if (!http_request) {
       return false;
    }	
    http_request.onreadystatechange = function() { printContent(http_request, document.getElementById('module-promo'), false); };
    
	var now = new Date();
	var timestamp = now.getTime();
	var filenamed = "promo-rotation.front?index=" + promoItemIndex + "&time=" + timestamp + "&coll=" + promoItemColl;
			
    http_request.open('GET', filenamed, true);
    http_request.send(null);
}

//Functions for Photo Gallery Display 

function galleryRotationNext(promoIndex, promoColl) {
	promoIndex++;
	if(promoIndex > galleryMax) {
		promoIndex = 1;
	}
	galleryRotationLoad(promoIndex, promoColl);
}

function galleryRotationPrev(promoIndex, promoColl) {
	promoIndex--;
	if(promoIndex <= 0) {
		promoIndex = galleryMax;
	}
	galleryRotationLoad(promoIndex, promoColl);
}

function galleryRotationLoad(promoItemIndex, promoItemColl) {
	
	// Begin AJAX request
	var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
       http_request = new XMLHttpRequest();
       if (http_request.overrideMimeType) {
       	  http_request.overrideMimeType('text/xml');
       }
    } 
	else if (window.ActiveXObject) { // IE
      try {
           http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } 
	  catch (e) {
          try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
          } 
		  catch (e) {
		  }
      }
    }    
    if (!http_request) {
       return false;
    }	
    http_request.onreadystatechange = function() { printContent(http_request, document.getElementById('gallery-module'), false); };
    
	var now = new Date();
	var timestamp = now.getTime();
	var filenamed = "gallery-rotation.front?index=" + promoItemIndex + "&max=" + galleryMax + "&item=" + promoItemColl;
			
    http_request.open('GET', filenamed, true);
    http_request.send(null);
}

//Health Lead Content

function itemRotationLoad(itemIndex) {
	
	// Begin AJAX request
	var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
       http_request = new XMLHttpRequest();
       if (http_request.overrideMimeType) {
       	  http_request.overrideMimeType('text/xml');
       }
    } 
	else if (window.ActiveXObject) { // IE
      try {
           http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } 
	  catch (e) {
          try {
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
          } 
		  catch (e) {
		  }
      }
    }    
    if (!http_request) {
       return false;
    }	
    http_request.onreadystatechange = function() { printContent(http_request, document.getElementById('lead-content-single-item'), false); applyImagesToLeadContent(itemIndex); };
    
	var filenamed = "health-lead-content-1.front?index=" + itemIndex + "&coll=" + itemColl + "&limit=" + healthLeadCount;
			
    http_request.open('GET', filenamed, true);
    http_request.send(null);
	
	
}

function nextItemRotation() {
	currentStory++;
	if(currentStory > totalLeadItems) {
		currentStory = 1
		rotations+=1;
	}
	itemRotationLoad(currentStory);
}
function previousItemRotation() {
	currentStory--;
	if(currentStory <= 0) {
		currentStory = totalLeadItems
	}
	itemRotationLoad(currentStory);
}
function itemRotationPrev() {
	clearTimeout(rotationTimeout);
	previousItemRotation();
}
function itemRotationStart(collection, leadItemCount) {
	totalLeadItems = leadItemCount;
	itemColl = collection;
	healthLeadCount = leadItemCount;
	if(currentStory == 1 || currentStory == 0){
		rotations = 0;
	} else {
		rotations = -1;
	}
	if(playingRotation) {
		clearTimeout(rotationTimeout);
	}
	rotateItem();
}
function rotateItem() {
	if(rotations<3){
		nextItemRotation()
		rotationTimeout = setTimeout('rotateItem()', 10000);
		playingRotation = true;
	}
}

function gotoLeadItem(collection) {
	collCode = collection;
	clearTimeout(rotationTimeout);
	itemRotationLoad(collCode);
}

function applyImagesToLeadContent(imageIndex) {
	theClass = "slide-" + imageIndex;
	var controlDiv = document.getElementById('lead-content-controls');
	linkTags = controlDiv.getElementsByTagName('a');
	for (i=0; i<linkTags.length; i++) {
		if (linkTags[i].className==theClass) {
			linkTags[i].className='lead-slide-index-active';
		}
	}
}
		


function popUp(URL) {
	day = new Date();
	id = day.getTime();
	eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=1,scrollbars=1,location=1,statusbar=1,menubar=1,resizable=1,width=1024,height=768,left = 0,top = 0');");
}
function playRelatedVideo(url) {
	var iFrame = document.getElementById('worldnowFrame526x375');
	if(iFrame != null) {
		if(url.indexOf("?") == -1 ) {
   			iFrame.src = url + "?size=526x389";
		} else {
			iFrame.src = url + "&size=526x389";
		}
		return false;
	} else {
		iFrame = document.getElementById('worldnowFrame300x665');
		if(iFrame != null ) {
			if(url.indexOf("?") == -1 ) {
    			iFrame.src = url + "?size=300x665";
			} else {
				iFrame.src = url + "&size=300x665";
			}
			return false;
		} else {
			return true;
		}
	}
}
function playRelatedVideoSmall(url) {
	var iFrame = document.getElementById('worldnowFrame300x265');
	if(iFrame != null) {
		if(url.indexOf("?") == -1 ) {
   			iFrame.src = url + "?size=300x265";
		} else {
			iFrame.src = url + "&size=300x265";
		}
		return false;
	} 
}
function clickOmni(tabId) {

		    var s=s_gi('tribsunsentinel');
		    s.linkTrackVars='eVar23,server';
		    s.eVar23='Sun-Sentinel.com:' + tabId;
		    s.server='sun-sentinel.com';
		    s.tl(true,'o', tabId );
}
function reSort(x){
	if (document.sort_form.jumpmenu.value != "null") {
		document.location.href = x
	}
}
function advReSort(target){
		document.adv_results_form.sortby.value=document.adv_results_form.jumpmenu.value;
		performSearch(document.adv_results_form,target);
}
function setMaxHeight(obj){
    var maxHeight = 0;
    obj.select('.tabDisplay').each(
		function(tab){
			if(tab.getHeight() > maxHeight){
				maxHeight = tab.getHeight();
			}
		}
	);
	obj.select('.tabDisplay').each(
	    function(e){
	        e.setStyle({height: maxHeight+"px"});
		});
}
function contentSwitch(tabNum, elm, num) {
    var obj = $(elm);
	var width = obj.up('.tabModuleContainer').down('.tabContentContainer').getWidth();
	var holder = obj.up('.tabModuleContainer').down('.tabContentHolder');
	holder.setStyle({left: (width * num * -1) + 'px'});
	
	obj.up('.tabModuleContainer').select('.tab').each(
        function(e){
        if(obj.up('.tab') == e && !e.hasClassName('curTab'))
            e.addClassName('curTab');
        else if(obj.up('.tab') != e && e.hasClassName('curTab'))
            e.removeClassName('curTab');
    });
};
function updateTabDisplay(target, elm){
    var obj = $(elm);
    obj.up('.tabModuleContainer').select('.tabDisplay').each(
        function(tab){
        if(tab.hasClassName(target) && !tab.hasClassName('currentTabDisplay')){
            tab.addClassName('currentTabDisplay');
        } else if(!tab.hasClassName(target)) {
            tab.removeClassName('currentTabDisplay');
        }
    });
    obj.up('.tabModuleContainer').select('.tab').each(
        function(e){
        if(obj.up('.tab') == e && !e.hasClassName('curTab'))
            e.addClassName('curTab');
        else if(obj.up('.tab') != e && e.hasClassName('curTab'))
            e.removeClassName('curTab');
    });
}
function checkForm(searchForm) {
	var valid;
	function trim(s) {
		s = s.replace(/(^\s*)|(\s*$)/gi,"");
		s = s.replace(/[ ]{2,}/gi," ");
		s = s.replace(/\n /,"\n");
		return s;
	}
	var srchVal=trim(searchForm.Query.value);	
	if(srchVal == "" || srchVal == "Search") {
		alert("Please Enter a Search Term");
		searchForm.Query.focus();
		if(window.event)
		    window.event.returnValue=false;
		valid = false;
	}
	return valid;
}
function trim(elm) {
    return elm.replace(/\s+$/, '');
}
function setContentDisplay(cntnt, elm){
    currentContent = cntnt;
    var obj = $(elm);
	var pages = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent').select('.tabContent').size();	
	var modSize = obj.up('.tabModuleContainer').down('.tabContentContainer').getWidth();
    var show = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent');
	var clear = obj.up('.tabModuleContainer').down('.tabContentHolder').children;
    var holder = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent').down('.tabHolder');
	var currentPosition = holder.getStyle('right') == null ? "0" : holder.getStyle('right').sub('px', '');
	
	for (i=0; i<clear.length; i++) 
    	clear.item(i).style.visibility='hidden' 

	show.style.visibility='visible'
	
	if (currentPosition == "0") {
		if (pages <= 1) {
			document.getElementById('nextTab').className='disable'; 
			document.getElementById('prevTab').className='disable'; 
		} else {
			document.getElementById('nextTab').className=''; 
			document.getElementById('prevTab').className='disable'; 
		}
	} else {
		if (((currentPosition / modSize) + 1) == (pages)) {
			document.getElementById('nextTab').className='disable'; 
			document.getElementById('prevTab').className=''; 
		} else if ((currentPosition / modSize) == 0) {
			document.getElementById('nextTab').className='';  
			document.getElementById('prevTab').className='disable'; 	
		} else {
			document.getElementById('nextTab').className='';  
			document.getElementById('prevTab').className=''; 	
		}
	}
}
	
function showNext(elm){
    var obj = $(elm);
	var pages = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent').select('.tabContent').size();
	var modSize = obj.up('.tabModuleContainer').down('.tabContentContainer').getWidth();
	var maxLength = modSize * (pages-1);
    var holder = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent').down('.tabHolder');
	var currentPosition = holder.getStyle('right') == null ? "0" : holder.getStyle('right').sub('px', '');
	var slide = modSize + parseInt(currentPosition);
	
	if (((currentPosition / modSize) + 1) >= (pages - 1)) {
		document.getElementById('nextTab').className='disable';  
		document.getElementById('prevTab').className='';  	
	} else {
		document.getElementById('nextTab').className='';  
		document.getElementById('prevTab').className='';  		
	}  
	
	if(slide <= maxLength){
		holder.setStyle({right: slide + 'px'});
	}
}

function showPrevious(elm){
    var obj = $(elm);
	var pages = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent').select('.tabContent').size();	
	var modSize = obj.up('.tabModuleContainer').down('.tabContentContainer').getWidth();
    var holder = obj.up('.tabModuleContainer').down('.' + currentContent + 'TabContent').down('.tabHolder');
	var currentPosition = holder.getStyle('right') == null ? "0" : holder.getStyle('right').sub('px', '');
	var slide = Math.abs(modSize - parseInt(currentPosition));
	
	if ((currentPosition / modSize) <= 1) {
		document.getElementById('nextTab').className='';  
		document.getElementById('prevTab').className='disable'; 	
	} else {
		document.getElementById('nextTab').className='';  
		document.getElementById('prevTab').className='';  
	}  
	
	if(currentPosition != '0'){
		holder.setStyle({right: slide + 'px'});
	}
}
(function() {

	// Dan Krecichwost

	var window = this,
	doc = window.document,
	undefined,
	health,
	utils,
	tabs,
	tabsConfig;

	window.health = health = window.health || {};

	/* UTILS */

	health.utils = utils = {

		replaceHtml : function(el, html) {

			// Steven Levithan, http://blog.stevenlevithan.com/archives/faster-than-innerhtml

			var oldEl = typeof el === "string" ? doc.getElementById(el) : el;

			/*@cc_on // Pure innerHTML is slightly faster in IE
				oldEl.innerHTML = html;
				return oldEl;
			@*/

			var newEl = oldEl.cloneNode(false);
			newEl.innerHTML = html;
			oldEl.parentNode.replaceChild(newEl, oldEl);
			return newEl;
		},
		
		applyAttributes : function(parent, objects, attributes) {
			var x, i, l = objects.length;
			for (x in attributes) {
				for (i = 1; i <= l; i++) {
					objects[i-1][x] = attributes[x](parent, i);
				}
			}
		},
		
		isFunction : function(func) {
			return typeof func == 'function';
		}
	};


/* TABS */

	health.tabs = tabs = function tabs(tabsetName, tabsetConfiguration) {
		
		var t = this,
		tabset = t.tabset = tabsetConfiguration || (tabset = tabs.config[tabsetName]) ? tabset() : null,
		defaultConfig = tabsConfig.__defaultConfig(),
		x;
		
		if (!(tabset && tabset.panel)) {
			return false;
		}
		
		for (x in tabset) {
			t[x] = tabset[x];
		}

		var panel = t.panel,
		tab = t.tab,
		startIndex = t.index = t.startIndex || defaultConfig.startIndex;

		t.tabsetName = tabsetName;
		t.collection[tabsetName] = t;
		
		function buildCollection(object) {
			if (object) {
				object.collection = object.collection || $$(object.selector);
				object.current = object.collection[startIndex-1];
				if (object.events) {
					utils.applyAttributes(t, object.collection, object.events);
				}
			}
		}
		
		buildCollection(panel);
		buildCollection(tab);

		for (x in defaultConfig) {
			if (!t[x]) {
				t[x] = utils.isFunction(defaultConfig[x]) ? defaultConfig[x](t) : defaultConfig[x];
			}
		}

		if (t.autoStart) {
			t.startRotation();
		}
	};
	
	tabs.collection = tabs.prototype.collection = {};

	tabs.prototype.rotate = function(t, index, instant) {
	
		if (!t) {
			t = this;
		}
		
		t.index = index || (t.index % t.indexTotal + 1);
		
		if (t.tab) {
			t.switchTab();
		}

		if (t.panel) {
			if (instant) {
				t.switchPanelInstant();
			} else {
				t.switchPanel();
			}
		}
	};

	tabs.prototype.startRotation = function() {

		var t = this,
		callback = t.rotate;

		/*@cc_on
			callback = function(t) {
				return function() {
					t.rotate();
				};
			}(t);
		@*/

		t.timeout = window.setInterval(callback, t.interval, t, null, null);

		t = callback = null;
	};

	tabs.prototype.stopRotation = function() {

		if (this.timeout) {
			window.clearInterval(this.timeout);
			this.timeout = null;
		}
	};
	
	tabs.prototype.switchTab = function(t) {
		
		t = t || this;
		var tab = t.tab,
		indexTab = tab.collection[t.index-1],
		currentTab = tab.current;
		
		if (indexTab && currentTab && currentTab != indexTab) {

			$(currentTab).removeClassName(tab.selectedClass);
			$(indexTab).addClassName(tab.selectedClass);

			tab.current = indexTab;
		}
		t = indexTab = currentTab = null;
	};
	
	tabs.prototype.switchPanel = function(t) {
		
		t = t || this;
		var panel = t.panel,
		indexPanel = panel.collection[t.index-1],
		currentPanel = panel.current;

		if (indexPanel && currentPanel && currentPanel != indexPanel) {

			$(currentPanel).removeClassName(panel.selectedClass);
			$(indexPanel).addClassName(panel.selectedClass);

			window.Effect[t.effect](indexPanel, { duration: t.effectDuration / 1000 });
			currentPanel.style.display = 'block';

			if (panel.timeout) {
				window.clearTimeout(panel.timeout);
			}

			panel.timeout = window.setTimeout(function() { currentPanel.style.display = 'none'; panel.timeout = currentPanel = null; }, t.effectDuration + 100);

			panel.current = indexPanel;
		}
		t = indexPanel = null;
	};
	
	tabs.prototype.switchPanelInstant = function(t) {

		t = t || this;
		var panel = t.panel,
		indexPanel = panel.collection[t.index-1],
		currentPanel = panel.current;

		if (indexPanel && currentPanel && currentPanel != indexPanel) {

			$(currentPanel).removeClassName(panel.selectedClass);
			$(indexPanel).addClassName(panel.selectedClass);

			currentPanel.style.display = 'none';
			panel.collection[t.index-1].style.display = 'block';
			
			panel.current = indexPanel;
		}
		t = indexPanel = currentPanel = null;
	};
	
	// configurations prefixed with a double underscore are not meant to be used as arguments to the tabs constructor
	tabs.config = tabsConfig = {

		__defaultConfig : function() {

			return {
				startIndex : 1,
				indexTotal : function(t) { 
					return t.panel.collection.length;
				},
				interval : 5000,
				autoStart : false,
				effect : 'Appear',
				effectDuration : 1000
			};
		},

		scrollTabs : function() {

			return {
				panel : {
					selector : '#hlt-scrollTabs-area > ul',
					selectedClass : 'hlt-scrollTabs-panel-selected'
				},
				tab : {
					selector : '#hlt-scrollTabs-nav > li',
					selectedClass : 'hlt-scrollTabs-nav-selected',
					events : {
						onclick : function(t, i) {
							return function() { 
								t.rotate(t, i, false);
								return false;
							};
						}
					}
				},
				autoStart : false,
				effect : 'Appear',
				effectDuration : 300
			};
		},

		leadContent : function() {

			return {
				panel : {
					selector : '#hlt-leadContent-imgArea > li',
					selectedClass : 'hlt-leadContent-img-selected'
				},
				tab : {
					selector : '#hlt-leadContent-nav-ul > li',
					selectedClass : 'hlt-leadContent-nav-selected',
					events : {
						onclick : function(t, i) {
							return function() {
								t.stopRotation();
								t.rotate(t, i, true);
								return false;
							};
						}
					}
				},
				interval : 12000,
				autoStart : true,
				effect : 'Appear',
				effectDuration : 1000
			};
		},

		newsRotator : function() {

			return {
				panel : {
					selector : '#hlt-newsRotator-list > li',
					selectedClass : 'hlt-newsRotator-item-selected'
				},
				interval : 5000,
				autoStart : true,
				effect : 'Appear',
				effectDuration : 1000
			};
		},

		__azIndex : function(type) {

			function displayResults(panel, letter) {
				new window.Ajax.Request("/encyclo-results.front?index=" + letter + "&type=" + type, {
					method : 'get',
					onCreate : function(transport){
						panel.innerHTML = '<div class="loading-image"><img src="/common/images/loading.gif"></div>';
					},
					onSuccess : function(transport){
						panel.innerHTML = transport.responseText;
					}
				});
			};

			return {
				panel : {
					selector : '#hlt-enc-results'
				},
				tab : {
					selector : '#hlt-enc-letters > a',
					events : {
						onclick : function(t, i) {
							return function() {
								displayResults(t.panel.current, String.fromCharCode(96 + i));
								return false;
							};
						}
					}
				},
				interval : 5000,
				autoStart : true,
				effect : 'Appear',
				effectDuration : 1000,
				startRotation : function() {
	
					var indexParam = gup('index');
					if (indexParam) {
						displayResults(this.panel.current, indexParam);
					}
				}
			};
		},
		
		azIndex1 : function() {
			return tabsConfig.__azIndex(1);
		},
		
		azIndex2 : function() {
			return tabsConfig.__azIndex(2);
		}
	}
})();
function initRotater(elm, delay, bullets){
    var obj = $(elm);
    setTimeout(function() { runRotater(obj, delay); }, delay*1000);
    if(bullets == 'yes'){
        setTimeout(function() { runRotaterBullets(obj, delay); }, delay*1000);
    }
}
function runRotater(elm, delay) {
    var obj = $(elm);
    
    var current = obj.down('.rotatingHeadlines').down('.active');
    var next = current.next() != null ? next = current.next() : next = obj.down('.rotatingHeadlines').down();
    
    Effect.Fade(current, {duration: 0.25});
    current.setStyle({display: 'none'});
    current.removeClassName('active');
    Effect.Appear(next, {duration: 0.25});
    next.addClassName('active');
    next.setStyle({display: 'block'});
    setTimeout(function() { runRotater(obj, delay); }, delay*1000);
}
function runRotaterBullets(elm, delay) {
    var obj = $(elm);
    
    var currentBullet = obj.down('.rotatingHeadlinesBullets').down('.active');
    var nextBullet = currentBullet.next() != null ? nextBullet = currentBullet.next() : nextBullet = obj.down('.rotatingHeadlinesBullets').down();
    
    currentBullet.removeClassName('active');
    nextBullet.addClassName('active');
    setTimeout(function() { runRotaterBullets(obj, delay); }, delay*1000);
}
function rh_jump(index, elm){
    var obj = $(elm);
    var i = 1;
    obj.select('.rotatingHeadlines li').each(
        function(tab){
        if(i == index){
            tab.addClassName('active');
            tab.setStyle({display: 'block'});
        } else {
            tab.removeClassName('active');
            tab.setStyle({display: 'none'});
        }
        i++;
    });
    i = 1;
    obj.select('.rotatingHeadlinesBullets li').each(
        function(tab){
        if(i == index){
            tab.addClassName('active');
        } else {
            tab.removeClassName('active');
        }
        i++;
    });
}

}
/*
     FILE ARCHIVED ON 20:06:12 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:57 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.364
  exclusion.robots: 0.07
  exclusion.robots.policy: 0.041
  esindex: 0.019
  cdx.remote: 15.631
  LoadShardBlock: 511.572 (3)
  PetaboxLoader3.datanode: 516.131 (5)
  PetaboxLoader3.resolve: 173.588 (3)
  load_resource: 208.346 (2)
*/