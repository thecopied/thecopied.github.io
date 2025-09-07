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

var TUGS = {
	tugsURL: "",
	closeUploadForm: function() {
		window.document.getElementById('popUpContent').style.display='none'; 
		window.document.getElementById('hudMask').style.display='none';
		popUp = $('popUpContent');
		popUp.removeChild($('tugsIFrame2'));
	},
	getMostCommented: function(partnerCode) {
		requestURL = TUGS.tugsURL+"/ws/items/topcommented/"+partnerCode+".json";
		var mostComments = "";
		new Ajax.Request(requestURL, {
	        method:'get',
	        onSuccess: function(transport){
	            var response = transport.responseText.evalJSON() || "no response";
				mostComments = '<div id="mostCommentsView">';
			
				for(i=0;i<response.length;i++) {
					if (i == (response.length)-1) {
						mostComments = mostComments+'<div class="uaItem last"><div class="uaIcon"><span class="'+response[i].content_type+'">'+response[i].content_type+'</span></div><div class="uaItemTitle"><a href="'+response[i].url+'">'+response[i].title+' ('+response[i].comment_count+')</a></div></div>';
					} else {
						mostComments = mostComments+'<div class="uaItem"><div class="uaIcon"><span class="'+response[i].content_type+'">'+response[i].content_type+'</span></div><div class="uaItemTitle"><a href="'+response[i].url+'">'+response[i].title+' ('+response[i].comment_count+')</a></div></div>';
					}
				}
				mostComments = mostComments+"</div>";
				$("uaContent").innerHTML = mostComments;
			},
			onFailure: function(){
				alert('Problem getting most commented');
			}
		});
	},
	getHighestRated: function(partnerCode) {
		requestURL = TUGS.tugsURL+"/ws/items/highestrated/"+partnerCode+".json";
		var highRatings = "";
		new Ajax.Request(requestURL, {
	        method:'get',
	        onSuccess: function(transport){
	            var response = transport.responseText.evalJSON() || "no response";
				highRatings = '<div id="highRatingsView">';
				for(i=0;i<response.length;i++) {
					if (i == (response.length)-1) {
						highRatings = highRatings+'<div class="uaItem last"><div class="uaIcon"></div><div class="uaItemTitle"><a href="'+response[i].url+'">'+response[i].title+' ('+response[i].comment_count+')</a></div></div>';
					} else {
						highRatings = highRatings+'<div class="uaItem"><div class="uaIcon"></div><div class="uaItemTitle"><a href="'+response[i].url+'">'+response[i].title+' ('+response[i].comment_count+')</a></div></div>';
					}
				}
				highRatings = highRatings+"</div>";
				firstPiece = ($("uaContent").innerHTML);
				$("uaContent").innerHTML = firstPiece + highRatings;
			},
			onFailure: function(){
				alert('Problem getting highest rated');
			}
		});
	},
	commentsTabUI: function(e) {
		if(this.id == "mostCommented") {
			$('mostCommentsView').style.display = "block";
			$('highRatingsView').style.display = "none";
			this.className = "active"
			$('highestRated').className = "";
		} else if(this.id == "highestRated") {
			$('highRatingsView').style.display = "block";
			$('mostCommentsView').style.display = "none";
			this.className = "active"
			$('mostCommented').className = "";
		}
	}, 
	setInitCount:function(jsonResp) {
		var starResp = jsonResp.evalJSON();
		var message = starResp.message;
		if (message == "Please check your input object.") {
			$('rating_1').innerHTML = "0";
		} else if (message == "No rating." || message == "No item.") {
			$('rating_1').innerHTML = "0";
		} else {
			var rateAVG = ((starResp.rate_summary.total_score) / (starResp.rate_summary.total_count)).toFixed(2);
			rateAVG = (rateAVG/20).toFixed(2);
			$('rating_1').innerHTML = rateAVG;
		} 
	},
	init_starRating: function() {
		var number_of_stars = 5;
		var status;
		var ratings = $('tugsRating').down('.rating');	    
		var rating = ratings.firstChild.nodeValue;
		ratings.removeChild(ratings.firstChild);
		if (rating > number_of_stars || rating < 0) return
		$R(1,number_of_stars).each(function(j) {
			var star = new Element('img');
			if (rating >= 1) {
	            star.setAttribute('src', '/hive/images/ratings/rating_on.jpg');
	            star.className = 'on';
	            rating--;
			} else if(rating > 0.5 && rating < 1) {
	            star.setAttribute('src', '/hive/images/ratings/rating_half.jpg');
	            star.className = 'half';
	            rating = 0;
			} else {
				star.className = 'off';
				star.setAttribute('src', '/hive/images/ratings/rating_off.jpg');
	        }
	        var widgetId = ratings.identify().substr(7);
	        star.writeAttribute('id', 'star_'+widgetId+'_'+j);
	        star.onmouseover = new Function("evt", "TUGS.displayHover("+widgetId+", "+j+");");
	        star.onmouseout = new Function("evt", "TUGS.displayNormal("+widgetId+", "+j+");");	
			ratings.appendChild(star);
		});
   

	    $$('.rating').each(function(n){
			n.immediateDescendants().each(function(c){
				Event.observe(c, 'click', TUGS.submitRating);
			});
		});
	},
	displayHover: function(ratingId, star) {
		$R(1,star).each(function(i) {
			$('star_'+ratingId+'_'+i).setAttribute('src', '/hive/images/ratings/rating_over.jpg');
		});
	},
	displayNormal: function(ratingId, star) {
		$R(1,star).each(function(i) {	
			var IDtoFind = 'star_'+ratingId+'_'+i;
			var status = $(IDtoFind).className;

			$('star_'+ratingId+'_'+i).setAttribute('src', '/hive/images/ratings/rating_'+status+'.jpg');
		});
	},
	submitRating:function(evt) {
		var starID = this.id;
		var voteAmt = starID.substr(7);
		var ratings = $('tugsRating').down('.rating');
		var itemSlug = $('rateMarket').innerHTML;
		//var requestURL = "/getRating.front?slug="+itemSlug;
		var requestURL = "/getRating.front?slug="+itemSlug+"&score="+voteAmt;
		var params = "item_slug="+itemSlug+"&score="+voteAmt+"&jsoncallback=?";
		var number_of_stars = 5;
		//alert(requestURL);
		
		new Ajax.Request(requestURL, {
	        method:'get',
			onLoading: function() {
				ratings.innerHTML = "<img id='loadIMG' src='/hive/images/ratings/ajax-loader.gif' width='16' height='16' />";
			},
	        onSuccess: function(transport){

				response = transport.responseText || "no response";
				firstPos = response.indexOf('{"rate":');
				var pulledJSON2 = response.substr(firstPos);
				endPos = "";
				if(pulledJSON2.indexOf('}}}') > 0) {
					endPos = pulledJSON2.indexOf('}}}')+3;
				} else {
					endPos = pulledJSON2.indexOf('}}')+2;
				}
				var pulledJSON = pulledJSON2.substr(0, endPos);
				finalJSON = pulledJSON.evalJSON();
				rateAVG = ((finalJSON.rate.rate_summary.total_score) / (finalJSON.rate.rate_summary.total_count)).toFixed(2);
				rateAVG = (rateAVG/20).toFixed(2);
				$('starRatingFeedback_1').innerHTML = rateAVG+' from '+finalJSON.rate.rate_summary.total_count+' ratings';
				
				newStars = new Element('span',{ 'id': 'newStars', 'style': 'display:none' });
				$R(1,number_of_stars).each(function(j) {
					var star = new Element('img');
					if (rateAVG >= 1) {
		                star.setAttribute('src', '/hive/images/ratings/rating_on.jpg');
		                star.className = 'on';
		                rateAVG--;
			        } else if(rateAVG == 0.5) {
		                star.setAttribute('src', '/hive/images/ratings/rating_half.jpg');
		                star.className = 'half';
		                rateAVG = 0;
					} else if(rateAVG > 0.5 && rateAVG < 1) {
						star.setAttribute('src', '/hive/images/ratings/rating_half.jpg');
		                star.className = 'half';
		                rateAVG = 0;
					} else {
						star.className = 'off';
						star.setAttribute('src', '/hive/images/ratings/rating_off.jpg');
		            }
		            var widgetId = ratings.identify().substr(7);
		            star.writeAttribute('id', 'star_'+widgetId+'_'+j);
					newStars.appendChild(star);
				});
				ratings.appendChild(newStars);
				ratings.removeChild($('loadIMG'));
				Effect.Appear(newStars, { duration: 0.5 });	
			},
			onFailure: function() {
				alert('Problem getting rating');
			}
		}); 
	},
	displayTugsTip: function() {
		var tipsArray = ["You can help keep the comment boards clean by \"reporting abuse\" on comments that may be spam or offensive to other users", "To reply directly to a comment click on \"reply\" to the right of the comment you would like to reply to", "On the discussions page, you can rate the item you are discussing by clicking on stars above the comment input box", "You can add bulletted lists to your comment by using the \"ordered list\" and \"unordered list\" icons above the text input box"];
		var tipsLength = tipsArray.length;
		var randomTip = Math.floor(Math.random()*tipsLength);
		var returnDisplay = "<div id='tugsTip'><span class='tipTitle'>Did you know?</span><p>"+tipsArray[randomTip]+"</p></div>";
		return document.write(returnDisplay);
		
	}
}


}
/*
     FILE ARCHIVED ON 20:06:15 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:55 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.557
  exclusion.robots: 0.03
  exclusion.robots.policy: 0.019
  esindex: 0.011
  cdx.remote: 5.016
  LoadShardBlock: 127.611 (3)
  PetaboxLoader3.datanode: 119.455 (5)
  PetaboxLoader3.resolve: 508.383 (3)
  load_resource: 556.008 (2)
*/