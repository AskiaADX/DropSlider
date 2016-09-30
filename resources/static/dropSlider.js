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
		(options.maxValue = options.maxValue || 100);
		(options.unitStep = options.unitStep || 1);

		// Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		if (!$.support.transition) $.fn.transition = $.fn.animate;

		var $container = $(this),
			isSingle = Boolean(options.isSingle),
			isInLoop = Boolean(options.isInLoop),
            responseWidth = options.responseWidth,
            responseHeight = options.responseHeight,
			hideHandleBG = Boolean(options.hideHandleBG),
			leftLabelText = Boolean(options.leftLabelText),
			rightLabelText = Boolean(options.rightLabelText),
			displayLabelText = (options.displayLabelText == "block") ? true : false,
			labelPlacement = options.labelPlacement,
			stackResponses = Boolean(options.stackResponses),
			valuesArray = new Array(),
			iteration = 0,
            unitStep = parseInt(options.unitStep),
			total_images = $container.find("img").length,
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
		$container.find('.responseItem img').each(function forEachImage() {
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
        
        if ( responseWidth !== 'auto' ) {	
			// resize images if response width or height has been set
            $container.find('.responseItem').each(function(index, element) {
				if ( $(this).width() < $(this).find('img').outerWidth() ) {
					var imageWPadding = $(this).find('img').outerWidth() - $(this).find('img').width(),
						ratio = $(this).find('img').width() / $(this).find('img').height();
					$(this).find('img').width( $(this).width() - imageWPadding );	
					$(this).find('img').height( $(this).find('img').width()/ratio );
				}
            });
        }
        if ( responseHeight !== 'auto' ) {
			$container.find('.responseItem').each(function(index, element) {
                if ( $(this).height() < $(this).find('img').outerHeight() ) {
					var imageHPadding = $(this).find('img').outerHeight() - $(this).find('img').height(),
						ratio = $(this).find('img').height() / $(this).find('img').width();
					$(this).find('img').height( $(this).height() - imageHPadding );
					$(this).find('img').width( $(this).find('img').height()/ratio );	
				}
            });
            
        }
			
		// Find biggest response height
		var maxHeight = Math.max.apply(null, $(".responseItem").map(function () {
				return $(this).height();
			}).get());
		$('.responseItem').height( maxHeight );
		$('.startArea').height( $('.responseItem').outerHeight() );
		
		// Make all responses same width
		var maxWidth = $('.responseItem').map(function() {
			return $(this).width();
		}).get();
		
		$('.responseItem').height(maxHeight);
		
		if ( stackResponses ) {
			for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
				var offset = $('.responseItem').eq(0).offset();
					$('.responseItem').eq(i).css("position", "absolute");
					$('.responseItem').eq(i).offset(offset);
			}
		}

		// Run noUiSlider
		for ( var i=0; i<(isSingle && !isInLoop ? 1 : items.length); i++ ) {

			var $input = items[i].element;

            var valueArray = new Array();
            
	 		//the draggable object
			$('.responseItem').each(function(index) { 
				$(this).draggable({
				  revert: true,
				  zIndex: 1000,
				  cursor: "move",
                  cursorAt: { 
						top:$('.responseItem').eq(index).outerHeight()/2, 
						left:$('.responseItem').eq(index).outerWidth()/2
					}
				});
				$(this).attr('data-ontarget',false);
                valueArray.push((items[index].element.val()!==''?items[index].element.val():0));
				
				/*alert((items[index].element.val()>=0?"true":"false"));
				valueArray.push(parseInt(items[index].element.val()));*/
			});
			
			$('.lineContainer').css('padding','0px');
				
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
            var initialValue = 0;
            var sliderTooltip = function(event, ui) {
                var curValue = ui.value || initialValue;
                var target = ui.handle || $('.ui-slider-handle');    
                var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + $container.find('.responseItem').eq($(ui.handle).index()).html() + '<span class="response_text">' + curValue + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
                $(target).html(tooltip);
				//$(target).find('img').width('').height('');
            };
            
			// Activate the UI slider
			sliderDiv.slider({
				min: options.minValue,
				max: options.maxValue,
                values: valueArray,
                step: options.unitStep,
				create : function(e,ui) {
                    sliderTooltip(e,ui);
					$(this).find(".ui-slider-handle").css('visibility','hidden');
				},
                slide: function(e,ui) {
                    sliderTooltip(e,ui);
                    $input = items[$(ui.handle).index()].element;
					$input.val( ui.value );
                }
			});
						
			//Set slider as droppable
			$('.lineContainer').droppable({
				//on drop 
				over: function( event, ui ) {
					$(event.target).css('background-color','rgb(' + options.baseDropHoverColour + ')');
					var finalMidPosition = $(ui.draggable).offset().left - $('.drop').offset().left;
					var val = Math.floor((finalMidPosition) / tickSize);
					$(ui.draggable).find('.tooltip-inner').html( val );
				},
				out: function( event, ui ) {
					$(event.target).css('background-color','');
					var finalMidPosition = $(ui.draggable).offset().left - $('.drop').offset().left;
					var val = Math.floor((finalMidPosition) / tickSize);
					$(ui.draggable).find('.tooltip-inner').html( val );
				},
				drop: function (e, ui) {
					$(e.target).css('background-color','');
					
					// show appropriate handle
					$(ui.draggable).css({'visibility':'hidden','left':'','top':''});
					var x = (e.pageX - $(this).offset().left) - 1,
						lengthOfBar = $(e.target).width() - 2,
						sliderID = parseInt($(ui.draggable).data('index')) - 1,
						range = parseInt(options.maxValue) - parseInt(options.minValue),
						val = Math.round(((x/lengthOfBar)*range)+options.minValue);
					
					val = unitStep * Math.round(val/unitStep);
					
					var target = $('.ui-slider-handle').eq(sliderID);    
					var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + $container.find('.responseItem').eq(sliderID).html() + '<span class="response_text">' + val + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
						$(target).html(tooltip);
					
					$(".drop").slider('values',sliderID,val);
					$input = items[sliderID].element;
					$input.val( val );
					
					$('.ui-slider-handle').eq( parseInt($(ui.draggable).attr('data-index')) - 1 ).css('visibility','visible');
					
					$(ui.draggable).attr('data-ontarget','true');
					
					/* show next response */
					if ( stackResponses ) $('.responseItem[data-ontarget=false]:hidden:first').show();
		  
				}
			});
	
			// set correct content to each tooltip
			$container.find('.ui-slider-handle').each(function(index, element) {
				var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + $container.find('.responseItem').eq(index).html() + '<span class="response_text">' + 0 + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
				$(this).html(tooltip);
			});
	
			// Find biggest tooltip height and adjust space above slider
			var maxTTHeight = Math.max.apply(null, $(".tooltip").map(
				function () {
					return $(this).outerHeight(true);
				}).get());
			$container.find('.slider').css('margin-top',maxTTHeight );
            
			// set position of bg
			$('.lineContainer .bg').css('top',(($('.lineContainer').height() - $('.lineContainer .bg').height())/2) + 'px');

		}
		
		//check if has a value
		$('.responseItem').each(function(index) { 
			
			// var val = Math.round((finalMidPosition - minX) / tickSize),
			var iteration = $(this).data('index')-1,
				val = items[iteration].element.val(),
				range = 100,
				sliderWidth = $('.sliderMiddle .lineContainer').outerWidth() - $(this).outerWidth(),
				tickSize = sliderWidth / range,
				POSX = (val * tickSize);				
			
			if ( val != '' ) {
				
                // SET VALUES TO SLIDER AND SHOW HANDLES
				
				// show appropriate handle
				$(this).css({'visibility':'hidden','left':'','top':''});
								
				var target = $('.ui-slider-handle').eq(index);    
				var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + $container.find('.responseItem').eq(index).html() + '<span class="response_text">' + val + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
				
				$(target).html(tooltip);
				
				$('.ui-slider-handle').eq( index ).css('visibility','visible');
				
				$(this).attr('data-ontarget','true');
                
				$(this).hide();
			
			}
			
		});

		if ( stackResponses ) {
			$('.responseItem[data-ontarget=false]').hide();
			$('.responseItem[data-ontarget=false]').first().show();
		}

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
            	$('.focused').removeClass('focused');
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