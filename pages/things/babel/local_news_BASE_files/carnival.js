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

//////////////////////////////////
//
//  Latest change notes: 
//	- implement Remember Me Front End Cookie  2010-04-26
//
/////////////////////////////////

jQuery.extend(jQuery.fn,{
	serializeFormToJson : function(selector){
		var o = {};
		var a = this.find('select,input,textarea');
		a = ((selector)?a.filter(selector):a.not("*[skip=skip]"))
		.filter(function() {
			return this.name && !this.disabled && this.type!='submit';
		});
		jQuery.each(a, function() {
			var v = (!(/checkbox|radio/).test(this.type) || this.checked) ? (jQuery(this).val()) : '';
			if (o[this.name] && o[this.name].length) {
				if(v !== ''){
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(v|| '');
				}
			} else {
				o[this.name] = v || '';
			}
		});
		return o;
	}
});

/**
 * carnival
 * @namespace
 */
var carnival = function($,document,window,undefined){
	var config= {};

	/**
	 * init - Constructor for carnival object
	 * @constructor
	 */
	var init = function(configs){
		

			config = {
				currentDomain : document.domain +(document.location.port.length ? (':'+document.location.port) : ''),
				cookieDomain : getCookieDomain(),
				c_mid : 'c_mId',
				c_unm : 'c_unm',
				c_llp : 'c_llp',
				c_rmc : 'c_rmc',
				c_prh : 'c_prh',
				c_prg : 'c_prg',
				userPath : '/registration',
				subscribePath : '/registration/subscription',
				modalCloseButton : '/hive/images/close.png',
				activateMessages : 'true'
			};

			if (!config.carnivalRM) {
				config.carnivalRM = 'init';
			}

			config = carnival.utils.merge(config,configs);

			if(!config.WSHostname){config.WSHostname = config.hostname;}
			carnival.user.getCookieProfile();
			handshake();
			carnival.utils.listener.listen('handshake',handshake);


	};

	/**
	 * getCookieDomain - gets the proper domain name that cookies should be set on
	 */
	var getCookieDomain = function(){
		var dDom = document.domain;
		return dDom.match(/^[0-9]{1,3}(\.[0-9]{1,3}){3}$/)?
			dDom //ip address
			:(dDom.split('.').length<3)?
				"."+dDom
				:!dDom.match(/\.trb$/)?
					"."+dDom.split('.').slice(1).join('.')
					:dDom.match(/\.(testprod|test|design|local)\.(tii|tila)\.trb$/)?
						"."+dDom.split('.').slice(-4).join('.')
						:"."+dDom.split('.').slice(-3).join('.');
	};

	/**
	 * handshake - method for determining actions based on URL parameters
	 */
	var handshake = function(argToken){
				
		// Getting URL var by its name
		var token = carnival.utils.getUrlVar('token');
		// Getting URL var by its name
		var isLogout = carnival.utils.getUrlVar('logout');
		
		
		//Gigya ISO cookie param for dynamic login
		if (!!argToken && argToken['ssopscn'] && argToken['ssopscv']) {
				carnival.configuration('ssopscn',argToken['ssopscn']);
				carnival.configuration('ssopscv',argToken['ssopscv']);
			}
		
		if(token===undefined && argToken!==undefined){
			if (!!argToken['autoLoginToken']) {
				//dynamic case
				token = argToken['autoLoginToken'];
			} else {
				//normal case through modal-close.jsp / .js
				token = argToken;
			}
		}
		
		
		if(isLogout == 'true' && argToken===undefined){
			if(carnival.user.isLoggedIn()){
				carnival.user.logout();
			}
			$(function(){carnival.utils.listener.fire('_carnival_after_logout_success');});
		} else {
			if( token !== undefined && !carnival.user.isLoggedIn() ){
				if(!!token) {
					//console.log("SHAKE SEES TOKEN");
					carnival.user.getBasicUserInfo(token,function(data){
						if(data.displayName=="trb_system"||data.id=="trbsignontoken_qaz_wsx"){
							//console.log("HANDSHAKE: TrbSystem Logout Case");
							carnival.user.carnivalLogout();
						}else if(data.isEmailExists == 'true' && data.isEmailVerified == 'true' && data.isConsumerProfileVerified !='true'){
							//console.log("HANDSHAKE: Email Token Case");
							$(function(){carnival.utils.listener.fire('_carnival_email_taken',{data:[data.sameEmailProvider]});});
						}else{
							//console.log("HANDSHAKE: After Handshake Success");
							$.cookies.del(configuration('c_unm'),{domain:configuration('cookieDomain'),path:'/'});
							$.cookies.del(configuration('c_llp'),{domain:configuration('cookieDomain'),path:'/'});
							$(function(){carnival.utils.listener.fire('_carnival_after_handshake_success');});
						}
					});
				} else {
					carnival.user.carnivalLogout();
				}
			} else if(carnival.utils.getUrlVar('verified') == 'true'){
				// removed to support ProgReg after verify flow - legacy listener, unused
				//$(function(){carnival.utils.listener.fire('_carnival_activate_done');});
			} else if(carnival.utils.getUrlVar('verified') == 'false'){
				$(function(){carnival.utils.listener.fire('_carnival_activate_error');});
			}	 else if(token !== undefined){
				window.location = carnival.utils.cleanLocation();
			} else if(carnival.utils.getUrlVar('reset_flag') !== undefined){
				//check for new modal library and show old modal if it does not exist
				$(document).ready( function(){
					if ( !window.registration ){
						var rFlag = carnival.utils.getUrlVar('reset_flag');
				
						if(rFlag ==='true'){
							$(function(){carnival.utils.listener.fire('_carnival_pass_create',
								{data:[{
									h_token:carnival.utils.getUrlVar('h_token'),
									email_token:carnival.utils.getUrlVar('email_token')
								}]}
							);});
						}else if(rFlag ==='false'){
							$(function(){carnival.utils.listener.fire('_carnival_pass_create_error');});
						}
				  }
		    });
			}
		}
		carnival.utils.listener.fire('_handshake_completed');
	};

	var afterHandShakeSuccess = function(func,scope){
		if(func && func.constructor == Function){
			carnival.utils.listener.listen('_carnival_after_handshake_success',func,scope);
		}
	};

	var afterHandShakeFail = function(func,scope){
		if(func && func.constructor == Function){
			carnival.utils.listener.listen('_carnival_after_handshake_fail',func,scope);
		}
	};

	/**
	 * configuration - Dynamic getter/setter for carnival configurations.  If no arguments
	 *   are passed, config object is returned.
	 * @param {String|Object} key Can be a string containing the name of the configuration
	 *   or an object containing configurations.
	 * @param {Object} value Value of cofig element set
	 */
	var configuration = function(key,value){
		if(key){
			if(key.constructor == String) {
				if(value!==undefined&&value!==null){
					config[key] = value;
					return value;
				}
			} else {
				config = carnival.utils.merge(config,key);
			}
			return config[key];
		}
		return config;
	};

	// return public methods
	return {init:init,configuration:configuration,afterHandShakeSuccess:afterHandShakeSuccess};
}(jQuery,document,window);


/**
 * modal - All functions needed for modal popup window
 * @namespace
 */
carnival.modal = function($,window,document,undefined){

	/**
	 * contentEl - jQuery object around DomNode to hold content
	 * initialized - boolean flag if modal has been initialized
	 * @private
	 */
	var contentEl,initialized = false;

	/**
	 * popit - function for opening a modal popup
	 * @param {String|DomNode} contents either a string containing the content or an element with an href to open
	 * @param {Function} callback
	 * @param {Function} closeCallback calback to call if window close
	 * @param {Object} modalConfig A configuration object to handle modal layout, containers, triggers and events
	 * @returns {Boolean} always false to stop further processing of link tags
	 */
	var popit = function( contents, callback, closeCallback, modalConfig ) {
		
		var registrationClass = "";
				
		var defaultModalConfig = {

			layout				: 'horizontal',
			isSticky			: false,
			container			: 'body',
			addClass 			: null,
			addWrapper			: null,
			triggerHandler		: '#signInLink',
			eventType 			: 'click',
			eventPreventDefault : false

		};

		var splitQueryString = function( href ){
			
			href = href || window.location.href;
			href = href.split( "?" );
			href[0] ="";
			href = href.join("");
			var qs = [];
			var parameters = href.split('&');

			for (var i = 0; i<parameters.length; i++) {
			    var pos = parameters[i].indexOf('=');
			    if (pos > 0) {
			        var paramname = parameters[i].substring(0,pos);
			        var paramval = parameters[i].substring(pos+1);
			        qs[paramname] = decodeURI(paramval.replace(/\+/g,' '));
			    } else {
			    	qs[parameters[i]]=""; 
			    }
			}
			return qs;
			
		};
		
		var thisContent = contents.href;
		var queryStringParams = splitQueryString( thisContent );
					
		if( queryStringParams[ 'modalClass' ] ){
			registrationClass = queryStringParams[ 'modalClass' ];
		}
		
		/** Merges the default modal config object and an optional modalConfig object used to 
			override defaults **/
		var thisModalConfig = carnival.utils.merge( defaultModalConfig, modalConfig );
		
		
		if ( modalConfig ) {

				
				var initializePopit = function(){
				
					//carnival.modal.removeIt();
					
					//respect forced layout? - not working
					//if (carnival.configuration('layout')) {
					//	thisModalConfig.layout = carnival.configuration('layout');
					//} else {
						carnival.configuration( 'layout', thisModalConfig.layout );
					//}
					
					/** If the method has not been initialized, the init method is called and the contentId 
						property is passed to the constructor **/	

					init( thisModalConfig );

					insertContent( contents, function(){

						positionIt( thisModalConfig.isSticky ); 

						if( callback ){ 
							callback(); 
						}

						if(thisModalConfig.layout == 'vertical'){
							var signInHeight = $('#ssorNavHeader').outerHeight(true);
							$('#carnivalModal').css('top',signInHeight+'px');
						}

					});
					
					if(closeCallback){
						carnival.utils.listener.kill('popitClose');
						carnival.utils.listener.listen('popitClose',closeCallback);
					}
					
					setTimeout( function(){
						$( document ).bind( 'keypress.carnivalModal', closeHandler );
					}, 200 );
					
					
				};
				
				
				//TODO make this cleaner
				if( modalConfig.eventType ){
					
					$( thisModalConfig.triggerHandler )[ thisModalConfig.eventType ]( function( e ){

						if(  thisModalConfig.triggerHandler  == "#signInLink" ){
							carnival.configuration('layout' , 'vertical');
						}

						initializePopit();

						if( thisModalConfig.eventPreventDefault ){
							e.preventDefault();
						}

					});		
					
				}
				else{
					initializePopit();
				}
			

		} else {
			//our floaty modal (non-sticky, horizontal)
				thisModalConfig.addClass = registrationClass;
				
				//carnival.modal.removeIt();
				
				init( thisModalConfig );
				//fix for selects showing above any element regardless of zindex
				if ( $.browser.msie && (/6.0/).test(navigator.userAgent) ) {
					$('select').hide();
				}
				$('#carnivalModalWrapper').width('');
				waitForIt();
				insertContent(contents,function(){
					positionIt(); 
					if(callback != null){ callback.call(); }
					$('<div id="carnivalFooter"></div>').appendTo('#carnivalContent');
				});	
										
				if(closeCallback){
					carnival.utils.listener.kill('popitClose');
					carnival.utils.listener.listen('popitClose',closeCallback);
				}
						
				setTimeout(function(){
					$(document).bind('keypress.carnivalModal',closeHandler);
				},200);
				
				return false;
	   }
		
		//return false;
	};


	/**
	 * dropit - closes a modal window
	 */
	var dropit = function(cancelCallback){
				
		cancelCallback = (cancelCallback === true);
		$(document).unbind('.carnivalModal');
		$('#carnivalModal,#carnivalModalOverlay').hide();
		//fix for selects showing above any element regardless of zindex
		if ( $.browser.msie && (/6.0/).test(navigator.userAgent) ) {
			$('select').show();
		}
		
		$('#'+config.contentId).html('');
		if( !cancelCallback ){
			carnival.utils.listener.fire( 'popitClose' );
			//removed { remove:true }
		}
		else{
			carnival.utils.listener.kill('popitClose');
		}
	
	};
	
	var removeIt = function(){
		dropit();
		$('#carnivalModal,#carnivalModalOverlay').remove();
		if( window.transport ){
			window.transport.destroy();
		}
	};

	/**
	
	 * init - initializes the modal window object
	 * @constructor
	 * @param {Object} configs JSON object with overrides of default configuration
	 */
	var init = function( configs ){
	
			var target = (configs && configs.container ) ? configs.container : 'body';
			var backgroundColor = carnival.configuration('ssorNavBackgroundColor') || "";
		
			if( target == 'body'){
					$( target ).prepend(popWrapper( configs ));
			}else{
				$( target ).append(popWrapper( configs ));
			}	
			config = carnival.utils.merge(config,configs);
			contentEl = $('#'+config.contentId);
		
			if( backgroundColor ){
				$('#carnivalModal').css('background-color', backgroundColor );		
			}

			preloadWaitImg();
			attachModals();
		
	
	};

	/**
	 * positionIt - Moves modal window into appropriate location
	 * @private
	 */
	var positionIt = function(isSticky){
	
		var win = $(window);
		if (!isSticky) {
			$('#carnivalModal').show().css({
					'top': win.scrollTop() + 140 + 'px',
					'left': win.width() / 2 - ($('#carnivalModal').width() / 2) + 'px'
			});
			$('#carnivalModalOverlay').show().fadeTo(0,0.5);
		} else {
			$('#carnivalModal').show();
		}
		
		carnival.utils.changeTextColor();
	};

	/**
	 * attachModals - automatically adds popup to links of class carnivalModal
	 * @private
	 */
	var attachModals = function(){
		$('.carnivalModal').click(function(){
			return popit(this);
		});
	};

	/**
	 * preloadWaitImg - called in contructor.  Prefetches the ajax load image
	 * @private
	 */
	var preloadWaitImg = function() {
		var img = new Image();
		img.src = config.waitImg;
	};

	/**
	 * waitForIt - inserts loading icon into modal window
	 * @private
	 */
	var waitForIt = function() {
		contentEl.html('<div style="width:200px;height:300px;text-align:center"><img style="display:inline;padding-top:130px" src="'+config.waitImg+'" /></div>');
		positionIt();
	};

	/**
	 * insertContent - inserts into modal window. called by popit
	 * @private
	 * @param {String|DomNode} contents What goes in
	 * @param {Function} callback What comes out
	 */
	var insertContent = function(contents,callback) {
		if(contents.constructor == String && !(/^https?\:\/\//.test(contents))) {
			contentEl.html(contents);
			callback.call(this);
		} else {
			try{
				var target = (contents.constructor == String) ? contents : $(contents).attr('href');
				if(carnival.core.isExternal(target) || ((contents.constructor != String) && $(contents).attr('rel') && $(contents).attr('rel') != '')) {
					var rel = $(contents).attr('rel');
					contentEl.html('<iframe frameBorder=0 border=0 allowTransparency="true" style="border:0px" '+rel+' src="'+target+'"></iframe>');
					callback.call(this);
				} else {
					var that = this;
					$.ajax({
						type:'GET',
						url: target,
						success:function(data){
							contentEl.html(data);
							callback.call(that);
						}
					});
				}
			} catch(e) {}
		}
	};

	/**
	 * config - default values for modal window
	 * @private
	 */
	var config = {
		contentId : 'carnivalContent',
		waitImg : '/images/ajax-loader.gif'
	};

	/**
	 * closeHandler - handles keypress and mouseclick events
	 * @private
	 * @param {Event} e event that triggered call
	 */
	var closeHandler = function(e) {
		if(e.keyCode==27 || (e.type!='keypress' && !($(e.target).parents('#carnivalModal')[0]))){
			dropit();
			return false;
		}
	};

	/**
	 * popWrapper - html for modal window
	 * @private
	 */
	var popWrapper = function( configs ){
		
		if(config.popWrapper || carnival.configuration('popWrapper')){
			return config.popWrapper || carnival.configuration('popWrapper');
		}
		
		var $carnivalModal = $( "#carnivalModal" );
		var $carnivalModalOverlay = $( "#carnivalModalOverlay" );
	
		if( $carnivalModal ){
			$carnivalModal.remove();
		}
		if( $carnivalModalOverlay ){
			$carnivalModalOverlay.remove();
		}
		
		var backgroundColor = carnival.configuration( 'ssorNavBackgroundColor' ) || "#353535";
		var isSticky = ( configs && configs.isSticky ) ? "sticky" : "nonSticky";
		var template = "";
		
		if( configs.addWrapper != null  ){
			template += '<div id="'+ configs.addWrapper +'">';
		}
		if( configs.addClass != 'undefined' || configs.addClass != null ){
			var myClass = configs.addClass || "";
		}
		 template += '<div id="carnivalModal" class="'+ configs.layout  + " " + isSticky +  " " + myClass + '" style="display:none;background-color:'+ backgroundColor +'">' +
			'<div id="carnivalModalWrapper">'+
				'<div id="carnivalModalHead" >'+
					'<a id="carnivalModalClose" href="" onclick="carnival.modal.dropit(); return false;" ><span class="carnivalCloseButton" >x close</span></a>'+
				'</div>'+
				'<div id="'+config.contentId+'" class="full clearfix" >'+
				'</div>'+
			'</div>'+
		'</div>';
		
		if( configs.addWrapper != null ){
			template += '</div>';
		}
		
		template += '<div id="carnivalModalOverlay" ></div>';
		
		return template;
	};

	// return public methods
	return {popit:popit,dropit:dropit,init:init,positionIt:positionIt, removeIt:removeIt};
}(jQuery,window,document);

/**
 * forms
 * @namespace
 */
carnival.forms = function($,document,window,undefined){

	/**
	 * @class A dynamic form validator
	 *
	 * @extends Object
	 */	
	
	var FormValidator = function formValidation( config ){
		this.constructor( config );	
	};	

	/**
	 * @lends FormValidator
	 */
	FormValidator.prototype = ( function( $ ){ 

		return {

			/**
			 * @property {String} className The name of this class.  Used for
			 *                              logging.
			 */
			className: "carnival.FormValidator",

			/**
			 * @constructs
			 * @param {Object} config The configuration object for the form	
			 * @description The contructor of the FormValidator class. This method takes a config of properties				  
			 * @return void
			 */
			constructor: function( config ){
				//Strip out jQuery
				this.properties		= {};
				this.targetFormId 	= config.formId || null;
				this.targetForm 	= document.getElementById( this.targetFormId );
				this.errors 		= new carnival.utils.Errors();
				this.logger 		= new carnival.Log( this.className );

				this.properties.errorClass = "errorMessage";
				
				if( config.errors ){

					if( config.errors.groupErrors ){
						this.properties.enableGroupedErrors = config.errors.groupErrors || false;
					}
					if( config.errors.inputBackgroundColor ){
						this.properties.inputBackgroundColor = config.errors.inputBackgroundColor || "none";
					}
					if( config.errors.aggregateMessages ){
						this.properties.aggregateMessages = config.errors.aggregateMessages || false;
					}
					if( config.errors.errorClass ){
						this.properties.errorClass = config.errors.errorClass;
					}
				}

				try{
					this.checkForRequiredConfigs();	
					this.initForm();
				}
				catch( error ){
					throw error.toString();
					return false;
				}
			},

			/** 
			* 	@property {Function} deconstructor
			* 	@description Destroys all references to objects properties
			*   @returns null
			**/
			deconstructor: function(){
				this.logger.warn( "deconstructor: Decontructing the FormValidator" );
				this.properties		= null;
				this.targetForm 	= null;
				this.targetFormId 	= null;
				this.errors 		= null;
				this.logger 		= null;
			},

			/** 
			* 	@property {Function} checkForRequiredConfigs
			* 	@description Checks for required config properties 
			*   @returns null
			*	@throws FormSelectorException
			**/
			checkForRequiredConfigs: function(){
				if( this.targetForm == null || "" ){
					this.errors.throwException( "FormSelectorException",
												"checkForRequiredConfigs: Missing form id which is required" );
				}
			},

			/** 
			* 	@property {Function} initForm
			* 	@description Initializes the form and readies all default validators to be used
			*   @returns null
			**/
			initForm: function(){

				this.logger.changeColor( "background-color:#ccffee" );
				this.logger.info( "initForm: Initializing the form and adding default validators" );

				/**
				*	Adding all default validators to be used by any form element
				**/

				this.addValidator( '@NotNull', 
									this.validators.notBlank, 
									this.errorMessages[ "@NotNull" ] );
				this.addValidator( '@Email', 
									this.validators.email, 
									this.errorMessages[ "@Email" ] );
				this.addValidator( '@Password', 
									this.validators.isValidPassword, 
									this.errorMessages[ "@Password" ] );
				this.addValidator( '@Min', 
									this.validators.minLength, 
									this.errorMessages[ "@Min" ] );
				this.addValidator( '@Max', 
									this.validators.maxLength, 
									this.errorMessages[ "@Max" ] );
				this.addValidator( '@Equals', 
									this.validators.compareEquality, 
									this.errorMessages[ "@Equals" ] );
				this.addValidator( '@AlphaNumeric', 
									this.validators.isAlphaNumeric, 
									this.errorMessages[ "@AlphaNumeric" ] );
				this.addValidator( '@Numeric', 
									this.validators.isNumeric, 
									this.errorMessages[ "@Numeric" ] );	
				this.addValidator( '@OfAge', 
									this.validators.ofAge, 
									this.errorMessages[ "@OfAge" ] );
				this.addValidator( '@Profane', 
									this.validators.isProfane, 
									this.errorMessages[ "@Profane" ] );
				this.addValidator( '@ValidDate', 
									this.validators.validDate, 
									this.errorMessages[ "@ValidDate" ] );					
				this.addValidator( '@StopChar', 
									this.validators.stopChars, 
									this.errorMessages[ "@StopChar" ] );
				this.addValidator( '@Zipcode', 
									this.validators.isZipCode, 
									this.errorMessages[ "@Zipcode" ] );	
				this.addValidator( '@Telephone', 
									this.validators.isTelephone, 
									this.errorMessages[ "@Telephone" ] );
				this.addValidator( '@ValidationRule', 
									this.validators.validationRule, 
									this.errorMessages[ "@ValidationRule" ] );																													

			},

			/** 
			* 	@property {Function} setUpValidationData
			*	@param validators
			* 	@description Parses the annotations
			*   @returns null
			**/
			setUpValidationData : function( validators ){

				this.logger.changeColor( "background-color:#eebbff" );
				this.logger.info( "setUpValidationData: Setting up Validation Data" );

				if( !validators ){
						this.errors.throwException( "MissingArgumentException",
													"setUpValidationData: Missing validators argument which is required" );
				}

				/** 
				* 	@private {Function} annoationParser
				*	@param {String} annotation
				* 	@description 
				*   @returns {Object}
				**/
				var annoationParser = function( annotation ){

					var theseAnnotations = annotation.split( "=" );

					return{

						/**
						*  @private {Function} annotationHasValue
						*  @description If there is an annotation passed into the parser, 
						*  				check to see if it has a value associated with it 
						*  				and if so, return it
						**/
						annotationHasValue : function(){
							return /=/.test( annotation );
						},

						/**
						*  @private {Function} getAnnotationValue
						*  @description Grab the annotation value and return it
						**/
						getAnnotationValue : function(){
							var args = [];
							args.push( theseAnnotations[ 1 ] );
							return args;
						},

						/**
						*  @private {Function} getAnnotation
						*  @return {String} returns the annotated string with the value stripped out
						**/
						getAnnotation : function(){
							return theseAnnotations[ 0 ];
						}
					}
				};

				var valueToTestAgainst 	= "",
					validationContainer = [];

				for( var index = 0, totalVals = validators.length;
					  	 index < totalVals; 
						 index++ ){

					var thisValidator 		= validators[ index ],
						validationWrapper	= {},
						thisParser 			= annoationParser( thisValidator );

					/**
					* If the annotation has a value associated with it then split these values and create a 
					* property on the validationWrapper to hold them
					**/	
					if( thisParser.annotationHasValue() ){
						validationWrapper.validationArguments = thisParser.getAnnotationValue();
						thisValidator = thisParser.getAnnotation();
					}
					
					/**
					* If thisValidator does not exist on the registry then we cannot add it to the validationContainer
					**/
					if( !this.validatorRegistry[ thisValidator ] ){
						this.logger.error( "No validator by the name of " + thisValidator + " exists in the registry" );
						break;
					}
					
					/**
					* Add validators to a validator array to be added as a property on the input to be validated
					**/
					validationWrapper.validatorName 	= this.validatorRegistry[ thisValidator ].validatorName;
					validationWrapper.validatorMethod 	= this.validatorRegistry[ thisValidator ].validator;
					validationWrapper.errorMessage 		= this.validatorRegistry[ thisValidator ].errorMessage;

					validationContainer.push ( validationWrapper );
				}
				return validationContainer;
			},

			/** 
			* 	@property {Function} formElement
			*	@param context
			*	@param name
			*	@param validators
			* 	@description 
			*   @returns null
			**/
			formElement : function( context, name, validators , errorCallback , successCallback ){

					var elements = context.getFormElements(name);
					var totalElements = elements.length;

				//If elements is undefined its not in the dom or we cannot find reference to it
				if( carnival.utils.arrays.isEmpty( elements ) ){
					context.logger.warn("formElement: Element cannot be found=" + name );
					return false;
				}

				this.validators 	= context.setUpValidationData( validators );
				this.fieldName 		= name;
				this.inputType 		= "input";


				if( errorCallback ){
					this.errorCallback = errorCallback;
				}

				if( successCallback ){
					this.successCallback = successCallback;
				}

				/**
				*	If we only have a single element like a text input field, select or even a checkbox,
				*	we will set this as our DOM reference point 
				**/
				if( totalElements == 1 ){
					this.domReference 	= elements[ 0 ];
				}
				else{
					this.domReference = elements;
				}

				this.getValue = function(){

					if( carnival.forms.isInput( this.domReference ) || carnival.forms.isTextField( this.domReference ) ){
						return this.domReference.value;
					}
					else if( carnival.forms.isCheckbox( this.domReference ) ){
						this.inputType 	= "checkbox";
						return this.domReference.checked == true ? "true" : "";
					}
					else if( carnival.forms.isRadio( this.domReference[ 0 ] ) ){
						this.inputType 	= "radio";
						var hasValue = "";
						for( var element = 0; element < totalElements; element++ ){
							if( this.domReference[ element ].checked == true ){
								hasValue = "true";
								break;
							}
						}
						return hasValue;
					}
					else if( carnival.forms.isSelect( this.domReference ) ){
						this.inputType 	= "select";
						return this.domReference.value;
					}

				};
			},
			
			
			
			
			getFormElements: function( elements ){
				
					var theseElements = document.getElementsByName( elements );
					var theseElementsLength = theseElements.length;
					var includedElements = [];
					for( var i = 0 ;  i < theseElementsLength; i++ ){
						var thisForm = theseElements[i].form || "";
						if( thisForm ){
							var thisFormId = thisForm.getAttribute( "id" ) || "";
						}
						else{
							continue;
						}

						if( thisFormId == this.targetFormId ){
							includedElements.push( theseElements[i] );
						}

					}

					return includedElements;
			},

			/**
			*	@property {Array} formElementCollection
			*	@description 
			*/
			formElementCollection : [],
			
			
			validateSingle : function( element, validators, errorCallback, successCallback ) {
				
				if( !validators || !element ){
					this.errors.throwException( "IllegalArgumentException",
												"bindValidator: The arguments passed into method bindValidator are invalid" );
				}
				
				var thisElement = this.getFormElements( element );
				
				/**
				*	If the element is a string matching to the name attribute of an input field, then continue 
				**/
				if( carnival.utils.strings.isAString( element ) ){

					formElement = new this.formElement( this, element , validators, errorCallback, successCallback );

					if( !formElement ){
						this.logger.warn( "Skipping binding validation since we cannot find a reference to it in the DOM" );
					}
				}
				else if( carnival.utils.objects.isAJqueryCollection( element ) ) {
					//TODO handle jQuery collection
					formElement = element;
				}
				else{
					this.errors.throwException( "IllegalArgumentException",
												"bindValidator: The argument passed into method bindValidator is invalid" );
				}

				return !this.validateElement( formElement );
				
			},
			
			/** 
			* 	@property {Function} bindValidator
			*	@param element
			*	@param validators
			*	@param errorCallback
			* 	@description 
			*   @returns null
			**/
			bindValidator : function( element , validators , errorCallback, successCallback ){

				var theseElements = this.getFormElements( element );

				if( carnival.utils.arrays.isEmpty( theseElements ) ){
					this.logger.changeColor( "background-color:#ff4444" );
					this.logger.warn( "bindValidator: Element cannot be found=" + element  + ". Skipping binding validations for element" );
					return false;
				}

				//TODO make HTML5 friendly
				var formElement = "";

				if( !validators || !element ){
					this.errors.throwException( "IllegalArgumentException",
												"bindValidator: The arguments passed into method bindValidator are invalid" );
				}

				/**
				*	If the element is a string matching to the name attribute of an input field, then continue 
				**/
				if( carnival.utils.strings.isAString( element ) ){

					formElement = new this.formElement( this, element , validators, errorCallback, successCallback );

					if( !formElement ){
						this.logger.warn( "Skipping binding validation since we cannot find a reference to it in the DOM" );
					}
				}
				else if( carnival.utils.objects.isAJqueryCollection( element ) ) {
					//TODO handle jQuery collection
					formElement = element;
				}
				else{
					this.errors.throwException( "IllegalArgumentException",
												"bindValidator: The argument passed into method bindValidator is invalid" );
				}

				this.formElementCollection.push( formElement );
			},

			/** 
			* 	@property {Function} unBindValidator
			*	@param element
			*	@param validators
			* 	@description 
			*   @returns null
			**/
			unBindValidator: function( element , validatorsToRemove ){

				this.logger.changeColor( "background-color:#ff99aa" );
				this.logger.info( "unBindValidator: unbinding validators for:" + element );

				/**
				* Store the collection of form elements that are scheduled for validationas a local variable 
				**/
				var elementToValidate = this.formElementCollection;

				for( var index = 0, totalElements = elementToValidate.length;
						 index < totalElements;
						 index++ ){

					/**
					* If the element that we are unbinding matches the element in the collection, begin removal
					* 
					**/		
					if( elementToValidate[ index ].fieldName == element ){

						/**
						* Set this elements validators to a local variable to iterate over
						**/
						var thisElementsValidators = elementToValidate[ index ].validators,
							totalValidatorsToRemove = validatorsToRemove.length;
							
						for( var validatorIndex = 0, totalElementValidators = thisElementsValidators.length;
							  	 validatorIndex < totalElementValidators;
								 validatorIndex++ ){

							for( var thisIndex = 0; thisIndex <= totalValidatorsToRemove; thisIndex++  ){
								if( validatorsToRemove[ thisIndex ] ==  thisElementsValidators[ validatorIndex ].validatorName ){
										thisElementsValidators.splice( validatorIndex , 1 );
										validatorsToRemove.splice( thisIndex , 1 );
										totalValidatorsToRemove -= totalValidatorsToRemove;
								}
							}

						}
					}
				}
			},

			/**
			 * @namespace regex
			 * @description A hash map of regular expressions used for validation of form fields
			 */
			regex:{

				email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
				password: /^(?=.*[0-9])(?=.*[A-Za-z])/,
				telephone: /^[\\d\\-\\s\\(\\)]{10,}$/,
				zipcode:  /^[\\da-zA-Z\\-\\s]{5,}$/,
				profaneFullMatch :  "\x73\x68\x69\x74\x7C\x66\x75\x63\x6B\x7C\x63\x6F\x63\x6B\x73\x75\x63\x6B\x65\x72\x7C\x61\x73"+
									"\x73\x28\x68\x6F\x6C\x65\x7C\x6D\x75\x6E\x63\x68\x7C\x77\x69\x70\x65\x29\x7C\x62\x69\x74\x63"+
									"\x68\x7C\x64\x69\x63\x6B\x68\x65\x61\x64\x7C\x6A\x61\x63\x6B\x6F\x66\x66\x7C\x77\x68\x6F\x72"+
									"\x65\x7C\x66\x61\x67\x67\x6F\x74\x7C\x28\x6E\x7C\x77\x29\x69\x67\x67\x28\x65\x72\x7C\x61\x7A"+
									"\x29\x7C\x74\x69\x74\x74\x69\x65\x73\x7C\x28\x62\x6C\x6F\x77\x7C\x68\x61\x6E\x64\x29\x6A\x6F"+
									"\x62\x7C\x66\x65\x6C\x6C\x61\x74\x69\x6F",
				profaneHalfMatch:   "\x28\x5E\x7C\x5B\x5E\x61\x2D\x7A\x5D\x29\x28\x61\x73\x73\x7C\x74\x77\x61\x74\x7C\x63\x6F\x63\x6B"+
									"\x7C\x63\x75\x6D\x7C\x74\x69\x74\x74\x69\x65\x73\x7C\x6B\x69\x6B\x65\x7C\x73\x70\x69\x63\x7C\x28\x61\x7C\x6D\x79\x7C"+
									"\x79\x6F\x75\x72\x29\x5B\x5E\x61\x2D\x7A\x5D\x2B\x64\x69\x63\x6B\x7C\x70\x69\x73\x73\x7C\x63\x75\x6E\x74\x7C\x74\x69"+
									"\x74\x73\x7C\x66\x61\x67\x7C\x68\x6F\x6D\x6F\x7C\x70\x75\x73\x73\x79\x7C\x63\x75\x6E\x74\x7C\x6E\x69\x67\x72\x61\x73"+
									"\x7C\x70\x69\x6E\x63\x68\x65\x29\x28\x24\x7C\x5B\x5E\x61\x2D\x7A\x5D\x29"
			},

			/**
			 * @namespace errorMessages
			 * @description A hash map of error messages that correspond to the associated validation annotations
			 */
			errorMessages:{

				"default"  			  : "This field is required",
				"@NotNull" 			  : "This field cannot be blank",
				"@Email"   			  : "Must be a valid email address",
				"@OfAge"			    : "You cannot select a birthday that indicates you are under ${1} years old. Please contact us for assistance.",
				"@Profane"			  : "This field is unacceptable",
				"@Password" 		  : "Your password must contain at least one letter and one number",
				"@Min"	   			  : "Must be at least ${1} characters",
				"@Max"	   			  : "Must be no more than ${1} characters",
				"@Equals"  			  : "This field must equal ${1}",
				"@Group"   			  : "Error Message Here",
				"@AlphaNumeric"   : "Must contain only letters and numbers",
				"@Numeric"			  : "This field must only contain numbers",
				"@ValidDate"		  : "This is not a valid date",
				"@Zipcode"			  : "This is not a valid zipcode",
				"@Telephone"		  : "This is not a valid telephone number",
				"@StopChar"			  : "${1} characters are not valid",
				"@ValidationRule"	: "There was a problem with your entry. Please enter a valid response."
				
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
					var context = arguments[ 1 ];
					return context.regex.email.test( value );  
				},

				/** 
				* 	@property {Function} isValidPassword
				* 	@param {String} value The value of an input field to be validated
				* 	@description Checks if a value has at least one letter and one number
				*   @return {Boolean} true is returned 
				**/
				isValidPassword: function( value ){
					var context = arguments[ 1 ];
					return value.match( context.regex.password ); 
				},

				/** 
				* 	@property {Function} stopChars
				* 	@param {String} value The value of an input field to be validated
				* 	@param {String} charToStop Which characters to prevent from being used
				* 	@description 
				*   @return {Boolean} true is returned 
				**/
				stopChars : function( value , charToStop ){
					var stopChars = new RegExp( '[' + charToStop + ']' ,'');
					return !( value.match( stopChars ) );			
				},

				/** 
				* 	@property {Function} isTelephone
				* 	@param {String} value The value of an input field to be validated
				* 	@description 
				*   @return {Boolean} true is returned 
				**/
				isTelephone: function( value ){
					return  context.regex.telephone.test( value );  
				},

				/** 
				* 	@property {Function} isZipCode
				* 	@param {String} value The value of an input field to be validated
				* 	@description 
				*   @return {Boolean} true is returned 
				**/
				isZipCode: function( value ){
					return  context.regex.zipcode.test( value );
				},

				/** 
				* 	@property {Function} ofAge
				* 	@param {String} value The value of an input field to be validated
				* 	@param {String} age 
				* 	@description 
				*   @return {Boolean} true is returned 
				**/
				ofAge: function( value , age ){
					//TODO pull date from server
					var ageInMilliseconds = 31557600000 * age;
					var myDate 			  = Date.parse( value ) + ageInMilliseconds;
					var today 			  = new Date().getTime();

					return ( myDate <= today );
				},

				/** 
				* 	@property {Function} validDate
				* 	@param {String} value The value of an input field to be validated
				* 	@description 
				*   @return {Boolean} true is returned 
				**/
				validDate: function( value ){
					
					var stripOutPreceedingZero = function( number ){
						var strippedNumber = number.replace( /^[0]/ , "" );
						return parseInt( strippedNumber );
					};
					
				    var isLeapYear = function( year ) {
				        return  ( year % 4 != 0 ? false : 
				            	( year % 100 != 0 ? true : 
				            	( year % 1000 != 0 ? false : true ) ) );
				    };

					var isValidDate = function( date_string ) {
					    
						var days = [ 0,31,28,31,30,31,30,31,31,30,31,30,31 ];
					    var year, month, day, date_parts = null;
					    var isValid = false;

					    date_parts = date_string.match( /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/ );
				        if ( date_parts ) {

							year = date_parts[ 3 ];
				            month = stripOutPreceedingZero( date_parts[ 1 ] );
				            day = stripOutPreceedingZero(date_parts[ 2 ] );

				            test = ( month == 2 && 
				                    isLeapYear( year ) && 
				                    29 || 
				                    days[ month ] || 0 );

				            isValid = 1 <= day && day <= test;
				        }

					    return isValid;
					}
					
					return isValidDate( value );
				},

				/** 
				* 	@property {Function} isProfane
				* 	@param {String} value The value of an input field to be validated
				* 	@description 
				*   @return {Boolean} true is returned 
				**/
				isProfane: function( value ){
					var context = arguments[ 1 ];
					return !( value.match( new RegExp( context.regex.profaneFullMatch,"gi" ) ) ) 
						&& !( value.match( new RegExp( context.regex.profaneHalfMatch,"gi") ) );
				},

				/** 
				* 	@property {Function} notBlank
				*   @param {String} value The value of an input field to be validated
				* 	@description A notBlank validator to determine if the value of the input 
				* 				 passed is blank
				* 	@return {Boolean} true is returned if the value is not an empty string
				**/
				notBlank: function( value ){ 
					return ( value == "" || value == undefined )  ? false : true;
				},

				/** 
				* 	@property {Function} minLength
				*   @param {String} value The value of an input field to be validated
				* 	@description
				* 	@return {Boolean}
				**/
				minLength: function( value , minLength ){

					if( !value ){
						return false;
					}

					return ( value.length < minLength[ 0 ] ) ? false : true;		
				},

				/** 
				* 	@property {Function} maxLength
				*   @param {String} value The value of an input field to be validated
				* 	@description
				* 	@return {Boolean}
				**/
				maxLength : function( value, maxLength ){
					if( value == "" ){
						return true;
					}
					return ( value.length > maxLength[ 0 ] ) ? false : true;
				},

				/** 
				* 	@property {Function} maxLength
				*   @param {String} valueOne The value of an input field to be validated
				*   @param {String} valueTwo The value of an input field to be validated
				* 	@description
				* 	@return {Boolean}
				**/
				compareEquality : function( valueOne, valueTwo ){
					return valueOne === this.getFormElements( valueTwo )[ 0 ].value;
				},

				/** 
				* 	@property {Function} isAlphaNumeric
				*   @param {String} value The value of an input field to be validated
				* 	@description
				* 	@return {Boolean}
				**/
				isAlphaNumeric : function( value ){
					return /\w+$/i.test( value );
				},

				/** 
				* 	@property {Function} isNumeric
				*   @param {String} value The value of an input field to be validated
				* 	@description
				* 	@return {Boolean}
				**/
				isNumeric : function( value ){
					return /-?\d+$/.test( value );	
				},

				/** 
				* 	@property {Function} validationRule
				*   @param {String} value The value of an input field to be validated
				*   @param {String} regex
				* 	@description
				* 	@return {Boolean}
				**/
				validationRule : function( value, regex ){

					if( value == "" ){
						return true;
					}
					var validationRule = new RegExp( regex, "" );
					return ( value.match( validationRule ) );
				}		
			},

			/** 
			* 	@property {Object} validatorRegistry
			* 	@description
			**/
			validatorRegistry: {},

			/** 
			* 	@property {Function} addValidator
			*   @param {String} validatorName 
			*   @param {Function|RegEx} validator 
			*   @param {String} errorMessage
			* 	@description
			**/
			addValidator: function( validatorName, validator, errorMessage ){

				/**
				* If we have missing critical arguments we need to throw an exception
				**/
				if( !validatorName ){
						this.errors.throwException( "MissingArgumentException",
													"addValidator: Missing validator name which is required" );
				}
				if( !validator ){
						this.errors.throwException( "MissingArgumentException",
													"addValidator: Missing validator method which is required" );
				}

				/**
				* If the validator doesn't exists in the registry, add it 
				**/
				if( !this.validatorRegistry[ validatorName ] ){
					this.validatorRegistry[ validatorName ] = {};
				}

				var validationMethod = null;

				/**
				* If the validator that is passed into the addValidator method is a regular expression, then we must 
				* create a method from it to add to the validator registry
				**/
				if( validator.constructor == RegExp ){
					validationMethod = function( value ){
						return validator.test( value );  
					};
				}
				/**
				*	Add validators to the validation registry
				**/
				this.validatorRegistry[ validatorName ].validatorName = validatorName;
				this.validatorRegistry[ validatorName ].validator = validationMethod || validator;
				this.validatorRegistry[ validatorName ].errorMessage = errorMessage || this.errorMessages[ "default" ];	
				
			},

			/** 
			* 	@property {Function} removeValidator
			*   @param {String} validatorName 
			* 	@description
			**/
			removeValidator: function( validatorName ){
				delete this.validatorRegistry[ validatorName ];	
			},

			/** 
			* 	@property {Function} executeValidator
			*   @param {String} value 
			* 	@param {String} validator 
			* 	@description
			**/
			executeValidator: function( value , validator ){
				
				/**
				*	We throw and error and escape the execution of the validator if the value is undefined.
				*   The would occur if the element we are targeting does not exist in the DOM.
				**/
				if( value == undefined ){
					this.logger.changeColor( "background-color:#ffaa99" );
					this.logger.error("executeValidator:" +  "value is undefined for validator" + validator.validatorName );
					return false;
				}
				else{
					this.logger.changeColor( "background-color:#aaccff" );
					this.logger.info( "executeValidator:" + value + " passed in for validator-" + validator.validatorName );
				}

				var value = carnival.forms.stripWhiteSpace( value );

				/**
				*	If the validator has validation arguments then pass them to the validation method 
				*	example:  @Min=4 the value of the number 4 would be passed as argument[ 0 ]
				**/
				if( validator.validationArguments ){
					return validator.validatorMethod( value , validator.validationArguments, this );
				}
				else{
					return validator.validatorMethod( value , this );
				}
			},

			/** 
			* 	@property {Function} stripAnnotationSymbol
			*   @param {String} annotationName 
			* 	@description
			**/
			stripAnnotationSymbol : function( annotationName ){
				return annotationName.replace( /@/, "");
			},

			/** 
			* 	@property {Function} displayErrorMessage
			*   @param {String} element 
			* 	@param {String} errorMessage 
			* 	@description
			**/
			displayErrorMessage : function( thisElement, thisValidator ){

				var $element = "",
					element ="";
					
				if( thisElement.inputType == "radio" ) {
					element = thisElement.domReference[ 0 ];
				}
				else{
					element = thisElement.domReference;
				}

				var errorMessage 		= thisValidator.errorMessage,
					validationArguments = thisValidator.validationArguments,
					errorCallback 		= thisElement.errorCallback,
					validatorErrorClass = element.name + 
										  this.stripAnnotationSymbol( thisValidator.validatorName ),
					errorContainerClass = this.properties.errorClass;

				if( element.length > 1 && !carnival.forms.isSelect( element ) ){
					//radio button so grab the first element
					$element = $( element[ 0 ] );
				}
				else{
					$element = $( element );
				}

				/*$element.css({
					"border-color"	: "1px solid #F00",
					"background-color": this.properties.inputBackgroundColor
				});*/
				
				if( validationArguments ){
					errorMessage = this.formatErrorMessage( errorMessage, validationArguments );
				}

				var $errorWrapper = $( "<span></span>" );
				    $errorWrapper.addClass( errorContainerClass );
					
				/** 
				* 	@private {Function} addErrorsToDOM
				*   @param {String} aggregateErrors  
				* 	@description
				**/
				var addErrorsToDOM = function( aggregateErrors ){
					
					var errorToCheckFor = aggregateErrors ? errorContainerClass :  validatorErrorClass ;
					
					if( $element.siblings("." + errorToCheckFor ).length == 0 ){

						$errorWrapper.addClass( validatorErrorClass );
						$errorWrapper.html( errorMessage );
						$element.before( $errorWrapper );

					}
					
				};	
				
				addErrorsToDOM( this.properties.aggregateMessages );
				
				if( errorCallback ){
					errorCallback( $element );
				}
			},

			/** 
			* 	@property {Function} formatErrorMessage
			*   @param {String} message 
			*   @param {String} args 
			* 	@description
			**/
			formatErrorMessage : function( message, args ){	
			//TODO do we want the ability to override these args?

				for( var index = 0, totalArguments = args.length;
						 index < totalArguments; 
						 index++ ){

					var thisArgumentValue = args[ index ],
						currentArg = index + 1,
						thisRegex = new RegExp('\\$\\{' + currentArg +'\\}','g');
						message = message.replace( thisRegex , thisArgumentValue );

				}  
				return message;	
			},

			/** 
			* 	@property {Function} removeErrorMessage
			*   @param {String} element 
			*   @param {String} element 
			* 	@description
			**/
			removeErrorMessage: function( thisElement , validator ){

				var elementName = "";
				var element = thisElement.domReference;
				
				
				if( carnival.forms.isRadio( element[ 0 ] ) ){
					elementName = element[ 0 ].name;
				}
				else if( !element.parentNode && !carnival.forms.isRadio( element[ 0 ] ) ){
					thisElement.domReference =  this.getFormElements( thisElement.fieldName )[ 0 ];
					element = thisElement.domReference;
				}
				else{
					elementName = element.name;
				}

				this.logger.changeColor( "background-color:#ddff77" );
				this.logger.info( "removeErrorMessage: Remove Error Message for " + elementName +
				 				  " and validator " + this.stripAnnotationSymbol( validator.validatorName ) );

				var $thisElement = $( element ),
					validatorErrorClass = elementName + this.stripAnnotationSymbol( validator.validatorName ),
					$thisError = $thisElement.siblings("span." + validatorErrorClass );
					$thisError.remove();
			},

			/** 
			* 	@property {Function} validateForm
			*   @param {String} thisElement 
			* 	@description
			**/
			validateElement : function ( thisElement ){

				this.logger.changeColor( "background-color:#bbff99" );
				this.logger.info( "validateElement: Validating Element " + thisElement.fieldName );
			
				var	thisElementsValidators = thisElement.validators,
					hasError = false;

				for( var validatorIndex = 0, totalValidators = thisElementsValidators.length;
					 	 validatorIndex < totalValidators;
						 validatorIndex++ ){

					this.logger.changeColor( "background-color:#bbff99" );
					this.logger.info( "validateElement: The value of element is = " + thisElement.getValue() );

					var thisValidator = thisElementsValidators[ validatorIndex ],
						result = this.executeValidator( thisElement.getValue() , thisValidator );

					if( !result ){

						var validationArguments = thisValidator.validationArguments || "";

						this.displayErrorMessage( thisElement , thisValidator );
						hasError = true;
					}
					else{
						this.removeErrorMessage( thisElement , thisValidator );
					}
				}

				if( !hasError ){

					var $element = $( thisElement.domReference );
						/*$element.css({
							"border-color"	: "#F0F0F0",
							"background-color"	: "#FFF"
						});*/

					if( thisElement.successCallback ){
						thisElement.successCallback();	
					}
				}
				return hasError;
			},

			/** 
			* 	@property {Function} validateForm
			* 	@description
			**/
			validateForm: function( ){

				this.logger.changeColor( "background-color:#ffaabb" );
				this.logger.info( "validateForm: Validating the Form" );

				var elementToValidate = this.formElementCollection,
				 	hasErrors = false;

				for( var index = 0, totalElements = elementToValidate.length; 
					  	 index < totalElements; 
						 index++ ){

					var thisElement = elementToValidate[ index ],
						context = this,
						errorsInValidation = context.validateElement( thisElement );
					
					if( errorsInValidation ){
						hasErrors = true;
					}
					
					if( thisElement.inputType == "checkbox" ||  thisElement.inputType == "radio" ){

						/** Wrap in an anonymous function so that we can preserve the reference 
						*   to thisElement  
						**/
						( function( element ){
							$( thisElement.domReference ).bind( "click" , function(){
								context.validateElement( element );
							});
						})( thisElement );
					}
					else if( thisElement.inputType == "select" ){
						( function( element ){
							$( thisElement.domReference ).bind( "change" , function(){
								context.validateElement( element );
							});
						})( thisElement );
					}
					else{
						( function( element ){
							$( thisElement.domReference ).bind( "blur" , function(){
								context.validateElement( element );
							});
						})( thisElement );
					}

				}

				if( hasErrors ){

					/** 
					*  If the form has errors, we return false to prevent the form from submitting
					**/
					this.logger.changeColor( "background-color:#ffaabb" );
					this.logger.warn( "validateForm: The form has errors" );
					return false;
				}
				else{

					/**
					*	If the form is free of field errors we can submit the form or pass control over 
					*	to another component to submit the form
					**/
					this.logger.changeColor( "background-color:#ffaabb" );
					this.logger.info( "validateForm: Success: Submitting the form" );

					var formId = this.targetForm,
						form = document.getElementById( formId );
						//Return true - validation passed so pass the success to the form controller and submit the form
						return true;
				}		
			}
		};

	})( jQuery );



	/**
	 * form - All functions needed for processing and populating forms.
	 * @constructor
	 */
	var form = function( formid ){
		
		this.formValidator = new FormValidator({ 
			formId : formid,
			errors :{
				groupErrors				: false,
				inputBackgroundColor	: "none",
				aggregateMessages		: true,
				errorClass				: "error"
			} 
		});
		
		this.formEl = $( '#' + formid );
		
		this.addValue('productCode',carnival.configuration('product'));
	};

	/**
	 * carnival.forms.form prototype functions
	 * @memberOf carnival.forms.form.prototype
	 */
	form.prototype = {

		/**
		 * addValue - adds a hidden value field to a form
		 * @param {String} key the Name attribute of the value
		 * @param {String} value the value of the attribue 
		 */
		addValue : function(key,value){
			if($('input[name='+key+']').length) {
				$('input[name='+key+']').val(value);
			} else {
				this.formEl.append('<input type="hidden" name="'+key+'" value="'+value+'"/>');
			}
		},
	
		serializeForm : function(selector){
			return this.formEl.serializeFormToJson(selector);
		},

		/**
		 * makeReadonly - adds readonly fields .
		 * @private
		 * @param {String} formid The id of the form to populate
		 * @param {Object} data JSON Object with readonly fields
		 */
		makeReadonly : function(data){
			for (var i = data.length;i--;) {
				if('string' == typeof carnival.user.profile(data[i]) && carnival.user.profile(data[i]).length){
				 	
					var textColor = carnival.configuration( 'ssorModalTextColor' ) || "#fff";
					this.formEl.find('input[name='+data[i]+']').attr('readonly','readonly');
					
					   $('input[name='+data[i]+']').css( {
							"border":"none",
							"background-color":"transparent",
							"color":textColor
						} );
						
						$("#userName").focus();
					
				}
			}
		},
		
		makeForm : function(data){
			carnival.forms.replicateDataPoints(this.formEl[0],data);
		},
	
		/**
		 * formatForm - adds required fields and redonly fields to form
		 * @param {Object} data JSON object with data

		 */
		formatForm : function( data ){

			var massageJSONObject = function( response ){
			
				var validationRules = [];
				var attributeRules = {};
				var requiredAttributes = {};
				var birthdayValidator = {};
				
				if( response.attrRules ){
					attributeRules = response.attrRules;
					validationRules = attributeRules;
				}
				
				if( response.requiredAttrs ){
					
					requiredAttributes  = response.requiredAttrs;
					
					for( var requiredAttribute = 0, totalrequiredAttributes = requiredAttributes.length; 
							 requiredAttribute < totalrequiredAttributes ; 
							 requiredAttribute++ ){
						
						var thisRequiredAttribute = requiredAttributes[ requiredAttribute ];
						
						for( var validationRule = 0, totalValidationRules = validationRules.length;
								 validationRule < totalValidationRules;
								 validationRule++ ){
							
							var thisValidationRule = validationRules[ validationRule ];
							
							if( thisValidationRule.name == thisRequiredAttribute ){
								thisValidationRule.required = true;
							}
						}	
					}
				}
				
				if( response.minAge ){
					ageValidator = {
						name		: "currentAge",
						minAge		: response.minAge,
						required 	: true
					};
					
					//validationRules.push( ageValidator );
				}
				
				return validationRules;
				
			};
			
			
			
			var getProfileContentRules = function( myNewValidator ){

				var thisValidator = myNewValidator;

				var handleProfileContentRules = function( validationRules ){
		
					for( var validationRule = 0, totalValidationRules = validationRules.length; 		
					 	 validationRule < totalValidationRules ;
						 validationRule++ ){

					 	var thisValidationRule = validationRules[ validationRule ];

						validatorController( thisValidationRule );
					}

				};

				var validatorController = function( thisValidationRule ){

					var validatorsToAdd = createValidators( thisValidationRule );
					thisValidator.bindValidator( thisValidationRule.name, validatorsToAdd );

				};

				var createValidators = function( validationRule ){

					var allValidators = [];

					for( var rule in validationRule ){

						if(  !validationRule.hasOwnProperty( rule )  ){
							 continue;
						}

							var validator = propertyRulesTranslator( rule, validationRule[ rule ] , validationRule.name ); 	
							if( validator ){
									allValidators.push( validator );
							}	


					}	
					return allValidators;

				};	

				var propertyRulesTranslator	= function( rule, value, elementToValidate ){
					//Creates and adds validators and returns a collection of validators to validate against
					//Ultimately it would be nice to have the validation rule names match or be consistant with the clientside annotation	
						var annotation = "";

						if( rule == "minLen" ){
							annotation = "@Min=" + value ;
						}
						else if( rule == "maxLen" ){
							annotation = "@Max=" + value;
						}
						else if( rule == "minAge" ){
							annotation = "@OfAge=" + value;
						}
						else if( rule == "stopChars" ){
							annotation = "@StopChar=" + value;
						}
						else if(  rule == "validationRule" ){
							annotation = "@ValidationRule=" + value;
						}
						else if( rule == "required" ){
							annotation = "@NotNull";	
						}
						else{
							//throw error
							return false;
						}

						return annotation;

				};
				
				var validationRules = massageJSONObject( data );
				
				handleProfileContentRules( validationRules ) ;

			};
			
			getProfileContentRules( this.formValidator );

			if( data.nonEditAttrs ){
				this.makeReadonly( data.nonEditAttrs );
			}


			if('true' == carnival.user.profile('isEmailVerified')){
				if(data.toBeVerifiedAttrs){
					this.makeReadonly(data.toBeVerifiedAttrs);
				}
			}
		},
		
		
		/**
		 * populateData - puts data into form fields
		 * @param {String} formid The id of the form to populate
		 * @param {Object} data JSON Object with data to go into form
		 * @param {String} optional - "hide" or "remove" to hide or remove items already populated
		 */
		populateData : function(data,hidePopulatedFlag) {
		
			var el;
			
			var birthDayValue = data.birthDay;
			var birthMonthValue = data.birthMonth;
			var birthYearValue = data.birthYear;
			var birthMonthString = "";
			var convertNumberToMonth = function( number ){
				switch( number ){
					case 1:
					birthMonthString = "January";
					break;
					case 2:
					birthMonthString = "February";
					break;
					case 3:
					birthMonthString = "March";
					break;
					case 4:
					birthMonthString = "April";
					break;
					case 5:
					birthMonthString = "May";
					break;
					case 6:
					birthMonthString = "June";
					break;
					case 7:
					birthMonthString = "July";
					break;
					case 8:
					birthMonthString = "August";
					break;
					case 9:
					birthMonthString = "September";
					break;
					case 10:
					birthMonthString = "October";
					break;
					case 11:
					birthMonthString = "November";
					break;
					case 12:
					birthMonthString = "December";
					break;
					default:
					birthMonthString ="";
					break;
				}
			};
			
			convertNumberToMonth( birthMonthValue );
			
			var $birthDay = this.formEl.find('#birthDay .selectContent');
			var $birthMonth = this.formEl.find('#birthMonth .selectContent');
			var $birthYear = this.formEl.find('#birthYear .selectContent');

			if( birthDayValue ){
				$birthDay.html( birthDayValue );	
			}
			if( birthMonthString ){
				$birthMonth.html( birthMonthString );	
			}
			if( birthYearValue ){
				$birthYear.html( birthYearValue );	
			}
			
			var calculateFullDate = function(){
				return birthMonthValue + "/" + birthDayValue + "/" + birthYearValue;
			};
					
			var populateFullDate = function( date ){
				$( "#currentAge" ).val( date );
			};
			
			populateFullDate ( calculateFullDate() );
			
			
			//special case for email address array
			var emails = data.emailArray;
			//eliminate blank values
			for (var i in emails) {
				if (emails[i] == "") {
					emails.splice(i,1);
				}
			}
			
			this.formEl.find('span').filter(function(i) {
				return $(this).html() == 'Loading...';
			}).html('Not supplied');
			
			for (var key in data) {
				if (data.hasOwnProperty(key) && !!(data[key]) ){
					el = this.formEl.find('input[name='+key+'][type!=checkbox][type!=radio]');

					//*********************
					// Convention: for views (spans) and edit fiels (forms) on the same page,
					// append a "v" to the end of your spans to solve naming conflict
					//**********************

					var elv = this.formEl.find('span#'+key+"v");
					elv.html(carnival.core.enumMapper(data[key]));
					//end profile fix

					if(el.length){
						el.val(data[key]);
					} else {
						try{
							el = this.formEl.find('[value='+key+'][type=checkbox],[name='+key+'][type=radio][value='+data[key]+']');
						}catch(e){el=[];}
						if(el.length){el.attr('checked',true);
						} else {
							el = this.formEl.find('[name='+key+'][type=checkbox][value='+data[key]+']');
							if(el.length){el.attr('checked',data[key]);}
							else {
								el = this.formEl.find('select[name='+key+']');
								if(el.length ){
									if(key == 'email'){
										for(var i = emails.length;i--;){
											el.append($('<option ></option>').val(emails[i]).html(emails[i]));
										}
									}
									try {el.val(data[key]);}
									catch(ex) {setTimeout(function(){el.val(data[key]);},10);}
								}else {
									el = this.formEl.find('span#'+key);
									el.html(data[key]);
								}
							}
						}
					}
					
					if (hidePopulatedFlag == "remove") {
						el.parents('li:first').remove();
					} else if (hidePopulatedFlag == "hide") {
						el.parents('li:first').hide();
					}
				
				}
			}
			
			carnival.utils.listener.fire( 'formPopulated' );
		},
			
	
		populateErrors : function(data){
			var error = '';
			data = data || {};
			//carnival.captcha.reload();
			//must exist and must be array
			if( data.validationErrors ) {
				var errors = data.validationErrors;
				if(!errors.push){errors = [data.validationErrors];}
				for (var i = errors.length;i--;) {
					if( carnival.forms.errCodes[errors[i].errCode] != undefined){
						error = carnival.forms.errCodes[errors[i].errCode];
						carnival.logger.info('error:' + error);
					} else {
						error = errors[i].errMsgs;
					}
					var errSelect = this.formEl.find("*[name="+errors[i].attrName+"]");
					if(errSelect.length){
						errorplacement('<label for="'+errors[i].attrName+'" generated="true" class="error">'+error+'</label>',errSelect);
					} else {
						this.formError(error);
					}
				}
			} else if(data.errMsg){
				if( carnival.forms.errStatus[data.returnCode] === undefined ){
					this.formError(data.errMsg);
				} else if (data.returnCode == "0") {
					this.clearFormError();
				} else {
					this.formError(carnival.forms.errStatus[data.returnCode]);
				}
			} else {
				this.clearFormError();
			}
		},
	
		clearFormError : function() {
			if(this.formEl.children('div.carnival-error').length > 0){
				this.formEl.children('div.carnival-error').hide();
			}
		},
	
		formError : function(msg){
			var theseButtons = this.formEl.find('#signonSubmits');
			if(!theseButtons.children('div.carnival-error').length){

				theseButtons.prepend('<div class="carnival-error" style="display:none" ></div>');
			}
			var el = theseButtons.children('div.carnival-error');
			el.html(msg).show();
		},

		flashMessage: function(msg){
			if(!this.formEl.children('div.carnival-flash').length){
				this.formEl.prepend('<div class="carnival-flash" style="display:none" ></div>');
			}
			var el = this.formEl.children('div.carnival-flash');
			el.html(msg).show();
		}
	
	};
	
	var errCodes = {};

	/**
	 * addErrorCode - method for adding custom error messages
	 * @param {String} code The code for the error message to override
	 * @param {String} message The custom message
	 */
	var addErrorCode = function(code,message){
		errCodes[code] = message;
	};

	//errStatus 2000 is for printing out whatever string is passed.
	var errStatus = {
		'3': 'An error occured.  Please try again.'
	};

	var addErrorStatus = function(code,message){
		errStatus[code] = message;
	};
	
	/**
	 * replicateDataPoints - Duplicate an HTML template and populates it with data
	 *   This method uses html comments as a data container.  The nodeValue of the
	 *   first comment in the container becomes the HTML template.
	 * @param {String|DomNode} moldContainer Container of HTML template to be duplicated
	 * @param {Object} values Data to be injected into template.
	 */
	var replicateDataPoints = function(container,values,templateContainer) {
		container = $(container);
		templateContainer = $(templateContainer || container);
		var template = (templateContainer.length ? templateContainer : container)[0].firstChild.nodeValue;
		for (var key in values) {
			if (values.hasOwnProperty(key)) {
				template = template.replace(new RegExp('\\$\\{'+key+'\\}','g'),carnival.utils.escapeHTML(values[key]));
			}
		}
		container.append(template.replace(/\$\{[^\}]*\}/g,''));
	};

	var createFormFields = function(location,data,templateContainer){
		for( var j = data.length, i = j+1 ; --i ;){
		    carnival.forms.replicateDataPoints(location,data[j-i], templateContainer);
		}
	};

	var errorplacement = function(er, element) {
		var el = element.siblings('span.signon-error') ;
		if(!el.length) {
			el = $('<span class="signon-error"><span>').insertAfter(element);
		}
		el.html(er);
	};
	
	var isTextField = function( element ){
		return element.nodeName == "TEXTAREA" && 
			   ( element.type == "textarea" || element.type == "hidden" );
	};
	
	var isInput = function( element ){
		return element.nodeName == "INPUT" && 
			   ( element.type == "text" || element.type == "hidden" || element.type == "password" );
	};

	var isSelect = function( element ){
		return element.nodeName == "SELECT";
	};

	var isCheckbox = function( element ){
		return element.nodeName == "INPUT" && 
			   element.type == "checkbox";
	};
	var isRadio = function ( element ){
		if ( element ){
			return element.nodeName == "INPUT" &&
			 	   element.type == "radio";
		}
	};

	var stripWhiteSpace = function( value ){
		if( !value ){
			return "";
		}
		return value.replace(/^\s+|\s+$/g,""); 
	};

		var	disableButton = function( element ){

			if( carnival.utils.objects.isAJqueryCollection( element ) ){
				element.attr( "disabled", "disabled" );
			} 
			else {
				$( element ).attr( "disabled", "disabled" );
			}

		};
		
		var enableButton = function( element ){
			if( carnival.utils.objects.isAJqueryCollection( element ) ){		
				element.removeAttr("disabled");
			} 
			else {
				$( element ).removeAttr("disabled");
			}

		};



	return {
		form:form,replicateDataPoints:replicateDataPoints,
		createFormFields:createFormFields,errorplacement:errorplacement,
		addErrorCode:addErrorCode,errCodes:errCodes,
		addErrorStatus:addErrorStatus,errStatus:errStatus,
		isInput:isInput,isSelect:isSelect,isCheckbox:isCheckbox,isRadio:isRadio,isTextField:isTextField,
		stripWhiteSpace:stripWhiteSpace, disableButton:disableButton, enableButton:enableButton
	};
}(jQuery,document,window);


/**
 * utils
 * @namespace
 */
carnival.utils = function($,window,document,undefined){
	var // keep all declarations under one var
	/**
	 * birthyear - makes sure that age is greater than 13
	 * @param {String} yearid the id for the select element with year values
	 * @param {String} monthid the id for the select element with month values
	 * @param {String} dayid the id for the select element with day values
	 */
	 birthyear = function(yearid,monthid,dayid) {	
		yearid = yearid || 'birth_year_span';
		monthid = monthid || 'birth_month_span';
		dayid = dayid || 'birth_day_span';
		var yearspan, monthspan, dayspan,
				today = new Date(), // better validate serverside later;
		checkYear = function(){
			if(yearinput.val() == today.getFullYear() - 13) {
				monthspan.css({display:'block'});
			}
		},
		checkMonth = function(){
			if(monthinput.val() > today.getMonth() ) {
				dayspan.css({display:'block'});
			}
		};
		if((yearspan = $('#'+yearid)) && (monthspan = $('#'+monthid)) && (dayspan = $('#'+dayid))) {
			yearinput = yearspan.find('select');
			monthinput = monthspan.find('select');
			yearinput.bind('focus change',checkYear);
			monthinput.bind('focus change',checkMonth);
		}
	},

	cleanLocation = function(){
		return document.location.toString().replace(/(?:(\?)|&)(reset_flag|email_token|h_token|logout|token|verified)=[^&]*/g,'$1').split("#")[0];
	},
	
	/**
	 * @function changeTextColor
	 * @description Changes the text color to the P2P param ssorModalTextColor
	 * @return void
	 */
	changeTextColor = function(){
		
		var modalTextColor = carnival.configuration( 'ssorModalTextColor' ) || "";
	
		if( modalTextColor ){
			carnival.logger.info('change text color=' + modalTextColor );
			$( '#prForm, #ssorNavHeader span, #ssorNavHeader a, #ssorNavBody a, #ssorNavHeader label, #carnivalContent span, #carnivalContent label, #carnivalContent ul, #carnivalContent li, #carnivalContent #emailConfirm, #carnivalContent p, #carnivalContent a, #carnivalContent h1, #carnivalContent h2, #carnivalContent h3, #carnivalContent .carnival-flash, #carnivalContent .nl-header, #carnivalContent .show_nl_desc, #carnivalContent .newsletter_description, #userNameAvailable, #carnivalModal.registration label, #carnivalInnercontent #email_address_taken, #carnivalInnercontent h1').css( 'color', modalTextColor );			
		}
		
		$( '#carnivalContent .selectContent, #carnivalContent #signonSubmits #signon-submit, #carnivalContent #signonSubmits #signon-submit span, #carnivalContent .selectOptions span, #recaptcha_instructions_image' ).css('color' , '#000');
		$('#carnivalModal.registration .error, #carnivalModal.registration .agreement .error').css('color' , '#F00');
	},
	
	
	/**  
	 * @function getBlueprintValue
	 * 
	 * @description calls service and returns value for blueprints data 
	 * @param bpCode - blueprints code [basically a key for the value] corresponding to the requested value
	 * @param callback - callback to handle the resulting value
	 * @param pCode - market product Code (optional - defaults to current)
	 * @return undefined or string "getBlueprintValue error" (b/c return value from service is string "true" or "false")
	 */
	getBlueprintValue = function(bpCode,callback,errCallback,pCode) {
		var BPSapiKey = "Carniva1";
		var pCode = pCode || carnival.configuration('product');
		var bpCode = bpCode || null;
		if (!bpCode) {
			carnival.logger.error("No Blueprint code was passed to utils.getBlueprintValue");
			return "getBlueprintValue error";	
		} else if (!callback) {
			carnival.logger.error("No Callback method was passed to utils.getBlueprintValue");
			return "getBlueprintValue error";
		}
		var reqParams = "apiKey="+BPSapiKey+"&code="+bpCode+"&productCode="+pCode;
		var BPSURL = carnival.configuration('hostname') + "/registration/trbsecurity/blueprintquery";
		
		$.ajax({
			url: BPSURL,
			type: "GET",
			contentType: 'application/x-www-form-urlencoded',
			data: reqParams,
			success: function(sdata) {
				//only update utils.blueprints for current product
				if (pCode == carnival.configuration('product')) {
					carnival.utils.blueprints(bpCode,sdata['value']);
				}
				callback(sdata['value']);
			},
			error: function(xmlReq, txtStatus, errThrown) {
				if (!!errCallback) { errCallback(); }
				carnival.logger.error( "getBlueprintValue error" );
			}
		});
				
	},
	
	blueprints = function(key,value){
		var _bp = this;
		if(key){
			if(key.constructor == String){
				if(value!=undefined){
					_bp[key] = value;
				}
				return _bp[key];
			} else {
				_bp = carnival.utils.merge(_bp,key);
			}
		}
		return _bp;
	},

	/**
	 * serializeJSON - turns JSON to string.  Uses built in
	 *   JSON.stringify if available
	 */
	serializeJSON = /* (typeof JSON != 'undefined' && !!(JSON.stringify) ) ? JSON.stringify : */ function (obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			if (t == "string"){ obj = '"'+obj+'"'; }
			return obj;
		} else {
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				if (obj.hasOwnProperty(n)) {
					v = obj[n]; t = typeof(v);
					if (t == "string") {v = '"'+v+'"';}
					else if (t == "object" && v !== null) {v = serializeJSON(v);}
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	},

	parseJSON = function(stringJSON){
		var data = '';
		try{data = (new Function("return "+stringJSON))();}catch(e){try{data=eval("("+stringJSON+")");}catch(f){}}
		return data;
	},

	/**
	 * sameHeight - adjusts elements to all have the same height
	 * @param elems {Object} elements that need to adjusted
	 * @param colCount {Number} allows for grouping of x number of elements at a time
	 */
	sameHeight = function(elems,colCount){
		colCount = colCount || elems.length;
		var totalCount = elems.length;
		elems.css({height:""});
		for(var i = 0;i-colCount <= totalCount;i += colCount){
			var heights = [0],j;
			for(j = i;(j==i || (j % colCount)) && j < totalCount;j++){
				heights.push($(elems[j]).height());
			}
			heights = Math.max(heights);
			for(j = i;(j==i || (j % colCount)) && j < totalCount;j++){
				$(elems[j]).height(heights);
			}
		}
	},

	/**
	 * merge - merges two objects
	 * @param {Object} original Original object
	 * @param {Object} update Object to merge in.  These values overwrite.
	 * @returns {Object} Merged object
	 */
	merge = function(original,update){
		var value='';
		for (var key in update) {
			if (update.hasOwnProperty(key)) {
				value = ((!!update[key]) && update[key].constructor == String)?update[key].replace(/<[^>]*>/g,''):update[key];
				original[key] = value;
			}
		}
		return original;
	},

	/**
	 * popup - open popup window
	 *   opens empty window first, then opens url inside that window to set referrer in IE
	 * @param {String} URL url of page to open
	 */
	popUp = function(){
		var page = null;
		var _popUp = function(URL) {
			if(page != null){
				page.close();
			}
			page = window.open('','_carnival_popup','toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=768,height=480');
			$(window).bind("unload", function() {
				page.close();
			});
			if(URL){page.location = URL;}
			try{page.focus();}catch(e){}
		};
		return _popUp;
	}(),

	/**
	 * listener - Singleton.  used to subscribe to and fire events
	 */
	listener = function(){
		/**
		 * @param {Object} evts the container for all event listeners
		 * @private
		 */
		var evts = {};

		/**
		 * listen - subscribe to events
		 * @param {String} evtName the name to be listening for
		 * @param {Function} method the function to be fired
		 * @param {Object} scope the value for the 'this' object inside the function
		 */
		var listen = function(evtName,method,scope) {
			if(method && method.constructor == Function) {
				evts[evtName] = evts[evtName]||[];
				evts[evtName][evts[evtName].length] = {method:method,scope:scope};
				if (carnival.configuration('eventTracing') == 'true') {		
					carnival.logger.info("LISTENING FOR: " + evtName + "? " + listening(evtName));
				}
			}
		};

		/**
		 * fire - call all the event handlers
		 * @param {String} evtName the name of the event listner to invoke
		 * @param {Boolean} remove Whether or not to unsubscribe all listeners
		 */
		var fire = function(evtName,args) {
			args = args || [];
			if( evts.hasOwnProperty(evtName)) {
				var evt = evts[evtName].reverse();
				for(var i=evt.length;i--;) {
					try{
						evt[i].method.apply(evt[i].scope||[],(args.data||[]));
					}catch(e){
						if(args && args.data && args.data.push) {
							evt[i].method(args.data[0]);
						} else {
							evt[i].method();
						}
					}
				}
				if(args.remove) {
					kill(evtName);
					carnival.logger.info("Listener Removing: " + evtName);
				}
			}
			//event tracing:
			if (!!carnival.configuration('eventTracing')) {
				carnival.logger.info("EVENT FIRED: " + evtName);
			}
		};
	
		var listening = function(evtName){
			if (!!evtName) {
				return !!evts[evtName];
			} else {
				return evts;
			}
		};
		
		var kill = function(evtName){
			if(evts.hasOwnProperty(evtName)) {delete evts[evtName];}
			if (carnival.utils.getUrlVar('listenerDebug') == 'true') {
				//console.log("HEARING: " + evtName + "? " + listening(evtName));
			}
		};
	
		// return the public functions
		return {listen:listen,fire:fire,kill:kill,listening:listening};
	}(),

	getUrlVar = function(){
		var vars;
	
		/**
		 * getVar - Get values from url parameters.  If no arguments are passed,
		 *   object with all URL parameters is returned.
		 * @param {String} key URL parameter to retrieve.
		 */
		var getVar  = function(key){
			if(!key){return getVars();}
			return getVars()[key];
		};
	
		/**
		 * getVars - Get object with all URL parameters
		 * @private
		 * @returns {Object} all URL parameters
		 */
		var getVars = function(){
			if(vars){return vars;}
			vars = {};
			var hashes;
			if(!!(hashes = window.location.href.replace(/(\?[^\?]*)\?/g,'$1&').split('?')[1])) {
				var hash = [];
				var eqPos;
				hashes = hashes.split('&').reverse();
				for(var i=hashes.length;i--;){
					eqPos = hashes[i].indexOf('=');
					hash[0] = hashes[i].substring(0,eqPos);
					hash[1] = hashes[i].substring(eqPos+1, hashes[i].length);
					vars[hash[0]] = hash[1];
				}	
			}	
			return vars;
		};
	
		return getVar;
	}(),
	
	
	
	

	contains = function(arr,obj){
		if(arr.indexOf){
			return arr.indexOf(obj)<0;
		}
		return $.inArray(arr,obj);
	},
	
	uniqueArray = function(a) {
		var retVal = [];
		for(i=0;i<a.length;i++){
			if(contains(retVal,a[i])){
				retVal.push(a[i]);
			}
		}
		return retVal;
	},
	
	escapeHTML = function(input){
		return input.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
	},
	
	cookies = $.cookies; // this can be changed to another cookie lib later if we need to
	
	return {birthyear:birthyear,listener:listener,merge:merge,sameHeight:sameHeight,cookies:cookies,
		getUrlVar:getUrlVar,serializeJSON:serializeJSON,popUp:popUp,escapeHTML:escapeHTML,changeTextColor:changeTextColor,
		cleanLocation:cleanLocation,uniqueArray:uniqueArray,parseJSON:parseJSON, getBlueprintValue:getBlueprintValue, blueprints:blueprints};
}(jQuery,window,document);

/*****************************************
	new utility methods
*******************************************/

carnival.utils.arrays = {
	
	isEmpty: function( array ){
		return ( array.length == 0 ) ? true : false;
	}

};

carnival.utils.Errors = function( config ){
	this.constructor( config );		
};

carnival.utils.Errors.prototype = ( function( $ ){ 
	
	return {
		
		constructor: function( config ){
			
		},
		
		/** 
		* 	@property {Function} throwException
		* 	@param {String} name 
		* 	@param {String} message 
		* 	@description 
		*   @throws {Error} 
		**/
		throwException: function( name, message ){
			var error = new Error();  
			error.name = name || "";  
			error.message = message || "";  
			throw ( error );
		}
	}
	
})();

carnival.utils.strings = {
	
	isAString : function( string ){
		return string.constructor == String;
	},
	
	capitalizeFirstLetter: function ( str ) {
	    var firstLetter = str.substr( 0, 1 );
	    return firstLetter.toUpperCase() + str.substr( 1 );
	},
	
	isEmpty: function( value ){
		//handle whitespace characters
		if( value == "" ){
			return true;
		}
		else{
			return false;
		}
	}	
};

carnival.utils.objects = {
	
	isAnObject : function( object ){
		return object.constructor == Object;
	},
	
	isAJqueryCollection : function( object ){
		return object.jquery !== undefined;
	}
		
};



/****************************************/

/**
 * user - functions related to userprofile
 * @namespace
 */
carnival.user = function($,window,document,undefined){
	var data={}, _profile={}, _provider = {}, config = carnival.configuration;

	var profile = function(key,value){
		if(key){
			if(key.constructor == String){
				if(value!==undefined&&value!==null){
					if(value.constructor == String){value = value.replace(/<[^>]*>/g,'');}
					_profile[key] = value;
				}
				return _profile[key];
			} else {
				_profile = carnival.utils.merge(_profile,key);
				
			}
		}
		return _profile;
	};
	
	var resetUser = function(){	
		_profile={};
	};
	

	var provider = function(key,value){
		if(key){
			if(key.constructor == String){ 
				if(value!=undefined){
					_provider[key] = value;
				}
				return _provider[key];
			} else {
				_provider = carnival.utils.merge(_provider,key);
			}
		}
		return _provider;
	};

	/**
	 * isLoggedIn - Function for determining if current user is logged in.
	 * @returns {Boolean} logged in or not
	 */
	var isLoggedIn = function(){
		try{return carnival.utils.cookies.get(config('c_mid')) !== null;}catch(e){return false;}
	};

	/**
	 * getCookieProfile - Function for determining if current user is logged in.
	 * @returns {Object} userprofile with data set coming from cookies
	 */
	var getCookieProfile = function(){
		profile('userName', carnival.utils.cookies.get(config('c_unm')) );
		profile('masterId', carnival.utils.cookies.get(config('c_mid')) );
		profile('lastProviderLogin', carnival.utils.cookies.get(config('c_llp')) );
		return profile();
	};

	var afterLogin = function(callback,scope){
		carnival.utils.listener.kill('_carnival_after_login');
		carnival.utils.listener.listen('_carnival_after_login',callback,scope);
	};
	
	var appendAfterLoginEvent = function(callback,scope) {
		carnival.utils.listener.listen('_carnival_after_login',callback,scope);
	};

	var login = function(cancelCallback){
		cancelCallback = (cancelCallback === true);
		setCarnivalCookie(cancelCallback);
	};

	var getEmailAddresses = function(){
		var p = profile(),i;
		var emails = [];
		var _verified = 0;
		profile('email',(p.email && p.email.length)?p.email:'');
		emails.push(profile('email'));
		if('false' != carnival.user.profile('isEmailVerified')  && 'false' != carnival.user.profile('isEmailExists')) {
			if(p.linkedIdentifiers && p.linkedIdentifiers.push){
				for(i = p.linkedIdentifiers.length;i--;){
					if(p.linkedIdentifiers[i].emailAddress && p.linkedIdentifiers[i].emailAddress.length){
						if(p.linkedIdentifiers[i].emailStatus == 'VERIFIED'){
							if((!profile('email') || !profile('email').length)){
								profile('email',p.linkedIdentifiers[i].emailAddress);
							}
							emails.push(p.linkedIdentifiers[i].emailAddress);
							profile(    'isEmailVerified','true');	
						}else if((!profile('email') || profile('email').length) && p.linkedIdentifiers[i].emailAddress.length){
							profile('email',p.linkedIdentifiers[i].emailAddress);
							emails.push(p.linkedIdentifiers[i].emailAddress);
						}
					}
				}
			} 
			if(!emails.length && profile('email') && profile('email').length) {
				emails.push(profile('email'));
			}
		} else {
			profile('isEmailVerified','false');
			if(p.linkedIdentifiers && p.linkedIdentifiers.push){
				for(i = p.linkedIdentifiers.length;i--;){
					if(p.linkedIdentifiers[i].emailAddress == profile('email') && p.linkedIdentifiers[i].emailStatus == 'VERIFIED'){
						profile('isEmailVerified','true');
						break;
					}
				}
			}
		}
		return carnival.utils.uniqueArray(emails);
	};

	/**
	 * logout - Function to log user out.  Only deletes masterid cookieTime
	 */
	var logout = function(logoutTarget){
		carnival.utils.cookies.del(config('c_mid'),{domain:config('cookieDomain'),path:'/'});
		carnival.utils.cookies.del(config('c_unm'),{domain:config('cookieDomain'),path:'/'});
		carnival.utils.cookies.del(config('c_rmc'),{domain:config('cookieDomain'),path:'/'});
		carnival.utils.cookies.del(config('ssopscn'),{domain:config('cookieDomain'),path:'/'});
		carnival.utils.cookies.del(config('c_prh'),{domain:config('cookieDomain'),path:'/'});
		
		carnival.user.profile('masterId','');
		window.location = logoutTarget || carnival.utils.cleanLocation();
		return false;
	};

	/**
	 * carnivalLogout - redirects user to logout on carnival
	 * @param {String} logoutUrl Location to redirect user to logout.  If empty will go to carnival
	 *   default logout location.
	 */
	var carnivalLogout = function(logoutUrl){
		document.location = (logoutUrl||getLogoutUrl());
		return false;
	};

	var getLoginUrl = function() {
		return config('hostname') + config('userPath') + "/signon.html?callbackUrl=" + carnival.utils.cleanLocation() + '&lastProvider=' + carnival.utils.cookies.get(config('c_llp')) + '&lastUser=' + carnival.utils.cookies.get(config('c_unm'));
	};

	var getLoginUrlPopup = function() {
		return config('hostname') + config('userPath') + '?callbackUrl=' + carnival.utils.cleanLocation() + '&lastProvider=' + carnival.utils.cookies.get(config('c_llp')) + '&lastUser=' + carnival.utils.cookies.get(config('c_unm'));
	};

	var getLogoutUrl = function(callbackPage) {
		return config('hostname')+config('userPath')+'/logout.html?callbackUrl='+encodeURIComponent(callbackPage || carnival.utils.cleanLocation());
	}; 

	var getUserName = function(){
		 var userName = carnival.user.profile('userName') || carnival.user.profile('displayName') || carnival.utils.cookies.get(config('c_unm'))  || '';
		return (decodeURIComponent( userName ));
	};
	
	/**
	 * getBasicUserInfo - retrieves initial user info using provided session token
	 * 
	 */
	var getBasicUserInfo = function(token,callback,scope) {
		$.getJSON(config('WSHostname')+config('userPath')+"/trbsecurity/userprofile?callback=?",
			{ signon_token : token},
			function(data) {
				carnival.user.profile(data);
				if(callback && callback.apply){callback.apply(scope||window,arguments);}
			}
		);
	};

	var setCarnivalCookie = function(cancelCallback) {
		if(!config('cookieTime')){
			var date = new Date();
			var rmcDate = new Date();
			date.setTime(date.getTime()+(14*24*60*60*1000));
			rmcDate.setTime(rmcDate.getTime()+(59*24*60*60*1000));
			config('cookieTime',date);
			config('rmcCookieTime',rmcDate);
		}
		//already checked carnival remember me cookie and there is one
		if (carnival.configuration('carnivalRM') == 't') {
			dropLoginCookies();
			carnival.utils.cookies.set(config('c_rmc'), 't', {expiresAt: config('rmcCookieTime'),domain:config('cookieDomain')});
			if(!cancelCallback){carnival.utils.listener.fire('_carnival_after_login');}
			try{carnival.utils.listener.fire('_carnival_after_cookie');}catch(e){}
		} else {
			var rememberMeURL = carnival.configuration('hostname') + "/registration/rememberMeCookieExists.jsp";
			$.ajax({
				url: rememberMeURL,
				success: function( rmdata ) {
					if ((rmdata != "") && (rmdata != undefined)){
						//there is a carnival remember me cookie
						dropLoginCookies();
						carnival.utils.cookies.set(config('c_rmc'), 't', {expiresAt: config('rmcCookieTime'),domain:config('cookieDomain')});
						if(!cancelCallback){carnival.utils.listener.fire('_carnival_after_login');}
						try{carnival.utils.listener.fire('_carnival_after_cookie');}catch(e){}
					} else {
						//no carnival remember me cookie
						dropLoginCookies();
						//delete front-end remember me cookie if exists in this case
						if (carnival.utils.cookies.get(carnival.configuration('c_rmc'))=="t") {
							carnival.utils.cookies.del(config('c_rmc'),{domain:config('cookieDomain'),path:'/'});
						}
						if(!cancelCallback){carnival.utils.listener.fire('_carnival_after_login');}
						try{carnival.utils.listener.fire('_carnival_after_cookie');}catch(e){}
					}
				},
				error:function( rmdata ){
					dropLoginCookies();
					if(!cancelCallback){carnival.utils.listener.fire('_carnival_after_login');}
					try{carnival.utils.listener.fire('_carnival_after_cookie');}catch(e){}
				}
			});
		}
		

		return false;
			
	};
	
	var dropLoginCookies = function() {
		carnival.utils.cookies.set(config('c_mid'), profile('masterId'), {domain:config('cookieDomain')});
		carnival.utils.cookies.set(config('c_unm'), profile('userName'), {expiresAt: config('cookieTime'),domain:config('cookieDomain')});
		carnival.utils.cookies.set(config('c_llp'), profile('lastProviderLogin'), {domain:config('cookieDomain')});
		if ((!!config('ssopscn')) && (!!config('ssopscv'))) {
			carnival.utils.cookies.set(config('ssopscn'), config('ssopscv'), {domain:config('cookieDomain')} );
		}
	};

	var profileIncomplete = function(incompleteCallback,completeCallback){
		//console.log("PROFINCOMPLETE FUNC");
		var missingData = [];
		if(carnival.user.profile('isEmailVerified') != 'true' && carnival.configuration('skipVerified') != 'true') {
			
			var _verified = false;
			if(carnival.user.profile('linkedIdentifiers').push){
				var lp = carnival.user.profile('linkedIdentifiers');
				for(var i = lp.length;i--;){
					if(lp[i].emailStatus == 'VERIFIED' && lp[i].providerName.toLowerCase().lastIndexOf(carnival.user.profile("lastProviderLogin")) === 0) {
						_verified = true;
					}
				}
			}
			if(!_verified) {
				return incompleteCallback(missingData);
			}
		}
		getConfigRules(function(data){
			if(data.requiredAttrs){
				for(var i= data.requiredAttrs.length;i--;) {
					if(!carnival.user.profile(data.requiredAttrs[i]) ){
						missingData.push(data.requiredAttrs[i]);
					}
				}
			}
			if(missingData.length){return incompleteCallback(missingData);}
			if(completeCallback){return completeCallback.call(window,[carnival.user.profile()]);}
		});
		return undefined;
	};

	var cancelLogin = function(logoutUrl) {
		carnivalLogout(logoutUrl);
	};

	
	/**
	 * submitUserResetRequest - request an email for a password reset
	 * @param {Object} email Email address requesting reset
	 * @param {Function} successMethod  The function to be called if success
	 * @param {Function} errorMethod  The function to be called if error
	 */
	var submitUserResetRequest = function(email,successMethod,errorMethod){
		var conf = config(),
			requestString = [
				conf.WSHostname,conf.userPath,
				'/trbsecurity/isoemailresetinstructions'
			].join(''),
			pCode = carnival.configuration('product') || 'default';
		
		var postData = {
			email:email, 
			productCode:pCode
		};
		
		if( carnival.configuration( 'landingPage' ) ){
			postData.landingPage = carnival.configuration( 'landingPage' );
		}
		
		carnival.core.postData({
			url:requestString,
			data:carnival.utils.serializeJSON( postData ),
			success:function(data){
				if(typeof data == 'string') {
					data = carnival.utils.parseJSON(data);
				}
				if(data.returnCode=="0"){
					successMethod(data);
				}
				else{errorMethod(data);}
			},
			error: function(transport){
				var data = carnival.utils.parseJSON(transport.responseText);
				if(data===undefined||data===''){data = transport;}
				errorMethod(data||transport);
			}
		});
	};
	
	var submitUserTempRequest = function(email,zipCode,successMethod,errorMethod){

			var conf = config(),
				requestString = [
					conf.WSHostname,conf.userPath,
					"/trbsecurity/isoresetpassword/sendpassword/?",
					"email=" + email,
					"&product_code=" + carnival.configuration('product') || 'default',
					"&zip=" + zipCode
				].join('');

			carnival.core.postData({
				url:requestString,
				success:function( data ){
					if(typeof data == 'string') {
						data = carnival.utils.parseJSON( data ) ;
					}
					if( data.returnCode=="0" && successMethod ){
						successMethod(data);
					}
					else if( errorMethod ){
						errorMethod( data );
					}
				},
				error: function( transport ){
						var data = carnival.utils.parseJSON( transport.responseText );
						if( data === undefined || data === '' ){ 
							data = transport;
						}
						if( errorMethod ){
							errorMethod( data || transport );
						}
				}
			});


	};
	
	/**
	 * submitUserReset -
	 * @param {Object}
	 * @param {Function} successMethod  The function to be called if success
	 * @param {Function} errorMethod  The function to be called if error
	 */
	var submitUserReset = function(inputs,successMethod,errorMethod){
		var conf = config(),
			requestString = [
				conf.WSHostname,conf.userPath,
				'/trbsecurity/isoresetpassword'
			].join(''),
			pCode = carnival.configuration('product') || 'default';
			
		var $errorsToClear = $( '.signon-frame' ).find( '.error' );
		$errorsToClear.remove();
		
		carnival.core.postData({
			url:requestString,
			data:carnival.utils.serializeJSON(inputs),
			success:function(data){
				if(typeof data == 'string') {
					data = carnival.utils.parseJSON(data);
				}
				if(data.returnCode=="0"){
					successMethod(data);
				}
				else{errorMethod(data);}
			},
			error: function(transport){
				var data = carnival.utils.parseJSON(transport.responseText);
				if(data===undefined||data===''){data = transport;}
				errorMethod(data||transport);
			}
		});
	};
	
	/**
	 * submitUserChange 
	 * @param {Object} 
	 * @param {Function} successMethod  The function to be called if success
	 * @param {Function} errorMethod  The function to be called if error
	 */
	var submitUserChange = function(inputs,successMethod,errorMethod){
		var conf = config(),
			requestString = [
				conf.WSHostname,conf.userPath,
				'/trbsecurity/isochangepassword'
			].join(''),
			pCode = carnival.configuration('product') || 'default';
		
		carnival.core.postData({
			url:requestString,
			data:carnival.utils.serializeJSON(inputs),
			success:function(data){
				if(typeof data == 'string') {
					data = carnival.utils.parseJSON(data);
				}
				if(data.returnCode=="0"){
					successMethod(data);
				}
				else{errorMethod(data);}
			},
			error: function(transport){
				var data = carnival.utils.parseJSON(transport.responseText);
				if(data===undefined||data===''){data = transport;}
				errorMethod(data||transport);
			}
		});
	};
	
	/**
	 * submitNewUser - sends new user username and password request to carnival
	 * @param {Object} inputs data to be saved
	 * @param {Function} successMethod  The function to be called if success
	 * @param {Function} errorMethod  The function to be called if error
	 */
	var submitNewUser = function(inputs,successMethod,errorMethod){
		var conf = config();
		var requestString = [conf.WSHostname,conf.userPath,
			'/trbsecurity/isocreatenewaccount?',
			'&api_key=',encodeURIComponent(inputs.apiKey),
			'&product_code=',encodeURIComponent(inputs.productCode)
			].join('');
		carnival.core.postData({
			url:requestString,
			data:transformNewUser(inputs),
			success:function(data){
				if(typeof data == 'string') {
					data = carnival.utils.parseJSON(data);
				}
				if(data.returnCode=="0"){successMethod(data);}
				else{errorMethod(data);}
			},
			error: function(transport){
				var data = carnival.utils.parseJSON(transport.responseText);
				if(data===undefined||data===''){data = transport;}
				errorMethod(data||transport);
			}
		});
	};

	/**
	 * submitConsumerProfile - save user data
	 * @param {Object} inputs data to be saved
	 * @param {Function} successMethod  The function to be called if success
	 * @param {Function} errorMethod  The function to be called if error
	 */
	var submitConsumerProfile = function(inputs,successMethod,errorMethod){
		var conf = config();
		// form is in JSON, but needs to be transformed to match what consumerprofile expects
		var transformedinputs = transformConsumerProfile(inputs);
		var landingPage = (!!carnival.configuration('landingPage')) ? carnival.configuration('landingPage') : 'default' ;
		var requestString = [conf.WSHostname,conf.userPath,
			'/trbsecurity/consumerprofile',
			'?master_id=',encodeURIComponent(inputs.masterId),
			'&api_key=',encodeURIComponent(inputs.apiKey),
			'&product_code=',encodeURIComponent(inputs.productCode),
			'&landingPage=',landingPage
			].join('');
		carnival.core.postData({
			url:requestString,
			data:transformedinputs,
			success:function(data){
				if(typeof data == 'string') {
					data = carnival.utils.parseJSON(data);
				}
				//fixes unm cookie setting issue
				if(!!inputs.userName){profile('userName',inputs.userName);}
				if(data.returnCode=="0"){
					if(!!inputs.email){profile('email',inputs.email);}
					if (!!successMethod) { successMethod(data); }
					dropProgregCookies(translateConsumerProfile(data.profileResponse));
				}
				else{errorMethod(data);}
				//REG-1093
				carnival.forms.enableButton( $("#signon-submit") );
			},
			error: function(transport){
				var data = carnival.utils.parseJSON(transport.responseText);
				if(data===undefined||data===''){data = transport;}
				errorMethod(data||transport);
				//REG-1093
				carnival.forms.enableButton( $("#signon-submit") );
			}
		});
	};
	
	/**
	 * dropProgregCookies - drop cookies for progressive registration use
	 * @param {Object} data from submit consumer profile or get consumer profile success
	 */
	var dropProgregCookies = function(data) {
		
		//get consumerprofile response sends top level profile, post consumerprofile returns data.profileResponse
		var localProfile = data;

		var prhCookieString = "";
		var prgCookieString = "";
		for (i in localProfile) {
			var sub = localProfile[i];
			if (!!sub && ((sub.constructor != Array) || (sub.constructor != Object))) {
				prhCookieString += i + "|";
			}
		}

		//use returning data for c_prg cookie
		for (d in localProfile) {
			if (d == "productProfileAttributes") {
				var dsub = localProfile[d];
				for (k in dsub) {
					if (dsub.hasOwnProperty(k) && (dsub[k]['name'] == 'groupstop')){
						prgCookieString = dsub[k]['value'];
					}
				}
			}
		}
		
		
		//set cookies
		carnival.utils.cookies.set(config('c_prh'), prhCookieString, {domain:config('cookieDomain')});
		dropProgregGroupCookie(prgCookieString);
	};
	
	var dropProgregGroupCookie = function(valueString) {
		
		//lives for ten years
		var prgDate = new Date();
		prgDate.setTime(prgDate.getTime()+(3650*24*60*60*1000));
		config('prgCookieTime',prgDate);
		
		carnival.utils.cookies.set(config('c_prg'), valueString, {expiresAt:config('prgCookieTime'), domain:config('cookieDomain')});
		
	};

	/**
	 * transformUserReset - Formats data to be sent to webservice
	 * @param {Object} input
	 */
	var transformUserReset = function(input){
		var out = {};
		for(var key in input) {
			if(input.hasOwnProperty(key)){
				if(!key.match(/recaptcha|adcopy|masterId|apiKey|productCode/i) && input[key].length) {
					out[key] = carnival.core.cleanInputs(input[key]);
				}
			}
		}
		return carnival.utils.serializeJSON(out);
	};
	
	/**
	 * transformNewUser - Formats data to be sent to webservice
	 * @param {Object} input
	 */
	var transformNewUser = function(input){
		var out = {};
		for(var key in input) {
			if(input.hasOwnProperty(key)){
				if(!key.match(/recaptcha|adcopy|masterId|apiKey|productCode/i) && input[key].length) {
					out[key] = carnival.core.cleanInputs(input[key]);
				}
			}
		}
		return carnival.utils.serializeJSON(out);
	};

	/**
	 * transformConsumerProfile - Formats data to be sent to webservice
	 * @param {Object} input
	 */
	var transformConsumerProfile = function(input){
		var out = {},val;
		for(var key in input) {
			if(input.hasOwnProperty(key)){
				if(!key.match(/recaptcha|adcopy|masterId|apiKey|productCode/i)) {
					val = carnival.core.cleanInputs(input[key]);
					if(key != key.replace(/^product_/,'')){
						if(!out.productProfileAttributesMap){out.productProfileAttributesMap = {entry:[]};}
						out.productProfileAttributesMap.entry.push({key:key.replace(/^product_/,''),value:val});
					} else if(key != key.replace(/^consumer_/,'')){
						if(!out.profileAttributes){out.profileAttributes = {entry:[]};}
						out.profileAttributes.entry.push({key:key.replace(/^consumer_/,''),value:val});
					} else {
						out[key] = val;
					}
				}
			}
		}
		return carnival.utils.serializeJSON(out);
	};

	/**
	 * translateConsumerProfile - Formats data returned by webservice
	 * @param {Object} data
	 */
	var translateConsumerProfile = function(data){
		var i;
		if(data.productProfileAttributes) { // && data.productProfileAttributes.entry){
			//if(!data.productProfileAttributes.push){data.productProfileAttributes = [data.productProfileAttributes];}
			for(i = data.productProfileAttributes.length;i--;){
				data["product_"+data.productProfileAttributes[i]['name']] = data.productProfileAttributes[i].value;
			}
		}
		//TO DO: make extendedProfileAttributes?
		if(data.profileAttributesList){
			//if(!data.profileAttributesList.entry.push){data.profileAttributesList.entry = [data.profileAttributesList.entry];}
			for(i = data.profileAttributesList.length;i--;){
				data["consumer_"+data.profileAttributesList[i]['name']] = data.profileAttributesList[i].value;
			}
		}
		if(data.linkedIdentifiers && data.linkedIdentifiers.length){
			for(i = data.linkedIdentifiers.length;i--;){
				carnival.user.provider(data.linkedIdentifiers[i].providerName,data.linkedIdentifiers[i].openId);
			}
		}
		return data;
	};

	/**
	 * getConsumerProfile - Function to get consumer data
	 * @param {Function|Object} callback method to call on success or object w/ arguments
	 * @param {Object} scope the scope that the callbacks will fire in
	 * @param {Function} error method to call on failure
	 * @param {Object} args any extra data passed to the method
	 */
	var getConsumerProfile = function(callback,scope,error,args){
		var conf = carnival.core.setConfigs(callback,scope,error,args);
		conf = carnival.utils.merge(conf,config());
		if(!isLoggedIn() && error){error.apply(scope);}
		//console.log(profile('masterId'));
		var requestString = [conf.WSHostname,conf.userPath,
			'/trbsecurity/consumerprofile/jsonp?',
			'api_key=',conf.apiKey,
			'&product_code=',conf.product,
			'&master_id=',profile('masterId'),
			'&callback=?'].join('');
		carnival.core.loadData({
			key:'consumerProfile',
			url:requestString,
			success:function(data){
				if( data.returnCode != undefined && data.returnCode == 0) {
					data = translateConsumerProfile(data);
					carnival.user.profile(data);
					carnival.core.injectData([data],conf.callback,conf.scope);
					dropProgregCookies(data);
				}else {
					if(conf.error){
						conf.error(data);
					}
				}
				
			},
			error:conf.error
		});
	};

	
	var verifyLogin = function(callback,error){
		var conf = carnival.core.setConfigs(callback,{},error,{});
		conf = carnival.utils.merge(conf,config());
		var requestString = [conf.WSHostname,conf.userPath,
			'/trbsecurity/tokenretriever/jsonp?product_code=',conf.product,
			'&callback=?'].join('');
		conf.success = conf.callback;
		var sMethod = function(data){
			if(data.isValidAnswer ) {
				conf.success.apply(conf.scope, arguments);
			} else {
				if(conf.error){conf.error.apply(conf.scope, arguments);}
			}
		};
		carnival.core.loadData({
			url:requestString,
			success:sMethod,
			error:function(){error.apply(conf.scope, arguments);}
		});
	
	};

	var protect = function(redirectUrl){
		redirectUrl = redirectUrl || '/';
		verifyLogin(function(){},
			function(){
				carnival.user.logout(redirectUrl);
			}
		);
	};
	
	/**
	 * getConfigRules - Function to get form from configuration service
	 * @param {Function|Object} callback method to call on success or object w/ arguments
	 * @param {Object} scope the scope that the callbacks will fire in
	 * @param {Function} error method to call on failure
	 * @param {Object} args any extra data passed to the method
	 */
	var getConfigRules = function(callback,scope,error,args){
		var conf = carnival.core.setConfigs(callback,scope,error,args);
		conf = carnival.utils.merge(conf,config());
		var requestString = [conf.WSHostname,conf.userPath,
			'/trbsecurity/profilecontentrules/jsonp?',
			'api_key=',conf.apiKey,
			'&product_code=',conf.product,
			'&profile_type=/',
			'&callback=?'].join('');
		carnival.core.loadData({
			key:'profileContentRules',
			url:requestString,
			success:function(){carnival.core.injectData(arguments,conf.callback,conf.scope);},
			error:error
		});
	};

	var is3rdPartyLogin = function(){
		return profile('lastProviderLogin') != 'isoprovider';
	};
	
	// return public methods ///////////////////////////////////////////////////////////////////////////////////----->USER METHODS
	return {
		data:data,
		getConsumerProfile:getConsumerProfile,
		getConfigRules:getConfigRules,
		submitConsumerProfile:submitConsumerProfile,
		isLoggedIn:isLoggedIn,
		login:login,
		logout:logout,
		carnivalLogout:carnivalLogout,
		getLoginUrl:getLoginUrl,
		getLoginUrlPopup:getLoginUrlPopup,
		getLogoutUrl:getLogoutUrl,
		cancelLogin:cancelLogin,
		getBasicUserInfo:getBasicUserInfo,
		setCarnivalCookie:setCarnivalCookie,
		getCookieProfile:getCookieProfile,
		provider:provider,
		profile:profile,profileIncomplete:profileIncomplete,
		resetUser:resetUser,
		verifyLogin:verifyLogin,
		protect:protect,getUserName:getUserName,
		afterLogin:afterLogin,
		appendAfterLoginEvent:appendAfterLoginEvent,
		getEmailAddresses:getEmailAddresses,
		submitUserResetRequest:submitUserResetRequest,
		submitUserTempRequest:submitUserTempRequest,
		submitUserReset:submitUserReset,
		submitNewUser:submitNewUser,
		submitUserChange:submitUserChange,
		is3rdPartyLogin:is3rdPartyLogin
	};
}(jQuery,window,document);


carnival.subscription = function($,window,document,undefined){

	var config = carnival.configuration;
	var profile = carnival.user.profile;
	/**
	 * getNewsletters - Function to get newsletter data
	 * @param {Function|Object} callback method to call on success or object w/ arguments
	 * @param {Object} scope the scope that the callbacks will fire in
	 * @param {Function} error method to call on failure
	 * @param {Object} args any extra data passed to the method
	 */
	var getNewsletters = function(callback,scope,error,data){
		var conf = carnival.core.setConfigs(callback,scope,error,data);
		conf = carnival.utils.merge(conf,config());
		var requestString = [conf.WSHostname,conf.subscribePath,
			'/subscribe/offers/jsonp?',
			'master_id=',encodeURIComponent(profile('masterId')),
			'&product_code=',conf.product,
			'&callback=?'].join('');
		carnival.core.loadData({
			url:requestString,
			success:function(data){carnival.core.injectData([translateNewsletters(data)],conf.callback,conf.scope);},
			error:error
		});
	};

	var getNewsletterSubscriptions = function(callback,scope,error,data){
		var conf = carnival.core.setConfigs(callback,scope,error,data);
		conf = carnival.utils.merge(conf,config());
		var requestString = [conf.WSHostname,conf.subscribePath,
			'/subscribe/subscriptions/jsonp?',
			'master_id=',encodeURIComponent(profile('masterId')),
			'&product_code=',conf.product,
			'&callback=?'].join('');
		carnival.core.loadData({
			url:requestString,
			key:'newsletterSubs',
			success:function(data){
				carnival.core.injectData([translateNewsletterSubscriptions(data)],conf.callback,conf.scope);
				},
			error:error
		});
	};

	var submitNewsletters = function(inputs,successMethod,errorMethod){
		var path="";
		var conf = config();
		var requestString = [conf.WSHostname,conf.subscribePath,
			'/subscribe/subscriptions?',
			'master_id=',encodeURIComponent(profile('masterId')),
			'&product_code=',encodeURIComponent(conf.product)
			].join('');
		// form is in JSON, but needs to be transformed to match what subscriptionservice expects
		inputs = transformNewsletters(inputs);
		carnival.core.postData({
			url:requestString,
			type:'PUT',
			data:inputs,
			success:successMethod,
			error: errorMethod
		});
	};

	var transformNewsletters = function(data){
		return carnival.utils.serializeJSON({"email":profile('email'),"format":"HTML","masterId":profile('masterId'),"subList":data.subs,"unSubList":data.unsubs});
	};
	
	var transformNewslettersXD = function(data){
		return carnival.utils.serializeJSON({"email":profile('email'),"format":"HTML","masterId":profile('masterId'),"subList":data.subs,"unSubList":data.unsubs});
	};

	var translateNewsletterSubscriptions = function(data){
		var returnData = {};
		if(!!data.newsletters){
			if(!data.newsletters.push){data.newsletters = [data.newsletters];}
			for(var i = data.newsletters.length;i--;){
				if(data.newsletters[i].status == '0'){
					returnData[data.newsletters[i].newsletter.code] = data.newsletters[i].newsletter.description;
				}
			}
		}
		return returnData;
	};
	
	var translateNewsletters = function(data){
		var returnData = {}, i, cats = {};
		if(!!data.newsletterCategories){
			for(i = data.newsletterCategories.length;i--;){
				cats[data.newsletterCategories[i].code] = data.newsletterCategories[i].name;
			}
		}
		
		if(!!data.newsletters){
			if(!data.newsletters.push){data.newsletters = [data.newsletters];}
			for(i = data.newsletters.length, a = data.newsletters.reverse();i--;){
				if(!!data.newsletters[i].description && data.newsletters[i].description!=='null'){
					if(returnData[cats[data.newsletters[i].categoryCode]] == null){
						returnData[cats[data.newsletters[i].categoryCode]] = [];
					}
					returnData[cats[data.newsletters[i].categoryCode]].push(data.newsletters[i]);
				}
			}
			return returnData;
		} else {
			return 0;
		}
	};
	
	return{
		getNewsletters:getNewsletters,
		getNewsletterSubscriptions:getNewsletterSubscriptions,
		submitNewsletters:submitNewsletters
	};

}(jQuery,window,document);


/**
 * carnival.captcha - Functions related to captcha
 * @namespace
 */
carnival.captcha = function($,document,window,undefined){

	var config = carnival.configuration, capElement, defaultCaptcha = 'securityFilter';

	var _capConf = {
		reCaptcha : {
			getPath : '/trbsecurity/captcha/jsonp',
			postPath : '/trbsecurity/validcaptcha/jsonp',
			responseField : '#recaptcha_response_field',
			challengeField : '#recaptcha_challenge_field',
			writeRegex : /captcha/i
		},
		adCopy : {
			getPath : '/trbsecurity/adcopy/jsonp',
			postPath : '/trbsecurity/validadcopy/jsonp',
			responseField : '#adcopy_response',
			challengeField : '#adcopy_challenge',
			writeRegex : /adcopy|ad_copy/i
		},
		solveMedia : {
			getPath : '/trbsecurity/solvemedia/jsonp',
			postPath : '/trbsecurity/validsolvemedia/jsonp',
			responseField : '#adcopy_response',
			challengeField : '#adcopy_challenge',
			writeRegex : /adcopy|ad_copy|solvemedia|solve_media/i
		},
		securityFilter : {
			postPath : '/trbsecurity/tokenretriever/jsonp'
		}
	}	;
	
	var capType;
	var capConf = function(){
			if(!capType){
			// if no type, use default
			if(!config('captchaType')){config('captchaType',defaultCaptcha);}
			var capType = _capConf[config('captchaType')];
			// if type is not in configs use default
			if(!capType){capType=_capConf[defaultCaptcha];}
		}
		return capType;
	};
	/**
	 * getCaptcha - Function to get captcha from service
	 * @param {Function|Object} callback method to call on success or object w/ arguments
	 * @param {Object} scope the scope that the callbacks will fire in
	 * @param {Function} error method to call on failure
	 * @param {Object} args any extra data passed to the method
	 *
	 * Example:
	 * carnival.captcha.getCaptcha(function(data){
	 *   $('#cap').append(data.htmlText);
	 * });
	 */
	var getCaptcha = function(callback,scope,error,args){	
		if(capConf().getPath){
			var conf = carnival.core.setConfigs(callback,scope,error,args);
			conf = carnival.utils.merge(conf,config());
			var requestString = [conf.WSHostname,conf.userPath,
				capConf().getPath,
				'?product_code=',config('product'),'&callback=?'].join('');
			carnival.core.loadData({
				url:requestString,
				success:function(){carnival.core.injectData(arguments,conf.callback,conf.scope);},
				error:error
			});
		}
	};

	var verify = function(){
		carnival.utils.listener.fire('submit_captcha');
		//return false;
	};

	/**
	 * postCaptcha - sends Captcha to verification service for validation token
	 * @param {Function|Object} callback method to call on success or object w/ arguments
	 * @param {Object} scope the scope that the callbacks will fire in
	 * @param {Function} error method to call on failure
	 * @param {Object} args any extra data passed to the method
	 *
	 * Example:
	 * carnival.captcha.postCaptcha({
	 *   callback:function(){
	 *     carnival.user.submitConsumerProfile({args:data});
	 *   },
	 *   error:function(){console.log('!!!')}
	 * });
	 */
	var postCaptcha = function(callback,scope,error,args){
		var conf = carnival.core.setConfigs(callback,scope,error,args);
		conf = carnival.utils.merge(conf,config());
		var ans = $(capConf().responseField).val() || "";
		var chl = $(capConf().challengeField).val() || "";
		var requestString = [conf.WSHostname,conf.userPath,
			capConf().postPath,
			'?product_code=',config('product'),
			'&answer=',ans,
			'&challenge=',chl,
			'&ip_address=',
			'&callback=?'].join('');
		conf.success = conf.callback;
		var sMethod = function(data){
			if(data.isValidAnswer ) {
				conf.success.apply(conf.scope, arguments);
			} else {
				reload();
				if(conf.error){conf.error.apply(conf.scope, arguments);}
			}
		};
		conf.callback = sMethod;
		carnival.core.loadData({
			url:requestString,
			success:function(){carnival.core.injectData(arguments,conf.callback,conf.scope);},
			error:function(){Recaptcha.reload ();error.apply(conf.scope, arguments);}
		});
	
	};

	var reload = function(){
		try{
			Recaptcha.reload();
			return;
		}catch(e){}
	
		try{
			ACPuzzle.reload();
			return;
		}catch(e){}
	};
	
	var captchaInitialized = false;

	/**
	 * initCaptcha - Defines where captcha will be located.  Adjusts document.write
	 * Function to handle captcha code appropriately
	 * @param {String|DomNode} elem Location that captcha should be inserted
	 * @param {RegExp} regex Regular expression of text catch.  Defaults to /captcha/
	 */
	var initCaptcha = function(elem,regex){
		if( !captchaInitialized ){
			var el = $(elem);
			capElement = el;
			var oldWrite = document.write;
			regex = regex || capConf().writeRegex;
			// we need to get creative with document.write
			// this is a repurposing of John Resig's document.write
			// http://ejohn.org/blog/xhtml-documentwrite-and-adsense/
			document.write = function(text){
				if(text.match(regex)){
					el.append(text);
				} else {
					try{
						var pos,div = document.createElementNS("http://www.w3.org/1999/xhtml","div");
						div.innerHTML = text;
						if(document.lastChild){
							pos = document;
							while (pos.lastChild&&pos.lastChild.nodeType===1){
								pos = pos.lastChild;
							}
						} else {
							pos = document.getElementsByTagName("*");
							pos = pos[pos.length-1];
						}
						var nodes = div.childNodes;
						while(nodes.length){pos.parentNode.appendChild(nodes[0]);}
					}catch(e){
						try {
							oldWrite.call(document,text);
						}catch(ee){/*hopeless?help me*/}
					}
				}
			};
				var $breakElement = $('.recaptcha_input_area').find('br');
				$breakElement.hide();
		}
		else{
		Recaptcha.reload();
		}
		//attachCaptcha();
	};

	/**
	 * getCaptchaElement - Getter for captcha container element
	 */
	var getCaptchaElement = function(){
		return capElement;
	};

	/**
	 * attachCaptcha - attaches captcha verification to form
	 * @param {Function} callback Function to call after success
	 * @param {Object} scope scope for callback to run in
	 */
	var attachCaptcha = function(callback,scope){
		var formEl = getCaptchaElement().parents('form');
		carnival.utils.listener.listen('submit_captcha',function(){
			postCaptcha({
				callback:function(data){
					if(callback){callback.apply((scope||window),arguments);}
					else{formEl[0].submit();}
				},
				error: function(){
					if($('#cap_message').length === 0) {
						getCaptchaElement().append('<span class="captcha-error"><label id="cap_message" ></label></span>');
					}
					$('#cap_message').html('The text you entered is incorrect.  Please try again.');
					carnival.forms.enableButton( $("#signon-submit") );	
				}
			});
			return false;
		});
	};

	return {getCaptcha:getCaptcha,attachCaptcha:attachCaptcha,initCaptcha:initCaptcha,verify:verify,reload:reload};

}(jQuery,document,window);


/**
 * carnival.core - Core Functions
 * @namespace
 */
carnival.core = function($,document,window,undefined){

	/**
	 * loadQueue - variable keeping track of what data is being loaded
	 */
	var loadQueue = [],
	
	data = {};

	/**
	 * loadData - Utility function for making ajax calls and inserting
	 *   data into carnival user object
	 * @param {Object} args A JSON objecto containing configurations
	 *   available options:
	 *     url {String} Url to get data from
	 *     key {String} A location to store the returned data in the
	 *       carnival user object.  If a key is passed that already exists
	 *       in the cache, ajax get is skipped.
	 *     success {Function} Function to call on success
	 *     error {Function} Function to call on error
	 */
	var loadData = function(args){
		if(args.key){
			if( data[args.key] != undefined) {
				if(args.success){args.success.apply(this,[data[args.key]]);}
				return;
			} else if(loadQueue[args.key]) {
				// this is in the loadQueue and is currently being fetched.
				// Wait for it to finish then fire the callback.
				if(args.success){
					carnival.utils.listener.listen('_loadData_'+args.key,function(){
						args.success.apply(this,[data[args.key]]);
					});
				}
				return;
			}
			loadQueue[args.key] = true;
		}
		$.ajax({
			url: args.url,
		  dataType: 'json',
			success:function(f){
				if(args.success){args.success.apply(this,arguments);}
				if(args.key){
					data[args.key] = f;
					loadQueue[args.key] = false;
				}
				carnival.utils.listener.fire('_loadData_'+args.key,{close:true});
			},
			error:args.error
		});
	};

	var isExternal = function(){
		var protocol = location.protocol,
				hostname = location.hostname,
				exRegex = RegExp('^'+protocol + '//' + hostname);
		
		
		var _isExternal = function(url) {
				// if xd library is being used, treat everything as internal
				if(carnival.configuration('xd')){return false;}
			return !exRegex.test(url) && /^https?:\/\//.test(url);
		};
	
		return _isExternal;
	}();

	var postData = function(args){
		$.ajax({
			url:args.url,
			data:args.data,
			contentType:"application/json",
			type:(args.type || 'POST'),
			success:function(f){
				if(args.key){data[args.key] = f;}
				if(args.success){args.success.apply(this,arguments);}
			},
			error:function(data){args.error(data);}
		});
	};

	/**
	 * setConfigs - Utility for setting up user methods
	 * @param {Function|Object} callback method to call on success or object w/ arguments
	 * @param {Object} scope the scope that the callbacks will fire in
	 * @param {Function} error method to call on failure
	 * @param {Object} args any extra data passed to the method
	 */
	var setConfigs = function(callback,scope,error,args){
		var conf = {};
		if(callback.constructor != Function){
			conf = carnival.utils.merge(conf,callback);
		} else {
			if(callback){conf.callback = callback;}
			if(scope){conf.scope = scope;}
			if(error){conf.error = error;}
			if(args){conf.args = args;}
		}
		return conf;
	};

	/**
	 * injectData - fire a callback with data injected in
	 * @param data {Object} Data returned from JSONP call
	 * @param	callback {Function} Method to fire
	 * @param scope {Object} Scope of callback.  Defaults to window
	 */
	var injectData = function(data,callback,scope){
		if(!scope){scope = window;}
		callback.apply(scope,data);
	};
	
	var cleanInputs = function(input){
		return input.replace(/<[^>]*>/g,'').replace(/^\s*|\s*$/g,'');
	},
	
	enumMapper = function(){
		var enumVals = {
			"MALE":"Male","FEMALE":"Female",
			"HIGHSCHOOL_SOME":"Some High School","HIGHSCHOOL_GRAD":"High School Graduate","COLLEGE_SOME":"Some College","COLLEGE_2_YEAR":"2 Year College Graduate","COLLEGE_4_YEAR":"4 Year College Graduate","POST_GRAD":"Postgraduate",
			"MARRIED":"Married","SINGLE":"Single",
			"true":"Yes","false":"No"
		};
		return function(input){
			if(enumVals[input]){return enumVals[input];}
			return input;
		};
	}();

	return {loadData:loadData,postData:postData,setConfigs:setConfigs,injectData:injectData,cleanInputs:cleanInputs,isExternal:isExternal,data:data,enumMapper:enumMapper};
}(jQuery,document,window);


/**
 * username	 - Functions related to username verification
 */
carnival.username = function($,window,document,undefined){
	var isGood = true;
	var config ={};
	config.availableHTML = '<label id="userNameAvailable">${userName} is available.</label>';
	config.unavailableHTML = '<label id="userNameUnavailable" class="label">${userName} is unavailable. The following recommended names are available.</label>'+
		'<label> </label><span class="form_radio_container">'+
				'<input type="radio" value="${reccomend}" class="form_radio" name="recommendedUserName" id="recommendedUserName" />'+
				'<label for="recommendedUserName" class="form_choice">${reccomend}</label>'+
			'</span>';
	config.resetUserNameHTML = '<label id="resetUserName">Please use a more unique username to use so that we can try to make your experience on the site just as unique.</label>';
	config.userNameRegex = new RegExp('\\$\\{userName\\}','g');
	config.recommendRegex = new RegExp('\\$\\{reccomend\\}','g');

	/**
	 * configuration - Dynamic getter/setter for configurations.  If no arguments
	 *   are passed, config object is returned.
	 * @param {String|Object} key Can be a string containing the name of the configuration
	 *   or an object containing configurations.
	 * @param {Object} value Value of cofig element set
	 */
	var configuration = function(key,value){
		if(key){
			if(key.constructor == String) {
				if(value !== undefined){
					config[key] = value;
					return value;
				}
			} else {
				config = carnival.utils.merge(config,key);
			}
			return config[key];
		}
		return config;
	};

	/**
	 * verify - Function to check uniqueness of username
	 * @param {String} username The username to be checked
	 * @param {Function} successMethod  The function to be called if unique
	 * @param {Function} errorMethod  The function to be called if not unique
	 */
	var verify = function(username,successMethod,errorMethod) {
		var requestString = [carnival.configuration('WSHostname'),carnival.configuration('userPath'),
			'/trbsecurity/suggestedusernames/jsonp?',
			'&product_code=',carnival.configuration().product,
			'&master_id=',carnival.user.profile('masterId'),
			'&user_name=',username,
			'&callback=?'].join('');
		carnival.core.loadData({url:requestString,
			success:function(data){
				if(!(data.suggestedUserName)){
					successMethod.apply(this,arguments);
				} else {
					errorMethod.apply(this,arguments);
				}
			},
			error: errorMethod
		});
	};

	var checker = function(field){
		var messages, field_input;
		field = $(field);
		field.after('<li style="display:none"></li>');
		messages = field.next('li');
		field_input = field.find('input[type=text]');
		field_input.addClass('selfvalidated');
		field_input.bind('blur',function(){checkit.call(this,messages,field_input);});
		if (!(carnival.user.profile('userName')) && (carnival.user.profile('tos') == 'true')) {
			$(messages).show()
				.html(
					carnival.username.configuration('resetUserNameHTML')
				);
		}
	};

	var checkit = function(messages,field_input){
		this.value = this.value.replace(/<[^>]*>/g,'');
		var $this = $(this);
		var that = this;
		var valFormID = $(this).parents('form').attr("id");
		var valForm = new carnival.forms.form(valFormID);
		var singleVal = valForm.formValidator.validateSingle("userName" , [ "@Profane","@Min=6","@AlphaNumeric" ]);
		if((!!singleVal) && ($this.hasClass('badGuy') || this.value != carnival.user.profile('userName') || carnival.user.profile('status') != 'VERIFIED')){
			verify(this.value,function(data){
				if(data.suggestedUserNames) {//no good
					isGood = false;
					$(messages).show()
						.html(
							configuration('unavailableHTML')
								.replace(configuration('userNameRegex'),that.value)
								.replace(configuration('recommendRegex'),data.suggestedUserNames.userName)
						);
					$('#'+valFormID).find('#userNameVal').val('invalid');	
					$('#recommendedUserName').click(function(){
						if(this.checked){
							field_input.val(this.value);
							$('#'+valFormID).find('#userNameVal').val('').trigger('blur');
							//$(messages).hide().html();
							field_input.trigger('blur');
						}
					});
				} else {//good
					isGood = true;
					$('#'+valFormID).find('#userNameVal').val('').trigger('blur');	
					if(configuration('availableHTML').length) {
						$(messages).show().html(configuration('availableHTML').replace(configuration('userNameRegex'),that.value));
					} else {$(messages).hide().html();}
				}
				carnival.utils.changeTextColor();
			});
		}  else {
			$this.removeClass('badGuy');
			$(messages).hide().html();
		}
	};

	var status = function(){
		return isGood;
	};

	return {verify:verify,checker:checker,configuration:configuration,status:status};
}(jQuery,window,document);

carnival.metrics = function($){
	var _metricsOrder = [0,5,3,2,4,4,6,2,7,1];
	var init = function(){
		carnival.utils.listener.listen('_carnival_after_cookie',function(){
			setMetricsId(carnival.user.profile('consumerId'));
		});
		carnival.utils.listener.listen('_carnival_after_logout_success',function(){
			removeMetricsId();
		});
	};
	
	var pad  = function(n) {
		n = n.toString();
		while(n.length < 4) {n=Math.floor(Math.random()*10)+n;}
		return n;
	};
	
	var rand = function(){
		return pad(Math.floor(Math.random()*1000));
	};
	
	var removeMetricsId = function(){
		$.cookies.del('metrics_id', {domain:carnival.configuration('cookieDomain')});
	};
	
	var setMetricsId = function(consumerId){
		
		if(consumerId === undefined){
			return;
		}
		
		var _metricsId;
		var metricArr = consumerId.split('-');
		while(metricArr.length < 8){
			metricArr.push(rand());
		}
		var retVal = '';
		for(var i=_metricsOrder.length;i--;){
			retVal += '-'+metricArr[_metricsOrder[i]];
		}
		_metricsId = retVal.substring(1).replace(/\s/g,'');
		$.cookies.set('metrics_id', _metricsId , {domain:carnival.configuration('cookieDomain')});
		return _metricsId;
	};
	
	var registrationUtilsCookiesGetValue = function( name ){
	
		var start = document.cookie.indexOf( name + "=" );
		var len = start + name.length + 1;
		if ( ( !start ) &&
		( name != document.cookie.substring( 0, name.length ) ) )
		{
		return null;
		}
		if ( start == -1 ) {
			return null;
		}
		var end = document.cookie.indexOf( ";", len );
		if ( end == -1 ) {
			end = document.cookie.length;
		}
		return unescape( document.cookie.substring( len, end ) );
		
	};
	
	
	
	var getMetricsId = function(){
	//	var m = $.cookies.get('metrics_id');
		var m = registrationUtilsCookiesGetValue('metrics_id');
		if(null===m || ''== m){return false;}
		var metricArr = m.split('-').reverse();
		var retArr = [];
		for(var i=_metricsOrder.length;i--;){
			retArr[_metricsOrder[i]] = metricArr[i];
		}
		return retArr.slice(0,3).join('-');
	};
	
	var _target;
	var setMetricsFrame = function(target){
		_target = target;
	};
	
	var addMetricsFrame = function(){
		$('body').prepend('<iframe border=0 style="border:0px;height:0;width:0;position:absolute;top:-10000px" src="'+_target+'"></iframe>');
	};
	
	
	var triggerOmnitureEvent = function(){
	
		if( window.s && window.s.t ){
			
			var carnival_username_c_unm = carnival.utils.cookies.get(carnival.configuration('c_unm')) || null;
			var	carnival_masterid_c_mid = carnival.metrics.getMetricsId();
			
			if(carnival_username_c_unm!=null && carnival_masterid_c_mid){
				window.s.prop28 = carnival_masterid_c_mid;
			}
			
		  //window.s.t();
		}	
	};
	
	$(function(){carnival.metrics.init()});
	
	return {
		init:init,
		getMetricsId:getMetricsId,
		setMetricsFrame:setMetricsFrame,
		addMetricsFrame:addMetricsFrame,
		triggerOmnitureEvent:triggerOmnitureEvent
	};
}(jQuery);


var memberNav = (function($){
	
	/**
	 * memberNav - object for creating navigation elements
	 * @param {String|Object} elem CSS selector or element to insert nav into
	 * @param {String|Function} loggedintext String to insert or function to call if user is logged in
	 * @param {String|Function} loggedouttext String to insert or function to call if user is logged out
	 */
	var memberNav = function(elem,loggedintext,loggedouttext){
		var _configs = {};
		this.navLocation = $(elem);
		this.configs = function(key,value){
			if(key){
				if(key.constructor == String){
					if(typeof value != 'undefined'){
						_configs[key] = value;
					}
					return _configs[key] || '';
				} else {
					_configs = carnival.utils.merge(_configs,key);
				}
			}
			return _configs;
		};
		this.loggedintext = loggedintext || this.profileItems;
		this.loggedouttext = loggedouttext || this.loggedoutItems;
		return this;
	};

	

	memberNav.prototype = {
		writeNav : function(){
	
 			var thisScope = this;
			var frontEndRememberCookie = (carnival.utils.cookies.get(carnival.configuration('c_rmc'))=="t");
			
			//console.log("RMC - " + frontEndRememberCookie);
			
			if (frontEndRememberCookie) {
				//there is a front end RM cookie
				if (!carnival.user.isLoggedIn()) {
					//carnivalRM state checks
					if (carnival.configuration('carnivalRM') == "init") {
						carnival.configuration('carnivalRM','checking');
						thisScope.carnivalRememberCheck(thisScope);
					} else {
						//try dynamic login - assumes previous block already hit by another memberNav instance on page
						thisScope.writeLoginItems();
						carnival.utils.listener.listen('_carnival_after_cookie',thisScope.writeProfileItems,thisScope);
					}
				} else {
				 	thisScope.writeProfileItems();
					carnival.utils.listener.listen('_carnival_after_cookie_remove',thisScope.writeLoginItems,thisScope);
				}
			} else {
				//no front end RM cookie, normal (user-action based) flow
				if (carnival.user.isLoggedIn()) {
					thisScope.writeProfileItems();
					carnival.utils.listener.listen('_carnival_after_cookie_remove',thisScope.writeLoginItems,thisScope);
				} else {
					thisScope.writeLoginItems();
					carnival.utils.listener.listen('_carnival_after_cookie',thisScope.writeProfileItems,thisScope);
				}
			}
				
		},
		carnivalRememberCheck : function(thisScope) {
			var rememberMeURL = carnival.configuration('hostname') + "/registration/rememberMeCookieExists.jsp";
			$.ajax({
 				url: rememberMeURL,
 				success: function( rmdata ) {
					//If there is a rememberMeCookie
 					if( ( rmdata != "" ) && ( rmdata != "undefined" ))  {
						carnival.configuration('carnivalRM','t');
 						if (carnival.user.isLoggedIn() == false) {
 							thisScope.dynamicLogin();
 							carnival.utils.listener.listen('_carnival_after_cookie',thisScope.writeProfileItems,thisScope);
 						} else {
 							thisScope.writeProfileItems();
 							carnival.utils.listener.listen('_carnival_after_cookie_remove',thisScope.writeLoginItems,thisScope);
						}
					//If not then go through the normal path, but delete c_rmc
 					} else {
						carnival.utils.cookies.del(carnival.configuration('c_rmc'),{domain:carnival.configuration('cookieDomain'),path:'/'});
						carnival.configuration('carnivalRM','f');
 						if (carnival.user.isLoggedIn()) {
 							thisScope.writeProfileItems();
							carnival.utils.listener.listen('_carnival_after_cookie_remove',thisScope.writeLoginItems,thisScope);
 						} else {
 							thisScope.writeLoginItems();
							carnival.utils.listener.listen('_carnival_after_cookie',thisScope.writeProfileItems,thisScope);
 						}
 					}
 				},
				error:function( data ){
					carnival.configuration('carnivalRM','err');
					carnival.logger.error( data );
				}

 			});
			//check the carnival remember me cookie service
		},
		dynamicLogin : function(){
			var loginurl = carnival.configuration('hostname') + "/registration/signon.html";
			var passdata = "loginType=auto&callbackUrl=" + window.location;
			$.ajax({
				url: loginurl,
				data: passdata,
				success: function(tokendata) {
					carnival.utils.listener.fire("handshake", {data: [tokendata]});
				},
				error:function( data ){
					carnival.logger.error( data );
				}
			});
		},
		writeProfileItems : function(){
			if(this.loggedintext.constructor == String){
				try {
					this.navLocation.each(function(){
						this.innerHTML = '';
					});
				}catch(e){}
				this.navLocation.html(this.loggedintext);
			} else {
				this.loggedintext.call(this);
			}
		},
		writeLoginItems : function(){
			if(this.loggedouttext.constructor == String){
				try {
					this.navLocation.each(function(){
						this.innerHTML = '';
					});
				}catch(e){}
				this.navLocation.html(this.loggedouttext);
			} else {
				this.loggedouttext.call(this);
			}
		},
		profileItems : function(){
			
			carnival.logger.info('loading profile items');
			
			var backgroundColor = carnival.configuration( 'ssorNavBackgroundColor' ) || "#353535";	
			var skipNewsLetters = carnival.configuration( 'skipNewsletters' ) || '0';
			var originHost		= carnival.configuration( 'originHost' ) || "";
			
			/*** 
			* Omniture custom event to force the analytics request 
			* - This allows us to tack the masterid for carnival on prop28 
			***/
			
			
			
			var loggedInNav = 	'<div id="ssorNavSignIn" class="loggedIn">'+
									'<div id="ssorNavHeader">'+
										'<a class="userName" href="" onclick="return false;">' + carnival.user.getUserName() + '</a>'+
									'</div>'+
									'<div id="ssorMiniModal">'+
										'<div id="ssorNavBody">'+	
											'<ul>'+
												'<li><a href="' + originHost + '/services/site/registration/show-profile.signon">Profile</a></li>';
											if( skipNewsLetters == "0"){
												loggedInNav += '<li><a id="NLddlink" href="' + originHost +'/services/site/registration/show-profile.signon#thenlpane">Newsletters</a></li>';
											}
											loggedInNav += '<li><a href="'+ carnival.user.getLogoutUrl() +'" onclick=" carnival.user.logout(carnival.user.getLogoutUrl());return false;">Sign Out</a></li>'+
											'</ul>'+
										'</div>'+	
									'</div>'+	
								'</div>';	
			
			
			this.navLocation.html('');
			this.navLocation.append( loggedInNav );
			
			
			carnival.metrics.triggerOmnitureEvent();
			
					/***********************************************
							   Logged In Username Functions
						* Handles the truncation of the username *		
					************************************************/

					var $navBody 		= $( '#ssorMiniModal' ),
						$navHead 		= $( '#ssorNavHeader' ),
						$userName 		= $( '#ssorNavHeader a' ),
						userNameWidth	= $userName.width(),
						navHeadWidth 	= $navHead.width(),
						navBodyWidth 	= userNameWidth + 30 ;
					
					/* If the width of the nav is greater than the width of the header, 
					   set the nav width to the max length of the header minus padding
					*/
					if( navBodyWidth >= navHeadWidth ){
						navBodyWidth = 210;
					}
					
					/**
					* 	@function truncateUsername
					*   @private
					*	@param {String} userName The username to be truncated
					* 	@description Truncates the username if it is longer than the 
					*				 total width of its container
					*   @return null
					*/
					var truncateUsername = function( userName ){

						var newLength = 30,
							newUsername = userName.substring(0, newLength ),
					 		revisedUsername =  newUsername + "...";

						$userName.html( revisedUsername );

					};

					/**
					* 	@function getUsernameContainerWidth
					*   @private
					* 	@description Calculates and returns the width of the parent 
					*				 container holding the username
					*   @return {Number} The width of the parent container
					*/
					var getUsernameContainerWidth = function(){
						return $navHead.width();
					};

					/**
					* 	@function getUsernameWidth
					*   @private
					* 	@description Calculates and returns the width of the username
					*   @return {Number} The width of the username
					*/
					var getUsernameWidth = function(){
						return $userName.width();
					};

					/**
					* 	@function shouldTruncateUsername
					*   @private
					* 	@description The layout of the modal and its contents
					*   @return boolean
					*/
					var shouldTruncateUsername = function(){

						var userNameContainerWidth  = getUsernameContainerWidth(),
							userNameWidth 			= getUsernameWidth();

						return  userNameWidth > userNameContainerWidth;

					};

					/**
					* 	@function userNameController
					*   @private
					* 	@description Decides if the username should be truncated
					*   @return null
					*/
					var userNameController = function(){

						if( shouldTruncateUsername() ){
							truncateUsername( $userName.html() );
						}

					};

					userNameController();

					/**************************************
					***************************************/
		
			if( backgroundColor ){
				$( '#ssorNavHeader, #ssorMiniModal' ).css( 'background-color', backgroundColor );	
			}
						

			//adjust height for different market classified bar heights
			if ($('#classified-bar').outerHeight()) {
				var signInHeight = $('#classified-bar').outerHeight(true);
				var signInPadding = (signInHeight - $('#signInLink').height()) / 4;
				$('#ssorNavHeader').css('height',(signInHeight - signInPadding));	
				$('#ssorNavHeader').css('padding-top',signInPadding+'px');
			} 
			else {
				$('#ssorNavHeader').css('padding','6px 6px 4px');
			}
	
			$( '#ssorMiniModal' ).width( navBodyWidth );
			
			carnival.utils.changeTextColor();
			
			$navHead.click( function ( e ){
				$navBody.toggle();
				e.preventDefault();
			});

			$navBody.hide();
			//Adding event listener for completion of navigation rendering
		    carnival.utils.listener.fire( 'navigationRendered' );
		},
		
		loggedoutItems :  function(){
			
			//BEGIN NEW LOGGED OUT ITEMS
			
			var backgroundColor = carnival.configuration( 'ssorNavBackgroundColor' ) || "#353535";
			this.navLocation.html('');
			var navTemplate = '<div id="ssorNavSignIn">'+
									'<div id="ssorNavHeader">'+
										'<span id="signInLink" class="link">Sign In</span>'+
										'<span> or </span>'+
										'<span id="signUpLink" class="link" onclick="carnival.user.resetUser();return signon.profile();" >Sign Up</span>'+
									'</div>'+
								'</div>';
			
			this.navLocation.append( navTemplate );
			
					/**
					*	@memberOf carnival.modal.popit
					* 	@description  Invokes the carnival popit method and returns the mini modal window with its current 
					*				  set of optional configs	
					**/
					var signOnLink = signon.originHost+'/'+signon.folder+'/site/registration/modal.signon';
					carnival.modal.popit( signOnLink, null, null, null );

			if( backgroundColor ){
				$( '#ssorNavHeader' ).css( 'background-color', backgroundColor );	
			}
			
			carnival.utils.changeTextColor();

			//adjust height for different market classified bar heights			
			if ($('#classified-bar').outerHeight()) {
				var signInHeight = $('#classified-bar').outerHeight(true);
				var signInPadding = (signInHeight - $('#signInLink').height()) / 4;
				$('#ssorNavHeader').css('height',(signInHeight - signInPadding));	
				$('#ssorNavHeader').css('padding-top',signInPadding+'px');
			} else {
				$('#ssorNavHeader').css('padding','6px 6px 4px');
			}
			
		}
		
	};

	return memberNav;

})(jQuery);


/**
 * @class 
 *
 * @extends Object
 */
carnival.Log = function( className ){
	this.constructor( className );
};


carnival.Log.prototype = ( function(){
	
	var Level = {

		OFF 	: "off",
		ON  	: "on",
		DEBUG	: "debug",
		INFO	: "info",	
		WARN	: "warn",
		ERROR	: "error",
		FATAL	: "fatal"

	};

	return {
		
		/**
		 * @constructs
		 *
		 * @param {Object} target The target object, or object publishing the event
		 * 
		 * @return void
		 */
		constructor : function( className ){
			this.className = className || "";
		},
		
		/** 
		* 	@property {Function} logMessage
		*   @param {String} cssProperty 
		* 	@description
		* 	@return void
		**/
		logMessage: function(  type, msg ){
			if (!!carnival.configuration('enableLogger')) {	
				// Handles window.console not being defined in IE
				if( !( "console" in window ) || !( "firebug" in console ) )
				{
				    var names = [ "log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
				    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd" ];

				    window.console = {};
				    for ( var i = 0; i < names.length; ++i )
				        window.console[ names[ i ] ] = function() {}
				}
				if( this.css ){
					console[ type ]( "%c" + this.className + ': ' + msg , this.css );	
				}
				else{
					console[ type ]( this.className + ': ' + msg );
				}
			}
		},
		
		/** 
		* 	@property {Function} error
		*   @param {String} msg 
		* 	@description
		* 	@return void
		**/
		error  : function( msg ){ this.logMessage( 'error', msg ) },
		
		/** 
		* 	@property {Function} info
		*   @param {String} msg 
		* 	@description
		* 	@return void
		**/
		info   : function( msg ){ this.logMessage( 'info', msg ) },
		
		/** 
		* 	@property {Function} debug
		*   @param {String} msg 
		* 	@description
		* 	@return void
		**/
		debug  : function( msg ){ this.logMessage( 'debug', msg ) },
	
		/** 
		* 	@property {Function} warn
		*   @param {String} msg 
		* 	@description
		* 	@return void
		**/
		warn   : function( msg ){ this.logMessage( 'warn', msg ) }
		
	}
	
})();

/** 
* 	@property {Function} changeColor
*   @param {String} cssProperty 
* 	@description
* 	@return void
**/
carnival.Log.prototype.changeColor = function( cssProperty ){
	this.css = cssProperty;
};

/** 
* 	@property {Function} getLogger
*   @param {String} cssProperty 
* 	@description
* 	@return void
**/
carnival.Log.prototype.getLogger = function( clazz ){
	this.clazz = clazz || "";
};

/** 
* 	@property {Function} setLevel
*   @param {String} cssProperty 
* 	@description
* 	@return void
**/
carnival.Log.prototype.setLevel = function( level ){
	this.level = level || "";
};

//Shim for old logger
carnival.logger =  new carnival.Log();


( function(){
	// initializer will take data between open/close script tags and initialize
	// js client with it.
	var carnival_script = document.getElementsByTagName('script');
	carnival_script = carnival_script[carnival_script.length-1];
	// src.match required to protect against deferred or dom injected script loads
	if(carnival_script.innerHTML.length && carnival_script.src.match(/carnival\.js/)){
		var text = carnival_script.innerHTML;
		try{carnival_data = JSON.parse(text);}
		catch(e){
			try{carnival_data = new Function("return " + $.trim(text))();}
			catch(f){carnival_data = eval("("+text+")");}
		}
		carnival.init(carnival_data);
	}
})();



}
/*
     FILE ARCHIVED ON 20:06:18 Oct 26, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 03:47:56 Sep 07, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.614
  exclusion.robots: 0.028
  exclusion.robots.policy: 0.016
  esindex: 0.01
  cdx.remote: 53.669
  LoadShardBlock: 916.573 (3)
  PetaboxLoader3.datanode: 222.563 (4)
  PetaboxLoader3.resolve: 365.552 (2)
  load_resource: 98.068
*/