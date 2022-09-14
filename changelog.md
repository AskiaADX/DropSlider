v1.0.0 -
v1.0.1
- Fixed tooltip text centering
- Fixed response centering when layout set to center
- Fixed spacing between responses and slider
- Changed caption text-alignment to center
- Fixed caption drop on mobile
- Added Touch UI for mobile drag
- Added button to remove responses from slider
- Changed cursor to pointer for handle and responses
- Change image resize to be based on responseItem size or tooltip size
- Added parameters to style base
- Added paramaters to style handle
- show markers
- only show pips (hide marker labels)
- alternating markers esp for single choice question
- highlight chosen number or label MAKE AN OPTION
- fixed pip highlighting
- Added Prefix/Suffix to markers
- Added marker distance
- Added marker text font-size
- Added marker text distance
- Added marker line height
- Fixed vertical position of handle on wide base
v1.0.2
- Markers can now be made circular
- Added option to only display tooltip on hover
- Fixed the alt marker bug
- Fixed spacing below markers
- Fixed side padding around slider on mobile
- Added margin to labels
- Fixed the label width for mobile
- Fixed marker still being selected after response is removed
- Fixed responses not reappearing
- Fixed response centering for stacked responses
- Collapsed margin above slider on mobile when tooltip hovering enabled
- Fixed marker text colouring when response placed on slider
- Fixed allowing tooltips to be dragged on mobile
- Fixed z-index issue with tooltips over start area
- Fixed response alignment for stacking
- Force stacked and mobile layout when slider base smaller than 300px
- Removed fixed label widths when greater than available space
- Added labels (read captions from single choice questions)
- Fixed bottom spacing with bigger/longer labels
- Fixed and check use with single question, setting and reading values
- Changed resize detection settings (was being triggered too often)
- Fixed handle vertical placement
- Enabled click to select and click to drop
- Fixed issue with items not returning to start position
- Fixed accuracy of click to drop on mobile
- Added options for active slider handle styling
- Fixed handle border radius- Fixed text padding in tooltip
- Added tooltip paddingv1.0.3
- Fixed tooltip layout when close to edges
- Added in DK
- Fixed show tooltips on hover bug

v1.1.0 - Added the interconnection between sliders property.
> This option link all the sliders between each other, so that the sum of the values of each slider within the loop do not go beyond a fixed maximum.
> A checkbox appears near each slider to fix its value.
> When a slider is moved, the value of all the other sliders is recalculated to fit the maximum sum defined in the properties.
> The value of each frozen slider is fixed, and not recalculated, but taken into account to calculate the value of the others.

v1.1.1 -
> fixing the handles not showing for interconnected sliders
> moving the properties for interconnected sliders
> deleting the maxForInterconnection property, the max value for the sliders will be used instead
> adding a property to chose the label for the checkbox

v2.0.0 -
v2.0.2 - Add alt attribute to img
v2.0.3 - Fixed step related bugs
v3.0.0 - AvailableAnswers
v3.0.3 - Fixed encoding caption
v3.0.4 - Changed GUID cause duplicate with Slider
v3.0.5 - Fixed value on handle tooltip
v3.1.0 - libraries/plugins update,
       - Share folder removed.
