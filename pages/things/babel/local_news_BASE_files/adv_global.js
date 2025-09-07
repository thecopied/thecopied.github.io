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

// ------- Plugins ---------

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Version 2.1.3-pre
*/

(function($){
$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
    s = $.extend({
        top : 'auto', // auto == .currentStyle.borderTopWidth
        left : 'auto', // auto == .currentStyle.borderLeftWidth
        width : 'auto', // auto == offsetWidth
        height : 'auto', // auto == offsetHeight
        opacity : true,
        src : 'javascript:false;'
    }, s);
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';
    return this.each(function() {
        if ( $(this).children('iframe.bgiframe').length === 0 )
            this.insertBefore( document.createElement(html), this.firstChild );
    });
} : function() { return this; });
// old alias
$.fn.bgIframe = $.fn.bgiframe;
function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}
})(jQuery);

/*
 * jQuery Tools 1.2.5 - The missing UI library for the Web
 * 
 * [overlay, dateinput, toolbox.expose]
 * 
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 * 
 * http://flowplayer.org/tools/
 * 
 * File generated: Tue Oct 12 18:36:21 GMT 2010
 */
(function(a){function t(d,b){var c=this,j=d.add(c),o=a(window),k,f,m,g=a.tools.expose&&(b.mask||b.expose),n=Math.random().toString().slice(10);if(g){if(typeof g=="string")g={color:g};g.closeOnClick=g.closeOnEsc=false}var p=b.target||d.attr("rel");f=p?a(p):d;if(!f.length)throw"Could not find Overlay: "+p;d&&d.index(f)==-1&&d.click(function(e){c.load(e);return e.preventDefault()});a.extend(c,{load:function(e){if(c.isOpened())return c;var h=q[b.effect];if(!h)throw'Overlay: cannot find effect : "'+b.effect+
'"';b.oneInstance&&a.each(s,function(){this.close(e)});e=e||a.Event();e.type="onBeforeLoad";j.trigger(e);if(e.isDefaultPrevented())return c;m=true;jq_tools_overlay_open=true;g&&a(f).expose(g);var i=b.top,r=b.left,u=f.outerWidth({margin:true}),v=f.outerHeight({margin:true});if(typeof i=="string")i=i=="center"?Math.max((o.height()-v)/2,0):parseInt(i,10)/100*o.height();if(r=="center")r=Math.max((o.width()-u)/2,0);h[0].call(c,{top:i,left:r},function(){if(m){e.type="onLoad";j.trigger(e)}});g&&b.closeOnClick&&a.mask.getMask().one("click",
c.close);b.closeOnClick&&a(document).bind("click."+n,function(l){a(l.target).parents(f).length||c.close(l)});b.closeOnEsc&&a(document).bind("keydown."+n,function(l){l.keyCode==27&&c.close(l)});return c},close:function(e){if(!c.isOpened())return c;e=e||a.Event();e.type="onBeforeClose";j.trigger(e);if(!e.isDefaultPrevented()){m=false;jq_tools_overlay_open=false;q[b.effect][1].call(c,function(){e.type="onClose";j.trigger(e)});a(document).unbind("click."+n).unbind("keydown."+n);g&&a.mask.close();return c}},getOverlay:function(){return f},
getTrigger:function(){return d},getClosers:function(){return k},isOpened:function(){return m},getConf:function(){return b}});a.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","),function(e,h){a.isFunction(b[h])&&a(c).bind(h,b[h]);c[h]=function(i){i&&a(c).bind(h,i);return c}});k=f.find(b.close||".close");if(!k.length&&!b.close){k=a('<a class="close"></a>');f.prepend(k)}k.click(function(e){c.close(e)});b.load&&c.load()}a.tools=a.tools||{version:"1.2.5"};a.tools.overlay={addEffect:function(d,
b,c){q[d]=[b,c]},conf:{close:null,closeOnClick:true,closeOnEsc:true,closeSpeed:"fast",effect:"default",fixed:!a.browser.msie||a.browser.version>6,left:"center",load:false,mask:null,oneInstance:true,speed:"normal",target:null,top:"10%"}};var s=[],q={};a.tools.overlay.addEffect("default",function(d,b){var c=this.getConf(),j=a(window);if(!c.fixed){d.top+=j.scrollTop();d.left+=j.scrollLeft()}d.position=c.fixed?"fixed":"absolute";this.getOverlay().css(d).fadeIn(c.speed,b)},function(d){this.getOverlay().fadeOut(this.getConf().closeSpeed,
d)});a.fn.overlay=function(d){var b=this.data("overlay");if(b)return b;if(a.isFunction(d))d={onBeforeLoad:d};d=a.extend(true,{},a.tools.overlay.conf,d);this.each(function(){b=new t(a(this),d);s.push(b);a(this).data("overlay",b)});return d.api?b:this}})(jQuery);
(function(d){function R(a,c){return 32-(new Date(a,c,32)).getDate()}function S(a,c){a=""+a;for(c=c||2;a.length<c;)a="0"+a;return a}function T(a,c,j){var q=a.getDate(),h=a.getDay(),r=a.getMonth();a=a.getFullYear();var f={d:q,dd:S(q),ddd:B[j].shortDays[h],dddd:B[j].days[h],m:r+1,mm:S(r+1),mmm:B[j].shortMonths[r],mmmm:B[j].months[r],yy:String(a).slice(2),yyyy:a};c=c.replace(X,function(s){return s in f?f[s]:s.slice(1,s.length-1)});return Y.html(c).html()}function v(a){return parseInt(a,10)}function U(a,
c){return a.getFullYear()===c.getFullYear()&&a.getMonth()==c.getMonth()&&a.getDate()==c.getDate()}function C(a){if(a){if(a.constructor==Date)return a;if(typeof a=="string"){var c=a.split("-");if(c.length==3)return new Date(v(c[0]),v(c[1])-1,v(c[2]));if(!/^-?\d+$/.test(a))return;a=v(a)}c=new Date;c.setDate(c.getDate()+a);return c}}function Z(a,c){function j(b,e,g){n=b;D=b.getFullYear();E=b.getMonth();G=b.getDate();g=g||d.Event("api");g.type="change";H.trigger(g,[b]);if(!g.isDefaultPrevented()){a.val(T(b,
e.format,e.lang));a.data("date",b);h.hide(g)}}function q(b){b.type="onShow";H.trigger(b);d(document).bind("keydown.d",function(e){if(e.ctrlKey)return true;var g=e.keyCode;if(g==8){a.val("");return h.hide(e)}if(g==27)return h.hide(e);if(d(V).index(g)>=0){if(!w){h.show(e);return e.preventDefault()}var i=d("#"+f.weeks+" a"),t=d("."+f.focus),o=i.index(t);t.removeClass(f.focus);if(g==74||g==40)o+=7;else if(g==75||g==38)o-=7;else if(g==76||g==39)o+=1;else if(g==72||g==37)o-=1;if(o>41){h.addMonth();t=d("#"+
f.weeks+" a:eq("+(o-42)+")")}else if(o<0){h.addMonth(-1);t=d("#"+f.weeks+" a:eq("+(o+42)+")")}else t=i.eq(o);t.addClass(f.focus);return e.preventDefault()}if(g==34)return h.addMonth();if(g==33)return h.addMonth(-1);if(g==36)return h.today();if(g==13)d(e.target).is("select")||d("."+f.focus).click();return d([16,17,18,9]).index(g)>=0});d(document).bind("click.d",function(e){var g=e.target;if(!d(g).parents("#"+f.root).length&&g!=a[0]&&(!L||g!=L[0]))h.hide(e)})}var h=this,r=new Date,f=c.css,s=B[c.lang],
k=d("#"+f.root),M=k.find("#"+f.title),L,I,J,D,E,G,n=a.attr("data-value")||c.value||a.val(),m=a.attr("min")||c.min,p=a.attr("max")||c.max,w;if(m===0)m="0";n=C(n)||r;m=C(m||c.yearRange[0]*365);p=C(p||c.yearRange[1]*365);if(!s)throw"Dateinput: invalid language: "+c.lang;if(a.attr("type")=="date"){var N=d("<input/>");d.each("class,disabled,id,maxlength,name,readonly,required,size,style,tabindex,title,value".split(","),function(b,e){N.attr(e,a.attr(e))});a.replaceWith(N);a=N}a.addClass(f.input);var H=
a.add(h);if(!k.length){k=d("<div><div><a/><div/><a/></div><div><div/><div/></div></div>").hide().css({position:"absolute"}).attr("id",f.root);k.children().eq(0).attr("id",f.head).end().eq(1).attr("id",f.body).children().eq(0).attr("id",f.days).end().eq(1).attr("id",f.weeks).end().end().end().find("a").eq(0).attr("id",f.prev).end().eq(1).attr("id",f.next);M=k.find("#"+f.head).find("div").attr("id",f.title);if(c.selectors){var z=d("<select/>").attr("id",f.month),A=d("<select/>").attr("id",f.year);M.html(z.add(A))}for(var $=
k.find("#"+f.days),O=0;O<7;O++)$.append(d("<span/>").text(s.shortDays[(O+c.firstDay)%7]));d("body").append(k)}if(c.trigger)L=d("<a/>").attr("href","#").addClass(f.trigger).click(function(b){h.show();return b.preventDefault()}).insertAfter(a);var K=k.find("#"+f.weeks);A=k.find("#"+f.year);z=k.find("#"+f.month);d.extend(h,{show:function(b){if(!(a.attr("readonly")||a.attr("disabled")||w)){b=b||d.Event();b.type="onBeforeShow";H.trigger(b);if(!b.isDefaultPrevented()){d.each(W,function(){this.hide()});
w=true;z.unbind("change").change(function(){h.setValue(A.val(),d(this).val())});A.unbind("change").change(function(){h.setValue(d(this).val(),z.val())});I=k.find("#"+f.prev).unbind("click").click(function(){I.hasClass(f.disabled)||h.addMonth(-1);return false});J=k.find("#"+f.next).unbind("click").click(function(){J.hasClass(f.disabled)||h.addMonth();return false});h.setValue(n);var e=a.offset();if(/iPad/i.test(navigator.userAgent))e.top-=d(window).scrollTop();k.css({top:e.top+a.outerHeight({margins:true})+
c.offset[0],left:e.left+c.offset[1]});if(c.speed)k.show(c.speed,function(){q(b)});else{k.show();q(b)}return h}}},setValue:function(b,e,g){var i=v(e)>=-1?new Date(v(b),v(e),v(g||1)):b||n;if(i<m)i=m;else if(i>p)i=p;b=i.getFullYear();e=i.getMonth();g=i.getDate();if(e==-1){e=11;b--}else if(e==12){e=0;b++}if(!w){j(i,c);return h}E=e;D=b;g=new Date(b,e,1-c.firstDay);g=g.getDay();var t=R(b,e),o=R(b,e-1),P;if(c.selectors){z.empty();d.each(s.months,function(x,F){m<new Date(b,x+1,-1)&&p>new Date(b,x,0)&&z.append(d("<option/>").html(F).attr("value",
x))});A.empty();i=r.getFullYear();for(var l=i+c.yearRange[0];l<i+c.yearRange[1];l++)m<=new Date(l+1,-1,1)&&p>new Date(l,0,0)&&A.append(d("<option/>").text(l));z.val(e);A.val(b)}else M.html(s.months[e]+" "+b);K.empty();I.add(J).removeClass(f.disabled);l=!g?-7:0;for(var u,y;l<(!g?35:42);l++){u=d("<a/>");if(l%7===0){P=d("<div/>").addClass(f.week);K.append(P)}if(l<g){u.addClass(f.off);y=o-g+l+1;i=new Date(b,e-1,y)}else if(l>=g+t){u.addClass(f.off);y=l-t-g+1;i=new Date(b,e+1,y)}else{y=l-g+1;i=new Date(b,
e,y);if(U(n,i))u.attr("id",f.current).addClass(f.focus);else U(r,i)&&u.attr("id",f.today)}m&&i<m&&u.add(I).addClass(f.disabled);p&&i>p&&u.add(J).addClass(f.disabled);jQuery('a#calnext').removeClass();u.attr("href","#"+y).text(y).data("date",i);P.append(u)}K.find("a").click(function(x){var F=d(this);if(!F.hasClass(f.disabled)){d("#"+f.current).removeAttr("id");F.attr("id",f.current);j(F.data("date"),c,x)}return false});f.sunday&&K.find(f.week).each(function(){var x=c.firstDay?7-c.firstDay:0;d(this).children().slice(x,x+1).addClass(f.sunday)});
return h},setMin:function(b,e){m=C(b);e&&n<m&&h.setValue(m);return h},setMax:function(b,e){p=C(b);e&&n>p&&h.setValue(p);return h},today:function(){return h.setValue(r)},addDay:function(b){return this.setValue(D,E,G+(b||1))},addMonth:function(b){return this.setValue(D,E+(b||1),G)},addYear:function(b){return this.setValue(D+(b||1),E,G)},hide:function(b){if(w){b=d.Event();b.type="onHide";H.trigger(b);d(document).unbind("click.d").unbind("keydown.d");if(b.isDefaultPrevented())return;k.hide();w=false}return h},
getConf:function(){return c},getInput:function(){return a},getCalendar:function(){return k},getValue:function(b){return b?T(n,b,c.lang):n},isOpen:function(){return w}});d.each(["onBeforeShow","onShow","change","onHide"],function(b,e){d.isFunction(c[e])&&d(h).bind(e,c[e]);h[e]=function(g){g&&d(h).bind(e,g);return h}});a.bind("focus click",h.show).keydown(function(b){var e=b.keyCode;if(!w&&d(V).index(e)>=0){h.show(b);return b.preventDefault()}return b.shiftKey||b.ctrlKey||b.altKey||e==9?true:b.preventDefault()});
C(a.val())&&j(n,c)}d.tools=d.tools||{version:"1.2.5"};var W=[],Q,V=[75,76,38,39,74,72,40,37],B={};Q=d.tools.dateinput={conf:{format:"mm/dd/yy",selectors:false,yearRange:[-5,5],lang:"en",offset:[0,0],speed:0,firstDay:0,min:undefined,max:undefined,trigger:false,css:{prefix:"cal",input:"date",root:0,head:0,title:0,prev:0,next:0,month:0,year:0,days:0,body:0,weeks:0,today:0,current:0,week:0,off:0,sunday:0,focus:0,disabled:0,trigger:0}},localize:function(a,c){d.each(c,function(j,q){c[j]=q.split(",")});
B[a]=c}};Q.localize("en",{months:"January,February,March,April,May,June,July,August,September,October,November,December",shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",days:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",shortDays:"Sun,Mon,Tue,Wed,Thu,Fri,Sat"});var X=/d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*'/g,Y=d("<a/>");d.expr[":"].date=function(a){var c=a.getAttribute("type");return c&&c=="date"||!!d(a).data("dateinput")};d.fn.dateinput=function(a){if(this.data("dateinput"))return this;
a=d.extend(true,{},Q.conf,a);d.each(a.css,function(j,q){if(!q&&j!="prefix")a.css[j]=(a.css.prefix||"")+(q||j)});var c;this.each(function(){var j=new Z(d(this),a);W.push(j);j=j.getInput().data("dateinput",j);c=c?c.add(j):j});return c?c:this}})(jQuery);
(function(b){function k(){if(b.browser.msie){var a=b(document).height(),d=b(window).height();return[window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,a-d<20?d:a]}return[b(document).width(),b(document).height()]}function h(a){if(a)return a.call(b.mask)}b.tools=b.tools||{version:"1.2.5"};var l;l=b.tools.expose={conf:{maskId:"exposeMask",loadSpeed:"slow",closeSpeed:"fast",closeOnClick:true,closeOnEsc:true,zIndex:9998,opacity:0.8,startOpacity:0,color:"#fff",onLoad:null,
onClose:null}};var c,i,e,g,j;b.mask={load:function(a,d){if(e)return this;if(typeof a=="string")a={color:a};a=a||g;g=a=b.extend(b.extend({},l.conf),a);c=b("#"+a.maskId);if(!c.length){c=b("<div/>").attr("id",a.maskId);b("body").append(c)}var m=k();c.css({position:"absolute",top:0,left:0,width:m[0],height:m[1],display:"none",opacity:a.startOpacity,zIndex:a.zIndex});a.color&&c.css("backgroundColor",a.color);if(h(a.onBeforeLoad)===false)return this;a.closeOnEsc&&b(document).bind("keydown.mask",function(f){f.keyCode==
27&&b.mask.close(f)});a.closeOnClick&&c.bind("click.mask",function(f){b.mask.close(f)});b(window).bind("resize.mask",function(){b.mask.fit()});if(d&&d.length){j=d.eq(0).css("zIndex");b.each(d,function(){var f=b(this);/relative|absolute|fixed/i.test(f.css("position"))||f.css("position","relative")});i=d.css({zIndex:Math.max(a.zIndex+1,j=="auto"?0:j)})}c.css({display:"block"}).fadeTo(a.loadSpeed,a.opacity,function(){b.mask.fit();h(a.onLoad);e="full"});e=true;return this},close:function(){if(e){if(h(g.onBeforeClose)===
false)return this;c.fadeOut(g.closeSpeed,function(){h(g.onClose);i&&i.css({zIndex:j});e=false});b(document).unbind("keydown.mask");c.unbind("click.mask");b(window).unbind("resize.mask")}return this},fit:function(){if(e){var a=k();c.css({width:a[0],height:a[1]})}},getMask:function(){return c},isLoaded:function(a){return a?e=="full":e},getConf:function(){return g},getExposed:function(){return i}};b.fn.mask=function(a){b.mask.load(a);return this};b.fn.expose=function(a){b.mask.load(a,this);return this}})(jQuery);


//Calendar Initializer/system date generator


var advSearchCal = function($){
    var calArray = new Array(),
    initCal = function(obj, handle, leftOffset){
		if(!leftOffset || leftOffset == null){
		    leftOffset = 0;
		}
		var today=advSearch.dateFmtCal(new Date());
		if(!handle || handle == null){
			$(obj).dateinput({
	        	format: 'mm/dd/yyyy',
	        	min: '1985-01-01',
				max: today,
				offset: [0, leftOffset]
	        });
		}else{
			calArray[handle] = jQuery(obj).dateinput({
	        	format: 'mm/dd/yyyy',
	        	min: '1985-01-01',
				max: today,
				offset: [0, leftOffset]
	        });
		}
    };
    return{
        initCal: initCal,
        calArray: calArray
    }
}(jQuery);

// ------- ADV Search Code ---------

//Jquery tools overlay open/close flag mod
var jq_tools_overlay_open,
    adv_search_modal_link;
//jQuery onReady Function
jQuery(function(){
    advSearch.init();
});
// ADS Object
var advSearch = function($){
    //Private properties/methods
    var search,
        search_input,
        search_pos,
      	search_overlay,
        search_overlay_input,
        adv_search,
        adv_search_input,
        relocated = false,
        radioParentLis,
    //Initialize functionality
    init = function(){
        search = $('#basicsearch');
        search_input = search.find('#searchText');
        search_overlay = search.next();
        adv_search = search_overlay.next();
        
        search_overlay_input = search_overlay.find('input[type=text]').eq(0);
        //default search input events
        search_input.focus(search_focus).click(search_focus);
        //default search submit events
        search.find('input[type=submit]').click(search_focus);
        
        search_pos = search.offset();
        search_overlay.find('#adv_search_open').click(openAdvSearch);
        adv_search.find('input[type=radio]').click(ads_radio_click);
        
        //adjust search pos on resize
        $(window).resize(function() {
          search_pos = search.offset();
        });
        
        //reset search_overlay/adv_search forms
        search_overlay.add(adv_search).find('input[type=text]').val('');
        var date_range_pre =  adv_search.find('#date_range_predefined');
        date_range_pre.find('option').eq(1).attr('selected', 'selected');
        date_range_pre.removeClass('disabled').attr('disabled', '');
        
        adv_search.find('#top_date_range_pre').attr('checked', 'checked');
        
        //initalize calendars
        advSetDateRange('top');
        advSearchCal.initCal('#date_range_custom_from');
        advSearchCal.initCal('#date_range_custom_to', null, -108);
        
        //Store radios parents to reduce lookup on event attachment to come
        radioParentLis = adv_search.find('ul').find('li.fixed_date, li.custom_date');
        
        //Append ADV Search layer
        $('body').append(search_overlay).append(adv_search);
        //Append BG Iframe to widgets for IE z-indexing issues
        search_overlay.add(adv_search).bgiframe();
        //Close layers on any clicks on the page
        $(document).click(function(e){
            if(!$(e.target).parents('#basicsearch,#search_overlay,#adv_search,#calroot').length){
                if($(e.target).attr('rel') != '#adv_search'){
                    $('#search_overlay,#adv_search,#cal_root').hide();
                    search.css('visibility', 'visible');
                }
            }
        });
        //Provide focus to ADS main input
        search_overlay_input.focus();
        
        //Widget close button
        adv_search.find('#adv_search_close').click(close_adv_search);
        
        //Date range toggle
        $('#top_date_range_pre').click(function(){
            $('#top_date_range_cust_div').hide("fast");
            $('#top_date_range_pre_div').show("fast");
        });
        $('#top_date_range_cust').click(function(){
            $('#top_date_range_pre_div').hide("fast");
            $('#top_date_range_cust_div').show("fast");
        });
    },
    //On focus of default search input, hide default search and display ADS
    search_focus = function(){
    	if(typeof $._spiderModalOpen === 'undefined')
    		$._spiderModalOpen = false;
    	else if($._spiderModalOpen)
    		return false;
    	
        if(search_input.val() == "Search" || search_input.val() == "" ){
            var field = $(this);
            search.css('visibility', 'hidden');
            if(search_overlay.next().length){
            	//Inject the ADS bar at the end of the DOM to ensure it 
            	//appears above any 3rd party ads injected above it.
            	$('body').append(search_overlay); 
            }
            //Show ADS, the trans layer and focus on input
            search_overlay.css({top: search_pos.top, left: search_pos.left-290}).show();
            search_overlay_input.focus();
            
            return false;
        }
        
        return true;
    },
    //Open ADV Search widget and close search overlay
    openAdvSearch = function(){
       	search_overlay.hide();
       	adv_search.css({top: search_pos.top, left: search_pos.left-290, position: 'absolute'}).show();
        return false;
    },
    //Toggle disabled states of date selection methods
    ads_radio_click = function(){
        var radio = $(this);
        radioParentLis.find('input[type=text], select').addClass('disabled').attr('disabled', 'disabled');
        radio.parent().parent().find('input[type=text], select').removeClass('disabled').removeAttr('disabled');
    },
    //Close ADS search module and restore default search form
    close_adv_search = function(){
        if(jq_tools_overlay_open){
          adv_search_modal_link.overlay().close();
        }
        adv_search.add('#calroot').hide();
        search.css('visibility', 'visible');
        return false;
    },
    checkAdvForm = function(){
		function trim(s) {
			s = s.replace(/(^\s*)|(\s*$)/gi,"");
			s = s.replace(/[ ]{2,}/gi," ");
			s = s.replace(/\n /,"\n");
			return s;
		}
        var adv_search_action="",
            adv_terms="",
            adv_terms_all=trim($("#include_all").attr("value")),
            adv_terms_any=trim($("#include_any").attr("value")),
            adv_terms_exact=trim($("#include_exact").attr("value")),
            adv_terms_not=trim($("#exclude").attr("value"));
        //string together
        if (adv_terms_not!="") {
            adv_terms_not_array=adv_terms_not.split(" ");
            var adv_not_str="";
            for (var i=0;i<adv_terms_not_array.length;i++){
                adv_not_str+="not "+adv_terms_not_array[i]+" ";
            }
            adv_terms+=adv_not_str;
        }
        if (adv_terms_exact!="")
            adv_terms+='"'+adv_terms_exact+'" ';
        if (adv_terms_all!="")
            adv_terms+=adv_terms_all;
        if (adv_terms_any!="") {
            adv_terms_any_array=adv_terms_any.split(" ");
            var adv_terms_any_str="";
            for (var i=0;i<adv_terms_any_array.length;i++){
                if (adv_terms==""){
                    adv_terms_any_str+=adv_terms_any_array[i];
                }else{
                    adv_terms_any_str+=adv_terms_any_array[i]+" "+adv_terms;
                }
                if (i<adv_terms_any_array.length-1)
                    adv_terms_any_str+=" or ";
            }
            //done with the ors, now replace the main string
            adv_terms=adv_terms_any_str;
        }
        //date range
        var adv_date,    
            dateMode = $('#adv_search').find('input:radio[name=range]:checked').val();
        if (dateMode=="pre"){
            adv_date = $('#adv_search').find('#date_range_predefined').val();
        }else{
    		//make assumptions for blanks & correct date order
    		//similar routine in adv_results.js
    
            function convert(date){
                dd=date.substring(3,5);
                mm=date.substring(0,2);
                yyyy=date.substring(6);
                var newFormat=yyyy+mm+dd;
                return parseInt(newFormat);
            }
    
    		var from = $('#date_range_custom_from').attr("value"),
            to = $('#date_range_custom_to').attr("value");
            
    		//if a field is blank, make an assumption
    		if (to==""){
    			to=dateFmt(new Date());
    			$('#date_range_custom_to').attr("value",to);
    		}
    		if (from==""){
    			from="01/01/1985";
    			$('#date_range_custom_from').attr("value",from);
    		}
    		
    		var fromConv=convert(from),
            toConv=convert(to);
    		
    		if (fromConv>toConv){
    			adv_date=to+"-"+from;		
            }else if (fromConv<=toConv){
                adv_date=from+"-"+to;
            }		
        }
        
        $("#date").attr("value",adv_date);
        $("#Query").attr("value",adv_terms);
        
        var query_val = $("#Query").attr("value");
        
        var srchVal=trim(query_val);
        if(srchVal == "" || srchVal == "Search") {
        	alert("Please Enter a Search Term");
        	if(window.event)
        	    window.event.returnValue=false
        	return false;
        }
        
    },
    dateFmt = function(myDate){
        var tmpDate = new Date(myDate);
        todayMonth=tmpDate.getMonth()+1;
        todayMonth=(todayMonth<10)?'0'+todayMonth:todayMonth;
        todayDate=tmpDate.getDate();
        todayDate=(todayDate<10)?'0'+todayDate:todayDate;
        return todayMonth + '/' + todayDate + '/' + tmpDate.getFullYear();
    },
    dateFmtCal = function(date){
        dd=date.getDate();
        mm=date.getMonth()+1;
        yyyy=date.getFullYear();
        var newFormat=yyyy+"-"+mm+"-"+dd;
        return newFormat;
    },
    advSetDateRange = function(id){
        //populate those date range menus
        var todayPre=new Date(),
    		todayPost=dateFmt(todayPre),
    		today7=new Date(),
    		today30=new Date(),
    		today3=new Date(),
    		today365=new Date(),
    		since85=new Date(),
    		minus7=dateFmt(today7.setDate(today7.getDate()-7))+'-'+todayPost,
            minus30=dateFmt(today30.setDate(today30.getDate()-30))+'-'+todayPost,
            minus3mo=dateFmt(today3.setMonth(today3.getMonth()-3))+'-'+todayPost,
            minus365=dateFmt(today365.setDate(today365.getDate()-365))+'-'+todayPost,
            //since85str=dateFmt(since85.setFullYear(1985,0,1))+'-'+todayPost,
            topObj = $("#date_range_predefined option"),
            leftObj = $('#panel_date_range_predefined option');
        if (id=="top"){
            topObj.eq(0).attr('value',minus7);
            topObj.eq(1).attr('value',minus30);
            topObj.eq(2).attr('value',minus3mo);
            topObj.eq(3).attr('value',minus365);
            //topObj.eq(4).attr('value',since85str);
        } else if (id=="left"){
            leftObj.eq(0).attr('value',minus30);
            leftObj.eq(1).attr('value',minus7);
            leftObj.eq(2).attr('value',minus30);
            leftObj.eq(3).attr('value',minus3mo);
            leftObj.eq(4).attr('value',minus365);
            //leftObj.eq(5).attr('value',since85str);
        }
    };
    //Return public methods
    return{
        init:init,
        search_focus: search_focus,
        checkAdvForm: checkAdvForm,
        dateFmt: dateFmt,
        dateFmtCal: dateFmtCal,
        advSetDateRange: advSetDateRange
    }
}(jQuery);

}
/*
     FILE ARCHIVED ON 20:06:15 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:54 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.518
  exclusion.robots: 0.024
  exclusion.robots.policy: 0.015
  esindex: 0.008
  cdx.remote: 46.412
  LoadShardBlock: 100.406 (3)
  PetaboxLoader3.datanode: 199.181 (5)
  PetaboxLoader3.resolve: 793.227 (3)
  load_resource: 897.013 (2)
*/