/* 
* jQuery EMS plugin
*/
(function($) {
	function EMSindicator( placeholder, type, options ) {
		// Initial configuration
		var engine = this;
		var settings = $.extend({
			size : 200,
			RPM : 0,
			EGT1 : 0,
			EGT2 : 0,
			EGT3: 0,
			EGT4: 0,
			EGT5: 0,
			EGT6: 0,
			showBox : true,
			img_directory : 'img/'
		}, options );

		var constants = {
			RPM_bound_l : 0,
			RPM_bound_h : 3500,
		}

		// Creation of the instrument
		placeholder.each(function(){
			switch(type){
				case 'tacho':
					$(this).html('<div class="instrument tacho"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><img src="' + settings.img_directory + 'ems_tacho_main.svg" class="arc" alt="" /><div class="tachoRPM box"><img src="' + settings.img_directory + 'ems_needle.svg" class="box" alt="" /></div></div>');
					_setTachoRPM(settings.RPM);
				break;
				default:
					$(this).html('<div class="instrument attitude"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /></div>');
			}
			$(this).find('div.instrument').css({height : settings.size, width : settings.size});
			$(this).find('div.instrument img.box.background').toggle(settings.showBox);
		});

		// Private methods


		function _setTachoRPM(RPM){
			if(RPM > constants.RPM_bound_h){RPM = constants.RPM_bound_h;}
			else if(RPM < constants.RPM_bound_l){RPM = constants.RPM_bound_l;}
			RPM = RPM*270/constants.RPM_bound_h - 45;
			placeholder.each(function(){
				$(this).find('div.instrument.tacho div.tachoRPM').css('transform', 'rotate(' + RPM + 'deg)');
			});	
		}


		function _resize(size){
			placeholder.each(function(){
				$(this).find('div.instrument').css({height : size, width : size});
			});
		}

		function _showBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').show();
			});
		}

		function _hideBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').hide();
			});
		}

		// Public methods
		this.setTachoRPM = function(RPM){_setTachoRPM(RPM);}
		this.resize = function(size){_resize(size);}
		this.showBox = function(){_showBox();}
		this.hideBox = function(){_hideBox();}

		return engine;
	};

	// Extension to jQuery
	$.emsIndicator = function(placeholder, type, options){
		var emsIndicator = new EMSindicator($(placeholder), type, options)
		return emsIndicator;
	}

	$.fn.emsIndicator = function(data, type, options){
		return this.each(function(){
			$.emsIndicator(this, type, options);
		});
	}
}( jQuery ));
