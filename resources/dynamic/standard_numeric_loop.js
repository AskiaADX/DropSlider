﻿/* standard_numeric_loop.js 2 */
{% 
Dim i 
Dim inputName
Dim ar = CurrentQuestion.ParentLoop.AvailableResponses

For i = 1 To ar.Count 
    inputName = CurrentQuestion.iteration(ar[i].Index).InputName()
%}
{element : $('#{%= inputName%}')}{%= On(i < CurrentQuestion.ParentLoop.AvailableResponses.Count, ",", "") %}
{% Next %}