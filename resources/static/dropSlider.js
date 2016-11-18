/*  Thing to fix

ensure all the cards are the same width and height i.e. maxWidth maxHeight
put expanded container in the line container
put all items in this container too

*/

(function($,sr){
    
      var debounce = function (func, threshold, execAsap) {
          var timeout;

          return function debounced () {
              var obj = this, args = arguments;
              function delayed () {
                  if (!execAsap)
                      func.apply(obj, args);
                  timeout = null;
              }

              if (timeout)
                  clearTimeout(timeout);
              else if (execAsap)
                  func.apply(obj, args);

              timeout = setTimeout(delayed, threshold || 100);
          };
      };
      // smartresize 
      jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

var width = $(window).width(), height = $(window).height();

$(window).smartresize(function(){
  if($(window).width() != width) { // prevent resize when width changes only
  	location.reload();
  }
});

// extend jQuery UI slider widget's _mouseCapture function to allow disabling handles
// _mouseCapture function copied from jQuery UI v1.10.3
$.widget("ui.slider", $.ui.slider, {
    _mouseCapture: function (event) {
        var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
        that = this,
            o = this.options;

        if (o.disabled) {
            return false;
        }

        this.elementSize = {
            width: this.element.outerWidth(),
            height: this.element.outerHeight()
        };
        this.elementOffset = this.element.offset();

        position = {
            x: event.pageX,
            y: event.pageY
        };
        normValue = this._normValueFromMouse(position);
        distance = this._valueMax() - this._valueMin() + 1;
        this.handles.each(function (i) {
            // Added condition to skip closestHandle test if this handle is disabled.
            // This prevents disabled handles from being moved or selected with the mouse.
            if (!$(this).hasClass("ui-slider-handle-disabled")) {
                var thisDistance = Math.abs(normValue - that.values(i));
                if ((distance > thisDistance) || (distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min))) {
                    distance = thisDistance;
                    closestHandle = $(this);
                    index = i;
                }
            }
        });

        // Added check to exit gracefully if, for some reason, all handles are disabled
        if(typeof closestHandle === 'undefined')
            return false;

        allowed = this._start(event, index);
        if (allowed === false) {
            return false;
        }
        this._mouseSliding = true;

        this._handleIndex = index;

        closestHandle.addClass("ui-state-active")
            .focus();

        offset = closestHandle.offset();
        // Added extra condition to check if the handle currently under the mouse cursor is disabled.
        // This ensures that if a disabled handle is clicked, the nearest handle will remain under the mouse cursor while dragged.
        mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle") || $(event.target).parents().addBack().is(".ui-slider-handle-disabled");
        this._clickOffset = mouseOverHandle ? {
            left: 0,
            top: 0
        } : {
            left: event.pageX - offset.left - (closestHandle.width() / 2),
            top: event.pageY - offset.top - (closestHandle.height() / 2) - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
        };

        if (!this.handles.hasClass("ui-state-hover")) {
            this._slide(event, index, normValue);
        }
        this._animateOff = true;
        return true;
    }
});


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
        
        if ( options.minValue < 0 ) options.minValue = 0;
        if ( options.maxValue < 0 ) options.maxValue = 10;
        
		// Delegate .transition() calls to .animate() if the browser can't do CSS transitions.
		if (!$.support.transition) $.fn.transition = $.fn.animate;

		var $container = $(this),
			isSingle = Boolean(options.isSingle),
			isInLoop = Boolean(options.isInLoop),
            clickActive = null,
            responseWidth = options.responseWidth,
            responseHeight = options.responseHeight,
            tooltipWidth = options.tooltipWidth,
			hideHandleBG = Boolean(options.hideHandleBG),
			leftLabelText = Boolean(options.leftLabelText),
			rightLabelText = Boolean(options.rightLabelText),
			displayLabelText = (options.displayLabelText == "block") ? true : false,
			labelPlacement = options.labelPlacement,
            handleWidth = parseFloat(options.handleWidth),
			stackResponses = Boolean(options.stackResponses),
            showTooltipOnHover = (options.showTooltipOnHover == "yes") ? true : false,
            useResponseCaptions = (options.useResponseCaptions == "yes") ? true : false,
            markerPrefix = options.markerPrefix,
            markerSuffix = options.markerSuffix,
			valuesArray = new Array(),
			iteration = 0,
            unitStep = parseInt(options.unitStep),
			total_images = $container.find("img").length,
			images_loaded = 0,
			items = options.items,
            responseAlign = options.responseAlign,
            isMobile = false; //initiate as false
        
        var rMarginTop = $('.responseItem').eq(0).css('margin-top');
        
        if ( isSingle ) {
			var allValuesArray = items[0].allValues.split(",");
            var allCaptionsArray = items[0].allCaptions.split(",");
			for ( var i=0; i<items.length; i++ ) {
				valuesArray.push( items[i].value );
			}
			options.maxValue = parseInt(options.minValue) + (allValuesArray.length - 1);
			unitStep = 1;
		}

        /*
		if ( isSingle && dkSingle ) {
			options.maxValue = parseInt(options.maxValue) - 1;
			$(this).find('.dk').attr('data-value',valuesArray[valuesArray.length-1]);
		}
        */
        
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
		
        var labelWidth = ( $('.sliderPC').eq(0).outerWidth() + $('.sliderPC').eq(1).outerWidth() ),
            sliderWidth = $('.sliderContainer').outerWidth() - labelWidth;
                
        if ( isMobile  || sliderWidth < 300 ) {
            $container.find('.sliderMob').show();
            $container.find('.sliderPC').hide();
            isMobile = true;
            stackResponses = true;
        } else {
            $container.find('.sliderMob').hide();
            $container.find('.sliderPC').show();
        }
        
        var labelArray = [];
        if ( isSingle ) {
            for ( var i=0; i<items.length; i++ ) {
                labelArray.push(items[i][1]);
            }
    	}
    
        // undo fixed label widths
        if ( labelWidth >  $('.sliderContainer').outerWidth() || $('.sliderContainer').outerWidth() >  $(window).width() ) $('.sliderPC, .leftLabel, .rightLabel').css('width','auto');
        
		$(this).css({'max-width':options.maxWidth,'width':options.controlWidth});
		/*if ( isInLoop ) $(this).parents('.controlContainer').css({'width':'100%','overflow':'hidden'});*/

		if ( options.controlAlign === "center" ) {
			$(this).parents('.controlContainer').css({'text-align':'center'});
			$(this).css({'margin':'0px auto'});
		} else if ( options.controlAlign === "right" ) {
			$(this).css({'margin':'0 0 0 auto'});
		}
        
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
		if ( stackResponses ) $('.startArea').height( $('.responseItem').outerHeight(true) );
		
		// Make all responses same width
		var maxWidth = $('.responseItem').map(function() {
			return $(this).width();
		}).get();
		
		$('.responseItem').height(maxHeight);
		
		if ( stackResponses ) {
			for ( var i=($('.responseItem').size()-1); i>=0; i-- ) {
                $('.responseItem').eq(i).css("display", "inline-block");
                
                if ( responseAlign === "left" ) {
                    $('.responseItem').eq(i).css({"position":"absolute","left": "0px","top": rMarginTop });
                } else if ( responseAlign === "center" ) {
                	var pos =  ( $('.startArea').outerWidth() - $('.responseItem').eq(i).outerWidth() )/2;
					$('.responseItem').eq(i).css({"position":"absolute","left": pos + "px","top": rMarginTop });
				} else if ( responseAlign === "right" ) {
                	$('.responseItem').eq(i).css({"position":"absolute","right": "0px","top": rMarginTop });
                }
            }
		}

		// Run uiSlider
		//for ( var i=0; i<(isSingle && !isInLoop ? 1 : items.length); i++ ) {

			//var $input = items[i].element;
            var $input = items[0].element;

            var valueArray = [];
            
        	if ( isSingle ) {
                var convertedVals = [];
              	for ( var i=0; i<items.length; i++ ) {
               		convertedVals.push( ($.inArray(valuesArray[i], allValuesArray) + options.minValue ));
            	}
            }
        
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
				})
                /*.bind('click', function(e) {
                    noDrag(e.target);
					e.stopPropagation();
                })*/
                .attr('data-ontarget',false);
                
                valueArray.push((items[index].element.val()!==''?items[index].element.val():'0'));
                //if ( items[index].element.val()!=='' ) valueArray.push(items[index].element.val()));
				// push blank or don't push
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
            /*var sliderTooltip = function(event, ui) {
                var curValue = ui.value || initialValue;
                var target = ui.handle || $('.ui-slider-handle');    
                var tooltip = '<div class="tooltip"><div class="tooltip-inner" data-index="' + $(ui.handle).index() + '"><div class="removeBtn">X</div>' + $container.find('.responseItem').eq($(ui.handle).index()).html() + '<span class="response_text">' + curValue + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
                $(target).html(tooltip);
                enableRemove();
				//$(target).find('img').width('').height('');
            };*/
        
        	
        
			// Activate the UI slider
			sliderDiv.slider({
				min: options.minValue,
				max: options.maxValue,
                values: isSingle ? convertedVals : valueArray,
                step: options.unitStep,
				start: function( event, ui ) {
					$(ui.handle).find('.ui-slider-tooltip').show();
				},
				create : function(e,ui) {
                    /*sliderTooltip(e,ui);*/
					//console.log($(ui.handle).index());
					var tooltip = $('<div class="tooltip"><div class="tooltip-inner" data-index="1"><div class="removeBtn">X</div>' + $container.find('.responseItem').eq(1).html() + '<span class="value_text">' + initialValue + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>');
					$(e.target).find('.ui-slider-handle').append(tooltip);
                    /*enableRemove();*/
				},
                slide: function(e,ui) {
                    /*sliderTooltip(e,ui);*/
					$(ui.handle).find('.value_text').text(ui.value);
                    $input = items[$(ui.handle).index()].element;
                    if ( isSingle ) $input.val( allValuesArray[ui.value] );
                    else $input.val( ui.value );
															
                    $('.responseItem').each(function(index) { 
                        if ( items[index].element.val() ==='' && index !== $(ui.handle).index() ) $('.ui-slider-pip-selected-' + (index+1)).removeClass('ui-slider-pip-selected-' + (index+1));
                        else $('.ui-slider-pip-selected-' + (index+1)).addClass('ui-slider-pip-selected-' + (index+1));
                    });
                },
                stop: function(e,ui) {
                	$('.responseItem').each(function(index) { 
                        if ( items[index].element.val() ==='' && index !== $(ui.handle).index() ) $('.ui-slider-pip-selected-' + (index+1)).removeClass('ui-slider-pip-selected-' + (index+1));
                        else $('.ui-slider-pip-selected-' + (index+1)).addClass('ui-slider-pip-selected-' + (index+1));
                    });
                    if ( showTooltipOnHover ) $(ui.handle).removeClass('ui-state-active ui-state-focus ui-state-hover');
            	},
                change: function(e,ui) {
                	$('.responseItem').each(function(index) { 
                        if ( items[index].element.val() ==='' && index !== $(ui.handle).index() ) $('.ui-slider-pip-selected-' + (index+1)).removeClass('ui-slider-pip-selected-' + (index+1));
                        else $('.ui-slider-pip-selected-' + (index+1)).addClass('ui-slider-pip-selected-' + (index+1));
                    });
            	},
			}).slider("pips", {
                steps:1,
                rest: options.showMarkerLabels,
                first: options.showMarkerLabels === "label" ? "label" : "pip",
                last: options.showMarkerLabels === "label" ? "label" : "pip",
                labels: (isSingle && useResponseCaptions) ? allCaptionsArray : false,// / {"":"","":""} (array)
                prefix: markerPrefix,
                suffix: markerSuffix
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
					/*var tooltip = '<div class="tooltip"><div class="tooltip-inner" data-index="' + sliderID + '"><div class="removeBtn">X</div>' + $container.find('.responseItem').eq(sliderID).html() + '<span class="value_text">' + val + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
						$(target).html(tooltip);
                    enableRemove();*/
                    $(target).find('.value_text').text(val);
                    
					
					$(".drop").slider('values',sliderID,val);
					$input = items[sliderID].element;

					if ( isSingle ) $input.val( allValuesArray[val] );
                    else $input.val( val );
					
					$('.ui-slider-handle').eq( parseInt($(ui.draggable).attr('data-index')) - 1 ).css({'visibility':'visible'}).removeClass('ui-slider-handle-disabled');
					
					$(ui.draggable).attr('data-ontarget','true');
					
					/* show next response */
					if ( stackResponses ) $('.responseItem[data-ontarget=false]:hidden:first').show();
		  
				}
			});
	
			// set correct content to each tooltip
			$container.find('.ui-slider-handle').each(function(index, element) {
				var tooltip = '<div class="tooltip"><div class="tooltip-inner" data-index="' + index + '"><div class="removeBtn">X</div>' + $container.find('.responseItem').eq(index).html() + '<span class="value_text">' + 0 + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
				$(this).html(tooltip);
			});
            enableRemove();
	
			// Find biggest tooltip height and adjust space above slider
			var maxTTHeight = Math.max.apply(null, $(".tooltip").map(
				function () {
					return $(this).outerHeight(true);
				}).get());
        
       		// Find biggest tooltip width and adjust space to the sides of slider
			var maxTTWidth = Math.max.apply(null, $(".tooltip").map(
				function () {
					return $(this).outerWidth(true);
				}).get());
			$container.find('.slider').css('margin-top',maxTTHeight );
            
			// set position of bg
			$('.lineContainer .bg').css('top',(($('.lineContainer').height() - $('.lineContainer .bg').outerHeight())/2) + 'px');

		//}
		
		//check if has a value
		$('.responseItem').each(function(index) { 
			
			// var val = Math.round((finalMidPosition - minX) / tickSize),
			var iteration = $(this).data('index')-1,
				val = items[iteration].element.val() /* CHECK */
            /*,
				range = 100,
				sliderWidth = $('.sliderMiddle .lineContainer').outerWidth() - $(this).outerWidth(),
				tickSize = sliderWidth / range,
				POSX = (val * tickSize)*/;				
			
			if ( val !== '' ) {
				
                // SET VALUES TO SLIDER AND SHOW HANDLES
				
				// show appropriate handle
				$(this).css({'visibility':'hidden','left':'','top':''});
								
				/*var target = $('.ui-slider-handle').eq(index);    
				var tooltip = '<div class="tooltip"><div class="tooltip-inner" data-index="' + index + '"><div class="removeBtn">X</div>' + $container.find('.responseItem').eq(index).html() + '<span class="response_text">' + val + '</span><div style="clear:both"></div></div><div class="tooltip-arrow"></div></div>';
				
				$(target).html(tooltip);
                
                enableRemove();*/
				
				$('.ui-slider-handle').eq( index ).css('visibility','visible');
				
				$(this).attr('data-ontarget','true');
				
				var target = $('.ui-slider-handle').eq(index).find('.value_text');
				target.text(convertedVals[index]);				
                
				//$(this).hide();
			
			} else {
                $('.ui-slider-handle').eq( index ).addClass('ui-slider-handle-disabled').css('visibility','hidden');
                $('.ui-slider-pip-selected-' + (index+1)).removeClass('ui-slider-pip-selected-' + (index+1));
            }
            // fix initial pip highlighting
            $('.ui-slider-pip-initial-' + (index+1)).removeClass('ui-slider-pip-initial-' + (index+1));
			
		});

		if ( stackResponses ) {
			$('.responseItem[data-ontarget=false]').hide();
			$('.responseItem[data-ontarget=false]').first().show();
		}
        
        // correct vertical alignment of base
        $('.ui-slider-horizontal.ui-slider-pips').css('margin-top',$('.ui-slider-horizontal.ui-slider-pips').css('margin-bottom') );
		
        
        if ( showTooltipOnHover ) {
            // collapse margin at top
            $container.find('.slider').css('margin-top','0px');
        } else if ( !showTooltipOnHover) {
            // adjust top margin above slider
        	$container.find('.slider').css('margin-top', maxTTHeight + "px");
        }

        
		// correct handle hover
		/*$('.ui-slider-handle').on('hover',function() {
            if ( $(this).is(':visible') ) $(this).css('z-index','1000');
            $(this).addClass('ui-handle-active');
        });*/
		
		/*$( window ).resize(function() {
			$('.sliderLabel').outerHeight('');
			layoutAdjust();
		});
		layoutAdjust();*/
        if ( useResponseCaptions ) {
            // Find biggest marker label height
			var maxRCHeight = Math.max.apply(null, $(".ui-slider-label").map(function () {
				return $(this).height();
			}).get());
            $('.slider').css('margin-bottom',maxRCHeight+'px');
        }
        
        // correct bottom spacing for mobile
        if ( isMobile ) {
            // correct bottom spacing for mobile
            var topMargin = parseInt(options.markerFontSize) + parseInt(options.markerDistance) + parseInt(options.markerTextDistance) + 20;
            $('.ui-slider-horizontal.ui-slider-pips').css({'margin-bottom':topMargin + "px",'margin-top':topMargin + "px"});
            
            // correct bottom spacing for mobile
            $('.lineContainer').css({'padding':  '0px ' + maxTTWidth + 'px'});
            
            // Fix start area overlap
            $('.startArea').height( $('.responseItem').outerHeight(true) );
        } else {
            // add margin to labels
            $('.leftLabel').css({'margin-right': Math.round((handleWidth + 2)/2) + 'px'}); /*here */
            $('.rightLabel').css({'margin-left': Math.round((handleWidth + 8)/2) + 'px'});       
        }

		/*function adjustLabelHeight(target) {
			var $target = $container.find(target);

			var maxLabelHeight = Math.max.apply( null, $target.map( function () {
				return $( this ).outerHeight();
			}).get() );

			// check each and adjust if smaller
			$container.find(target).each(function(index, element) {
                if ( $(this).outerHeight() < maxLabelHeight ) $(this).outerHeight(maxLabelHeight);
            });			
		}*/

		/*function layoutAdjust() {
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

			// Find tallest label

		}*/
        
        // Function to remove item
        function enableRemove() {
            $container.find('.removeBtn').off('mousedown').on('mousedown',function(e) {
                e.preventDefault();
                e.stopPropagation();
                var index = parseInt($(e.target).parents().data('index'));
                $('.ui-slider-handle').eq( index ).find('.tooltip').css('display','none');

                $('.ui-slider-handle').eq( index ).css('visibility','hidden').addClass('ui-slider-handle-disabled');
                $('.responseItem').eq( index ).css('visibility','visible').attr('data-ontarget','false');
                if ( showTooltipOnHover ) $('.ui-slider-handle').eq( index ).removeClass('ui-state-active ui-state-focus ui-state-hover');

                // remove value
                $input = items[index].element;
                $input.val( '' );
                $('.ui-slider-pip-selected-' + (index + 1)).removeClass('ui-slider-pip-selected-' + (index + 1));
            
                /* show next response */
                if ( stackResponses ) {
                    $('.responseItem').hide();
                    $('.responseItem[data-ontarget=false]:hidden:first').show();
                }
                
            });
            
             if ( tooltipWidth !== 'auto' ) {
                // resize images if response width or height has been set
                $container.find('.tooltip-inner').each(function(index, element) {
                    if ( $(this).width() < $(this).find('img').outerWidth() ) {
                        var imageWPadding = $(this).find('img').outerWidth() - $(this).find('img').width(),
                            ratio = $(this).find('img').width() / $(this).find('img').height();
                        $(this).find('img').width( $(this).width() - imageWPadding );	
                        $(this).find('img').height( $(this).find('img').width()/ratio );
                    }
                });
            }
            
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