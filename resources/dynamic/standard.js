/* standard.js */
$(window).load(function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcDropSlider({
		target : 'jsObj{%= CurrentADC.InstanceId%}',
		width : 400,
        unitStep : {%= CurrentADC.PropValue("unitStep") %},
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
      	responseWidth : '{%= CurrentADC.PropValue("responseWidth") %}',
      	responseHeight : '{%= CurrentADC.PropValue("responseHeight") %}',
        tooltipWidth : '{%= CurrentADC.PropValue("tooltipWidth") %}',
		maxImageWidth : '{%= CurrentADC.PropValue("maxImageWidth") %}',
		maxImageHeight : '{%= CurrentADC.PropValue("maxImageHeight") %}',
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
		labelWidth : '{%= CurrentADC.PropValue("labelWidth") %}',
		unitStep : {%= CurrentADC.PropValue("unitStep") %},
		minValue : {%= CurrentQuestion.MinValue %},
		maxValue : {%= CurrentQuestion.MaxValue %},
        baseDropHoverColour : '{%= CurrentADC.PropValue("baseDropHoverColour") %}',
		isInLoop: {%= (CurrentADC.PropValue("isInLoop") = "1") %},
		leftLabelText : {%= (CurrentADC.PropValue("leftLabelText") <> "") %},
		rightLabelText : {%= (CurrentADC.PropValue("rightLabelText") <> "") %},
		displayLabelText : '{%= CurrentADC.PropValue("displayLabelText") %}',
		labelPlacement : '{%= CurrentADC.PropValue("labelPlacement") %}',
		stackResponses: {%= (CurrentADC.PropValue("stackResponses") = "1") %},
      	showMarkerLabels : '{%= CurrentADC.PropValue("showMarkerLabels") %}',
      	markerPrefix : '{%:= CurrentADC.PropValue("markerPrefix") %}',
      	markerSuffix : '{%:= CurrentADC.PropValue("markerSuffix") %}',
		items : [
			{%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
		]
	});
});