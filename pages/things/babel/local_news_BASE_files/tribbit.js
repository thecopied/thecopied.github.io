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
//signon object	
signon = window.signon || {};
signon.folder = (!!(location.protocol.match(/https/))?"services":"about");
signon.originHost = carnival.configuration('originHost') || location.protocol+'//'+carnival.configuration('currentDomain');

	signon.injectFormProfile = function(){
		if($('#signon-form,#signon-profile').length) {
			var formid = $('#signon-form,#signon-profile')[0].id;
			var f = new carnival.forms.form(formid);
			carnival.captcha.initCaptcha('#carnival_cap');
			carnival.captcha.attachCaptcha(function(data){
				var subHash = window.location.hash.substring(1);
				if (subHash == "thenlpane_e") {
					var jUns = $("#subscription-form").find("input[name=subscriptions]:unchecked");
					var uns = [];
					for(var i = jUns.length;i--;){
						uns.push(jUns[i].value);
					}
					carnival.subscription.submitNewsletters(
						{subs:($("#subscription-form").serializeFormToJson().subscriptions || []),unsubs:uns},
						function(){
							carnival.utils.listener.fire('_carnival_after_login');
						},
						function(){
							carnival.forms.errorplacement("An error occurred. Please try again.",$("#signon-heading h1"));
						}
					);
				} else {
					f.addValue('apiKey',data.validationToken);
					carnival.user.submitConsumerProfile(f.serializeForm('*[name!=subscriptions]'),
					function(){
						carnival.utils.listener.fire('_carnival_after_login');
					},
					function(data){f.populateErrors.call(f,data);}
			);//subCP
			}//if news
			});//attach
		}//if
	}

	
	$( function(){
	
	 			
		/**
		* 	@description  The configuration object passed into modal.popit for the layout, 
		*				  positioning and events
		**/
		var signInNavConfig = {

			/**
			* 	@property{String} layout
			* 	@default "horizontal"
			* 	@description The layout of the modal and its contents
			*/
			layout 				: 'vertical',
			/**
			* 	@property {Boolean} isSticky
			* 	@default false
			* 	@requires currentNavConfig.container
			* 	@description Tells the modal if it should be floating and 
			*				 centered on the page or stuck to a specifc DOM node
			*/
			isSticky 			: true,
			/**
			* 	@property {String} addClass
			* 	@default null
			* 	@description If you want to add an extra class to the modal for styling
			*/
			addClass 			: null,
			/**
			* 	@property {String} addWrapper
			* 	@default null
			* 	@description An additional wrapper you can add to the menu
			*/
			addWrapper			: null,
			/**
			* 	@property {String} container
			* 	@default "body"
			* 	@requires currentNavConfig.isSticky
			* 	@description This is the container element where the modal will be appended to
			*/
			container 			: '#ssorNavSignIn',
			/**
			* 	@property {String} triggerHandler
			* 	@default "#signInLink"
			* 	@description The jQuery id reference to a DOM element that will 
			*				 trigger the modals opening
			*/
			triggerHandler		: '#signInLink',
			/**
			* 	@property {String} eventType
			* 	@default "click"
			* 	@description The event type that is listening to the triggerHandler DOM element
			*/
			eventType 			: 'click',
			/**
			* 	@property {Boolean} eventPreventDefault
			* 	@default false
			* 	@description Turns on the ability to prevent the events default repsonse
			*/
			eventPreventDefault : true
		
		};

		
		var a = new memberNav( '#memberLoginInfo'
		,null,
		function(){

			var signInLinkUrl = (carnival.configuration('ssorSignInLinkUrl') || "");
			var signUpLinkUrl = (carnival.configuration('ssorSignUpLinkUrl') || "");

			var backgroundColor = carnival.configuration( 'ssorNavBackgroundColor' ) || "";
			var navLocation = $( '#memberLoginInfo' );
			navLocation.html('');

			signUpLinkUrl = ((signUpLinkUrl!="") ? ("window.location='"+signUpLinkUrl+"'") : "");
			signUpLinkUrl = ((signUpLinkUrl!="") ? signUpLinkUrl : "carnival.user.resetUser();return signon.profile();");

			var navTemplate = '<div id="ssorNavSignIn">'+
									'<div id="ssorNavHeader">'+
										'<span id="signInLink" class="link">Sign In</span>'+
										'<span> or </span>'+
										'<span id="signUpLink" class="link" onclick="'+signUpLinkUrl+'" >Sign Up</span>'+
									'</div>'+
								'</div>';
			
			navLocation.append( navTemplate );

			if( backgroundColor ){
				$( '#ssorNavHeader' ).css( 'background-color', backgroundColor );	
			}
			
			carnival.utils.changeTextColor();

			/**
			*	@memberOf carnival.modal.popit
			* 	@description  Invokes the carnival popit method and returns the mini modal window with its current 
			*				  set of optional configs	
			**/
			var signOnLink = signon.originHost+'/'+signon.folder+'/site/registration/modal.signon';

			if (signInLinkUrl!="") {
				$('#signInLink').click( function(){ window.location = signInLinkUrl });
			}
			else {
				carnival.modal.popit( signOnLink, null, null, signInNavConfig );
			}

				//adjust height for different market classified bar heights
				var signInHeight = $('#classified-bar').outerHeight(true);
				var CBwidth = $('#classified-bar').outerWidth(true);
				var topMargin = $('#classified-bar').css('margin-top');
				var signInPadding = (signInHeight - $('#signInLink').height()) / 4;
				var $ssNH = $('#ssorNavHeader');
				var ssHNwidth = $ssNH.outerWidth(true);
				
				if(signInPadding < 0) 
				   signInPadding = 0;
				
				$ssNH.css('height',(signInHeight - signInPadding));	
				$ssNH.css('padding-top',signInPadding+'px');
				
			}).writeNav();
			
			$('#signInLink').click( function(){
				carnival.user.resetUser();
			});
					
					
	});

	//listeners on carnival events
	var cul = carnival.utils.listener;

	cul.listen('_carnival_activate_done',function(){
		if(carnival.configuration('activateMessages') == 'true'){ 
			carnival.modal.popit(
				signon.originHost+'/'+
				signon.folder+'/site/registration/activate-done.signon'
			);
		}
	});

	cul.listen('_carnival_activate_error',function(){
		if(carnival.configuration('activateMessages') == 'true'){
			carnival.modal.popit(
				signon.originHost+'/'+
				signon.folder+'/site/registration/activate-error.signon'
			);
		}
	});
	
	cul.listen('_carnival_pass_change',function(data){

		carnival.modal.popit(
			signon.originHost+'/'+
			signon.folder+'/site/registration/reset-password-form.signon',
			function(){
				var f = new carnival.forms.form('pass-create-form');
				$('.form-list').prepend(
					'<li><label class="label" for="email">Email Address</label><input class="email input" name="email" id="email"></li>'+
					'<li><label for="oldPassword" class="label">Old Password</label><input id="oldPassword" name="oldPassword" type="password" class="email input"></li>'
				);
				
				carnival.utils.changeTextColor();
				
				
				/******************************************
					Validator for Change Password Form
				*******************************************/
					//TODO merge with other validation 
					
					/**
					 * @namespace changePasswordForm
					 * @description  object literal that contains all of the necessary 
					 * 				methods and properties to handle the change password form validation
					 */
					var changePasswordForm = {

						/** 
						* 	@property {Object} $resetPasswordForm
						* 	@description The jQuery collection pointer to the change password Form
						**/
						$changePasswordForm: $( '#pass-create-form' ),

						/** 
						* 	@property {Function} init
						* 	@description The initialization method which clears the form and readies it for use
						*   @return void
						**/
						init: function(){
							this.removeErrors();
							this.formValidatorController( this.$changePasswordForm );	
						},

						/**
						 * @namespace inputValidationRules
						 * @description  Contains all inputValidation rules for all inputs in the change password field
						 */
						inputValidationRules:{

							password:{
								notBlank 	: {
									errorMessage: 'Field cannot be blank'
								},
								minLength :{
									lengthToCheck: 6,
									errorMessage: 'Password must be at least 6 characters'
								}
							},

							password2:{
								notBlank 	:  {
									errorMessage: 'Field cannot be blank'
								},
								minLength :{
									lengthToCheck: 6,
									errorMessage: 'Password must be at least 6 characters'
								},
								compareEquality : {
									errorMessage: 'Password and confirm password must match',
									valuesToCompare: [ 'password', 'password2' ]
								}
							},

							email:{
							 	notBlank 	: {
									errorMessage: 'Field cannot be blank'
								}
							},

							oldPassword:{
								notBlank 	: {
									errorMessage: 'Field cannot be blank'
								}					
							}

						},

						/**
						 * @namespace validators
						 * @description  A collection of form validators
						 */
						validators:{

							/** 
							* 	@property {Function} email
							* 	@param {String} value The value of an input field to be validated
							* 	@description An email validator to match test the passed input value 
							* 				 with a regular expression pattern
							*   @return {Boolean} true is returned if a valid email pattern is found
							**/
							email: function( value ){
								var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
								return emailRegex.test( value );  
							},

							/** 
							* 	@property {Function} notBlank
							*   @param {String} value The value of an input field to be validated
							* 	@description A notBlank validator to determine if the value of the input 
							* 				 passed is blank
							* 	@return {Boolean} true is returned if the value is not an empty string
							**/
							notBlank: function( value ){ 
								return  value == ""  ? false : true;
							},

							/** 
							* 	@property {Function} minLength
							*   @param {String} value The value of an input field to be validated
							* 	@description
							* 	@return {Boolean}
							**/
							minLength: function( value , minLength ){
								return ( value.length < minLength ) ? false : true;		
							},

							/** 
							* 	@property {Function} maxLength
							*   @param {String} value The value of an input field to be validated
							* 	@description
							* 	@return {Boolean}
							**/
							maxLength : function( value , maxLength ){
								return ( value.length > maxLength ) ? false : true;
							},

							/** 
							* 	@property {Function} maxLength
							*   @param {String} valueOne The value of an input field to be validated
							*   @param {String} valueTwo The value of an input field to be validated
							* 	@description
							* 	@return {Boolean}
							**/
							compareEquality : function( valueOne, valueTwo ){
								return valueOne === valueTwo;
							}

						},

						/** 
						* 	@property {Function} removeErrors
						* 	@description  Removes all error messages from the form
						* 	@return void
						**/
						removeErrors : function( ){

							var $errorsToClear = this.$changePasswordForm.find( '.carnival-error' );
							$errorsToClear.remove();

						},

						/** 
						* 	@property {Function} removeErrors
						*   @param {Object} form A jQuery collection pointer to the change password form
						* 	@description  Controller for all form validation and error handling
						* 	@return void
						**/
						formValidatorController: function( form ){

							 /** 
							 * 	@function collectFormInputs
							 * 	@private
							 * 	@description Grabs a collection of all input fields for a particular form {formId}
							 * 	@return {Object} inputs A hash representing the form input fields
							 **/
							 var collectFormInputs = function(){

								 /**
								  * A jQuery collection of all inputs
								  */
								 var $thisFormInputs = form.find( 'input' );
								 var inputs = {}; 

								 /**
								  * Iterate over the inputs and create an object that references 
								  * input fields within the form
								  */
								 $thisFormInputs.each( function(){

									 var thisName = $( this ).attr( 'id' );
									 var thisValue = $( this ).val();

									 inputs[ thisName ] = thisValue;


								 });

								 return inputs;

							 }();

							 /** 
							 * 	@function validateRules
							 * 	@private
							 *	@param rules {Object} The validation rules to check against
							 *  @param inputValue {String|Number} The value to validate
							 * 	@description Validates an input based on a series of rules
							 * 	@return {Array} Returns a collection of form errors
							 **/
							var validateRules = function( rules , inputValue ) {

								var isValid = null;
								var value = null;
								var valueTwo = null;
								var errorCollection = [];
								var error = {};

								 /** 
								 * 	@function isObjectEmpty
								 * 	@private
								 *	@param obj {Object}  The object to check against
								 * 	@description Checks to see if the object argument is empty
								 * 	@return {Boolean} Returns true if the object is empty
								 **/
								var isObjectEmpty = function ( obj ) {
								    for( var prop in obj ) {
								        if( obj.hasOwnProperty( prop ) ){
								        	return false;
								        }     
								    }
								    return true;
								};


								for( var rule in rules ){

									if ( !rules.hasOwnProperty( rule ) ) {
										continue;
									}

									if( rules[ rule ].hasOwnProperty( 'valuesToCompare' ) ){
										value = $( '#' + rules[ rule ].valuesToCompare[ 0 ] ).val();
										valueTwo = $( '#' + rules[ rule ].valuesToCompare[ 1 ] ).val();
										isValid = changePasswordForm.validators[ rule ]( value, valueTwo );

									}
									else if(  rule == 'minLength' ){
										isValid = changePasswordForm.validators[ rule ]( value, rules[ rule ].lengthToCheck );
									}
									else{
										value = inputValue;
										isValid = changePasswordForm.validators[ rule ]( value );
									}

									if( !isValid ){

										if( !error[ rule ] ){
											error[ rule ] = rules[ rule ].errorMessage;

										}

									}

								}

								if( !isObjectEmpty( error ) ){
									errorCollection.push( error );	
								}
								return errorCollection;

							};

							/** 
							 * 	@function displayError
							 * 	@private
							 *	@param inputId {String}  The input to append the errors to
						 	 *	@param errors {Object}  The object of errors to display
							 * 	@description Displays errors based on the input field that failed validation
							 * 	@return void
							 **/
							var displayError = function( inputId, errors ){

									var $input = $('#' + inputId );
									var errorContainer ="";
									var errorToCheck = "";
									var $errorParentContainer = "";

									for( var error in errors ){

										if ( !errors.hasOwnProperty( error ) ) {
											continue;
										}

										$errorParentContainer = $input.parent();
										errorToCheck = $errorParentContainer.find('.carnival-error .' + error );
										if( errorToCheck.length == 0 ){
											errorContainer = '<div class="carnival-error ' + error + '">' + errors[ error ] + '</div>'
											$input.after( errorContainer );
										}

									}


							};

							/** 
							 * 	@function validateFormInputs
							 * 	@private
							 *	@param inputs {Object}  The inputs to validate
						 	 *	@param rulesToValidate {Object}  The rules to validate against
							 * 	@description Validates the form inputs based on a set of rules
							 * 	@return void
							 **/
							var validateFormInputs = function( inputs , rulesToValidate ){

								var rules = null;
								var value = null;
								var errors = null;
								var success = true;

								for ( var name in inputs ) {

									if ( !inputs.hasOwnProperty( name ) ) {
										continue;
									}

									rules = rulesToValidate[ name ];
									value = inputs[ name ];

									if( rules ){
										errors = validateRules( rules , value );

										if( errors.length > 0 ){

											for( var i = 0, errorsLength = errors.length; i < errorsLength; i++ ){
												displayError( name, errors[ i ] );
											}

											success = false;
										}

									}

								}

								if( success ){
									changePasswordForm.submitForm();	
								}

							};

							validateFormInputs( collectFormInputs , this.inputValidationRules );

						},
						
						/** 
						 * 	@function submitForm
						 * 	@private
						 * 	@description Upon successful validation submits the form
						 * 	@return void
						 **/
						submitForm: function(){
							carnival.utils.listener.fire('send_pass_change');
							return false;
						}

					};
				
				
					$('#pass-create-form #signon-submit').click( function(){
						changePasswordForm.init();
						return false;
					});
				
			}
		);
	});
	
	cul.listen('send_pass_change',function(){
		var f = new carnival.forms.form('pass-create-form');
		var data = $('#pass-create-form').serializeFormToJson();
		carnival.user.submitUserChange(data,
			function(transport){
				carnival.modal.dropit();
			},	
			function(transport){f.populateErrors.call(f,transport);}
		);
	});
	
// controllers
carnival.site = window.carnival.site || {};

carnival.site.profile_form = function(){
		carnival.configuration('captchaType','securityFilter');
		try{$(function(){carnival.utils.birthyear();});}catch(e){}
		carnival.captcha.initCaptcha('#carnival_cap');
		carnival.captcha.getCaptcha(function(data){
			$('#carnival_cap').append(data.htmlText);
		});
	
		var f = new carnival.forms.form('signon-profile');
		carnival.user.getConfigRules(f.formatForm,f);
		carnival.user.getConsumerProfile(function(){
			carnival.user.profile('emailArray',carnival.user.getEmailAddresses());
			f.populateData(carnival.user.profile());
			f.addValue('facebookMessage','');
			f.addValue('sendNewRegistrationEmail','');
			f.addValue('twitterMessage','');
		});
	
		var $birthMonth = $( "#birthMonth" );
		var $birthYear = $( "#birthYear" )
		var $birthDay = $( "#birthDay" );
	
		f.formValidator.bindValidator( "email" , [ "@NotNull", "@Email","@Min=5", "@Profane" ] );
		f.formValidator.bindValidator( "password" , [ "@NotNull","@Min=6", "@Profane" ] );
		f.formValidator.bindValidator( "userName" , [ "@Profane" ] );
		f.formValidator.bindValidator( "currentAge" , [ "@NotNull", "@OfAge=13"] );
		
		$("#birthMonth, #birthYear, #birthDay").bind( "change" , function(){
			if( checkedIfAllDatesEntered() ){
				populateFullDate ( calculateFullDate() );
			}
		});

		var checkedIfAllDatesEntered = function(){
			return ( $birthMonth.val() != "" ) && ( $birthDay.val() != "") && ( $birthYear.val() != "");
		};

		var calculateFullDate = function(){
			return $birthMonth.val() + "/" + $birthDay.val() + "/" + $birthYear.val();
		};
		
		var populateFullDate = function( date ){
			$( "#currentAge" ).val( date );
		};
		
		var checkForBirthdate = function(){
			if( checkedIfAllDatesEntered() ){
				populateFullDate ( calculateFullDate() );
			}
		}

		carnival.utils.listener.listen('formPopulated', checkForBirthdate );

		$( "#signon-profile" ).submit( function( event ){ 

			event.preventDefault();

			var success = f.formValidator.validateForm();

			if( success ){
				carnival.captcha.verify();
				//REG-1093
				carnival.forms.disableButton( $("#signon-submit") );
			}
			else{
				return false;
			}

		});
		
	
		try{
			if($('input[name=userName]').val().length)$('input[name=userName]').change();
		}catch(e){}
		
		signon.injectFormProfile();	

}

//UNLINK
carnival.site.unlink = function(selector){
		carnival.user.getConsumerProfile(function(){
			var p = carnival.user.provider();
			for( var i in p){
				if(!i.match(/isoprovider/))
					$(selector || "#signon-linked-accounts").append("<div class='providerOption'><div class='signon-logo' id='"+i.toLowerCase().split(/\s+|\.|!/)[0]+"'><span>"+i.toLowerCase()+"</span></div></div>");
			}
		});
}

carnival.site.link_options = function(url){

	$(function(){
		if(url) {
			if( !url.match('loginHost=')){
				url = url+'&r='+(new Date()).getTime()+'&loginHost='+url.match((new RegExp('^((?:f|ht)tp(?:s)?\://(?:[^/]+))','im')))[1].toString();
			}
			$.ajax({
				url:url,
				success:function(e){
				$("#signon-linked-accounts").append(e)
				},
				error:carnival.site.unlink
			});
		} else {
			carnival.site.unlink();
		}
		$('#email').parent('li').append('<div id="link-additions" > \
		<div id="link-additions-choices" style="display:none"> \
		<iframe src="'+carnival.configuration('hostname')+'/registration/link.jsp?callbackUrl='+ document.location.protocol+'//'+document.location.hostname+'/services/site/registration/popupclose.signon" width="510" scrolling="no" height="200" frameborder="0" style="border:0;margin-bottom:10px;"></iframe> \
		</div> \
		</div>');
		var linkEl = $('<a href="#" class="add_acct_link">Link Additional Accounts</a>').insertBefore('#link-additions');
		linkEl.click(function(){
			$('#link-additions-choices').show(); return false;
		});
	});
}

carnival.site.link_options_profile = function(url){

	$(function(){
		if(url) {
			if( !url.match('loginHost=')){
				url = url+'&r='+(new Date()).getTime()+'&loginHost='+url.match((new RegExp('^((?:f|ht)tp(?:s)?\://(?:[^/]+))','im')))[1].toString();
			}
			$.ajax({
				url:url,
				success:function(e){
				if(e.match(/NASCAR/)){
					carnival.site.unlink("#signon-linked-accounts");
				}else{
					$("#signon-linked-accounts").append(e);
				}
				},
				error:function(){carnival.site.unlink("#signon-linked-accounts")}
			});	
		} else {
			carnival.site.unlink("#signon-linked-accounts");
		}
	});
}

carnival.site.link_options_profform = function(url){

	$(function(){
		if(url) {
			if( !url.match('loginHost=')){
				url = url+'&r='+(new Date()).getTime()+'&loginHost='+url.match((new RegExp('^((?:f|ht)tp(?:s)?\://(?:[^/]+))','im')))[1].toString();
			}
			$.ajax({
				url:url,
				success:function(e){
				if(e.match(/NASCAR/)){
					carnival.site.unlink("#signon-linked-accounts-form");
				}else{
					$("#signon-linked-accounts-form").append(e);
				}
				},
				error:function(){carnival.site.unlink("#signon-linked-accounts-form")}
			});	
		} else {
			carnival.site.unlink("#signon-linked-accounts-form");
		}
		$('#acct-links-form').append('<div id="link-additions-form" > \
		<div id="link-additions-choices-form" style="display:none; margin-left:4px;"> \
		<iframe src="'+carnival.configuration('hostname')+'/registration/link.jsp?callbackUrl='+ document.location.protocol+'//'+document.location.hostname+'/services/site/registration/popupclose.signon" width="320" scrolling="no" height="370" frameborder="0" style="border:0;margin-bottom:10px;"></iframe> \
		</div> \
		</div>');
		var linkEl = $('<a href="#" class="add_acct_link">Link Additional Accounts</a>').insertBefore('#link-additions-form');
		linkEl.click(function(){
			$('#link-additions-choices-form').show();
			return false;
		});
	});
}

carnival.site.thanks_page = function(){
	$('#view-profile-link').click(function(){
		if(!carnival.user.isLoggedIn()){
		
			var link = signon.originHost+'/'+signon.folder+'/site/registration/modal.signon';
			var elem = $('<a href="'+link+'" >a</a>')
			carnival.modal.popit(elem[0]);
			
			carnival.user.afterLogin(function(){
				window.location.href = $('#view-profile-link')[0].href;
			});
			return false;
		}
	});
	carnival.utils.listener.listen('_carnival_newsletters_finish',function(){
		$('#subscription-form').html('<div class="left" ><h2>Thank you for subscribing to our online newsletters.</h2></div>');
	});
};


carnival.site.subscription_links = function() {
	$('.subscription_links').click(function(){
		carnival.subscription.fired =  0 ;
		carnival.modal.popit(this);return false;
	});
	carnival.subscription.getNewsletters(function(data){if(!data)$('#newsletter-signup').hide();});
	carnival.subscription.getNewsletterSubscriptions(function(data){
		var values = [];
		for(var i in data){
			values.push(data[i]);
		}
		//TO DO: Order NL displays by alpha
		if(!values.length){
			$('#newsletter-list').html('<p>You are currently not subscribed to any newsletters.</p>');
		}else{
			$('#newsletter-list').html('<ul><li>' + values.join('</li><li>') + '</li></ul>');
		}
	});
}

carnival.site.subscription_links_profile = function() {
	
	carnival.subscription.fired = 0;
	
	carnival.subscription.getNewsletters(function(data){if(!data)$('#newsletter-signup').hide();});
	carnival.subscription.getNewsletterSubscriptions(function(data){
		var values = [];
		for(var i in data){
			values.push(data[i]);
		}
		if(!values.length){
			$('#newsletter-list').html('<p>You are currently not subscribed to any newsletters.</p>');
		}else{
			$('#newsletter-list').html('<ul class=\"prof-subs\"><li>' + values.join('</li><li>') + '</li></ul>');
		}
	});
}

// PROFILE UI handler functions

setup_profile = function() {
	
	$('.pw').hide();

	if (window.location.hash) {
		var sendhash = window.location.hash.substring(1);
		var showedit = sendhash.substring(sendhash.length-2);
		var valhash = sendhash.substring(3);
		if ( $('.profile-tab-nav > ul > li').is('[rel='+valhash+']') ) {
			// a - ok
		} else if (showedit == "_e") { 
			var tabrel = "";
			make_edit();
			$('.edit-link').html("View Profile");
		} else {
			sendhash = "theacpane";
		}
		setuppane(sendhash);
	} else {
		setuppane("theacpane");
	}
	
}//end setup_profile

$(function() {

	var cxFlag = 0;  //1=warning
	
	//newsletter form fix
	$('.unlinksso').click(function(event) {
		event.preventDefault();
		carnival.site.unlinkprof();
	});
	
	$('.profile-tab-nav > ul > li').click(function(event) {
		if (cxFlag == 0) {
			var whichpane = "the" + $(this).attr("rel");
			var forposthash = whichpane.substring(whichpane.length-2);
			if (forposthash == "_e") {
				postHash = "#the" + $(this).attr("rel");
				postHash = postHash.substring(0,postHash.length-2);
				newCallback = oldCallback + postHash;
			}
			
			setuppane(whichpane);
			
		}
	});
	
	
	//subscription add/modify link
	$('.subscription_links').click(function(event) { 
		event.preventDefault();
		var tabrel = "";
		postHash = "#thenlpane";
		newCallback = oldCallback + postHash;
		make_edit();
		$('.edit-link').html("View Profile");
		setuppane("thenlpane_e");
	});
	
	$('a#signon-cancel').click(function(event) {
		if (cxFlag == 0) {
			event.preventDefault();
			var newhash = window.location.hash.substring(1);
			var tabrel = "";
			make_view();
			$('.edit-link').html("Edit Profile");
			newhash = newhash.substring(0,(newhash.length-2));
			setuppane(newhash);
			if (newhash == "thenlpane") {
				window.location.reload();
			}
		}
	});
	
	$('a#au-cancel').click(function(event) {
		event.preventDefault();
		window.location = oldCallback;
	});
		
	$('.edit-link').click(function(event) {
			var newhash = window.location.hash.substring(1);
			var tabrel = "";
			if ($(this).html() == "Edit Profile") {
				$(this).html("View Profile");
				make_edit();
				postHash = "#" + newhash;
				newCallback = oldCallback + postHash;
				newhash += "_e";
			} else {
				if (cxFlag == 0) {
					$(this).html("Edit Profile");
					make_view();
					newhash = newhash.substring(0,(newhash.length-2));
				}
			}
			setuppane(newhash);
			event.preventDefault();
	});
	
	$('#pwtoggle').click(function() {
		if ($(this).is(':checked')) {
			$('.pw').show();
		} else {
			$('.pw').hide();
		}
	});
	
	
	// leave page on edit warning functions
	$('#signon-profile').find(':input').focus(function() {
		$(this).change(function() {
			cxFlag = 1;
		});
	});
	
	//are you sure? modal on change and leave pane
	$('.edit-link,.profile-tab-nav > ul > li').click(function(event) {
		if (cxFlag == 1) {
			carnival.modal.popit($('#panewarning').val(),function(){
					
					$('button#panewarning-no').click(function() {
						window.location.reload();
					});
					$('button#panewarning-cancel').click(function() {
						carnival.modal.dropit();
					});
					$('button#panewarning-yes').click(function() {
						carnival.modal.dropit();
						$('form#signon-profile').submit();
					});
					
				});
			event.preventDefault();
		}//if
		
	});
	
	$('.pwchange').click(function(event) {
		event.preventDefault();
		carnival.utils.listener.fire('_carnival_pass_change')
	});
	
	//workaround for NL link on membernav dropdown
	$('#NLddlink').live('click',function(e) {
		//only execute this block on a profile page
		var prrx = /show-profile/i;
		if (prrx.test(window.location.pathname)) {
			e.preventDefault();
			setuppane("thenlpane");
		}
	});
		
}); //be in jquery

function setuppane(thepane) {
	var nlFlag = 0;
	var tab = $('.profile-tab-nav > ul > li');
	var relpane = thepane.substring(3);
	var edbool = relpane.substring(relpane.length-2);
	if (edbool == "_e") {
		if (relpane != "avpane_e") {
			$('#termsbox').show();
			$('#submitbox').show();
		} else { 
		 	$('#termsbox').hide();
			$('#submitbox').hide();
		}
	} else {
		$('#termsbox').hide();
		$('#submitbox').hide();
	}
	if (tab.hasClass("tab")) {
		$('div#profile-content > div').hide();
		$('div#profile-content > div#'+ relpane).show();
		$('.current_tab').removeClass("current_tab").addClass("tab");
		$('.profile-tab-nav > ul > li[rel='+relpane+']').removeClass("tab").addClass("current_tab");
	}
	if (relpane == "avpane") {
		$('#avatar-display img').attr('src',$('#avatar-display img').attr('src').replace(/\?+.*$|$/,'?'+(new Date()).getTime()));
	}
	window.location.hash = thepane;
	$('a.edit-link').attr("href","show-profile.signon#" + thepane);
}//setuppane

function make_edit() {
	$('.profile-tab-nav > ul > li').each(function(index) {
		tabrel = $(this).attr("rel");
		tabrel += "_e";
		$(this).attr("rel",tabrel);
		(carnival.user.is3rdPartyLogin()) ?	$('.pw').hide() : $('.pw').show();
	});
}//

function make_view() {
	$('.profile-tab-nav > ul > li').each(function(index) {
		tabrel = $(this).attr("rel");
		tabrel = tabrel.substring(0,(tabrel.length-2));
		$(this).attr("rel",tabrel);	
	});
}


})(jQuery);



}
/*
     FILE ARCHIVED ON 20:06:19 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:55 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.498
  exclusion.robots: 0.033
  exclusion.robots.policy: 0.023
  esindex: 0.01
  cdx.remote: 18.66
  LoadShardBlock: 620.608 (3)
  PetaboxLoader3.datanode: 610.864 (4)
  PetaboxLoader3.resolve: 100.667 (2)
  load_resource: 109.976
*/