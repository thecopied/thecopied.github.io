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

Sound={tracks:{},_enabled:true,template:new Template('<embed style="height:0" id="sound_#{track}_#{id}" src="#{url}" loop="false" autostart="true" hidden="true"/>'),enable:function(){Sound._enabled=true;},disable:function(){Sound._enabled=false;},play:function(url){if(!Sound._enabled)return;var options=Object.extend({track:'global',url:url,replace:false},arguments[1]||{});if(options.replace&&this.tracks[options.track]){$R(0,this.tracks[options.track].id).each(function(id){var sound=$('sound_'+options.track+'_'+id);sound.Stop&&sound.Stop();sound.remove();})
this.tracks[options.track]=null;}
if(!this.tracks[options.track])
this.tracks[options.track]={id:0}
else
this.tracks[options.track].id++;options.id=this.tracks[options.track].id;$$('body')[0].insert(Prototype.Browser.IE?new Element('bgsound',{id:'sound_'+options.track+'_'+options.id,src:options.url,loop:1,autostart:true}):Sound.template.evaluate(options));}};if(Prototype.Browser.Gecko&&navigator.userAgent.indexOf("Win")>0){if(navigator.plugins&&$A(navigator.plugins).detect(function(p){return p.name.indexOf('QuickTime')!=-1}))
Sound.template=new Template('<object id="sound_#{track}_#{id}" width="0" height="0" type="audio/mpeg" data="#{url}"/>')
else
Sound.play=function(){}}

}
/*
     FILE ARCHIVED ON 15:04:40 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:46:03 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.592
  exclusion.robots: 0.03
  exclusion.robots.policy: 0.017
  esindex: 0.013
  cdx.remote: 8.742
  LoadShardBlock: 75.981 (3)
  PetaboxLoader3.datanode: 97.677 (4)
  load_resource: 114.885
  PetaboxLoader3.resolve: 77.872
*/