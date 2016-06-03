/*  Thing to fix

ensure all the cards are the same width and height i.e. maxWidth maxHeight
put expanded container in the line container
put all items in this container too

*/


(function ($) {
	"use strict";

	$.fn.adcDropSlider = function adcDropSlider(options) {

		(options.width = options.width || 400);
		(options.height = options.height || "auto");
		(options.animate = Boolean(options.animate));
		(options.autoForward = Boolean(options.autoForward));
		(options.minValue = options.minValue || 0);
		(options.maxValue = options.maxValue || 10);
		(options.unitStep = options.unitStep || 1);

		// Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		if (!$.support.transition) $.fn.transition = $.fn.animate;

		var $container = $(this),
			isSingle = Boolean(options.isSingle),
			isInLoop = Boolean(options.isInLoop),
			hideHandleBG = Boolean(options.hideHandleBG),
			leftLabelText = Boolean(options.leftLabelText),
			rightLabelText = Boolean(options.rightLabelText),
			displayLabelText = (options.displayLabelText == "block") ? true : false,
			labelPlacement = options.labelPlacement,
			stackResponses = Boolean(options.stackResponses),
			valuesArray = new Array(),
			iteration = 0,
			total_images = $container.find("img").length,
			unitDP = decimalPlaces(options.unitStep),
			images_loaded = 0,
			items = options.items;
		
		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		/*if ( isInLoop ) $(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});*/

		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}

		// Check for images and resize
		$container.find('.caption img').each(function forEachImage() {
			var size = {
				width: $(this).width(),
				height: $(this).height()
			};

			if (options.forceImageSize === "height" ) {
				if ( size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}
			} else if (options.forceImageSize === "width" ) {
				if ( size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}

			} else if (options.forceImageSize === "both" ) {
				if ( parseInt(options.maxImageHeight,10) > 0 && size.height > parseInt(options.maxImageHeight,10) ) {
					var ratio = ( parseInt(options.maxImageHeight,10) / size.height);
					size.height *= ratio,
					size.width  *= ratio;
				}

				if ( parseInt(options.maxImageWidth,10) > 0 && size.width > parseInt(options.maxImageWidth,10) ) {
					var ratio = ( parseInt(options.maxImageWidth,10) / size.width);
					size.width  *= ratio,
					size.height *= ratio;
				}

			}
			$(this).css(size);
		});
		
		/*for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
			
			/*	var offset = $('.responseItem').eq(i).offset();
					$('.responseItem').eq(i).css("position", "absolute");
					$('.responseItem').eq(i).offset(offset);
					
			}*/
			
			// Find biggest response height
			var maxHeight = Math.max.apply(null, $(".responseItem").map(function () {
					return $(this).height();
				}).get());
			$('.responseItem, .responseItemClone').height( maxHeight );
			$('.startArea').height( $('.responseItem').outerHeight() );
			
			// Make all responses same height
			var maxWidth = $('.responseItem').map(function() {
				return $(this).width();
			}).get();
			
			$('.responseItem, .responseItemClone').height(maxHeight);
			
			if ( stackResponses ) {
				
				for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
			
					var offset = $('.responseItem').eq(0).offset();
						$('.responseItem').eq(i).css("position", "absolute");
						//$('.responseItem').eq(i).offset(offset);
						
				}
				
			}

		// Run noUiSlider
		for ( var i=0; i<(isSingle && !isInLoop ? 1 : items.length); i++ ) {

			var $input = items[i].element;
			console.log($input);
				//handleValue = roundToStep($input.val()) >= 0 ? ( isSingle ? $.inArray(roundToStep($input.val()), valuesArray) + roundToStep(options.minValue) : roundToStep($input.val()) ) : Math.floor((roundToStep(options.minValue) + roundToStep(options.maxValue))/2 );
				
				//$('.responseItem').hide().eq(0).show();
			// Number of tick marks on slider
	
	 		//the draggable object
			$('.responseItem').each(function(index) { 
				$(this).draggable({
				  revert: true,
				  zIndex: 1000,
				  cursor: "move"
				});
				$(this).attr('data-ontarget',false);
			});
			
			$('.responseItemClone').each(function(index) { 
				$(this).draggable({
				  revert: false,
				  zIndex: 1000,
				  cursor: "move"
				});
				$(this).attr('data-ontarget',true);
				
				// bring to front when hovering
				$(this).hover( function() {
					$(this).css('z-index',1000);
				}, function() {
					$(this).css('z-index','');
				});
			});
			
			//$('.lineContainer').css('padding','0 ' + ($('.responseItemClone').eq(0).outerWidth()/2) + 'px');
			$('.lineContainer').css('padding','0px');
			$('.drop').height( $('.responseItem').eq(0).outerHeight() );
				
			//Prepare the slider
			var range = 100,
				sliderDiv = $(".drop");
				
			// Number of tick marks on slider
			var position = sliderDiv.position(),
				sliderWidth = sliderDiv.width() - $('.responseItem').eq(0).outerWidth(),
				minX = position.left,
				maxX = minX + sliderWidth,
				tickSize = sliderWidth / range;
			
            // check
            var initialValue = 2012;
            var sliderTooltip = function(event, ui) {
                var curValue = ui.value || initialValue;
                var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';

                $('.ui-slider-handle').html(tooltip);

            }
            
			// Activate the UI slider
			sliderDiv.slider({
				min: 0,
				max: range,
				create : function(){
					$(this).find(".ui-slider-handle").hide();
                    sliderToolTip;
				},
                slide: sliderTooltip
			});
			
			//Set slider as droppable
    sliderDiv.droppable({
        //on drop 
        drop: function (e, ui) {
			
			//$('.drop').css('margin','0 ' + ($('.responseItem').eq(0).width()*0.5) + 'px');
			var /*destination = $('.lineContainer').offset().top + ( ($('.lineContainer').outerHeight() - $(ui.draggable).outerHeight())/2 ),*/
				destination = $('.lineContainer').position().top + $(ui.draggable).outerHeight(),
				x1 = $('.drop').offset().left - ($('.responseItem').eq(0).width()*0.5) + 1,
				y1 = $('.drop').position().top,
				x2 = x1 + $('.drop').width() - 2,
				y2 = y1 + $('.drop').height(),
				currentItem = $('.responseItemClone[data-name=' + $(ui.draggable).attr('data-name') + ']');
								
			//$(ui.draggable).draggable( "option", "revert", false ).css({top: destination});
			//console.log( $(ui.draggable).offset().left + ":" + $('.drop').offset().left);
			
			$(ui.draggable).attr('data-ontarget','true');
			
			
			/* show next response */
			if ( currentItem.draggable( "option", "axis" ) != "x" )
				$('.responseItem[data-ontarget=false]:hidden:first').show();
			
			//$(ui.draggable).draggable( "option", { axis: "x", containment: [ x1, y1, x2, y2 ] } );*/
			
			

            //var finalMidPosition = $(ui.draggable).position().left + Math.round($(ui.draggable).outerWidth() / 2);
			//var finalMidPosition = parseInt(currentItem.position().left)/* + Math.round($('.responseItemClone[data-name=' + $(ui.draggable).attr('data-name') + ']').outerWidth() / 2)*/;
			
			
			$('.responseItemClone[data-name=' + $(ui.draggable).attr('data-name') + ']')/*.css('left',finalMidPosition+'px')*/.show();
			$('.responseItemClone[data-name=' + $(ui.draggable).attr('data-name') + ']').draggable( "option", { axis: "x", containment: '.sliderMiddle .lineContainer' } );
			
			/*if ( $(ui.draggable).is(':visible') ) {
				console.log("visible");*/
				var finalMidPosition = $(ui.draggable).offset().left - $('.drop').offset().left;
			/*} else {
				console.log("not visible");
				var finalMidPosition = currentItem.position().left;
			}*/
			
			$(ui.draggable).hide();
			
			
			$('.responseItemClone[data-name=' + $(ui.draggable).attr('data-name') + ']').css('left',finalMidPosition+'px').show();
						
			
			
            //If within the slider's width, follow it along
            //if (finalMidPosition >= minX && finalMidPosition <= maxX) {

				var val = Math.round((finalMidPosition) / tickSize),
					iteration = $(ui.draggable).data('index')-1;
					
					
                sliderDiv.slider("value", val);
                //alert($(ui.draggable).data('index')-1 + " : " + val + "%");
				
				$input = items[iteration].element;
				$input.val( val );
				

                //do ajax update here to set the position
                /*$.ajax({
                    type: "POST",
                    url: url,
                    data: val,
                    success: function () {
                        //congrats
                    },
                    dataType: dataType
                });*/

            //}
			
			

        }
    });

			/*$(this).find('.noUiSlider').eq(i).noUiSlider({
				range: {'min':[options.minValue], 'max':[options.maxValue]},
				start: handleValue,
				step: options.unitStep, // step in range fore each point
				behaviour: 'tap-drag',
				orientation: options.sliderOrientation, // or 'vertical'
				direction: options.sliderOrientation == 'horizontal' ? 'ltr' : 'rtl'
			}).on({
				set : function() {

					if ( isInLoop ) iteration = $(this).parents('.sliderContainer').data('iteration');

					var $container = $(this).parents('.sliderContainer'),

						$input = items[iteration].element;
					if ( isSingle && !isInLoop )
						$input.val( items[ roundToStep( $(this).val() - roundToStep(options.minValue) ) ].value );
					else if ( isSingle && isInLoop )
						$input.val( valuesArray[ ( roundToStep($(this).val()) - roundToStep(options.minValue) ) ] );
					else
						$input.val( roundToStep( $(this).val() ) );

					$('.focused').removeClass('focused');


					if(!interconnection){ // (the interaction is bad with interconnected sliders, the handles will be shown on slide, not on set)
						// make handle visible and add focus
						$(this).parents('.controlContainer').find('.slider').eq(iteration).addClass('focused').find('.noUi-handle').show();


						// set slider base colour once selected
						$container.addClass('selected');
					}

					if (showValue) {
						var element = $(this).parents('.controlContainer'),
							handleValue = isSingle ? $.inArray(roundToStep($input.val()), valuesArray) + roundToStep(options.minValue) : roundToStep($input.val());

						element.find('.handleValue').eq(iteration).css('padding-top', '');
						element.find('.noUi-handle').eq(iteration).html( "<div class='handleValue'>" + handleValue + "</div>" );
						var topAdj = Math.ceil( ( element.find('.noUi-handle').eq(iteration).height() - element.find('.handleValue').eq(iteration).outerHeight() ) * 0.5 );
						element.find('.handleValue').eq(iteration).css('padding-top', topAdj + 'px');
					}

					$(this).parents('.sliderContainer').find('.dk').removeClass('selected');

				},
				slide : function() {
					if ( isInLoop ) iteration = $(this).parents('.sliderContainer').data('iteration');
					if (showValue) {
						var element = $(this).parents('.controlContainer'),
							handleValue = isSingle ?
								( isInLoop ? roundToStep($(this).val()) : $.inArray(roundToStep(items[ roundToStep( $(this).val() - roundToStep(options.minValue) ) ].value), valuesArray) + roundToStep(options.minValue) )
								: roundToStep(roundToStep( $(this).val() ));
							//handleValue = isSingle ? $.inArray(parseInt($(this).val()), valuesArray) + parseInt(options.minValue) : parseInt($(this).val());

						element.find('.handleValue').eq(iteration).css('padding-top', '');
						element.find('.noUi-handle').eq(iteration).html( "<div class='handleValue'>" + handleValue + "</div>" );
						var topAdj = Math.ceil( ( element.find('.noUi-handle').eq(iteration).height() - element.find('.handleValue').eq(iteration).outerHeight() ) * 0.5 );
						element.find('.handleValue').eq(iteration).css('padding-top', topAdj + 'px');
					}

					$(this).parents('.sliderContainer').eq(iteration).find('.dk').removeClass('selected');

					if(interconnection){ // (show the handles on slide, not on set)
						$(this).parents('.controlContainer').find('.slider').eq(iteration).addClass('focused').find('.noUi-handle').show();
					}
				},
				change : function(){
				}
			})*/

		}
		
		/**/
		//check if has a value
		$('.responseItemClone').hide();
		$('.responseItem').each(function(index) { 
			
			// var val = Math.round((finalMidPosition - minX) / tickSize),
			var iteration = $(this).data('index')-1,
				val = items[iteration].element.val(),
				range = 100,
				sliderWidth = $('.sliderMiddle .lineContainer').outerWidth() - $(this).outerWidth(),
				tickSize = sliderWidth / range,
				POSX = (val * tickSize);				
			
			if ( val != '' ) {
				
				var destination = $('.lineContainer').position().top + $(this).outerHeight(),
					x1 = $('.drop').offset().left - ($('.responseItem').eq(0).width()*0.5) + 1,
					y1 = $('.drop').position().top,
					x2 = x1 + $('.drop').width() - 2,
					y2 = y1 + $('.drop').height();
									
				//$(this).draggable( "option", "revert", false ).css({top: destination, left:POSX});
				//$(this).attr('data-ontarget',true);
				//$(this).draggable( "option", { axis: "x", containment: [ x1, y1, x2, y2 ] } );
				
				$(this).hide();
				$('.responseItemClone').eq(iteration).draggable( "option", { axis: "x", containment: '.sliderMiddle .lineContainer' } );
				$('.responseItemClone').eq(iteration).css('left',POSX+'px').show();
				$('.responseItemClone').eq(iteration).show();
			
			}
			
		});
		
		

		if ( stackResponses ) {
			$('.responseItem[data-ontarget=false]').hide();
			$('.responseItem[data-ontarget=false]').first().show();
		}
		//$('.noUi-handle').click(function () { $(this).parents('.slider').addClass('focused'); })

		$( window ).resize(function() {
			$('.sliderLabel').outerHeight('');
			layoutAdjust();
		});
		layoutAdjust();

		function adjustLabelHeight(target) {
			var $target = $container.find(target);

			var maxLabelHeight = Math.max.apply( null, $target.map( function () {
				return $( this ).outerHeight();
			}).get() );

			// check each and adjust if smaller
			$container.find(target).each(function(index, element) {
                if ( $(this).outerHeight() < maxLabelHeight ) $(this).outerHeight(maxLabelHeight);
            });			
		}

		function layoutAdjust() {
			//if ( $(window).width() < parseInt(options.labelWidth) * 3 && options.sliderOrientation == 'horizontal' ) {

			$('.leftLabel, .rightLabel').width('');

			var colspan = 1;
			$('.sliderMiddle td:nth-child(1)').show();
			$('.sliderMiddle td:nth-child(2)').show();
			$('.sliderMiddle td:nth-child(3)').show();
			$('.sliderMiddle td:nth-child(2)').attr('colspan',colspan);
			$('.leftLabel, .rightLabel').hide();
			$('.sliderMiddle .leftLabel, .sliderMiddle .rightLabel').show();
			// large
			//$('.bottomLabels.left').css('position','relative !important');
			//$('.bottomLabels').show();
			//$('.topLabels').hide();
			$('.slider').css({'padding':''});

			// Centralize slider
			var paddingAdjustmentV = Math.floor(($('.sliderLabel').outerHeight() - $('.noUiSlider').outerHeight() )/2) + 'px';
			var paddingAdjustmentH = Math.floor(($('.sliderLabel').outerWidth() - $('.noUiSlider').outerWidth() )/2) + 'px';
			/*if ( options.sliderOrientation === 'horizontal' ) $('.noUiSlider').css({'margin-top':paddingAdjustmentV,'margin-bottom':paddingAdjustmentV});
			else if ( options.sliderOrientation === 'vertical' ) $('.noUiSlider').css({'margin-left':paddingAdjustmentH,'margin-right':paddingAdjustmentH});*/

			// Find tallest label

		}

		// Remove focus when not clicking on slider
		$(document).click(function(e) {

			if ( !($(e.target).hasClass('noUi-base') || $(e.target).hasClass('noUi-origin') || $(e.target).hasClass('noUiSlider') || $(e.target).hasClass('noUi-handle')) ) {

				var element = $('.focused').parents('.controlContainer');
            	$('.focused').removeClass('focused');

				// vertically center number
				for ( var i=0; i<items.length; i++ ) {
					element.find('.handleValue').eq(i).css('padding-top', '');
					var topAdj = Math.ceil( ( element.find('.noUi-handle').eq(i).height() - element.find('.handleValue').eq(i).outerHeight() ) * 0.5);
					element.find('.handleValue').eq(i).css('padding-top', topAdj + 'px');

				}

			}

        });

		function roundToStep(num) {
			/*
			var resto = num%options.unitStep;
			if (resto <= (options.unitStep/2)) {
				return num-resto;
			} else {
				return num+options.unitStep-resto;
			}
			*/
			if(options.unitStep == 1 || unitDP == 0){
				return parseInt(num)
			} else {
				var stepMultiplyer = 1/options.unitStep;
				//console.log("roundToStep" + Math.ceil(num*stepMultiplyer)/stepMultiplyer).toFixed(2)):
				return (Math.ceil(num*stepMultiplyer)/stepMultiplyer).toFixed(unitDP)
			}
		}

		function decimalPlaces(n) {
		  // Make sure it is a number and use the builtin number -> string.
		  var s = "" + (+n);
		  // Pull out the fraction and the exponent.
		  var match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
		  // NaN or Infinity or integer.
		  // We arbitrarily decide that Infinity is integral.
		  if (!match) { return 0; }
		  // Count the number of digits in the fraction and subtract the
		  // exponent to simulate moving the decimal point left by exponent places.
		  // 1.234e+2 has 1 fraction digit and '234'.length -  2 == 1
		  // 1.234e-2 has 5 fraction digit and '234'.length - -2 == 5
		  return Math.max(
			  0,  // lower limit.
			  (match[1] == '0' ? 0 : (match[1] || '').length)  // fraction length
			  - (match[2] || 0));  // exponent
		}

		// enable keyboard interaction
		$(document).keydown(function( e ) {

			// if focus found
			if ( $('.focused').size() > 0 ) {

				var element = $('.focused').parents('.controlContainer'),
					iteration = isInLoop ? $('.focused').parents('.sliderContainer').data('iteration') : 0,
					slider = $('.focused').parents('.controlContainer').find('.noUiSlider').eq(iteration),
					value = roundToStep( slider.val() ),
					$input = items[iteration].element;

				switch ( e.which ) {
					case 38:
						if ( value < options.maxValue ) value ++;
						slider.val( value );
						break;
					case 40:
						if ( value > options.minValue ) value --;
						slider.val( value );
						break;
				}

				//var handleValue = parseInt(value);
				var handleValue = roundToStep(value);

				if (showValue) {
					element.find('.handleValue').eq(iteration).css('padding-top', '');
					element.find('.noUi-handle').eq(iteration).html( "<div class='handleValue'>" + handleValue + "</div>" );
					var topAdj = Math.ceil( ( element.find('.noUi-handle').eq(iteration).height() - element.find('.handleValue').eq(iteration).outerHeight() ) * 0.5 );
					element.find('.handleValue').eq(iteration).css('padding-top', topAdj + 'px');
				}

				if ( isSingle && !isInLoop ) $input.val( items[ parseInt( value ) - 1  ].vaolue );
				else if ( isSingle && isInLoop ) {
					if ( e.which == 38 ) $input.val( valuesArray[ (value - parseInt(options.minValue) ) ] );
					else if ( e.which == 40 ) $input.val( valuesArray[ (value - parseInt(options.minValue)) ] );
				} else $input.val( roundToStep( value ) );
			}
		});

		if ( total_images > 0 ) {
			$container.find('img').each(function() {
				var fakeSrc = $(this).attr('src');
				$("<img/>").css('display', 'none').load(function() {
					images_loaded++;
					if (images_loaded >= total_images) {

						// now all images are loaded.
						$container.css('visibility','visible');

					}
				}).attr("src", fakeSrc);
			});
		} else {
			$container.css('visibility','visible');
		}

		// Returns the container
		return this;
	};

} (jQuery));
