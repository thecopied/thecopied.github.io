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

/**
 * UGCObject is to store all
 * potential actions / properties a UGC content item
 * can invoke
 */
function UGCObject()
{
    //action URLs only for audio gallery
    this.audioGallerySingleAdvance = null;
    this.audioGallerySetAdvance = null;
    this.audioGalleryThumbnailUpdate = null;
    
	// All three photogallery urls are replaced by single url.
	//action URLs only for photo gallery
    //this.photoGallerySingleAdvance = null;
    //this.photoGallerySetAdvance = null;
    //this.photoGalleryThumbnailUpdate = null;
	
	// new action for single ajax call for photogallery.
	this.photoGalleryAjaxCall = null;
	// Ad url for photogallery
	this.refreshAd = null;
    
	//action URLs only for video gallery
    this.videoGallerySingleAdvance = null;
    this.videoGallerySetAdvance = null;
    this.videoGalleryThumbnailUpdate = null;

    //action URL for media player update
    this.mediaPlayerUpdate = null;

    //action URLs for comments
    this.commentFormUpdate = null;
    this.commentSubmit = null;
    this.commentDisplay = null;

    //action URLs for ratings
    this.ratingSubmit = null;
    this.ratingUpdate = null;

    //content item type code property
    this.contentItemType = null;

    //allow rating / comment properties
    this.ratingsPermitted = false;
    this.commentsPermitted = false;

    //refresh properties
    this.refreshThumbnails = false;
    this.refreshMediaPlayer = false;

    //autoplay property
    this.mediaAutoPlay = false;

    //target Id index
    this.targetIdIndex = 1;

    //thumbnail index
    this.thumbnailIndex = 1;

    //start index
    this.startIndex = 1;

    //max record count
    this.totalRecords = null;

    //advanceMedia function call
    this.advanceMedia = advanceMedia;
}

/**
 Pre-load ratings and comments images
 */
ImageStarOn = new Image();
ImageStarOff = new Image();
ImageThumbsUp = new Image();
ImageCheck = new Image();
ImageStarOn.src = "/hive/images/ratings/star_selected.gif";
ImageStarOff.src = "/hive/images/ratings/star_unselected.gif";
ImageThumbsUp.src = "/hive/images/ratings/thumbsup.png";
ImageCheck.src = "/hive/images/ratings/check.png";


/**
 * Global variable to check for profanity
 */
var noProfanity = 'true';

/**
 * Submit comment on UGCGallery content item
 */
function submitComment()
{

    var id = document.postCommentForm["user_id"].value;
    var location = document.postCommentForm["location"].value;
    var email = document.postCommentForm["user_url"].value;
    var comment = document.postCommentForm["comment_text"].value;
    var targetId = document.postCommentForm["target_id"].value;
    var targetType = document.postCommentForm["target_type"].value;
    var url = document.postCommentForm["comment_post"].value;
    if (id && location && email && comment && targetId && targetType && url) {
		//document.postCommentForm["submit"].disabled = true;
        //need to take this approach b/c prototype takes hidden fields and automatically adds them to the post
        //we need to have an approach that is generic for with / without hidden fields b/c of unique display requirements
        url = cleanActionUrls(url);
        var requestPlusParams = url + '?' + 'target_id=' + targetId + '&location=' + location + '&user_url=' + email + '&user_id=' + id + '&comment_text=' + comment + '&target_type=' + targetType;
        new Ajax.Updater('commentPost', requestPlusParams, {asynchronous:true, evalScripts:true, method:'POST', onComplete: submitCommentMessageDisplay });
        return false;
    } else {
        //check for null form fields
        for (i = 0; i < document.postCommentForm.elements.length; i++)
        {
            if (!document.postCommentForm.elements[i].value) {
                alert('The ' + document.postCommentForm.elements[i].name + ' field is required. You cannot leave it blank.');
                break;
            }
        }
	document.postCommentForm['submit'].disabled = false;
    }
    return false;
}

/**
 * Submit comment on UGCGallery content item with required registration
 */
function submitCommentWithReg(regPostUrl)
{

    var id = document.postCommentForm["user_id"].value;
    var location = document.postCommentForm["location"].value;
    var email = document.postCommentForm["user_url"].value;
    var comment = document.postCommentForm["comment_text"].value;
    var targetId = document.postCommentForm["target_id"].value;
    var targetType = document.postCommentForm["target_type"].value;
    var url = document.postCommentForm["comment_post"].value;
    if (!id || !location) {
       window.open(regPostUrl,'commentReg','width=600,height=450,scrollbars=yes,resizable=yes');
	   return false;
    }
    if (id && location && email && comment && targetId && targetType && url) {
		//document.postCommentForm["submit"].disabled = true;
        //need to take this approach b/c prototype takes hidden fields and automatically adds them to the post
        //we need to have an approach that is generic for with / without hidden fields b/c of unique display requirements
        url = cleanActionUrls(url);
        var requestPlusParams = url + '?' + 'target_id=' + targetId + '&location=' + location + '&user_url=' + email + '&user_id=' + id + '&comment_text=' + comment + '&target_type=' + targetType;
        new Ajax.Updater('commentPost', requestPlusParams, {asynchronous:false, evalScripts:true, method:'POST', onComplete: submitCommentMessageDisplay });
        return false;
    } else {
        //check for null form fields
        for (i = 0; i < document.postCommentForm.elements.length; i++)
        {
            if (!document.postCommentForm.elements[i].value) {
                alert('The ' + document.postCommentForm.elements[i].name + ' field is required. You cannot leave it blank.');
                break;
            }
        }
	document.postCommentForm['submit'].disabled = false;
    }
    return false;
}

/**
 * Submit comment on UGCGallery content item with required registration
 */
function submitCommentWithRegNew(regPostUrl)
{
    checkUserLoginInfo(0);
    var id = document.postCommentForm["user_id"].value;
    var location = document.postCommentForm["location"].value;
    var email = document.postCommentForm["user_url"].value;
    var comment = document.postCommentForm["comment_text"].value;
    var targetId = document.postCommentForm["target_id"].value;
    var targetType = document.postCommentForm["target_type"].value;
    var url = document.postCommentForm["comment_post"].value;
    var pa = document.postCommentForm["pacode"].value;    
    if (!id || !location) {
       window.open(regPostUrl,'commentReg','width=600,height=450,scrollbars=yes,resizable=yes');
	   return false;
    }
    if (id && location && email && comment && targetId && targetType && url) {
		//document.postCommentForm["submit"].disabled = true;
        //need to take this approach b/c prototype takes hidden fields and automatically adds them to the post
        //we need to have an approach that is generic for with / without hidden fields b/c of unique display requirements
        url = cleanActionUrls(url);
        var requestPlusParams = url + '?' + 'target_id=' + targetId + '&location=' + location + '&user_url=' + email + '&user_id=' + id + '&comment_text=' + escape(comment) + '&target_type=' + targetType + '&pacode=' + pa;
        new Ajax.Updater('gallery-subcontent', requestPlusParams, {asynchronous:false, evalScripts:true, method:'POST', onComplete: submitCommentMessageDisplay });
        return false;
    } else {
        //check for null form fields
        for (i = 0; i < document.postCommentForm.elements.length; i++)
        {
            if (!document.postCommentForm.elements[i].value) {
                alert('The ' + document.postCommentForm.elements[i].name + ' field is required. You cannot leave it blank.');
                break;
            }
        }
	document.postCommentForm['submit'].disabled = false;
    }
    return false;
}

function ReportComment(regPostUrl, commentId)
{
    checkUserLoginInfo(commentId); 
    var targetId = commentId; 
    var formName = 'reportCommentForm' + commentId;
    var id = document.forms[formName].user_id.value;
    var comment = document.forms[formName].report_reason.value + ' Additional Comment: ' + document.forms[formName].report_message.value;
    var targetType = document.forms[formName].target_type.value;
    var url = document.forms[formName].report_comment_post.value;
    var pa = document.forms[formName].pacode.value;    
    if (!id) {
       window.open(regPostUrl,'commentReg','width=600,height=450,scrollbars=yes,resizable=yes');
       document.getElementById("ReportCommentId").innerHTML = commentId;
       return false;
    }
        //need to take this approach b/c prototype takes hidden fields and automatically adds them to the post
        //we need to have an approach that is generic for with / without hidden fields b/c of unique display requirements
        url = cleanActionUrls(url);
        var requestPlusParams = url + '?' + 'target_id=' + targetId + '&user_id=' + id + '&message=' + escape(comment) + '&target_type=' + targetType + '&pacode=' + pa;
        new Ajax.Updater('reportComment' + targetId, requestPlusParams, {asynchronous:false, evalScripts:true, method:'POST', onComplete: showReportCommentForm(targetId) });
        return false;
    return false;
}

/**
 * Submit comment on Editorial content item
 */
function submitEditorialComment(regPostUrl)
{

    var id = document.postCommentForm["user_id"].value;
    var location = document.postCommentForm["location"].value;
    var email = document.postCommentForm["user_url"].value;
    var comment = document.postCommentForm["comment_text"].value;
    var targetId = document.postCommentForm["target_id"].value;
    var targetType = document.postCommentForm["target_type"].value;
    var url = document.postCommentForm["comment_post"].value;
    var commentDisplayUrl = document.postCommentForm["comment_display"].value;
    
    if (!id) {
       window.open(regPostUrl,'optin','width=600,height=450,scrollbars=yes,resizable=yes');
	   return false;
    }
    if (id && location && email && comment && targetId && targetType && url) {
		//document.postCommentForm["submit"].disabled = true;
        //need to take this approach b/c prototype takes hidden fields and automatically adds them to the post
        //we need to have an approach that is generic for with / without hidden fields b/c of unique display requirements
        url = cleanActionUrls(url);
        var requestPlusParams = url + '?' + 'target_id=' + targetId +  '&location=' + location + '&user_url=' + email + '&user_id=' + id + '&comment_text=' + comment + '&target_type=' + targetType;
        new Ajax.Updater('commentPost', requestPlusParams, {asynchronous:true, evalScripts:true, method:'POST', onComplete: submitCommentMessageDisplay });
        return false;
    } else {
        //check for null form fields
        for (i = 0; i < document.postCommentForm.elements.length; i++)
        {
            if (!document.postCommentForm.elements[i].value) {
                alert('The ' + document.postCommentForm.elements[i].name + ' field is required. You cannot leave it blank.');
                break;
            }
        }
    }
    updateCommentDisplay(targetId, targetType, null, 0, 2, commentDisplayUrl, null);
    return false;
}

/**
 * Used for the comment form and contains customized
 * client side validation because it is not using
 * the <form> tag or formvalidation.js
 */
function submitCommentMessageDisplay(transport, json)
{
    if (json.value && json.username && json.location) {
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var timeStamp = month + "/" + day + "/" + year;

        //Display the message and user info just posted
	fullComment = '<h5>Thank you, your comment has been submitted.</h5><h5>Below is a preview; your actual comment will appear shortly.</h5><div class="user-comment"><p class="comment">' +  unescape(json.value) + '</p><p class="user">' + json.username + ' (' + timeStamp + ')</p><div class="clear"></div></div>';
        $('previewComment').innerHTML =  fullComment;
    }
}



/**
 * The main function for updating the gallery pages including thumbnails,
 * the main image, comments, and rating display.
 */
function advanceMedia(ugcObject)
{
    //targetIdIndex, targetType, index, recordCount, startIndex, refreshThumbnails, blnShowComments, blnShowRatings, ugcObject, refreshMediaPlayer, autoPlay
    var params = queryParameterCreation(ugcObject);
    if (ugcObject.contentItemType == 'ugcphotogallery') { // ci type for photo gallery
        updatePhotoAjax(ugcObject)
    }
    if (ugcObject.contentItemType == 'ugcvideogallery') {  //ci type for video gallery
        updateVideo(ugcObject);
    }

    if (ugcObject.contentItemType == 'ugcaudiogallery') {  //ci type for audio gallery
        updateAudio(ugcObject);
    }
}

function cleanActionUrls(url)
{
    if (url) {
        //remove unnecessary query parameters
        var urlArray = url.split("?");
        if (urlArray[0]) {
            return urlArray[0];
        } else {
            //no query parameter
            return url;
        }
    }
}

function queryParameterCreation(ugcObject)
{
    var params;

    var totalCount;
    if ($('recordCount')) {
        totalCount = $('recordCount').value;
    } else {
        totalCount = ugcObject.totalRecords;
    }

    if (ugcObject) {
        params = '&target_id=' + ugcObject.targetIdIndex + '&target_type=' + ugcObject.contentItemType + '&thumbrail_index=' + ugcObject.thumbnailIndex + '&total_count=' + totalCount + '&start_index=' + ugcObject.startIndex + '&auto_play=' + ugcObject.mediaAutoPlay + '&show_comments=' + ugcObject.commentsPermitted + '&show_ratings=' + ugcObject.ratingsPermitted;
    }

    return params;
}

function updateAudio(ugcObject)
{
    updateMediaPlayer(ugcObject);
}

/**
 * Called within advanceGallery() to update the thumbs and media player
 */
function updateVideo(ugcObject)
{
    var targetId = 'targetId' + ugcObject.targetIdIndex;

    //when refreshing the thumbnails must take into account response lag
    if (ugcObject.refreshThumbnails == true) {
        updateVideoGalleryThumbnails(ugcObject);
    } else if (ugcObject.refreshMediaPlayer == true) {
        updateMediaPlayer(ugcObject);
        updateSupportingContent(ugcObject);
    }

    if (ugcObject.refreshThumbnails != true && ugcObject.refreshMediaPlayer != true) {
        updateSupportingContent(ugcObject);
    }

}

/**
 * Called within advanceGallery() to update the thumbs and main photo
   Note: This function is replaced by updatePhotoAjax for single ajax call.
 */
function updatePhoto(ugcObject)
{
    //when refreshing the thumbnails must take into account response lag
    if (ugcObject.refreshThumbnails == true) {
        updatePhotoGalleryThumbnails(ugcObject);
    } else {
        updateMainPhoto(ugcObject);
        updateSupportingContent(ugcObject);
    }

}
/**
This is the new function for ugc photogallery Ajax call. 
**/
function updatePhotoAjax(ugcObject)
{
   // all misc update. 

    var imageId = 'thumbrailimg' + ugcObject.targetIdIndex;
    var targetId = 'targetId' + ugcObject.targetIdIndex;
    var targetType = ugcObject.contentItemType;
    var showComments = ugcObject.commentsPermitted;
    var showRatings = ugcObject.ratingsPermitted;
	
    document.getElementById("photo-information").scrollTop = 0;
    
    if (ugcObject.refreshThumbnails == false) {
		highlightPhotoThumb(imageId);
		updateMainPhoto(ugcObject);
	}
	var params = queryParameterCreation(ugcObject);
	params = params + '&refresh_thumbnails=' + ugcObject.refreshThumbnails;
	//if (showComments == 'true') {
        //var params_sub1 = updateCommentDisplayQParams(0,targetType, null, 0, 5, ugcObject.commentDisplay);
	//	params = params + params_sub1;
	//}
	
	ugcObject.photoGalleryAjaxCall = cleanActionUrls(ugcObject.photoGalleryAjaxCall);
	new Ajax.Request(ugcObject.photoGalleryAjaxCall, {asynchronous:false, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
				    output = transport.responseText.split("#!PHOTO_GALLERY_DELIMITER");
					if (ugcObject.refreshThumbnails == true) {
						var galleryDiv = document.getElementById('gallery-photos-more');
                		galleryDiv.innerHTML =output[0];
				
						highlightPhotoThumb(imageId);
						updateMainPhoto(ugcObject);
					}
                    else
                    {
					    var ratingDiv = document.getElementById('photo-next-left');
                	    ratingDiv.innerHTML = output[1];

                        var ratingDiv = document.getElementById('photo-next-right');
                	    ratingDiv.innerHTML = output[2];
                    }
                     var indexDiv = document.getElementById('photo-index');
                	    indexDiv.innerHTML = output[3];
				}
			}
		});
		if (showComments == 'true') {
		    updateCommentFormAndDisplay($(targetId).value, targetType, 0, 3, ugcObject.commentDisplay);
                }
                if (showRatings == 'true') {
                    updateRating(ugcObject);
                }   
        
        
	// refresh Ad for photo gallery.
	
	$$('.refreshable_ad').each(function(setAd){
		setAd.src = setAd.src;
	});
	    	
	headerAdRefresh();
		
	//collecting omniture Data for photo title.
	s.prop37= "Photo "+ ugcObject.targetIdIndex; 
	void(s.t());
	
 	return false;
}

function updateDesc(ugcObject)
{
    var title = 'title' + ugcObject.targetIdIndex;
    var description = 'description' + ugcObject.targetIdIndex;
    var credit = 'credit' + ugcObject.targetIdIndex;
    var date_created= 'date_created' + ugcObject.targetIdIndex;
    
    $('mediaTitle').innerHTML = $(title).value;
    $('mediaDescription').innerHTML = '<p class="caption">' + $(description).value + '</p>';
    $('mediaCredit').innerHTML = '<span class="credit">(' + $(credit).value + ')</span>';
    $('mediaCreatedDate').innerHTML = '<span class="date">' + $(date_created).value + '</span>'
}
/**
 * Function used to update the main image for photogalleries
 */
function updateMainPhoto(ugcObject)
{

    // var parsedParamsObject = params.parseQuery();

    var targetId = 'targetId' + ugcObject.targetIdIndex;
    var targetUrlId = 'hiddenFullImg' + ugcObject.targetIdIndex;
    var url = $(targetUrlId).value;
    var title = 'title' + ugcObject.targetIdIndex;

    var queryParams = '&url=' + url + '&title=' + title;
    var mediaFocus = document.getElementById("mediaFocus");
    mediaFocus.innerHTML = "";
    var mainImg = document.createElement("IMG");
    mainImg.src = url;
    mainImg.title = title;
	mainImg.className = "gallery-slideshow-photo";
	mainImg.alt = title;

    mediaFocus.appendChild(mainImg);
    updateDesc(ugcObject);
}
/**
 * Function used to update supporting content such as description, credit, ratings, comments
 */
function updateSupportingContent(ugcObject)
{
    var title = 'title' + ugcObject.targetIdIndex;
    var description = 'description' + ugcObject.targetIdIndex;
    var credit = 'credit' + ugcObject.targetIdIndex;
    var imageId = 'thumbrailimg' + ugcObject.targetIdIndex;
    var targetId = 'targetId' + ugcObject.targetIdIndex;
    var targetType = ugcObject.contentItemType;
    var showComments = ugcObject.commentsPermitted;
    var showRatings = ugcObject.ratingsPermitted;
    var date_created = 'date_created' + ugcObject.targetIdIndex;

    $('mediaTitle').innerHTML = $(title).value;
    $('mediaDescription').innerHTML = '<p class="caption">' + $(description).value + '</p>';
    $('mediaCredit').innerHTML = '<p class="credit">' + $(credit).value + '</p>';
    $('mediaCreatedDate').innerHTML = '<p class="date">' + $(date_created).value + '</p>';

    highlightMediaThumb(imageId);

    var params = queryParameterCreation(ugcObject);
    /* this part of code is not used for ugc photogallery anymore 
    if (targetType == 'ugcphotogallery') {  // ci type for photo gallery

        ugcObject.photoGallerySingleAdvance = cleanActionUrls(ugcObject.photoGallerySingleAdvance);
		ugcObject.photoGallerySetAdvance = cleanActionUrls(ugcObject.photoGallerySetAdvance);
		new Ajax.Request(ugcObject.photoGallerySingleAdvance, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
					var gallerySlideShowNav = document.getElementById('gallery-slideshow-nav');
					gallerySlideShowNav.innerHTML = transport.responseText;
				}
			}
		});
		
		new Ajax.Request(ugcObject.photoGallerySetAdvance, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
					var setNavigation = document.getElementById('setNavigation');
					setNavigation.innerHTML = transport.responseText;
				}
			}
		});	
		
		// refresh Ad for photo gallery.
		//var setAd = document.getElementById('refreshable_ad');
		//setAd.src = setAd.src;	
		var setAds = document.getElementsByClassName('refreshable_ad');
		setAds.each(function(setAd){setAd.src = setAd.src;});
		
		//collecting omniture Data for photo title.
		s.prop37= "Photo "+ ugcObject.targetIdIndex; 
		void(s.t());
    }
    */
    if (targetType == 'ugcvideogallery') {   // ci type for video gallery
        ugcObject.videoGallerySingleAdvance = cleanActionUrls(ugcObject.videoGallerySingleAdvance);
        ugcObject.videoGallerySetAdvance = cleanActionUrls(ugcObject.videoGallerySetAdvance);
		
		new Ajax.Request(ugcObject.videoGallerySingleAdvance, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
					var singleNavigation = document.getElementById('singleNavigation');
					singleNavigation.innerHTML = transport.responseText;
				}
			}
		});
		
		new Ajax.Request(ugcObject.videoGallerySetAdvance, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
					var setNavigation = document.getElementById('setNavigation');
					setNavigation.innerHTML = transport.responseText;
				}
			}
		});
    }

    if (targetType == 'ugcaudiogallery') {  // ci type for audio gallery
        ugcObject.audioGallerySingleAdvance = cleanActionUrls(ugcObject.audioGallerySingleAdvance);
        ugcObject.audioGallerySetAdvance = cleanActionUrls(ugcObject.audioGallerySingleAdvance);
        
		new Ajax.Request(ugcObject.audioGallerySingleAdvance, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
					var singleNavigation = document.getElementById('singleNavigation');
					singleNavigation.innerHTML = transport.responseText;
				}
			}
		});
		
		new Ajax.Request(ugcObject.audioGallerySetAdvance, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
			onSuccess: function(transport)
			{
				if (transport.status == 200 && transport.responseText != null) {
					var setNavigation = document.getElementById('setNavigation');
					setNavigation.innerHTML = transport.responseText;
				}
			}
		});
		
    }

    if (showComments == 'true') {
        updateCommentFormAndDisplay($(targetId).value, targetType, 0, 3, ugcObject.commentDisplay);
    }

    if (showRatings == 'true') {

        updateRating(ugcObject);
    }

    return false;
}

/**
 * Function is used to swap out the correct audio or video running in the player
 */
function updateMediaPlayer(ugcObject)
{

    var token = 'token' + ugcObject.targetIdIndex;
    var autoPlay = ugcObject.mediaAutoPlay;
    var preRoll = 'preRoll' + ugcObject.targetIdIndex;
    var postRoll = 'postRoll' + ugcObject.targetIdIndex;

    var player = $('player');
    ugcObject.mediaPlayerUpdate = cleanActionUrls(ugcObject.mediaPlayerUpdate);
    player.src = ugcObject.mediaPlayerUpdate + '?' + 'token=' + $(token).value + '&autoPlayMedia=' + autoPlay + '&player_name=uvp';

}

/**
 * Rewrites / refreshes the thumbnail section for photo galleries
  Note: This function is replaced by updatePhotoAjax for single ajax call.
 */
function updatePhotoGalleryThumbnails(ugcObject)
{

    var imageId = 'thumbrailimg' + ugcObject.targetId;

    //This implementation MUST!!! be used instead of Ajax.Updater due to the lag time of the response and response Text
    //being written to the inner HTML of div and the control of the style

    var params = queryParameterCreation(ugcObject);
    ugcObject.photoGalleryThumbnailUpdate = cleanActionUrls(ugcObject.photoGalleryThumbnailUpdate);
    new Ajax.Request(ugcObject.photoGalleryThumbnailUpdate, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
        onSuccess: function(transport)
        {
            if (transport.status == 200 && transport.responseText != null) {
                var galleryDiv = document.getElementById('gallery-photos-more');
                galleryDiv.innerHTML = transport.responseText;
                updateMainPhoto(ugcObject);
                updateSupportingContent(ugcObject);
            }
        }
    });
}

/**
 * Rewrites / refreshes the thumbnail section for video galleries
 */
function updateVideoGalleryThumbnails(ugcObject)
{
    var imageId = 'thumbrailimg' + ugcObject.targetIdIndex;

    var params = queryParameterCreation(ugcObject);

    //This implementation MUST!!! be used instead of Ajax.Updater due to the lag time of the response and response Text
    //being written to the inner HTML of div and the control of the style
    ugcObject.videoGalleryThumbnailUpdate = cleanActionUrls(ugcObject.videoGalleryThumbnailUpdate);
    new Ajax.Request(ugcObject.videoGalleryThumbnailUpdate, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
        onSuccess: function(transport)
        {
            if (transport.status == 200 && transport.responseText != null) {
                var galleryDiv = document.getElementById('gallery-videos-more');
                galleryDiv.innerHTML = transport.responseText;
                highlightMediaThumb(imageId);
				if(ugcObject.refreshMediaPlayer == true) {
					updateMediaPlayer(ugcObject);
				}
                updateSupportingContent(ugcObject);
            }
        }
    });
}

/**
 * Writes and enables the ratings area for a gallery
 */
function updateRating(ugcObject)
{
    var targetId = 'targetId' + ugcObject.targetIdIndex;
    var targetType = ugcObject.targetId;

    params = '&target_id=' + $(targetId).value + '&target_type=' + targetType + '&thumbrail_index=' + ugcObject.thumbnailIndex;

    ugcObject.ratingUpdate = cleanActionUrls(ugcObject.ratingUpdate);

	new Ajax.Request(ugcObject.ratingUpdate, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
        onSuccess: function(transport)
        {
         
            if (transport.status == 200 && transport.responseText != null) {
	
                var ratingDiv = document.getElementById('rating');
                ratingDiv.innerHTML = transport.responseText;

            }
        }
    });
	
	return false;
}

/**
 * Updates the whole comment form
 */
function updateCommentForm(ugcObject)
{
    var targetId = 'targetId' + ugcObject.targetIdIndex;
    var targetType = ugcObject.contentItemType;
    params = '&target_id=' + $(targetId).value + '&target_type=' + targetType + '&thumbrail_index=' + ugcObject.thumbnailIndex;

    ugcObject.commentFormUpdate = cleanActionUrls(ugcObject.commentFormUpdate);

	new Ajax.Request(ugcObject.commentFormUpdate, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
        onSuccess: function(transport)
        {
            if (transport.status == 200 && transport.responseText != null) {
                var commentPost = document.getElementById('commentPost');
                commentPost.innerHTML = transport.responseText;
            }
        }
    });
	
    return false;
}

/**
 * Updates the whole comment form
 */
function updateCommentPhotoGalleryForm(slug, url)
{

    params = '&targetid=' + slug + '&target_type=photo' + '&thumbrail_index=';

    var commentFormUpdate = cleanActionUrls(url);

	new Ajax.Request(commentFormUpdate, {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
        onSuccess: function(transport)
        {
            if (transport.status == 200 && transport.responseText != null) {
                var commentPost = document.getElementById('commentPost');
                commentPost.innerHTML = transport.responseText;
            }
        }
    });
	
    return false;
}

/**
 * Highlights the current thumbnail
 */
function highlightMediaThumb(id)
{
    for (var i = 1; i < 5; i++) {
        var mediaId = "thumbrailimg" + i;
        var mediaThumb = document.getElementById(mediaId);
        if (mediaThumb != null) {
            mediaThumb.className = "";
        }
    }

    var img = document.getElementById(id);
    if (img) {
        img.className = "current";
    }

}

/**
 * Function used to index the comments by moving the user to the next set
 * for a particular UGC content item
 */
function updateCommentDisplay(targetId, targetType, maxRecords, index, limit, url, thumbnailIndex)
{
    if (targetId && targetType && limit && url) {

        var params;

        //check for hidden input type value field
        if (maxRecords != null) {
            if (maxRecords.type == 'hidden') {
                params = '&target_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords.value + '&comment_index=' + index + '&limit=' + limit+ '&thumbrail_index=' + thumbnailIndex;
            } else {
                params = '&target_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords + '&comment_index=' + index + '&limit=' + limit+ '&thumbrail_index=' + thumbnailIndex;
            }
        } else {
            params = '&target_id=' + targetId + '&target_type=' + targetType + '&comment_index=' + index + '&limit=' + limit + '&thumbrail_index=' + thumbnailIndex;
        }

        url = cleanActionUrls(url);
		
        new Ajax.Request(url, {asynchronous:true, evalScripts:true, parameters:params, method:'GET',
            onSuccess: function(transport)
            {
                if (transport.status == 200 && transport.responseText != null) {
                    var commentDisplay = document.getElementById('commentDisplay');
                    commentDisplay.innerHTML = transport.responseText;
                }
            }
        });
    }

    return false;
}

/**
 * Function used to index the comments by moving the user to the next set
 * for a particular UGC content item
 */
function updateCommentFormAndDisplay(targetId, targetType, index, limit, url)
{
    if (targetId && targetType && limit && url) {
        var params;
	params = '&target_id=' + targetId + '&target_type=' + targetType + '&comment_index=' + index + '&limit=' + limit;
        url = cleanActionUrls(url);
        new Ajax.Request(url, {asynchronous:true, evalScripts:true, parameters:params, method:'GET',
	    onSuccess: function(transport)
	    {
	        if (transport.status == 200 && transport.responseText != null) {
		     var commentFormAndDisplay = document.getElementById('gallery-subcontent');
		     commentFormAndDisplay.innerHTML = transport.responseText;
                }
            }
        });
    }
    return false;
}


/**
 * Function used to index the comments by moving the user to the next set
 * for a particular UGC content item
 */
function httpReqCommentDisplayAll(targetId, targetType, maxRecords, index, limit, url, thumbnailIndex)
{
    if (targetId && targetType && limit && url) {

        var params;

        //check for hidden input type value field
        if (maxRecords != null) {
            if (maxRecords.type == 'hidden') {
                params = '&target_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords.value + '&comment_index=' + index + '&limit=' + limit+ '&thumbrail_index=' + thumbnailIndex;
            } else {
                params = '&target_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords + '&comment_index=' + index + '&limit=' + limit+ '&thumbrail_index=' + thumbnailIndex;
            }
        } else {
            params = '&target_id=' + targetId + '&target_type=' + targetType + '&comment_index=' + index + '&limit=' + limit + '&thumbrail_index=' + thumbnailIndex;
        }

        url = cleanActionUrls(url);
		
        new Ajax.Updater('gallery-subcontent', url, {asynchronous:true, evalScripts:true, parameters:params, method:'GET',
            onSuccess: function(transport)
            {
                if (transport.status == 200 && transport.responseText != null) {
                    var commentDisplay = document.getElementById('commentDisplay');
                    commentDisplay.innerHTML = transport.responseText;
                }
            }
        });
    }

    return false;
}
function updateCommentPhotoGalleryDisplay(targetId, targetType, maxRecords, index, limit, url, thumbnailIndex)
{
    if (targetId && targetType && limit && url) {

        var params;

        //check for hidden input type value field
        if (maxRecords != null) {
            if (maxRecords.type == 'hidden') {
                params = '&target_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords.value + '&comment_index=' + index + '&limit=' + limit;
            } else {
                params = '&target_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords + '&comment_index=' + index + '&limit=' + limit;
            }
        } else {
            params = '&target_id=' + targetId + '&target_type=' + targetType + '&comment_index=' + index + '&limit=' + limit;
        }

        url = cleanActionUrls(url);
		
        new Ajax.Request(url, {asynchronous:true, evalScripts:true, parameters:params, method:'GET',
            onSuccess: function(transport)
            {
                if (transport.status == 200 && transport.responseText != null) {
                    var commentDisplay = document.getElementById('commentDisplay');
                    commentDisplay.innerHTML = transport.responseText;
                }
            }
        });
    }

    return false;
}


/**
  Function to replace updateCommentDisplay for photogallery
**/
function updateCommentDisplayQParams(targetId, targetType, maxRecords, index, limit, url)
{
    var params= '';
 	if (targetId && targetType && limit && url) {

        //check for hidden input type value field
        if (maxRecords != null) {
            if (maxRecords.type == 'hidden') {
                params = '&currenttarget_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords.value + '&comment_index=' + index + '&limit=' + limit;
            } else {
                params = '&currenttarget_id=' + targetId + '&target_type=' + targetType + '&total_count=' + maxRecords + '&comment_index=' + index + '&limit=' + limit;
            }
        } else {
            params = '&currenttarget_id=' + targetId + '&target_type=' + targetType + '&comment_index=' + index + '&limit=' + limit;
        }
	}
		return params;
}

/**
 * Highlights the rating images when user mouses over them
 */
function hiliteRating(rating)
{
    for (var i = 1; i <= rating; i++) {
        $('rating-' + i).src = ImageStarOn.src;
    }
    for (var i = rating + 1; i <= 5; i++) {
        $('rating-' + i).src = ImageStarOff.src;
    }
}

/**
 * Highlights the rating images when user mouses over them
 */
function hiliteThumbsUpRatingEditorial(rating, slug)
{
    if(rating == 1) {
        $('rating-thumb-' + slug).src = ImageCheck.src;
    }
    else {
        $('rating-thumb-' + slug).src = ImageThumbsUp.src;
    }
}

/**
 * Highlights the rating images when user mouses over them
 */
function hiliteThumbsUpRatingNonEditorial(rating)
{
    if(rating == 1) {
        $('rating-thumb').src = ImageCheck.src;
    }
    else {
        $('rating-thumb').src = ImageThumbsUp.src;
    }
}


function hiliteGalleryRating(rating, slug)
{
    for (var i = 1; i <= rating; i++) {
        $('rating-' + i + '-' + slug).src = ImageStarOn.src;
    }
    for (var i = rating + 1; i <= 5; i++) {
        $('rating-' + i + '-' + slug).src = ImageStarOff.src;
    }
}

/**
 * Submits the rating and updates the rating area with a JSON response string
 * by calling averageImage()
 */
function rateItem(targetId, rating, targetType, url)
{

    var params = 'value=' + rating + '&target_id=' + targetId + '&target_type=' + targetType;
    url = cleanActionUrls(url);
    new Ajax.Updater('rating', url, {asynchronous:true, evalScripts:true, parameters:params, method:'POST', onComplete: averageImage });
    return false;
}

function rateEditorialItem(targetId, rating, targetType, url)
{

    var params = 'value=' + rating + '&target_id=' + targetId + '&target_type=' + targetType;
    url = cleanActionUrls(url);
    new Ajax.Updater('rating', url, {asynchronous:true, evalScripts:true, parameters:params, method:'POST', onComplete: averageImage });
    return false;
}


function rateThumbsUpEditorialItem(targetId, rating, targetType, url)
{

    var params = 'value=' + rating + '&target_id=' + targetId + '&target_type=' + targetType;
    url = cleanActionUrls(url);
    new Ajax.Updater('rating', url, {asynchronous:true, evalScripts:true, parameters:params, method:'POST', onComplete: averageThumbsUpImageEditorial });
    return false;
}

function rateThumbsUpNonEditorialItem(targetId, rating, targetType, url)
{

    var params = 'value=' + rating + '&target_id=' + targetId + '&target_type=' + targetType;
    url = cleanActionUrls(url);
    new Ajax.Updater('rating', url, {asynchronous:true, evalScripts:true, parameters:params, method:'POST', onComplete: averageThumbsUpImageNonEditorial });
    return false;
}


function update(targetId,target_type,ratingUpdate)
{


	params = '&target_id=' + targetId + '&target_type=' + target_type;

    ratingUpdate = cleanActionUrls(ratingUpdate);

	new Ajax.Request('rating', {asynchronous:true, evalScripts:true, parameters:params, method:'POST',
        onComplete:function (t)
	{
	
	var commentDisplay = document.getElementById('rating'); 

document.test["comments"].value=t.responseText;

        $('ratingUpdate').innerHTML = t.responseText;
	}});	
	return false;
	

}



function rateGalleryItem(targetId, rating, targetType, url, index)
{
    var params = 'value=' + rating + '&target_id=' + targetId + '&target_type=' + targetType + '&index=' + index;
    url = cleanActionUrls(url);
	new Ajax.Updater('rating-'+targetId, url, {asynchronous:true, evalScripts:true, parameters:params, method:'POST', onComplete: averageImageEditorial });

    return false;
}

/**
 * Takes the AJAX request and JSON header and formats the rating area with
 * total number of votes and average rating
 */
function averageImage(originalRequest, json)
{

    //Swap the the average image and number of votes
    if (json.average) {
        hiliteRating(parseInt(json.average));
       $('numberOfVotes').innerHTML = json.total_count + ' ' + 'votes';

    }

}

/**
 * Takes the AJAX request and JSON header and formats the rating area with
 * total number of votes 
 */
function averageThumbsUpImageEditorial(originalRequest, json)
{
    var ratingDiv = document.getElementById('rating');
    ratingDiv.innerHTML = '<img src="/hive/images/ratings/check.png" width="18" id="rating-thumb-' + json.target_id + '"' +
	' alt=\'Yes\'  title=\'Yes\'/> <span class="thanks">(<span id="numberOfVotes"></span>) Thanks</span>';
    //alert(json.total_count);
    $('numberOfVotes').innerHTML = json.total_count;
     var ratingDiv = document.getElementById('rating-top');
     ratingDiv.innerHTML = '<img src="/hive/images/ratings/check.png" width="18" id="rating-thumb-' + json.target_id + '-top"' +
        ' alt=\'Yes\'  title=\'Yes\'/> <span class="thanks">(<span id="numberOfVotes-top"></span>) Thanks</span>';
    $('numberOfVotes-top').innerHTML = json.total_count;
    hiliteThumbsUpRatingEditorial(1, json.target_id);
    hiliteThumbsUpRatingEditorial(1, json.target_id + '-top');
}

/**
 * Takes the AJAX request and JSON header and formats the rating area with
 * total number of votes 
 */
function averageThumbsUpImageNonEditorial(originalRequest, json)
{
    $('numberOfVotes').innerHTML = json.total_count;
    hiliteThumbsUpRatingNonEditorial(1);
}



function averageImage1(originalRequest, json)
{
    //Swap the the average image and number of votes
    alert("json" +json.average);
    alert("count"+json+total_count);

}

/**
 * Takes the AJAX request and JSON header and formats the rating area with
 * total number of votes and average rating
 */
function averageImageEditorial(originalRequest, json)
{
    //Swap the the average image and number of votes
    if (json.average) {
        hiliteGalleryRating(parseInt(json.average), json.target_id);
		var numberOfVotesId = 'numberOfVotes' + '-' + json.target_id;
        $(numberOfVotesId).innerHTML = json.total_count + ' ' + 'votes';
    }

}


/**
 * Takes upload form fields, sets them into an AJAX request, profanity filtering messages (if present)
 * are returned on the header in JSON format stopping the form submission
 */
function submitUpload(frm)
{
    var titleValue;
    var filePath;
    var ret;
    var file_upload;
    var description;
    var dateTaken;

    titleValue = document.uploadForm["title"].value;
    description = document.uploadForm["description"].value;
    dateTaken = document.uploadForm["md_8"].value;
    sessionUploadUrl = document.uploadForm["session_upload"].value;

    if (titleValue != null && description != null && dateTaken != null && sessionUploadUrl) {
        titleValue = titleValue.replace(/&/, "");
        titleValue = titleValue.replace(/&amp;/, "");
        description = description.replace(/&/, "");
        description = description.replace(/&amp;/, "");
        dateTaken = dateTaken.replace(/&/, "");
        dateTaken = dateTaken.replace(/&amp;/, "");
        sessionUploadUrl = cleanActionUrls(sessionUploadUrl);
        $('uploadFormError').innerHTML = "";
        var requestPlusParams = sessionUploadUrl + '?' + 'title=' + titleValue + '&description=' + description + '&md_8=' + dateTaken;
        //Making a !!!SYNCHRONOUS!!! call here to wait for the response before continuing, without the response
        //and the result we can't tell if there is profanity
        new Ajax.Request(requestPlusParams, {asynchronous:false, evalScripts:true, method:'POST',
            onComplete: profanityCheck});
    }

    //profanity was present -- do not continue
    // vars declared in function 'profanityCheck' are unaccessible and return types are ignored
    // therefore noProfanity has been declared at the global level
    if (noProfanity == 'false') {
        return false;
    }
    else {
        return true;
    }

}

/**
 * Process the JSON profanity header if present and write the messages to the page
 */
function profanityCheck(transport, json)
{
    //Check for custom error message otherwise process as normal
    if (transport.status == 200) {
        //profanity is present is json is not null
        if (json != null) {
            noProfanity = 'false';
            if (json.ugc_profanity_filtered) {
                //Write the profanity message similiar to that of error framework
                var formattedErrorMessages = "<ul>";
                var messageBuffer = "";
                var messageArray = json.ugc_profanity_filtered;
                for (var index = 0; index < messageArray.length; index++) {
                    messageBuffer = messageBuffer + '<li>' + messageArray[index] + '</li>';
                }
                formattedErrorMessages = formattedErrorMessages + messageBuffer + '</ul>';
                $('uploadFormError').innerHTML = formattedErrorMessages;
            }
        } else {
            noProfanity = 'true';
        }
    }

    return false;
}

function checkFieldLength(field, counter, rem, totalAllowed)
{
    if (field && field.value && field.value.length) {
        var len = field.value.length;

        if (len > totalAllowed) {
            field.value = field.value.substring(0, totalAllowed);
            len = totalAllowed;
        }

        document.getElementById(counter).innerHTML = len;
        document.getElementById(rem).innerHTML = totalAllowed - len;
    }
}


// used for disabling file field on media-upload-form.jsp
function dumbMethod()
{
    return false;
}

var vmixMyHomeFileExtensions = [

        ['jpg','image'],

        ['png','image'],

        ['gif','image'],

        ['wmv','video'],

        ['flv','video'],

        ['mp3','audio'],

        ['mov','video'],

        ['qt','video'],

        ['avi','video'],

        ['3g2','video'],

        ['3gp','video'],

        ['mpeg','video'],

        ['mp4','video'],

        ['asf','video'],

        ['mpg','video'],

        ['jpeg','image'],

        ['png','image'],

        ['','']
        ];

function vmixMyHomeIsValidExtension(extension)
{
    var isValidExtension = false;

    for (var i = 0; i < vmixMyHomeFileExtensions.length; i++)
    {
        if (extension.toLowerCase() == vmixMyHomeFileExtensions[i][0]) {
            isValidExtension = true;
        }
    }

    return isValidExtension;
}

function vmixMyHomeGetType(extension)
{
    var type = '';

    for (var i = 0; i < vmixMyHomeFileExtensions.length; i++)
    {
        if (extension.toLowerCase() == vmixMyHomeFileExtensions[i][0]) {
            type = vmixMyHomeFileExtensions[i][1];
        }
    }

    return type;
}

function vmixMyHomeShowFileExtension(input)
{

    if (input.length > 0) {
        var dotPos = input.lastIndexOf(".");
        var extension = input.substr(dotPos + 1);

        //var isValidFileExtension = vmixMyHomeIsValidExtension(extension);
        var type = vmixMyHomeGetType(extension);
        var isValidFileExtension = (type == 'video' || type == 'image' || type == 'audio') ? 1 : 0;

        if (!isValidFileExtension) {
            alert("This isn't a valid file type.");
        }
    }

    return isValidFileExtension;
}
 

function showCommentsForm() { 
  var commentPost = document.getElementById("ugc-comment-form");
  var commentPreview = document.getElementById("previewComment");
  var raminingCommentChars = document.getElementById("remaining");
  if (commentPost.style.display == "block") {	  	
        document.postCommentForm["comment_text"].value = "";
        commentPost.style.display = "none";
	if(commentPreview != null ) {
	    commentPreview.style.display = "none";
	}
	if(raminingCommentChars != null) {
		raminingCommentChars.innerHTML = "1400";
	}
	document.postCommentForm["user_id"].value = "";	
	document.postCommentForm["user_url"].value = "";
	document.postCommentForm["location"].value = "";
  } else {
        checkUserLoginInfo(0);
        if(commentPreview != null ) {
            commentPreview.style.display = "none";
        }
	commentPost.style.display = "block";
        
  }
}

function checkUserLoginInfo(commentId) {
	var corecookie = readCookie('ti_core');
	var uin = "";
	var uie = "";
	var uiz = "";	
	if (corecookie){
		var infocookie = readCookie('ti_info');
		if (infocookie){
			if (cookieEncode(corecookie.substring(1,150)) == readCvalue(infocookie,"tisk")) {
    			    uin = cookieDecode(readCvalue(infocookie,"uin"));
    			    uie = cookieDecode(readCvalue(infocookie,"uie"));
    			    if(readCvalue(infocookie,"cun") == 0) {
			        document.postCommentForm["user_id"].value = uin;
                                if(commentId != 0) {
			            document.forms['reportCommentForm' + commentId].user_id.value = uin;
			        }
                                document.getElementById("ugcUserInfo").innerHTML = '<label for="post-comment-author">Name:</label>' + uin;
			        document.getElementById("ugcUserInfo").style.display = "inline";
			        document.postCommentForm["user_url"].value = uie;
			        uiz = cookieDecode(readCvalue(infocookie,"uiz"));
			        if(uiz != "") {
			            document.postCommentForm["location"].value = uiz;
			        }
			        else {
			            document.postCommentForm["location"].value = "99999";
			        }
			    }
			}
		}
	}
}

function showReportCommentForm(commentId) { 
  var reportCommentPost = document.getElementById("ugc-report-comment-form-" + commentId);
  var formName = 'reportCommentForm' + commentId;

  if (reportCommentPost.style.display == "block") {	  	
        document.forms[formName].report_message.value = "";        
	document.forms[formName].user_id.value = "";	
        document.getElementById("ReportCommentId").innerHTML = "";
	reportCommentPost.style.display = "none";
  } else {
        checkUserLoginInfo(commentId);
        document.forms[formName].submit.disabled = false;
	reportCommentPost.style.display = "block";
        
  }
}


}
/*
     FILE ARCHIVED ON 07:18:31 Oct 25, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:55 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.488
  exclusion.robots: 0.024
  exclusion.robots.policy: 0.015
  esindex: 0.009
  cdx.remote: 9.525
  LoadShardBlock: 98.468 (3)
  PetaboxLoader3.datanode: 98.12 (5)
  PetaboxLoader3.resolve: 1710.675 (3)
  load_resource: 1765.201 (2)
*/