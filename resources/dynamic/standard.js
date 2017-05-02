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
        isSingle : {%= (CurrentQuestion.Type = "single") %},
        useResponseCaptions : '{%= CurrentADC.PropValue("useResponseCaptions") %}',
		leftLabelText : {%= (CurrentADC.PropValue("leftLabelText") <> "") %},
		rightLabelText : {%= (CurrentADC.PropValue("rightLabelText") <> "") %},
		displayLabelText : '{%= CurrentADC.PropValue("displayLabelText") %}',
		labelPlacement : '{%= CurrentADC.PropValue("labelPlacement") %}',
		stackResponses: {%= (CurrentADC.PropValue("stackResponses") = "1") %},
      	showMarkerLabels : '{%= CurrentADC.PropValue("showMarkerLabels") %}',
        markerFontSize : '{%= CurrentADC.PropValue("markerFontSize") %}',
      	markerDistance : '{%= CurrentADC.PropValue("markerDistance") %}',
      	markerTextDistance : '{%= CurrentADC.PropValue("markerTextDistance") %}',
      	markerPrefix : '{%:= CurrentADC.PropValue("markerPrefix") %}',
      	markerSuffix : '{%:= CurrentADC.PropValue("markerSuffix") %}',
		showTooltipCaption : '{%:= CurrentADC.PropValue("showTooltipCaption") %}',
		showTooltipImage : '{%:= CurrentADC.PropValue("showTooltipImage") %}',
		showTooltipValue : '{%:= CurrentADC.PropValue("showTooltipValue") %}',
        showTooltipOnHover : '{%:= CurrentADC.PropValue("showTooltipOnHover") %}',
      	responseAlign : '{%= CurrentADC.PropValue("responseAlign") %}',
      	handleWidth : '{%= CurrentADC.PropValue("handleWidth") %}',
        displayResponseText : '{%= CurrentADC.PropValue("displayResponseText") %}',
      	allowDK : {%= CurrentQuestion.IsAllowDK %},
      	dkEntry : '{%= CurrentQuestion.DKEntry %}',
        dkText : "{%= CurrentADC.PropValue("dkText") %}",
      	currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
		items : [
      		{% IF CurrentQuestion.Type = "single" Then %}
				{%:= CurrentADC.GetContent("dynamic/standard_single.js").ToText()%}
			{% ElseIf CurrentQuestion.Type = "numeric" Then %}
				{%:= CurrentADC.GetContent("dynamic/standard_numeric.js").ToText()%}
			{% EndIF %}
		]
	});
});