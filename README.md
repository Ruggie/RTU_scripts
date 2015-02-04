# RTU_scripts
Add-on script(s) for the game Rebuild The Universe

USAGE:
Currently you have to copy and paste rtu_scripts.js into your console then issue:
1) init(false) for just additional buy information added to unit panel
2) init(true) for same as above plus enables access to autobuy

Starting point was: https://gist.github.com/Celarix/cd009edde135c196f6a8 written by Celarix

CHANGES
+ Added Autobuy On/Off button to DOM in the top left corner of window (fixed)
+ Moved Autobuy feedback spot into floating/fixed header
+ Autobuy feedback will show and hide itself as needed and has been highlighted
+ Autobuy timer does NOT cicle if timer has been deactivated.
+ Autobuy cycle delay is adjustable (autobuySpeed via console only).
