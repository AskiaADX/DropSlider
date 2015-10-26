/* standard.js */
$(window).load(function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcDropSlider({
		target : 'jsObj{%= CurrentADC.InstanceId%}',
		width : 400,
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
		maxImageWidth : {%= CurrentADC.PropValue("maxImageWidth") %},
		maxImageHeight : {%= CurrentADC.PropValue("maxImageHeight") %},
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
		labelWidth : '{%= CurrentADC.PropValue("labelWidth") %}',
		unitStep : {%= CurrentADC.PropValue("unitStep") %},
		minValue : {%= CurrentADC.PropValue("minValue") %},
		maxValue : {%= CurrentADC.PropValue("maxValue") %},
		isInLoop: {%= (CurrentADC.PropValue("isInLoop") = "1") %},
		leftLabelText : {%= (CurrentADC.PropValue("leftLabelText") <> "") %},
		rightLabelText : {%= (CurrentADC.PropValue("rightLabelText") <> "") %},
		displayLabelText : '{%= CurrentADC.PropValue("displayLabelText") %}',
		labelPlacement : '{%= CurrentADC.PropValue("labelPlacement") %}',
		stackResponses: {%= (CurrentADC.PropValue("stackResponses") = "1") %},
		items : [
			{%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
		]
	});
});