{% 
Dim i 
Dim inputCode
Dim dkvalue
Dim ar = CurrentQuestion.ParentLoop.AvailableAnswers

For i = 1 To ar.Count 
    inputCode = CurrentQuestion.iteration(ar[i].Index).InputCode
    dkvalue = CurrentQuestion.DKEntry
    
%}
{element : $('#{%= CurrentQuestion.Iteration(ar[i].index).InputName()%}')}{%= On(i < CurrentQuestion.ParentLoop.AvailableAnswers.Count, ",", "") %}
{% Next %}