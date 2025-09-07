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

(function(xd){
window.xd = xd;
xd.core = function(){
	var _hashPairDelim = '|=|', _hashValDelim = '|&|',
	
	hashPairDelim = function(key){
		if(key!=undefined){
			_hashPairDelim = key;
		}
		return _hashPairDelim;
	},
	hashValDelim = function(key){
		if(key!=undefined){
			_hashValDelim = key;
		}
		return _hashValDelim;
	},
	getHash = function(){
		var pathname = document.URL;
		var hashIndex = pathname.indexOf('#');
		if(hashIndex > 0) {
			return pathname.substring(hashIndex + 1);
		}
		return false;
	},
	getHashVar = function(){
		var vars,
		getVar  = function(key){
			if(!key){return getVars();}
			return getVars()[key];
		},
		getVars = function(){
			if(vars){return vars;}
			vars = {};
			var hashes;
			if(!!(hashes = getHash())) {
				var hash;
				hashes = hashes.split(hashValDelim());
				for(var i=hashes.length;i--;){
					hash = hashes[i].split(hashPairDelim());
					vars[hash[0]] = hash[1];
				}	
			}	
			return vars;
		};
		return getVar;
	}();
	return {
		getHashVar:getHashVar,hashPairDelim:hashPairDelim,hashValDelim:hashValDelim
	}
}();
})(window.xd||{})

}
/*
     FILE ARCHIVED ON 20:06:17 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:55 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.008
  exclusion.robots: 0.053
  exclusion.robots.policy: 0.034
  esindex: 0.019
  cdx.remote: 6.122
  LoadShardBlock: 107.22 (3)
  PetaboxLoader3.datanode: 113.835 (5)
  load_resource: 134.196 (2)
  PetaboxLoader3.resolve: 88.244
*/