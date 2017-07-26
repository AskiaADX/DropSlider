{% 
Dim i 
Dim inputName
Dim dkvalue
Dim ar = CurrentQuestion.ParentLoop.Answers

For i = 1 To ar.Count 
    inputName = CurrentQuestion.iteration(ar[i].Index).InputName()
    dkvalue = CurrentQuestion.DKEntry
   
%}
{element : $('#{%= inputName%}')}{%= On(i < CurrentQuestion.ParentLoop.AvailableResponses.Count, ",", "") %}
{% Next %}