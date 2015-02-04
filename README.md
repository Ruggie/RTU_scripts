# RTU_scripts
Add-on script(s) for the game Rebuild The Universe

USAGE:
Currently you have to copy and paste rtu_scripts.js content into your console then issue:
1) init(false) for just additional buy information added to unit panel
2) init(true) for same as above plus enables access to autobuy

Starting point was: https://gist.github.com/Celarix/cd009edde135c196f6a8 written by Celarix

CHANGES
+ Added Autobuy On/Off button to DOM in the top left corner of window (fixed)
+ Moved Autobuy feedback spot into floating/fixed header
+ Autobuy feedback will show and hide itself as needed and has been highlighted
+ Autobuy timer does NOT cicle if timer has been deactivated.
+ Autobuy cycle delay is adjustable (autobuySpeed via console only).
+ Autobuy base cost index modified to include time, can be toggled off.
+ Autobuy accounts for bonuses and achievements.
+ Autobuy modified to buy our entire tiers if we have the funds on hand. This will push bonuses and achievements.
+ Note: Side effect of time-weighted BCI can cause "buying special" message to return often. Should this be considered a bug?
+ Autobuy performs much better now!

FUTURE IDEAS / PLANS
+ Follow Celarix's plan and add unit costs to each unit box via hover in units specific box. (Will still list info in large info box) 
+ Move autobuy enabled option into the options menu and auto init script
+ Setup git to pull in as javascript include, auto activate init
+ Add auto-off timer to autobuy so that it can't be left unattended for that long?
+ Add BCI to bonuses and specials

