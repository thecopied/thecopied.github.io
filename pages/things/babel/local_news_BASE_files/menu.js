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

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
};

function menuFix() {
	jQuery('ul#root').each(function(){
		jQuery(this).css({visibility:'visible'});
	});
	var hlink;
	var shlink;
	var holdsublink;
	var navExists = false
	var tempPath = readCookie("mainPage");
	if (!tempPath){
		tempPath = "/";
	}
    if (tempPath.length > 1){
    if (tempPath.substring(tempPath.length-1, tempPath.length) == "/")
        tempPath = tempPath.substring(0, tempPath.length-1);
	}
    var fullPath = tempPath;
	while (tempPath.length > 0 && navExists == false) {
		jQuery('#root li a.mainNav').each(function(){
        	hlink = jQuery(this).attr('href').split('#');
        	hlink = hlink[0].split('?');
        	hlink = hlink[0];
			if (hlink.length > 1){
				if (hlink.substring(hlink.length-1, hlink.length) == "/")
					hlink = hlink.substring(0, hlink.length-1);
			}
        	if(hlink == tempPath){
                jQuery(this).parent().addClass('highlight');
                if (jQuery(this).nextAll('ul')) {
                    jQuery(this).nextAll('ul').addClass('subStay');
                    navExists = true;
                    var arr = jQuery(this).next('ul').children();
                    arr.each(function(subLink){
                        jQuery(this).find('a').each(function(subLinkA){
							//shlink = jQuery(this).attr('href');
							shlink = jQuery(this).attr('href').split('#');
							shlink = shlink[0].split('?');
							shlink = shlink[0];
							if (shlink != null && shlink.length > 1){
								if (shlink.substring(shlink.length-1, shlink.length) == "/")
									shlink = shlink.substring(0, shlink.length-1);
								}
                            if(shlink == fullPath){
                                jQuery(this).parent().addClass('highlight');
                            }
                        });
                    });
                };
            }
		});
        tempPath = tempPath.substr(0,tempPath.lastIndexOf("/"));

	}
	if (navExists == false) {
		jQuery('#root li a.mainNav').each(function(){
	        //hlink = jQuery(this).attr('href');
	        hlink = jQuery(this).attr('href').split('#');
	        hlink = hlink[0].split('?');
	        hlink = hlink[0];
			if (hlink.length > 1){
				if (hlink.substring(hlink.length-1, hlink.length) == "/")
					hlink = hlink.substring(0, hlink.length-1);
			}
	        if(hlink == "/"){
                jQuery(this).parent().addClass('highlight');
                if (jQuery(this).nextAll('ul')) {
                    jQuery(this).nextAll('ul').addClass('subStay');
                    var arr = jQuery(this).next('ul').children();
                    arr.each(function(subLink){
                    	jQuery(this).find('a').each(function(subLinkA){
                        	holdsublink = jQuery(this).attr('href').split('#');
        					holdsublink = holdsublink[0].split('?');
        					holdsublink = holdsublink[0];
                              	//if(subLinkA.attr('href') == tempPath){
                              	if(holdsublink == tempPath){
                                subLinkA.parent().addClass('highlight');
                            }
                        });
                    });
                }
			}
	    });
		eraseCookie("mainPage");
		createCookie("mainPage","/","1");
	}
}

function tribHover() {
	var timeout = 600;
	var cssClass = "highlight";
	var thisPage = readCookie("mainPage");
	if (!thisPage){
		thisPage = "/";
	}

	var queue = [];
	var reCSS = new RegExp("\\b" + cssClass + "\\b");
	var tribEls = document.getElementById("root").getElementsByTagName("li");
	
	var holdlink = "";
	var holdsublink = "";

 	for (var i=0; i<tribEls.length; i++) {
	 	if(/subStay/.test(tribEls[i].parentNode.className))
	  	{

		} else {

		// mouseover and mouseout handlers for regular mouse based interface.
		tribEls[i].onmouseover = function() {
			queueFlush();
			this.className += " " + cssClass;
			jQuery('#root li a.mainNav').each(function(){
				holdlink = jQuery(this).attr('href').split('#');
				holdlink = holdlink[0].split('?');
				holdlink = holdlink[0];
				if (holdlink.length > 1){
					if (holdlink.substring(holdlink.length-1, holdlink.length) == "/")
						holdlink = holdlink.substring(0, holdlink.length-1);
				}
	        		
				if(holdlink == thisPage ){					
					//jQuery(this).parent().removeClass(cssClass);
					this.parentNode.className = this.parentNode.className.replace(reCSS,"");
				}
		    });
		}
		tribEls[i].onmouseout = function() {
			queue.push([setTimeout(queueTimeout, timeout), this]);
		}
		// focus and blur handlers for keyboard based navigation.
		tribEls[i].onfocus = function() {
			queueFlush();
			this.className += " " + cssClass;
		}
		tribEls[i].onblur = function() {
			queue.push([setTimeout(queueTimeout, timeout), this]);

			// click event handler needed for tablet type interfaces (e.g. Apple iPhone).
			tribEls[i].onclick = function(e) {
				if (this.className.search(reCSS) == -1) {
					// CSS not set, so clear all sibling (and decendants) menus, and then set CSS on this menu...
					var elems = this.parentNode.getElementsByTagName("li");
					for (var i=0; i<elems.length; i++) {
						elems[i].className = elems[i].className.replace(reCSS, "");
					}
					this.className += " " + cssClass;
				} else {
					// CSS already set, so clear all decendant menus and then this menu...
					var elems = this.getElementsByTagName("li");
					for (var i=0; i<elems.length; i++) {
						elems[i].className = elems[i].className.replace(reCSS, "");
					}
					this.className = this.className.replace(reCSS, "");
				}
				if (e && e.stopPropagation)
					e.stopPropagation();
				else
					window.event.cancelBubble = true;
			}
		}

		queueFlush = function () {
			while (queue.length) {
				clearTimeout(queue[0][0]);
				queueTimeout();
			}
		}

		queueTimeout = function() {
			if (queue.length) {
				var el = queue.shift()[1];
				el.className = el.className.replace(reCSS, "");
				jQuery('#root li a.mainNav').each(function(){
					holdlink = jQuery(this).attr('href').split('#');
					holdlink = holdlink[0].split('?');
        			holdlink = holdlink[0];
					if (holdlink.length > 1){
						if (holdlink.substring(holdlink.length-1, holdlink.length) == "/")
							holdlink = holdlink.substring(0, holdlink.length-1);
					}
			        //if(jQuery(this).attr('href') == thisPage){
					if(holdlink == thisPage){
						jQuery(this).parent().addClass(cssClass);
                        if (jQuery(this).next('ul')) {
                            var arr = jQuery(this).nextAll('ul').children();
                            arr.each(function(subLink){
                                jQuery(this).find('a').each(function(subLinkA){
                                	holdsublink = jQuery(this).attr('href').split('#');
        							holdsublink = holdsublink[0].split('?');
        							holdsublink = holdsublink[0];
									if (holdsublink.length > 1){
										if (holdsublink.substring(holdsublink.length-1, holdsublink.length) == "/")
											holdsublink = holdsublink.substring(0, holdsublink.length-1);
									}
                                	//if(subLinkA.attr('href') == thisPage){
                                	if(holdsublink == thisPage){
                                    	jQuery(this).parent().addClass(cssClass);
                                    }
                                });
                            });
                        }
					}
			    });
			}
		}
	}
}
}




}
/*
     FILE ARCHIVED ON 20:06:14 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:58 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.59
  exclusion.robots: 0.025
  exclusion.robots.policy: 0.015
  esindex: 0.01
  cdx.remote: 21.603
  LoadShardBlock: 291.524 (6)
  PetaboxLoader3.datanode: 279.99 (7)
  PetaboxLoader3.resolve: 132.867 (2)
  load_resource: 137.391
*/