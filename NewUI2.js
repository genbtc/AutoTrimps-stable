//set up AutoTrimps
if (autoTrimpSettings === undefined) {
    console.log('Huh, autoTrimpSettings was undefined in the UI script...')
    var autoTrimpSettings = new Object();
}
//create the Automation icon in the game bar
automationMenuInit();

//prepare CSS for new Tab interface
var link1 = document.createElement('link');
link1.rel = "stylesheet";
link1.type = "text/css";
link1.href = 'https://genbtc.github.io/AutoTrimps/tabs.css';
document.head.appendChild(link1);

//CREATE TABS + CONTENT
var addtabs = document.createElement('div');
var ul_0 = document.createElement('ul');
    ul_0.className = "tab";
addtabs.appendChild( ul_0 );
//functions
function createTabs(name,description){ 
   var li_0 = document.createElement('li');

      var a_0 = document.createElement('a');
          a_0.className = "tablinks";
          a_0.setAttribute('onclick', 'toggleTab(event, \'' + name + '\')');
          a_0.href = "#";
          a_0.appendChild( document.createTextNode(name) );
      li_0.appendChild( a_0 );

   ul_0.appendChild( li_0 );
   createTabContents(name,description);
}
function createTabContents(name,description){ 
    var div_0 = document.createElement('div');
        div_0.className = "tabcontent";
        div_0.id = name;

       var div_1 = document.createElement('div');
       div_1.setAttribute("style", "margin-left: 1vw; margin-right: 1vw;");
       var h4_0 = document.createElement('h4');
           h4_0.appendChild( document.createTextNode(description) );
       div_1.appendChild( h4_0 );
       
       div_0.appendChild( div_1 );

    addtabs.appendChild( div_0 );
}
/*
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
*/
function toggleTab(evt, tabName) {
    //Toggle.
    if (evt.currentTarget.className.indexOf(" active") > -1) {
        document.getElementById(tabName).style.display = "none";
        evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");        
    }
    else {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";        
    }
}
//Make Tabs.
createTabs("Core","Main Controls for the script");
createTabs("Core2","Sub Controls for the script + Advanced");
createTabs("genBTC","GenBTC Advanced");
createTabs("Scryer","Scryer Stance");
createTabs("Import Export","Import Export Settings");
//Insert tabs into the game area
document.getElementById("autoSettings").appendChild(addtabs);
//pretend click to make first tab active.
document.getElementById("Core").style.display = "block";
document.getElementsByClassName("tablinks")[0].className += " active";

//START MAKING BUTTONS IN THE TABS:
//CORE:
createSetting('ManualGather', 'Auto Gather/Build', 'Automatically gathers resources (and uses Turkimp on metal). Auto speed-builds your build queue and auto-researches science on demand.', 'boolean',true,null,"Core");
createSetting('AutoFight', 'Better Auto Fight', 'Will automatically handle fighting. It gives you autofight before you get the Battle upgrade in Zone 1.. .CAUTION: If you autoportal with BetterAutoFight disabled, the game sits there doing nothing until you click FIGHT. (not good for afk) ', 'boolean',true,null,"Core");
createSetting('AutoStance', 'Auto Stance', 'Automatically swap stances to avoid death.', 'boolean',true,null,"Core");
createSetting('TrapTrimps', 'Trap Trimps', 'Automatically trap trimps when needed, including building traps.', 'boolean',true,null,"Core");
createSetting('BuyStorage', 'Buy Storage', 'Will buy storage when resource is almost full. (like AutoStorage, even anticipates Jestimp)', 'boolean',true,null,"Core");
createSetting('BuyJobs', 'Buy Jobs', 'Buys jobs based on ratios configured below. CAUTION: you cannot manually assign jobs with this. Toggle if you need to.', 'boolean',true,null,"Core");
createSetting('BuyBuildings', 'Buy Buildings', 'Will buy non storage buildings as soon as they are available', 'boolean',true,null,"Core");
createSetting('BuyUpgrades', 'Buy Upgrades', 'Autobuy non equipment Upgrades', 'boolean',true,null,"Core");
createSetting('BuyArmor', 'Buy Armor', 'Auto-Buy/Level-Up the most cost efficient armor available. ', 'boolean',true,null,"Core");
createSetting('BuyArmorUpgrades', 'Buy Armor Upgrades', '(Prestiges) & Gymystic. Will buy the most efficient armor upgrade available. ', 'boolean',true,null,"Core");
createSetting('BuyWeapons', 'Buy Weapons', 'Auto-Buy/Level-Up the most cost efficient weapon available. ', 'boolean',true,null,"Core");
createSetting('BuyWeaponUpgrades', 'Buy Weapon Upgrades', '(Prestiges) Will buy the most efficient weapon upgrade available. ', 'boolean',true,null,"Core");
createSetting('BuyShieldblock', 'Buy Shield Block', 'Will buy the shield block upgrade. CAUTION: If you are progressing past zone 60, you probably don\'t want this :)', 'boolean',false,null,"Core");
createSetting('AutoMaps', 'Auto Maps', 'Automatically run maps to progress. Very Important.', 'boolean',true,null,"Core");
createSetting('RunUniqueMaps', 'Run Unique Maps', 'Relies on AutoMaps to choose to run Unique maps. Required for AutoPortal. Also needed for challenges: Electricity, Mapocalypse, Meditate, and Crushed (etc). Needed to auto-run The Wall and Dimension of Anger. ', 'boolean',true,null,"Core");
createSetting('AutoHeirlooms', 'Auto Heirlooms', 'Automatically evaluate and carry the best heirlooms, and recommend upgrades for equipped items. AutoHeirlooms will only change carried items when the heirlooms window is not open. Carried items will be compared and swapped with the types that are already carried. If a carry spot is empty, it will be filled with the best shield (if available). Evaluation is based ONLY on the following mods (listed in order of priority, high to low): Void Map Drop Chance/Trimp Attack, Crit Chance/Crit Damage, Miner Efficiency/Metal Drop, Gem Drop/Dragimp Efficiency, Farmer/Lumberjack Efficiency. For the purposes of carrying, rarity trumps all of the stat evaluations. Empty mod slots are valued at the average value of the best missing mod.', 'boolean',true,null,"Core");
createSetting('HireScientists', 'Hire Scientists', 'Enable or disable hiring of scientists. Math: ScientistRatio=(FarmerRatio+LumberjackRatio+MinerRatio)/25 and stops hiring scientists after 250k Farmers.', 'boolean',true,null,"Core");
createSetting('WorkerRatios', 'Auto Worker Ratios', 'Automatically changes worker ratios based on current progress. WARNING: overrides worker ratio settings. Settings: 1/1/1 up to 300k trimps, 3/3/5 up to 3mil trimps, then 3/1/4 above 3 mil trimps, then 1/1/10 above 1000 tributes, then 1/2/22 above 1500 tributes. Uses 1/40/8 in Spire since we get plenty of metal from that.', 'boolean',true,null,"Core");
createSetting('ManageBreedtimer', 'Manage Breed Timer', 'Automatically manage the breed timer by purchasing Geneticists. Sets ideal anticpation stacks. If not using AutoStance, this will probably be undesirable... Picks appropriate times for various challenges (3.5s,11s,30s). Delays purchasing potency and nurseries if trying to raise the timer. EFFECTIVELY LOCKS THE BREED TIMER', 'boolean',true,null,"Core");
createSetting('GeneticistTimer', 'Geneticist Timer', 'Breed time in seconds to shoot for using geneticists. Disable with -1 (and Disable ManageBreedTimer) to disable the Hiring/Firing of geneticists (and potency upgrades). CANNOT CHANGE WITH MANAGE BREED TIMER OPTION ON', 'value', '30',null,"Core");
createSetting('Prestige', 'Prestige', 'Acquire prestiges through the selected item (inclusive) as soon as they are available in maps. Forces equip first mode. Automap must be enabled. THIS IS AN IMPORTANT SETTING related to speed climbing and should probably always be on something. If you find the script getting stuck somewhere, particularly where you should easily be able to kill stuff, setting this to an option lower down in the list will help ensure you are more powerful at all times, but will spend more time acquiring the prestiges in maps.', 'dropdown', 'Polierarm', ['Off', 'Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'],"Core");
//Make a backup of the prestige setting: backup setting grabs the actual value of the primary setting any time it is changed, (line 412 of the function settingChanged())
if (autoTrimpSettings["PrestigeBackup"] === undefined) {
    autoTrimpSettings["PrestigeBackup"] = autoTrimpSettings["Prestige"];
    autoTrimpSettings["PrestigeBackup"].id = "PrestigeBackup";
    autoTrimpSettings["PrestigeBackup"].name = "PrestigeBackup";
}
createSetting('AutoPortal', 'Auto Portal', 'Automatically portal. Will NOT auto-portal if you have a challenge active, the challenge setting dictates which challenge it will select for the next run. All challenge settings will portal right after the challenge ends, regardless. Helium Per Hour portals at cell 1 of the first level where your He/Hr went down even slightly compared to the current runs Best He/Hr. Take note, there is a Buffer option in the genBTC settings, which is like a grace percentage of how low it can dip without triggering.  CAUTION: Selecting He/hr may immediately portal you if its lower.', 'dropdown', 'Off', ['Off', 'Helium Per Hour', 'Balance', 'Electricity', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Custom'],"Core");
createSetting('HeliumHourChallenge', 'Challenge for Helium per Hour and Custom', 'Automatically portal into this challenge when using helium per hour or custom autoportal. Custom portals after cell 100 of the zone specified. ', 'dropdown', 'None', ['None', 'Balance', 'Electricity', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead','Corrupted'],"Core");
createSetting('CustomAutoPortal', 'Custom Portal', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '200',null, "Core");
createSetting('HeHrDontPortalBefore', 'He/Hr Dont Portal Before', 'Do NOT allow Helium per Hour AutoPortal setting to portal BEFORE this level is reached. It is an additional check that prevents drops in helium/hr from triggering autoportal. Set to 0 or -1 to completely disable this check.', 'value', '200',null, "Core");
createSetting('VoidMaps', 'Void Maps', 'The zone at which you want all your void maps to be cleared (Cell 96).  0 is off', 'value', '0',null,"Core");
createSetting('RunNewVoids', 'Run New Voids', 'Run new void maps acquired after the set void map zone. Runs them at Cell 95 by default, unless you set a decimal value indicating the cell, like: 187.75  CAUTION: May severely slow you down by trying to do too-high level voidmaps. Use the adjacent RunNewVoidsUntil setting to limit this.', 'boolean', null, null, 'Core');
createSetting('RunNewVoidsUntil', 'Run New Voids Until', 'Put a cap on what zone new voids will run at, until this zone, inclusive. ', 'value', '-1', null, 'Core');
createSetting('VoidCheck', 'Void Difficulty Check', 'How many hits to be able to take from a void map boss in dominance stance before we attempt the map. Higher values will get you stronger (by farming for health) before attempting. 2 should be fine.', 'value', '2', null, 'Core');
//CORE2:
createSetting('FarmerRatio', 'Farmer Ratio', '', 'value', '1',null,"Core2");
createSetting('LumberjackRatio', 'Lumberjack Ratio', '', 'value', '1',null,"Core2");
createSetting('MinerRatio', 'Miner Ratio', '', 'value', '1',null,"Core2");
createSetting('MaxScientists', 'Max Scientists', 'Advanced. Cap your scientists. recommend: -1 ("infinite" still controls itself and caps to around 250k under normal situations)', 'value', '-1',null,"Core2");
createSetting('MaxExplorers', 'Max Explorers', 'Cap your explorers, most of fragments are gained by looting not gathering. recommend: 150', 'value', '150',null,"Core2");
createSetting('MaxTrainers', 'Max Trainers', 'Advanced. Cap your trainers. recommend: -1', 'value', '-1',null,"Core2");
createSetting('MaxHut', 'Max Huts', '', 'value', '100',null,"Core2");
createSetting('MaxHouse', 'Max Houses', '', 'value', '100',null,"Core2");
createSetting('MaxMansion', 'Max Mansions', '', 'value', '100',null,"Core2");
createSetting('MaxHotel', 'Max Hotels', '', 'value', '100',null,"Core2");
createSetting('MaxResort', 'Max Resorts', '', 'value', '100',null,"Core2");
createSetting('MaxGateway', 'Max Gateways', 'WARNING: Not recommended to raise above 25', 'value', '25',null,"Core2");
createSetting('MaxWormhole', 'Max Wormholes', 'WARNING: Wormholes cost helium! Values below 0 do nothing.', 'value', '0',null,"Core2");
createSetting('MaxCollector', 'Max Collectors', 'recommend: -1', 'value', '-1',null,"Core2");
createSetting('FirstGigastation', 'First Gigastation', 'How many warpstations to buy before your first gigastation', 'value', '20',null,"Core2");
createSetting('DeltaGigastation', 'Delta Gigastation', 'How many extra warpstations to buy for each gigastation. Supports decimal values. For example 2.5 will buy +2/+3/+2/+3...', 'value', '2',null,"Core2");
createSetting('MaxGym', 'Max Gyms', 'Advanced. recommend: -1', 'value', '-1',null,"Core2");
createSetting('MaxTribute', 'Max Tributes', 'Advanced. recommend: -1 ', 'value', '-1',null,"Core2");
createSetting('MaxNursery', 'Max Nurseries', 'Advanced. recommend: -1', 'value', '-1',null,"Core2");

//advanced settings
createSetting('LimitEquipment', 'Limit Equipment', 'Limit levels of equipment bought to:(level 11 - the prestige level). At or Above Prestige X (10), your equipment will remain at level 1. In other words, do not level equipment after ~level ~51, and only buy Prestiges. CAUTION: may reduce He/hr performance in many cases.', 'boolean', null, null, 'Core2');
createSetting('BreedFire', 'Breed Fire', 'Fire Lumberjacks and Miners to speed up breeding when needed. (Not geneticists).', 'boolean', null, null, 'Core2');
createSetting('MaxTox', 'Max Toxicity Stacks', 'Get maximum toxicity stacks before killing the improbability in each zone 60 and above. Generally only recommended for 1 run to maximize bone portal value. This setting will revert to disabled after a successful Max-Tox run + Toxicity Autoportal.', 'boolean', null, null, 'Core2');
createSetting('DisableFarm', 'Disable Farming', 'Disables the farming section of the automaps algorithm. This will cause it to always return to the zone upon reaching 10 map stacks. TROUBLESHOOTING: Save and Refresh when you toggle this, if necessary. INFO: The new Trimps 3.22 map-buttons greatly eliminate the usefulness of this. ALSO: NO LONGER DISABLES SIPHONOLOGY. ', 'boolean', null, null, 'Core2');
createSetting('PauseScript', 'Pause AutoTrimps', 'Pause AutoTrimps (not including the graphs module)', 'boolean', null, null, 'pause');

//genBTC advanced settings - option buttons.
createSetting('WarpstationCap', 'Warpstation Cap', 'Do not level Warpstations past Basewarp+DeltaGiga **. Without this, if a Giga wasnt available, it would level infinitely (wastes metal better spent on prestiges instead.) **The script bypasses this cap each time a new giga is bought, when it insta-buys as many as it can afford (since AT keeps available metal/gems to a low, overbuying beyond the cap to what is affordable at that first moment is not a bad thing). ', 'boolean', null, null, 'genBTC');
//migrate old WW to new WW2 slider.
if (autoTrimpSettings["WarpstationWall3"] === undefined && autoTrimpSettings["WarpstationWall"]) {
    createSetting('WarpstationWall3', 'Warpstation Wall', 'Metal Cap. Only buys 1 Warpstation when you can afford <b>X</b> warpstations metal cost (at the first one\'s price, simple math). -1, 0, 1 = disable. In other words, only allows warps that cost less than 1/nth your currently owned metal. (to save metal for prestiges)', 'value', 0, null, 'genBTC');
    autoTrimpSettings["WarpstationWall3"].value = 4 * (1 * autoTrimpSettings["WarpstationWall"].enabled);
} else {
    createSetting('WarpstationWall3', 'Warpstation Wall', 'Metal Cap. Only buys 1 Warpstation when you can afford <b>X</b> warpstations metal cost (at the first one\'s price, simple math). -1, 0, 1 = disable. In other words, only allows warps that cost less than 1/nth your currently owned metal. (to save metal for prestiges)', 'value', 0, null, 'genBTC');
}
createSetting('CapEquip', 'Cap Equip to 10', 'Do not level equipment past 10. Similar to LimitEquipment, Helps for early game when the script wants to level your tier2s to 40+, but unlike LimitEquipment, does not impact Zone 60+.', 'boolean', null, null, 'genBTC');
createSetting('AlwaysArmorLvl2', 'Always Buy Lvl 2 Armor', 'Always Buy the 2nd point of Armor even if we dont need the HP. Its the most cost effective level, and the need HP decision script isnt always adequate. FORCE on during Spire.', 'boolean', null, null, 'genBTC');
createSetting('WaitTill60', 'Skip Gear Level 58&59', 'Dont Buy Gear during level 58 and 59, wait till level 60, when cost drops down to 10%.', 'boolean', null, null, 'genBTC');
createSetting('DelayArmorWhenNeeded', 'Delay Armor', 'Delay buying armor prestige upgrades during Want More Damage or Farming automap-modes.', 'boolean', null, null, 'genBTC');
createSetting('DynamicSiphonology', 'Dynamic Siphonology', 'Use the right level of siphonology based on your damage output.', 'boolean', true, null, 'genBTC');
createSetting('FarmWhenNomStacks7', 'Farm on >7 NomStacks', 'On Improbability(cell 100). Meant to be used with DisableFarming (otherwise farming would take care of this, but its slower). If Improbability already has 5 NomStacks, stack 30 Anticipation. If the Improbability has >7 NomStacks on it, get +200% dmg from MapBonus. If we still cant kill it, enter Farming mode at 30 stacks, Even with DisableFarming On! (exits when we get under 20x)', 'boolean', null, null, 'genBTC');
createSetting('AutoRoboTrimp', 'AutoRoboTrimp', 'Use RoboTrimps ability starting at this level, and every 5 levels thereafter. (set to 0 to disable)', 'value', '60', null, 'genBTC');
createSetting('HeliumHrBuffer', 'He/Hr Portal Buffer %', 'When using the He/Hr Autoportal, it will portal if your He/Hr drops by this amount of % lower than your best for current run, default is 0% (ie: set to 5 to portal at 95% of your best)', 'value', '0', null, 'genBTC');
createSetting('DynamicPrestige', 'Dynamic Prestige', 'EXPERIMENTAL: Skip getting prestiges at first, and Gradually work up to the desired Prestige setting you have set. Runs with Dagger to save a significant amount of time until we need better gear, then starts increasing the prestige setting near the end of the run. ---NEW ALGORITHM 7/23/2016--- Examines which prestiges you have, how many missing ones youd need to achieve the desired target and starts running 5 maps or 2 maps every zone, Until the target prestige is reached. Example: For mace, starts getting the prerequisite prestiges 10 zones away from max, then more and more, finally reaching the desired prestige by the last final zone (also goes for 9 mapbonus on the last zone). IMPORTANT NOTE PLEASE READ: Final Zone Number is inherently tied to the AutoPortal setting. When using the Helium per Hour setting, it uses the zone we portaled at last run (game.global.lastPortal). If the AutoPortal is set to a challenge, it will use the last zone of the challenge. CAUTION: EXPERIMENTAL, please come to Discord chat if you have problems.', 'boolean', null, null, 'genBTC');
createSetting('RunBionicBeforeSpire', 'Run Bionic Before Spire', 'Run the Bionic Wonderlands I through VI and then repeatedly farms VI(level 200) before attempting Spire, for the purpose of farming. WARNING: The point at which it stops farming has yet to be fully decided upon or set in stone, so it currently runs Bionic VI until it runs out of new prestige item rewards, then runs Bionic VII until it runs out of prestige items from that one, and then attempts the spire. This amounts to somewhere around 144 minutes. DO NOT USE WITH HE/HR PORTAL. Not meant to be used every time, He/Hr suffers.', 'boolean', null, null, 'genBTC');
createSetting('TrainerCaptoTributes', 'Cap Trainers to a % of Tributes', 'Only Buy a Trainer when its cost is LESS than X% of cost of a tribute. This setting can work in combination with the other one, or set the other one to -1 and this will take full control. Default: -1 (Disabled). 50% is close to the point where the cap does nothing. You can go as low as you want but recommended is 10% to 1%. (example: Trainer cost of 5001, Tribute cost of 100000, @ 5%, it would NOT buy the trainer.)', 'value', '-1', null, 'genBTC');
createSetting('AutoHeirlooms2', 'Auto Heirlooms2', 'New algorithm for Heirlooms. While enabled, the old AutoHeirlooms algorithm will be disabled (the button will stay lit or you can turn that one off). CAUTION: Turning this on will immediately re-sort your heirlooms according to the new algorithm, and turning it off again DOES revert to the original algorithm even though it may NOT have a visible result on your heirlooms. (fyi: This lack of action highlights one of the problems with the old one.) ', 'boolean', null, null, 'genBTC');
createSetting('AutoGoldenUpgrades', 'AutoGoldenUpgrades', 'Automatically Buy the specified Golden Upgrades as they become available.', 'dropdown', 'Off', ["Off","Helium", "Battle", "Void"], 'genBTC');
var AGULabel = document.createElement("Label");
AGULabel.id = 'AutoGoldenUpgradesLabel';
AGULabel.innerHTML = "Golden Upgrades:";
AGULabel.setAttribute('style', 'margin-right: 0.4vw; font-size: 0.8vw;');
document.getElementById("AutoGoldenUpgrades").parentNode.insertBefore(AGULabel,document.getElementById("AutoGoldenUpgrades"))
createSetting('AutoUpgradeHeirlooms', 'Auto Upgrade Heirlooms', 'Automatically buy the upgrade the script advises for the Equipped shield and staff, until we are out of nullifium.', 'boolean', null, null,'genBTC');
createSetting('MinutestoFarmBeforeSpire', 'Minutes to Farm Before Spire', 'Farm level 200 maps for X minutes before continuing to beat spire (0 to disable)', 'value', '0', null, 'genBTC');
createSetting('ExitSpireCell', 'Exit Spire After Cell', 'Exits the Spire after completing cell X. example: 40 for Row 4. (better use 0 to disable, not -1)', 'value', '0', null, 'genBTC');
createSetting('CorruptionCalc', 'Corruption Farm Mode', 'Enabling this will cause the Automaps routine to take amount of corruption in a zone into account, to decide whether it should do maps first for map bonus. ONLY in Zone 181+. ', 'boolean', false, null, 'genBTC');

// Export/Import/Default settings
createSetting('ExportAutoTrimps', 'Export AutoTrimps', 'Export your Settings.', 'infoclick', 'ExportAutoTrimps', null, 'Import Export');
createSetting('ImportAutoTrimps', 'Import AutoTrimps', 'Import your Settings.', 'infoclick', 'ImportAutoTrimps', null, 'Import Export');
createSetting('DefaultAutoTrimps', 'Reset to Default', 'Reset everything to the way it was when you first installed the script.', 'infoclick', 'DefaultAutoTrimps', null, 'Import Export');

// Scryer settings
createSetting('UseScryerStance', 'Use Scryer Stance', 'Stay in Scryer stance in z181 and above (Overrides Autostance). Falls back to regular Autostance when not in use (so leave that on). Current point is to get Dark Essence. EXPERIMENTAL. This is the Master button. All other buttons have no effect if this one is off.', 'boolean',true,null,'Scryer');
createSetting('ScryerMinZone', 'Min Zone', 'Minimum zone to start using scryer in.(inclusive) rec:(60 or 181)', 'value', '181', null, 'Scryer');
createSetting('ScryerMaxZone', 'Max Zone', 'Zone to STOP using scryer at.(not inclusive) Use at your own discretion. rec: (0 or -1 to disable.)', 'value', '-1',null, 'Scryer');
createSetting('ScryerUseWhenOverkill', 'Use When Overkill', 'Use when we can Overkill in S stance, for double loot with no speed penalty. Reccommend this be on. NOTE: This being on, and being able to overkill in S will override ALL other settings. This is a logical shortcut that disregards all the other settings. If you ONLY want to use S during Overkill, as a workaround: turn this on and Min zone: to 9000 and everything else off. ', 'boolean', false,null, 'Scryer');
createSetting('ScryerUseinMaps2', ['Maybe Use in Maps','Force Use in Maps'], 'Maybe/Force Use in Maps. Does not have to be on for Overkill Button to use S in maps. (Obeys zone settings)', 'multitoggle', 0,null, 'Scryer');
createSetting('ScryerUseinVoidMaps2', ['Maybe Use in VoidMaps','Force Use in VoidMaps'], 'Maybe/Force Use in Void Maps. Does not have to be on for Overkill Button to use S in VoidMaps. (Obeys zone settings)', 'multitoggle', 0,null, 'Scryer');
createSetting('ScryerUseinSpire2', ['Maybe Use in Spire','Force Use in Spire'],'Maybe/Force Use in Spire. Does not have to be on for Overkill Button to use S in Spire. ', 'multitoggle', 0,null, 'Scryer');
createSetting('ScryerSkipBoss2', ['Use on Cell 100 (Default)','Never Use on Cell 100 above VoidLevel','Never Use on Cell 100 (ALL Levels)'], 'Use=Default, Never Use: Above VoidLevel, or Never Use: ALL Levels(cell 100). Doesnt use Scrying stance for world Improbabilities/Bosses (cell 100) if you are past the level you have your voidmaps set to run at. (or all levels, if set.)', 'multitoggle', 0,null, 'Scryer');
createSetting('ScryerSkipCorrupteds2', ['Default behavior on Corrupteds','Dont Use S on Corrupteds'], 'UNLESS you can overkill them. (Turning this on doesnt use S stance for corrupted cells UNLESS you can overkill them.) Off just means default (corrupteds are treated like normal cells), SO something else has to be ON to trigger Scryer to be used on normal as well as any corrupted cells.', 'multitoggle', 0,null, 'Scryer');
//createSetting('ScryerUseinSpireSafes', 'Use in Spire(Safes)', 'Use on Spire cells marked with the safe icons - high loot *50 metal reward.', 'boolean', false,null, 'Scryer');
//createSetting('TEMPvarMultiToggle', ['TEMPvarMultiToggle0','TEMPvarMultiToggle1','TEMPvarMultiToggle2'], 'Master description for all 3 settings', 'multitoggle', 0, null, 'Scryer');


function loadAutoTrimps() {
    var thestring = document.getElementById("importBox").value.replace(/(\r\n|\n|\r|\s)/gm,"");
    var tmpset = JSON.parse(thestring);
    if (tmpset == null)
        return;
    //should have done more error checking with at least an error message.
    autoTrimpSettings = tmpset;
    checkSettings();
    saveSettings();
    updateValueFields();
    updateCustomButtons();
    for (var setting in autoTrimpSettings) {
        if (autoTrimpSettings[setting].type == 'boolean')
            //refresh boolean buttons.
            document.getElementById(setting).setAttribute('class', 'settingsBtn settingBtn' + autoTrimpSettings[setting].enabled);
    }
}

function AutoTrimpsTooltip(what, isItIn, event) {
    if (game.global.lockTooltip) 
        return;
    var elem = document.getElementById("tooltipDiv");
    swapClass("tooltipExtra", "tooltipExtraNone", elem);
    var ondisplay = null; // if non-null, called after the tooltip is displayed
    var tooltipText;
    var costText = "";
    if (what == "ExportAutoTrimps"){
        tooltipText = "This is your AUTOTRIMPS save string. There are many like it but this one is yours. Save this save somewhere safe so you can save time next time. <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + JSON.stringify(autoTrimpSettings) + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')){
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function(){
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                      try {
                        document.execCommand('copy');
                      } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                      }
                });
            };
        }
        else {
            ondisplay = function(){
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    }
    if (what == "ImportAutoTrimps"){
        //runs the loadAutoTrimps() function.
        tooltipText = "Import your AUTOTRIMPS save string! It'll be fine, I promise.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText="<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); loadAutoTrimps();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function () {
            document.getElementById('importBox').focus();
        };
    }
    if (what == "DefaultAutoTrimps"){
        localStorage.removeItem('autoTrimpSettings');
        tooltipText = "Please Save your game and reload your browser now, for Autotrimps to reset to defaults.";
    }
    game.global.lockTooltip = true;
    elem.style.left = "33.75%";
    elem.style.top = "25%";
    document.getElementById("tipTitle").innerHTML = what;
    document.getElementById("tipText").innerHTML = tooltipText;
    document.getElementById("tipCost").innerHTML = costText;
    elem.style.display = "block";
    if (ondisplay !== null)
        ondisplay();
}

function automationMenuInit() {

    var settingBtnSrch = document.getElementsByClassName("btn btn-default");
    for (var i = 0; i < settingBtnSrch.length; i++) {
        if (settingBtnSrch[i].getAttribute("onclick") === "toggleSettingsMenu()")
            settingBtnSrch[i].setAttribute("onclick", "autoPlusSettingsMenu()");
    }
    //create the button Script button
    var newItem = document.createElement("TD");
    newItem.appendChild(document.createTextNode("AutoTrimps"));
    newItem.setAttribute("class", "btn btn-default");
    newItem.setAttribute("onclick", "autoToggle()");
    var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
    settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);
    //create automaps button
    var newContainer = document.createElement("DIV");
    newContainer.setAttribute("class", "battleSideBtnContainer");
    newContainer.setAttribute("style", "display: block;");
    newContainer.setAttribute("id", "autoMapBtnContainer");
    var abutton = document.createElement("SPAN");
    abutton.appendChild(document.createTextNode("Auto Maps"));
    abutton.setAttribute("class", "btn fightBtn btn-success");
    abutton.setAttribute("id", "autoMapBtn");
    abutton.setAttribute("onClick", "settingChanged('AutoMaps')");
    abutton.setAttribute("onmouseover", 'tooltip(\"Toggle Automapping\", \"customText\", event, \"Toggle automapping on and off.\")');
    abutton.setAttribute("onmouseout", 'tooltip("hide")');
    var fightButtonCol = document.getElementById("battleBtnsColumn");
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);
    
    //create automaps status
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1.1vw; text-align: center; background-color: rgba(0,0,0,0.3);");
    abutton = document.createElement("SPAN");
    abutton.id = 'autoMapStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

     //make timer click toggle paused mode
    document.getElementById('portalTimer').setAttribute('onclick', 'toggleSetting(\'pauseGame\')');
    document.getElementById('portalTimer').setAttribute('style', 'cursor: default');


    //create container for settings buttons
    document.getElementById("settingsRow").innerHTML += '<div id="autoSettings" style="display: none; max-height: 96vh;"></div>';
   //shrink padding for fight buttons to help fit automaps button/status
    var btns = document.getElementsByClassName("fightBtn");
    for (var x = 0; x < btns.length; x++){
        btns[x].style.padding = "0.01vw 0.01vw";
    }
}


//toggles the display of the settings menu.
function autoToggle(what){ 
    if(what) {
        whatobj = document.getElementById(what);
        if(whatobj.style.display === 'block'){
            whatobj.style.display = 'none';
            document.getElementById(what+'BTN').style.border = '';
        }
        else {
            whatobj.style.display = 'block';
            document.getElementById(what+'BTN').style.border = '4px solid green';
        }
    }
    else {
        if (game.options.displayed)
            toggleSettingsMenu();
        if (document.getElementById('graphParent').style.display === 'block')
            document.getElementById('graphParent').style.display = 'none';
        var item = document.getElementById('autoSettings');
        if(item.style.display === 'block')
            item.style.display='none';
        else item.style.display = 'block'; 
    }
}

//overloads the settings menu button to include hiding the auto menu settings.
function autoPlusSettingsMenu() {
    var item = document.getElementById('autoSettings');
    if(item.style.display === 'block')
        item.style.display='none';
    item = document.getElementById('graphParent');
    if(item.style.display === 'block')
        item.style.display='none';
    toggleSettingsMenu();
}
    
  
function createSetting(id, name, description, type, defaultValue, list, container) {
    var btnParent = document.createElement("DIV");
   // btnParent.setAttribute('class', 'optionContainer');
   btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 1vw; margin-right: 1vw; margin-bottom: 1vw; width: 14.5vw;');
    var btn = document.createElement("DIV");
    btn.id = id;
    if (type == 'boolean') {
        if (autoTrimpSettings[id] === undefined) {
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                enabled: defaultValue ? defaultValue : false
            };
        }
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].enabled);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        //special case for Pause button.
        if (container == 'pause'){
            btn.setAttribute('style', 'inline-block');
            btnParent.style.float = 'right';
            btnParent.style.marginBottom = '';
            btnParent.style.marginRight = '2vw';
            btnParent.appendChild(btn);
            container = "Core2";
        }
        btnParent.appendChild(btn);
        if(container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);        
    } else if (type == 'value') {
        if (autoTrimpSettings[id] === undefined) {
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: defaultValue
            };
        }
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        btn.setAttribute("onclick", 'autoSetValueToolTip("' + id + '", "' + name + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if(container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'dropdown') {
        if (autoTrimpSettings[id] === undefined) {
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                selected: defaultValue,
                list: list
            };
        }
        var btn = document.createElement("select");
        btn.id = id;
        if(game.options.menu.darkTheme.enabled == 2) btn.setAttribute("style", "color: #C8C8C8");
        else btn.setAttribute("style", "color:black");
        btn.setAttribute("class", "noselect settingsBtn");
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("onchange", 'settingChanged("' + id + '")');

        for (var item in list) {
            var option = document.createElement("option");
            option.value = list[item];
            option.text = list[item];
            btn.appendChild(option);
        }
        btn.value = autoTrimpSettings[id].selected;
        btnParent.appendChild(btn);
        
        if(container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'infoclick') {
        btn.setAttribute('class', 'btn btn-info');
        btn.setAttribute("onclick", 'AutoTrimpsTooltip(\'' + defaultValue + '\', null, \'update\')');
        btn.setAttribute("style", "display: block; font-size: 0.8vw;");
        btn.textContent = name;
        btnParent.style.width = '';
        btnParent.appendChild(btn);
        if(container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return;
    } else if (type == 'multitoggle') {
        defaultValue = defaultValue ? defaultValue : 0;
        if (autoTrimpSettings[id] === undefined) {
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: defaultValue
            };
        }
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].value);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name[defaultValue] + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = autoTrimpSettings[id].name[autoTrimpSettings[id].value];
        btnParent.appendChild(btn);
        if(container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);      
    }
    //make sure names/descriptions match what we have stored.
    if (autoTrimpSettings[id].name != name)
        autoTrimpSettings[id].name = name;
    if (autoTrimpSettings[id].description != description)
        autoTrimpSettings[id].description = description;    
}

function settingChanged(id) {
    var btn = autoTrimpSettings[id];
    if (btn.type == 'boolean') {
        btn.enabled = !btn.enabled;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
        updateCustomButtons();
    }
    if (btn.type == 'multitoggle') {
        btn.value++;
        if (btn.value > btn.name.length-1)
            btn.value = 0;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        document.getElementById(id).textContent = btn.name[btn.value];
        updateCustomButtons();
    }    
    if (btn.type == 'dropdown') {
        btn.selected = document.getElementById(id).value;
        //part of the prestige dropdown's "backup" system to prevent internal tampering via the dynamic prestige algorithm. everytime we see a user initiated change, make a backup.
        if (id == "Prestige")
            autoTrimpSettings["PrestigeBackup"].selected = document.getElementById(id).value;
    }
    updateCustomButtons();
    saveSettings();
    checkSettings();
}




function autoSetValueToolTip(id, text) {
    ranstring = text;
    var elem = document.getElementById("tooltipDiv");
    var tooltipText = 'Type a number below. You can also use shorthand such as 2e5 or 200k. Put -1 for Infinite.';
    tooltipText += '<br/><br/><input id="customNumberBox" style="width: 50%" onkeypress="onKeyPressSetting(event, \'' + id + '\')" value=' + autoTrimpSettings[id].value + '></input>';
    var costText = '<div class="maxCenter"><div class="btn btn-info" onclick="autoSetValue(\'' + id + '\')">Apply</div><div class="btn btn-info" onclick="cancelTooltip()">Cancel</div></div>';
    game.global.lockTooltip = true;
    elem.style.left = '32.5%';
    elem.style.top = '25%';
    document.getElementById('tipTitle').textContent = 'Value Input';
    document.getElementById('tipText').innerHTML = tooltipText;
    document.getElementById('tipCost').innerHTML = costText;
    elem.style.display = 'block';
    var box = document.getElementById('customNumberBox');
    try {
        box.setSelectionRange(0, box.value.length);
    } catch (e) {
        box.select();
    }
    box.focus();
}

function onKeyPressSetting(event, id) {
    if (event.which == 13 || event.keyCode == 13) {
        autoSetValue(id);
    }
}

function autoSetValue(id) {
    var num = 0;
    unlockTooltip();
    tooltip('hide');
    var numBox = document.getElementById('customNumberBox');
    if (numBox) {
        num = numBox.value.toLowerCase();
        if (num.split('e')[1]) {
            num = num.split('e');
            num = Math.floor(parseFloat(num[0]) * (Math.pow(10, parseInt(num[1]))));
        } else {
            var letters = num.replace(/[^a-z]/gi, '');
            var base = 0;
            if (letters.length) {
                var suffices = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv', 'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'];
                for (var x = 0; x < suffices.length; x++) {
                    if (suffices[x].toLowerCase() == letters) {
                        base = x + 1;
                        break;
                    }
                }
                if (base) num = Math.round(parseFloat(num.split(letters)[0]) * Math.pow(1000, base));
            }
            if (!base) num = parseFloat(num);
        }
    } else return;
    var txtNum = (num > -1) ? prettify(num) : 'Infinite';
    autoTrimpSettings[id].value = num;
    document.getElementById(id).textContent = ranstring + ': ' + txtNum;
    saveSettings();
    checkSettings();
}

function updateValueFields() {
    for (var setting in autoTrimpSettings) {
        if (autoTrimpSettings[setting].type == 'value') {
            var elem = document.getElementById(autoTrimpSettings[setting].id);
            if (elem != null) elem.textContent = autoTrimpSettings[setting].name + ': ' + ((autoTrimpSettings[setting].value > -1) ? prettify(autoTrimpSettings[setting].value) : 'Infinite');
        }
    }
    //automaps status
    var status = document.getElementById('autoMapStatus');
    if(!autoTrimpSettings.AutoMaps.enabled) status.innerHTML = 'Off';
    else if(needPrestige && !doVoids) status.innerHTML = 'Prestige';
    else if(doVoids && voidCheckPercent == 0) status.innerHTML = 'Void Maps: ' + game.global.totalVoidMaps + ' remaining';
    else if(needToVoid && !doVoids && game.global.totalVoidMaps > 0 && !stackingTox) status.innerHTML = 'Prepping for Voids';
    else if(doVoids && voidCheckPercent > 0) status.innerHTML = 'Farming to do Voids: ' + voidCheckPercent + '%';
    else if(shouldFarm && !doVoids) status.innerHTML = 'Farming: ' + HDratio.toFixed(4) + 'x';
    else if(stackingTox) status.innerHTML = 'Getting Tox Stacks';
    else if (!enoughHealth && !enoughDamage) status.innerHTML = 'Want Health & Damage';
    else if (!enoughDamage) status.innerHTML = 'Want ' + HDratio.toFixed(4) + 'x &nbspmore damage';
    else if (!enoughHealth) status.innerHTML = 'Want more health';   
    else if (enoughHealth && enoughDamage) status.innerHTML = 'Advancing';
}

function updateCustomButtons() {
    //automaps button
    
    if (autoTrimpSettings.AutoMaps.enabled) document.getElementById("autoMapBtn").setAttribute("class", "btn fightBtn btn-success");
    else document.getElementById("autoMapBtn").setAttribute("class", "btn fightBtn btn-danger");
    //auto portal setting, hide until player has cleared zone 59
    if (game.global.highestLevelCleared >= 59 ) document.getElementById("AutoPortal").style.display = '';
    else document.getElementById("AutoPortal").style.display = 'none';
    //custom auto portal value
    if (autoTrimpSettings.AutoPortal.selected == "Custom") document.getElementById("CustomAutoPortal").style.display = '';
    else document.getElementById("CustomAutoPortal").style.display = 'none';
    //challenge for he/hr setting
    if (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour" || autoTrimpSettings.AutoPortal.selected == "Custom") document.getElementById("HeliumHourChallenge").style.display = '';
    else document.getElementById("HeliumHourChallenge").style.display = 'none';
    
    //do not portal before during He/hr auto portal value
    if (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour") document.getElementById("HeHrDontPortalBefore").style.display = '';
    else document.getElementById("HeHrDontPortalBefore").style.display = 'none';
        
    //update dropdown selections:
    document.getElementById('AutoPortal').value = autoTrimpSettings.AutoPortal.selected;
    document.getElementById('HeliumHourChallenge').value = autoTrimpSettings.HeliumHourChallenge.selected;
    document.getElementById('AutoGoldenUpgrades').value = autoTrimpSettings.AutoGoldenUpgrades.selected;
    //document.getElementById('Prestige').value = autoTrimpSettings.Prestige.selected;
}




