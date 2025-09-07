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

(function($){
	signon = window.signon || {};
	signon.folder = (!!(location.protocol.match(/https/))?"services":"about");
	signon.originHost = carnival.configuration('originHost') || location.protocol+'//'+carnival.configuration('currentDomain');
	signon.currentPath = location.pathname.substring(0,location.pathname.lastIndexOf('/'));
	
	signon.profile = function(data){
		//console.log("SIGNON PROFILE");
		if(undefined === carnival.user.profile('masterId')){
			signon.setupNewUser(); 	//ISO
		}else{	
			signon.teardownNewUser();
		}
		var e = document.createElement('div');
			e.innerHTML =  '<a href="'+signon.originHost+signon.currentPath+'/show-regform.signon?modalClass=registration">d</a>';
			carnival.modal.popit(e.firstChild,
				function(){
				},
				function(){
					if(!carnival.user.profile('newUser')){
						carnival.user.carnivalLogout();
					}
				}
			);
		return false;
	};
	
	carnival.site = carnival.site || {};
	carnival.site.alphaNLSort = function(a,b) {
		//eventually sort on displayOrder for all NL sets, once admin interface is built
		  if (a.description < b.description)
		     return -1;
		  if (a.description > b.description)
		    return 1;
		  return 0;		
	};
	carnival.site.subscription_form = function(){
		carnival.subscription.fired = 0; // carnival.subscription.fired || 0 ;
		//if(!carnival.subscription.fired){
			carnival.subscription.fired++;
			carnival.subscription.getNewsletters(function(data){
				var listName = '';
				var listHolder = $('#subscription-form-field');
				for(var o in data) {
					if(listName != o) {
						listName = (o!='undefined')?o:'Additional Newsletters';
						listHolder.append('<div class="form-list-title bold nl-header">'+listName+'<p class="nl-click-text">Click on plus sign to see newsletter description</p></div>' +
						'<div class="show_nl_desc" rel="'+o.replace(/\s+/g,'')+'">show all <span class="nl-dd-img plus"></span></div>' +
						'<ul class="form-list" id="newsletters-list-'+o.replace(/\s+/g,'')+'" rel="'+o.replace(/\s+/g,'')+'"></ul>');
					}
					//eventually sort on displayOrder for all NL sets, once admin interface is built
					if (o != 'Top Picks') {
						data[o].sort(carnival.site.alphaNLSort);
					}

					carnival.forms.createFormFields("#newsletters-list-"+o.replace(/\s+/g,''),data[o],'#subscription-form-field');
					carnival.utils.changeTextColor();
				}
				
				//add individual collapse attributes and matching rel attributes for individual toggles				
				$('li.nl-item').each(function(i) {
					$(this).children('label').after('<span class="nl-dd-img plus"></span>');
					var theref = $(this).children('input.form_radio').val();
					$(this).find('span.nl-dd-img').attr('ref',theref);
					$(this).children('div.newsletter_description').attr('ref',theref);
				});
				
				var newform = new carnival.forms.form("subscription-form");
				carnival.subscription.getNewsletterSubscriptions(newform.populateData,newform);
				
				//do individual toggles
				$('span.nl-dd-img').click(function(e) {
					e.preventDefault();
					($(this).hasClass('plus'))?$(this).removeClass('plus').addClass('minus'):$(this).removeClass('minus').addClass('plus');
					$('div.newsletter_description[ref='+$(this).attr('ref')+']').slideToggle(400);
				});
				
				$('.newsletter_description').css("clear","left");

				//every third after one, add a clear
				$('#subscription-form-field ul.form-list li:nth-child(2n+1)').css("clear","left");
				
				//in subscriptions modal, get rid of above, then add a clear after every second item
				//$('form.modal-nl-form #subscription-form-field ul.form-list li').css("clear","none");
				//$('form.modal-nl-form #subscription-form-field ul.form-list li:nth-child(2n+1)').css("clear","left");

				$('.newsletter_description').hide();
				
				//do section toggles
				$('.show_nl_desc').click(function(){
					this.blur();
					if ($(this).children('span').hasClass('plus')) {
						this.innerHTML = 'hide all <span class="nl-dd-img minus"></span>';
						$('ul.form-list[rel='+$(this).attr('rel')+']').find('span.nl-dd-img').removeClass('plus').addClass('minus');
						$('ul.form-list[rel='+$(this).attr('rel')+']').find('.newsletter_description').slideDown(400);
					} else {
						this.innerHTML = 'show all <span class="nl-dd-img plus"></span>';
						$('ul.form-list[rel='+$(this).attr('rel')+']').find('span.nl-dd-img').removeClass('minus').addClass('plus');
						$('ul.form-list[rel='+$(this).attr('rel')+']').find('.newsletter_description').slideUp(400);
					}
				
				carnival.utils.changeTextColor();	
				
	        return false;
				});
			});
		//} //if

		$("#subscription-form").submit(function() {
			//errorPlacement: carnival.forms.errorplacement,
			//submitHandler : function(){
				var jUns = $("#subscription-form").find("input[name=subscriptions]:unchecked");
				var uns = [];
				for(var i = jUns.length;i--;){
					uns.push(jUns[i].value);
				}
					if(carnival.user.isLoggedIn() || (carnival.user.profile('isEmailVerified') == 'true' || carnival.configuration('skipVerified') == 'true')){
						carnival.user.getConsumerProfile(function(){	
							carnival.subscription.submitNewsletters(
								//success
								{subs:($("#subscription-form").serializeFormToJson().subscriptions || []),unsubs:uns},
								function(){
									if(carnival.utils.listener.listening('_carnival_newsletters_finish')){
										//drop modal if NL modal (which will call _carnival_newsletter_finish), otherwise make that call here
										if(!carnival.modal.dropit()) {
											carnival.utils.listener.fire('_carnival_newsletters_finish');
										}
									}else {
										window.location = carnival.utils.cleanLocation();
									}
								},
								//error
								function(){
									carnival.forms.errorplacement("An error occurred. Please try again.",$("#signon-heading h1"));
								}
							);
						});
					}else{
						var link = signon.originHost+'/'+signon.folder+'/site/registration/modal.signon';
						var elem = $('<a href="'+link+'" >a</a>');
						carnival.modal.popit(elem[0]);
						carnival.user.afterLogin(function(){
							$("#subscription-form").submit();
						});
					}
				return false;
			//}
		});
	};
	
	signon.setupNewUser = function(){
		carnival.configuration('captchaType',(carnival.configuration('isoCaptchaType')||carnival.configuration('captchaType')||'reCaptcha'));
		carnival.user.profile('newUser',true);
		carnival.user.profile('masterId','gAtVwDLOydoIUNMji77wcA');
	};
	
	signon.teardownNewUser = function(){
		carnival.user.profile('newUser',false);
		carnival.configuration('isoCaptchaType',carnival.configuration('captchaType')||'reCaptcha'); //save captcha for later
		carnival.configuration('captchaType','securityFilter');
		carnival.user.profile('masterId',undefined);
	};
	/*
	if(carnival.user.isLoggedIn()){
		carnival.user.verifyLogin(function(){},function(){carnival.user.logout();})
	}
	*/
	carnival.configuration("interceptCallback" ,signon.profile);
	
	
	
	/*********************************************************
	 *             listeners on carnival events
	 *********************************************************/
	
	var cul = carnival.utils.listener;
	
	cul.listen('_carnival_after_handshake_success',function(){
		//console.log("HANDSHAKE SUCCESS");
		//console.log(carnival.user.profile());
		carnival.user.getConsumerProfile(function(){
			//console.log("GOT CONS PROF");
			carnival.user.profileIncomplete(function(){
				//console.log("DID PROFILE INCOMPLETE");
				$(function(){carnival.configuration("interceptCallback")()});
			},function(data){
				carnival.utils.listener.fire('_carnival_before_user_login');
				carnival.utils.listener.fire('_carnival_user_login');
				carnival.utils.listener.fire('_carnival_after_user_login');
			});
		});
	});
	
	cul.listen('_carnival_user_login',function(){carnival.user.login();})
	
	cul.listen('registration',function(){
		carnival.modal.dropit(true);
		signon.profile();
	});
	
	cul.listen('pass_reset',function(){
		
		var sendTemporaryPassword = carnival.configuration( 'tempPassword' ) || 'false' ;
		
		if( sendTemporaryPassword == "false" ){
			carnival.modal.popit(
				signon.originHost+'/'+
				signon.folder+'/site/registration/reset-password.signon',
				function(){
					$('#carnivalModalWrapper').width( 520 );
					$( '#reset-form' ).submit( function(  ){
						carnival.utils.listener.fire('send_pass_reset');
						return false;
					});
				}
			);
		}
		else{
			carnival.modal.popit(
				signon.originHost+'/'+
				signon.folder+'/site/registration/temp-password.signon',
				function(){
					$('#carnivalModalWrapper').width( 520 );
					$( '#temp-form' ).submit( function( e ){
						e.preventDefault();
						carnival.utils.listener.fire('send_temp_pass');
						return false;
					});
				}
			);
		}
	});
	
	cul.listen('send_temp_pass',function(){
		var f = new carnival.forms.form('temp-form');
		f.formValidator.bindValidator('email', [ "@NotNull", "@Email","@Min=5", "@Profane" ]);
		f.formValidator.bindValidator('zipCode', [ "@NotNull" ]);
		
		var success = f.formValidator.validateForm();
		if (success){
			carnival.user.submitUserTempRequest($('#temp-form').find('#email').val(), $('#temp-form').find('#zipCode').val(),
				function(transport){
					carnival.modal.dropit();
					cul.fire('temp_pass_thanks',
					{
						data:transport
					});
				},	
				function(transport){
					f.populateErrors.call(f,transport);
				}
			);
		}
	});
	
	cul.listen('_carnival_email_taken',function(copy){
		var c = copy && copy.usrMsgs ? copy.usrMsgs : '';	carnival.modal.popit(signon.originHost+'/'+signon.folder+'/site/registration/address-taken.signon',function(){ 
			if( c && c.length)$('#email_address_taken').html(c);
		},
		carnival.user.carnivalLogout);
	});

	cul.listen('send_pass_reset',function(){
		var f = new carnival.forms.form('reset-form');
		carnival.user.submitUserResetRequest($('#reset-form').find('#email').val(),
			function(transport){
				carnival.modal.dropit();
				cul.fire('pass_thanks',{data:transport});
			},	
			function(transport){f.populateErrors.call(f,transport);}
		);
	});
	
	cul.listen('_carnival_pass_create',function(data){
		carnival.modal.popit(
			signon.originHost+'/'+
			signon.folder+'/site/registration/reset-password-form.signon',
			function(){
				var f = new carnival.forms.form('pass-create-form');
				f.addValue('hashToken',data.h_token);
				f.addValue('emailToken',data.email_token);
					$("#carnivalModal").css("z-index", 2147483647);
					$("#carnivalModal").addClass("dialog-wrapper");
				$('#pass-create-form').submit(function(){
					carnival.utils.listener.fire('send_pass_create');
					return false;
				});
			}
		);
	});
	
	cul.listen('send_pass_create',function(){
		var f = new carnival.forms.form('pass-create-form');
		var data = $('#pass-create-form').serializeFormToJson();
		carnival.user.submitUserReset(data,
			function(transport){
				var cMod = $('#carnivalModal');
				cMod.find('h1').html('Thank You');
				cMod.find('.form-list').html('<li>Your password has been successfully changed.</li>');
				cMod.find('.carnivalFormBlock p').remove();
				cMod.find('#signon-submit').remove();
				cMod.find('div.carnival-error').remove();
				carnival.utils.listener.listen('popitClose',function(){window.location.href = carnival.utils.cleanLocation()});
				carnival.utils.changeTextColor();
			},	
			function(transport){f.populateErrors.call(f,transport);}
		);
	});
	
	cul.listen('pass_thanks',function(){
		carnival.modal.popit(
			signon.originHost+'/'+
			signon.folder+'/site/registration/reset-password-thanks.signon',
			function(){}
		);
	});
	
	cul.listen('temp_pass_thanks',function(){
		carnival.modal.popit(
			signon.originHost+'/'+
			signon.folder+'/site/registration/temp-password-thanks.signon',
			function(){}
		);
	});
	
	//extras - newsletter actions
	cul.listen('_carnival_newsletters',function(){
		var nextStep = {};
		nextStep.href = signon.originHost+'/'+signon.folder+'/site/registration/subscription-regform.signon?modalClass=subscription';
		if(window.top!=window){
			carnival.utils.listener.fire('_carnival_newsletters_finish');
		}else{
			carnival.modal.popit(nextStep,
				//callback
				null,
				//close callback
				function(){
					carnival.utils.listener.fire('_carnival_newsletters_finish');
				}
			);
		}
	});

	
	
	/*************************************************************************************************
		    Carnival Flows Namespace for Registration
		
		NOTE - these flows all precede and do not over-write the '_carnival_after_login' event
		 
	****************************************************************************************************/
	
	carnival.flows = function(type) {
		
		var cul = carnival.utils.listener;
		
		var verified = false;
		var extras = [];
		var autosubscribe = false;
		
		// verified / unverified
		if (carnival.user.profile('isEmailVerified') == 'true' || carnival.configuration('skipVerified') == 'true') {
			verified = true;
		}
		
		// Autosubscribe Email 
		if ((carnival.configuration('emailcode') != "") && (carnival.configuration('emailcode') != 'undefined')) {
			autosubscribe = true;
		}
		
		
		/******************************************
		**              THE FLOWS
		*******************************************/
		
		//DEFAULT FLOW
		var doAfterRegistrationFlow = function() {

			//if end of flow is reached (will only happen for verified sso at this point), log the user in
			cul.listen('_carnival_flow_finish',function() {
				carnival.user.login();
			});
			
			
			// Build Extras for this flow - placed w/in individual flow b/c other flows might have 
			// different collection of extras, different orders, etc
			if (!carnival.configuration('extras')) {
				
				//pre-existing from P2P custom section param
				if ((carnival.configuration('skipNewsletters') != "") && ( carnival.configuration('skipNewsletters') !== undefined )) {
					//use same identifying string as the listeners
					extras.push('_carnival_newsletters');
				}

				
				//finally, assign array to carnival config object
				carnival.configuration('extras',extras);
				
			} else {
				//or over-ride
				extras = carnival.configuration('extras');
			}
			
			//autosubscribe - does not need listeners, as is asynchronous and presents no UI.  for verified or unverified users
			if (!!autosubscribe) { 
				try {
					autoSubscribe();
				} catch(e) { carnival.logger.error("Autosubscribe Error: " + e); }
			}
			
			//verification modal and callbacks - NOTE: for unverified registrants, flow ends here with verification modal & email
			if (!verified) {
				var verifyLink = [signon.originHost,signon.currentPath,'/verify-email.signon'].join('');
				carnival.modal.dropit(true);
				carnival.modal.popit(verifyLink,
					//callback
					null,
					//closecallback
					function() {
						carnival.user.carnivalLogout;
						if (!!carnival.configuration('nlcallback')) {
							window.location = carnival.configuration('nlcallback');
						}
					});
			} else {
				//if verified registration, drop reg modal and proceed
				carnival.modal.dropit(true);
			}
			
			
			//Do extras or, if none, log user in (assumed verified)
			if (!!extras.length) {
				carnival.extras(extras,verified); 
				cul.listen('_carnival_extras_finish',function() {
					cul.fire('_carnival_flow_finish',{remove:true});
				});
			} else if (!!verified) {
				cul.fire('_carnival_flow_finish',{remove:true});
			}
			
		}; //doAfterRegistrationFlow
		
		
		//FLOW FOR AFTER SIGNUP FROM PROGREG PAGE
			var doAfterPRregistrationFlow = function() {
				
				
				//if end of flow is reached, log user in
				cul.listen('_carnival_flow_finish',function() {
					carnival.user.login();
				});


				// Build Extras for this flow - placed w/in individual flow b/c other flows might have 
				// different collection of extras, different orders, etc
				if (!carnival.configuration('extras')) {

					//pre-existing from P2P custom section param
					if ((carnival.configuration('skipNewsletters') != "") && ( carnival.configuration('skipNewsletters') !== undefined )) {
						//use same identifying string as the listeners
						extras.push('_carnival_newsletters');
					}


					//finally, assign array to carnival config object
					carnival.configuration('extras',extras);

				} else {
					//or over-ride
					extras = carnival.configuration('extras');
				}

				//autosubscribe - does not need listeners, as is asynchronous and presents no UI.  for verified or unverified users
				if (!!autosubscribe) { 
					try {
						autoSubscribe();
					} catch(e) { carnival.logger.error("Autosubscribe Error: " + e); }
				}

				//verification modal and callbacks - NOTE: for unverified registrants, flow ends here with verification modal & email
				if (!verified) {
					var verifyLink = [signon.originHost,signon.currentPath,'/verify-email.signon'].join('');
					carnival.modal.dropit(true);
					carnival.modal.popit(verifyLink,
						//callback - DO NOT LET USER CLOSE MODAL (ProgReg) --> or close window?
						function() {
							$j('#carnivalModalClose').hide();
							$j('#carnivalModalHead').css('height','12px');
						},
						//closecallback
						function() {
							carnival.user.carnivalLogout;
							if (!!carnival.configuration('nlcallback')) {
								window.location = carnival.configuration('nlcallback');
							}
						});
				} else {
					//if verified registration, drop reg modal and proceed
					carnival.modal.dropit(true);
				}


				//Do extras or, if none, log user in (assumed verified)
				if (!!extras.length) {
					carnival.extras(extras,verified); 
					cul.listen('_carnival_extras_finish',function() {
						cul.fire('_carnival_flow_finish',{remove:true});
					});
				} else if (!!verified) {
					cul.fire('_carnival_flow_finish',{remove:true});
				}

			}; //doAfterPRregistrationFlow
		
		
		//FLOW FOR RETURNING VERIFICATION IN ProgReg CONTEXT
		//NOTE - this flow could be combined with doAfterPRregistration by doing some testing for
		//       verification, but the newly verified user returning to the PR page will never hit regform.js.
		//       So one is truly an after registration flow, and one is not.  Part of the reason for this is 
		//       the desire to show NL modal (an extra) to returning verified users, something otherwise handled on the 
		//       thanks page.
		var doAfterPRverified = function() {
			
			//drop existing modal if still up (and cancel callback in argument)
			carnival.modal.dropit(true);
			
			//if end of flow is reached, log the user in - should kick of ProgReg at that point
			cul.listen('_carnival_flow_finish',function() {
				carnival.user.login();
			});
			
			// Build Extras for this flow - placed w/in individual flow b/c other flows might have 
			// different collection of extras, different orders, etc
			if (!carnival.configuration('extras')) {

				//pre-existing from P2P custom section param
				if ((carnival.configuration('skipNewsletters') != "") && ( carnival.configuration('skipNewsletters') !== undefined )) {
					//use same identifying string as the listeners
					extras.push('_carnival_newsletters');
				}

				//finally, assign array to carnival config object
				carnival.configuration('extras',extras);

			} else {
				//or over-ride
				extras = carnival.configuration('extras');
			}
						
			//Do extras or, if none, log user in (assumed verified)
			if (!!extras.length) {
				carnival.extras(extras,verified); 
				cul.listen('_carnival_extras_finish',function() {
					cul.fire('_carnival_flow_finish',{remove:true});
				});
			} else if (!!verified) {
				cul.fire('_carnival_flow_finish',{remove:true});
			}
						
		} //doAfterPRverified
		
		
		//autoSubscription method
		var autoSubscribe = function() {
			if (!!carnival.configuration('newslist')) {
				var newslist = carnival.configuration('newslist').split(',');
				carnival.subscription.submitNewsletters({subs:newslist,unsubs:[]},
					//success
					function(data) {
						carnival.logger.info('Autosubscribe Success' + data);
					},
					//error
					function(a,b,c) {
						carnival.logger.error("AUTO SUBSCRIBE FAIL" + c);
					});
			} else {
				carnival.logger.info("No Autosubscribe List Found");
			}	
		};
		
		
		//call methods per flow type
		switch(type) {
			case "afterRegistration" : doAfterRegistrationFlow();			   
				break;
			case "afterPRregistration" : doAfterPRregistrationFlow();
				break;
			case "afterPRverified" : doAfterPRverified();
				break;
			default: 
				break;
		}//switch
		
		
	}; //carnival.flows


	/****************************************************
	 *	    Carnival Extras Namespace for Registration
	*****************************************************/

	carnival.extras = function(extrasArray,isVerified) {
		
		var cul = carnival.utils.listener;
		var extrasArray = extrasArray;
		
		//extras currently for verified users only.  if not verified, exit extras
		if (!isVerified) { cul.fire('_carnival_extras_finish',{remove:true}); return false; }
		
		var numOfExtras = (!!extrasArray.length) ? extrasArray.length : 0;
		if (numOfExtras == 0) { carnival.utils.listener.fire('_carnival_extras_finish',{remove:true}); return false; }
				
		var currExtra = 0;
		
		//go to next extra
		var bounceExtra = function() {
			
			//clear previous if hasn't happened already
			if (cul.listening(extrasArray[currExtra])) {
 				cul.kill(extrasArray[currExtra]);
 			}
			
			currExtra++;
						
			//catch any empty extras that might have been passed in
			if (!extrasArray[currExtra]) {
				carnival.logger.error("Empty Extra Called");
				currExtra++;
			}
						
			doExtras();
				
		};
		
		//loop extras Hash
		var doExtras = function() { 
			
			//setup listener string for current extra finish
			var currfinishString = extrasArray[currExtra] + '_finish';
				
			//listen for end or next
			if (currExtra == (numOfExtras-1)) {
				//last extra - on finish exit extras
				cul.listen(currfinishString, function(){
					cul.fire('_carnival_extras_finish',{remove:true});
				});
			} else {
				//on finish of current extra kick off next extra
				cul.listen(currfinishString, function(){
					bounceExtra();
				});
			}
			
			//do current extra and kill listener upon finish
			cul.fire(extrasArray[currExtra], {remove:true});			
			
		}; //doExtra
		
		
		//kick off extras
		doExtras();
				
		
	}; //carnival.extras
	
	
})(jQuery);


}
/*
     FILE ARCHIVED ON 20:06:23 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:56 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.994
  exclusion.robots: 0.044
  exclusion.robots.policy: 0.028
  esindex: 0.014
  cdx.remote: 5.314
  LoadShardBlock: 303.921 (3)
  PetaboxLoader3.datanode: 281.276 (5)
  PetaboxLoader3.resolve: 120.166 (3)
  load_resource: 126.578 (2)
*/