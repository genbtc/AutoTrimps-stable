Document Code Structure: (for other developers): see main-doc.txt 
 
-    createSetting('BetterAutoFight', ['Better AutoFight OFF', 'Better Auto Fight 1', 'Better Auto Fight 2'], '3-Way Button, Recommended [ON], or Advised to use [OFF] for low level players under 1 million HE.  Will automatically handle fighting. #2 is the new one (benefits higher level players), #1 is the old algorithm (if you have any issues).<br>BAF#1 does: (1)Click Fight if we are dead and already have enough for our breed timer, and fighting would not add a significant amount of time:(&lt;2 sec). (2) Send Trimps to fight now if it takes less than 0.5 seconds to create a new group of soldiers, if we havent bred fully yet. <br>The new BAF#2 additionally does: (3) Click fight anyway if we are dead and stuck in a loop due to Dimensional Generator (z230+) and we can get away with adding time to it(although can happen at any zone) Pseudocode:(RemainingTime + ArmyAdd.Time &lt; GeneTimer) and (4) Clicks fight anyway if we are dead and have &gt;=31 NextGroupTimer and deal with the consequences by firing genetecists afterwards. <br>OFF: Can now be used as to use the in-game AutoFight with no downsides.(will autofight after portal), Recommended OFF for lowlevel. ', 'multitoggle', 1, null, "Core");

-TODO: a BW toggle that can let AT do Bionic Wonderland maps if they haven't ever been done before?
  (in the same vein, check for "Speed" achievements for unique maps and do them if they're not done yet and possible)

- AUTOMAPS: Decide whether map stacks can help speed you up or not:
If you're more limited by you being dead and your lack of health, than damage output, its probably more likely to not be worth it.
also if you don't have the overkill perk increasing damage can get inefficient when damage output is wasted
so keeping a good "survivability to damage output" ratio is better than optimizing "damage output"
keep a count of how long you were dead and how long you were doing damage
if you're never dead, then the damage boost from map stacks is USUALLY worth it. (cant say for sure but im pretty sure)
I still think you'd have to run 1 full map to know for sure if its worth it. then extrapolate that out times 10
Summary:
never dead -> damage boost helps when not "early game when you're ripping through bad guys"
almost never alive, frequently dead -> if more damage output than damage taken (and enough hp to react to fast guys), go on, otherwise farm
occasionally dead and dies faster than breeding -> needs more damage
occasionally dead and dies slower than breeding -> advance


230+ regular maps should really be treated differently from corruption
they don't have block pierce, and no special abilities

    Voidmaps:
    //TODO: Account for magmated voidmaps. (not /2)
    //TODO: Account for daily.
On Voids Diff:
if you have enough HP to survive poisonous without genetecists, i guess its easy
poison is really bad before you get geneticists for example
before you have geneticists poisonous is just awful
if you block everything, heinous is awful
if you almost block everything, destructive is awful
and then the double hit is somewhere in the middle
yeah i think they shift a lot depending on how strong you are
if you're strong enough that doing voids at 190 is a joke but can't do them later after you finish corrupted for example
for me right now I usually block close to 100% of the damage, which is why destruction and heinous are worst
poison is completely trivial when the maps are already easy
destruction = % damage, heinous = crit
if you're trying to do the void maps before you're actually strong though poison is a killer
yea thats a good point, people doing them at the challenge boundary vs at the end of their run
I also thing the difficulty check should consider block, if it doesn't already do that
i always found poison to be the most obnoxious of them early on because when you don't even have geneticists to fire to make breeding faster again it just takes sooo long
for a large part of the game I only did VMs when I could completely block everything, which made them trivial            


old TODO LIST: from 8/17/2016

get to in Near Future:
------------
TODO: Add notes or labels to graph runs.  (to indicate which settings we used)
 it doesnt go into the map bonus mode soon enough because of the fact that its gauging the zone on non-corrupted enemies
 //we will get at least 85 toxstacks from the 1st voidmap UNLESS we have overkill, then we dont get enough.
 //if a new fight group is available and anticipation stacks aren't 30, abandon and grab a new group
 Overkill and certain graphs can skip progress and get mis-aligned if the script was paused or was backgrounded.
  
New Features To Add:
----------------
Documentation (started)
Update README (always do this)
Code Comments (getting better)

new TODO LIST: 3/3/2018 and 3/4/2018
TODO: Perks - background thread / web worker    
TODO: Perks - allocate speed improvement, shortcuts, (36 million iterations and 15 seconds @ 720Qa HE)
            - maybe slow due to OO structure and repeated resolutions for pass2.
FAR TODO: Theoretically the graphs database can be used as a pro-active future prediction model and conditions can be inferred from past runs.
    Example: If Helium per/hour is ABOUT to go down based on previous cached runs (during the ambiguity period of about a few zones), portal earlier.
    Think like Grace %% setting but automatic.
FAR TODO: Cloud distributed graphs. Show similar users graphs? Long shot.
FAR TODO: Cloud management of Save Files
FAR TODO: Analysis of the Userbase and custom settings, even make queries to ask server for better decision making based on global multi-client probability state
TODO: IMPLEMENT A STANDARD FOR USAGE STATISTICS/PROFILE: {
 Highest zone, helium, bones, ATSettings, MODULES, which graphs were clicked on, Perk preset/ratios.
}
TODO: "Max Magmamancers By Zone #" so we can buy them at the start, to gain 5% attack for the first 10 minutes, usually for cases when the void zone which is the same as the portal zone, and you want to stack that level up with all you've got.
TODO: "Map Special Modifier": Special Modifiers, Perfect Sliders (way more fragments), Extra Zones (+0 to +10)
    with a save config option
    if you create a config with FA and +5 zones, and save it, next time you/the script creates a map, it will remember the setting
    so if you want you can use the script to create 3 setups (there are 3 slots to save your config)
    + maps should be only created at poison zones and when they will provide new equipment
    prestigious when you need prestiges, lmc when you need more lvls in your eq
    perfect sliders when you can afford it
    make perfect sliders like if you're able to afford 3x the cost of it in frags, just buy it. otherwise no. and it will be rarer that way but still useful
    another valid idea is burn out all your frags on perfect near the end i guess
TODO for alfa166: "Bionic OverBurner" :smiley: Make it Configurable to run BW 470 one time at z480 to unlock and run BW485, (with the +5 map kit)
TODO: Make a more configurable Auto Spend Nulli function for 2018
TODO: Should invent a tool/script to plug in the version numbers, changelogs, docs.
TODO: Modular Structured load of the modules/*.js files is less than robust now. Check status of each loaded, tally a count, double check success.
     -FAR: In this way, the tracking and loading of modules can be timestamped and version controlled for itemization and aggregate cloud managed.

Bugs To Fix:
----------------
BUG 1: Liquification - the Auto-Skip-tons-of-zones-in-beginning - causes overkill graph to be off by a LOT.
BUG 2: Bone Portal messes with graphs / Importing a savedgame in progress produces bad graphs
Most github pull requests and issues from recently have been resolved.


Other Improvements:
----------------
Void Map Farming
    - based on how much damage you do rather than your health/survival

Programming/CodeWise:
----------------------
Rewrite the automaps way of deciding/picking/buying/running maps. (convo above)
Also while doing this, determine more refined rules for entering the 3 modes: want dmg/want health/farming


Old Done:
------
Done: Visible Version Status Number in UI / Startup popup messages
Done: Essence graph
Done: Renamed Module names: Some stuff is named auto, some stuff isnt. Its AutoTrimps so isn't everything auto? Redundant? 
Done: Renamed NewUI2.js as SettingsGUI - needs new name, some love.
Done: Add autotrimps.site data json upload capability (thanks to Swiffy)