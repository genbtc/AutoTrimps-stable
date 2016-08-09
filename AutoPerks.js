// ==UserScript==
// @name         AutoPerks
// @namespace    http://tampermonkey.net/
// @version      1.0.02-beta-7-31-2016
// @description  Trimps Automatic Perk Calculator
// @author       zxv, genBTC
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

//Create blank AutoPerks object
AutoPerks = {};

//Import the Library
var head = document.getElementsByTagName('head')[0];
var queuescript = document.createElement('script');
queuescript.type = 'text/javascript';
queuescript.src = 'https://genbtc.github.io/AutoTrimps/FastPriorityQueue.js';
head.appendChild(queuescript);

//Create button and Add to Trimps Perk Window(and Portal)
var buttonbar = document.getElementById("portalWrapper");
var btnParent = document.createElement("DIV");
btnParent.id = 'allocatorBtnContainer';
btnParent.setAttribute('style', 'display: inline-block; margin-left: 1vw; margin-right: 1vw; margin-bottom: 1vw; margin-top: 1vw; width: 10vw;');
var allocatorBtn1 = document.createElement("DIV");
allocatorBtn1.id = 'allocatorBTN1';
allocatorBtn1.setAttribute('class', 'settingsBtn settingBtntrue');
allocatorBtn1.setAttribute('onclick', 'AutoPerks.parseData()');
allocatorBtn1.textContent = 'Automatically Allocate Perks';
btnParent.appendChild(allocatorBtn1);
buttonbar.appendChild(btnParent);

//Create all perk customRatio boxes in Trimps perk window.
AutoPerks.createInput = function(perkname,div) {
    var perk1input = document.createElement("Input");
    perk1input.id = perkname + 'Ratio';
    perk1input.setAttribute('style', 'text-align: center; width: 60px; color: black;');
    perk1input.setAttribute('class', 'perkRatios');
    var perk1label = document.createElement("Label");
    perk1label.id = perkname + 'Label';
    perk1label.innerHTML = perkname;
    perk1label.setAttribute('style', 'margin-right: 1vw; width: 120px; color: white;');
    //add to the div.
    div.appendChild(perk1input);
    div.appendChild(perk1label);
}
var customRatios = document.createElement("DIV");
customRatios.id = 'customRatios';
//Line1
var ratios1 = document.createElement("DIV");
ratios1.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
var listratios1 = ["Overkill","Resourceful","Coordinated","Resilience","Carpentry"];
for (var i in listratios1)
    AutoPerks.createInput(listratios1[i],ratios1);
customRatios.appendChild(ratios1);
var ratios2 = document.createElement("DIV");
ratios2.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
//Line2
var listratios2 = ["Artisanistry","Pheromones","Motivation","Power","Looting"];
for (var i in listratios2)
    AutoPerks.createInput(listratios2[i],ratios2);
//Create dump perk dropdown
var dumpperklabel = document.createElement("Label");
dumpperklabel.id = 'DumpPerk Label';
dumpperklabel.innerHTML = "Dump Perk:";
dumpperklabel.setAttribute('style', 'margin-right: 1vw; color: white;');
var dumpperk = document.createElement("select");
dumpperk.id = 'dumpPerk';
dumpperk.setAttribute('style', 'text-align: center; width: 120px; color: black;');
ratios2.appendChild(dumpperklabel);
ratios2.appendChild(dumpperk);
//List of the perk options are populated at the bottom of this file.
//Create ratioPreset dropdown
var ratioPresetLabel = document.createElement("Label");
ratioPresetLabel.id = 'Ratio Preset Label';
ratioPresetLabel.innerHTML = "Ratio Preset:";
ratioPresetLabel.setAttribute('style', 'margin-right: 1vw; color: white;');
var ratioPreset = document.createElement("select");
ratioPreset.id = 'ratioPreset';
ratioPreset.setAttribute('style', 'text-align: center; width: 110px; color: black;');
//List of the perk options are populated at the bottom of this file.
//populate dump perk dropdown list 
var html = "<option id='zxvPreset'>ZXV (default)</option>"
html += "<option id='TruthPreset'>Truth</option>"
html += "<option id='nSheetzPreset'>nSheetz</option>"
html += "<option id='nSheetzPreset'>nSheetz(new)</option>"
html += "<option id='customPreset'>Custom</option></select>"
ratioPreset.innerHTML = html;
ratioPreset.selectedIndex = 0; // First element is zxv (default) ratio.
ratioPreset.setAttribute('onchange', 'AutoPerks.setDefaultRatios()');
ratios1.appendChild(ratioPresetLabel);
ratios1.appendChild(ratioPreset);
//
customRatios.appendChild(ratios2);
buttonbar.appendChild(customRatios);

//BEGIN AUTOPERKS SCRIPT CODE:>

AutoPerks.saveCustomRatios = function() {
    var perks = document.getElementsByClassName('perkRatios');
    var customRatios = [];
    for(var i = 0; i < perks.length; i++) {
        customRatios.push({'id':perks[i].id,'value':parseFloat(perks[i].value)});
    }
    localStorage.setItem('AutoPerksCustomRatios', JSON.stringify(customRatios));
}

//sets the ratioboxes with the default ratios embedded in the script when perks are instanciated. hardcoded @ lines 333-360 (ish)
//executed manually at the very last line of this file.
//loads custom ratio selections from localstorage if applicable
AutoPerks.setDefaultRatios = function() {
    var perks = document.getElementsByClassName("perkRatios");
    var ratioSet = document.getElementById("ratioPreset").selectedIndex;
    var currentPerk;
    for(var i = 0; i < perks.length; i++) {
        currentPerk = AutoPerks.getPerkByName(perks[i].id.substring(0, perks[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
        perks[i].value = currentPerk.value[ratioSet];
    }
    //grab custom ratios if saved.
    if (ratioSet == document.getElementById("ratioPreset").length-1) {
        var tmp = JSON.parse(localStorage.getItem('AutoPerksCustomRatios'));
        if (tmp !== null) 
            customRatios = tmp;
        else {
            // If "custom" is manually selected, and no file was found, start by setting all perks to 0.
            for(var i = 0; i < perks.length; i++) {
                perks[i].value = 0;     //initialize to 0.
            }
            return; //then exit.
        }
        //if we have ratios in the storage file, load them
        for(var i = 0; i < perks.length; i++) {
            //do a quick sanity check (order)
            if (customRatios[i].id != perks[i].id) continue;
            currentPerk = AutoPerks.getPerkByName(perks[i].id.substring(0, perks[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
            perks[i].value = customRatios[i].value;
        }        
    }
    localStorage.setItem('AutoPerksSelectedRatioPresetID', ratioSet);
}

//updates the internal perk variables with values grabbed from the custom ratio input boxes that the user may have changed.
AutoPerks.setNewRatios = function() {
    var perks = document.getElementsByClassName('perkRatios');
    var currentPerk;
    for(var i = 0; i < perks.length; i++) {
        currentPerk = AutoPerks.getPerkByName(perks[i].id.substring(0, perks[i].id.length - 5)); // Remove "ratio" from the id to obtain the perk name
        currentPerk.updatedValue = parseFloat(perks[i].value);
    }

    toughness.updatedValue = resilience.updatedValue / 2;
    // Manually update tier II perks
    var tierIIPerks = AutoPerks.getTierIIPerks();
    for(var i in tierIIPerks) tierIIPerks[i].updatedValue = tierIIPerks[i].parent.updatedValue / tierIIPerks[i].relativeIncrease;
}

//get ready
AutoPerks.initialise = function() {
    var perks = AutoPerks.getOwnedPerks();  
    for(var i in perks) {
        perks[i].level = 0;
        perks[i].spent = 0;
        perks[i].updatedValue = perks[i].value;
    }
    //grab new ratios if any
    AutoPerks.setNewRatios();
    //save custom ratios if set.
    if (document.getElementById("ratioPreset").selectedIndex == document.getElementById("ratioPreset").length-1)
        AutoPerks.saveCustomRatios();
}

AutoPerks.parseData = function() {
    AutoPerks.initialise(); // Reset all fixed perks to 0 and grab new ratios if any

    var preSpentHe = 0;

    var helium = AutoPerks.getHelium();

    // Get fixed perks
    var fixedPerks = AutoPerks.getFixedPerks();
    for (var i = 0; i < fixedPerks.length; i++) {
        fixedPerks[i].level = game.portal[AutoPerks.capitaliseFirstLetter(fixedPerks[i].name)].level;
        var price = AutoPerks.calculateTotalPrice(fixedPerks[i], fixedPerks[i].level);
        fixedPerks[i].spent += price;
        preSpentHe += price;
    }

    var remainingHelium = helium - preSpentHe;
    // Get owned perks
    var perks = AutoPerks.getOwnedPerks();

    AutoPerks.spendHelium(remainingHelium, perks);
}

AutoPerks.getOwnedPerks = function() {
    var perks = [];
    for (var name in game.portal){
        perk = game.portal[name];
        if(perk.locked !== undefined || !perk.locked)
            perks.push(AutoPerks.getPerkByName(name));
    }
    return perks;
}

//NEW way: Get accurate count of helium (not able to be wrong)
AutoPerks.getHelium = function() {
    //determines if we are in the portal screen or the perk screen.
    var respecMax = (game.global.viewingUpgrades) ? game.global.heliumLeftover : game.global.heliumLeftover + game.resources.helium.owned;
    //iterates all the perks and gathers up their heliumSpent counts.
    for (var item in game.portal){
        if (game.portal[item].locked) continue;
        var portUpgrade = game.portal[item];
        if (typeof portUpgrade.level === 'undefined') continue;
        respecMax += portUpgrade.heliumSpent;
    }
    return respecMax;
}

AutoPerks.calculatePrice = function(perk, level) { // Calculate price of buying *next* level 
    if(perk.type == 'exponential') return Math.ceil(level/2 + perk.base * Math.pow(1.3, level));
    else if(perk.type == 'linear') return Math.ceil(perk.base + perk.increase * level);
}

AutoPerks.calculateTotalPrice = function(perk, finalLevel) {
    var totalPrice = 0;
    for(var i = 0; i < finalLevel; i++) {
        totalPrice += AutoPerks.calculatePrice(perk, i);
    }
    return totalPrice;
}

AutoPerks.calculateIncrease = function(perk, level) {
    var increase = 0;
    var value; // Allows for custom perk ratios.

    if(perk.updatedValue != -1) value = perk.updatedValue;
    else value = perk.value;

    if(perk.compounding) increase = perk.baseIncrease;
    else increase = (1 + (level + 1) * perk.baseIncrease) / ( 1 + level * perk.baseIncrease) - 1;
    return increase / perk.baseIncrease * value;
}

AutoPerks.spendHelium = function(helium, perks) {
    if(helium < 0) {
        console.log("Not enough helium to buy fixed perks.");
        //document.getElementById("nextCoordinated").innerHTML = "Not enough helium to buy fixed perks.";
        return;
    }
    
    var perks = AutoPerks.getVariablePerks();

    var effQueue = new FastPriorityQueue(function(a,b) { return a.efficiency > b.efficiency } ) // Queue that keeps most efficient purchase at the top
    // Calculate base efficiency of all perks
    for(var i in perks) {
        var price = AutoPerks.calculatePrice(perks[i], 0);
        var inc = AutoPerks.calculateIncrease(perks[i], 0);
        perks[i].efficiency = inc/price;
        if(perks[i].efficiency == 0) {
            console.log("Perk ratios must be positive values.");
            return;
        }
        effQueue.add(perks[i]);
    }

    var mostEff = effQueue.poll();
    var price = AutoPerks.calculatePrice(mostEff, mostEff.level); // Price of *next* purchase.
    var inc;
    while(price <= helium) {
        // Purchase the most efficient perk
        helium -= price;
        mostEff.level++;
        mostEff.spent += price; 
        // Reduce its efficiency
        inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
        mostEff.efficiency = inc/price;
        // Add back into queue run again until out of helium
        effQueue.add(mostEff);
        mostEff = effQueue.poll();
        price = AutoPerks.calculatePrice(mostEff, mostEff.level);
    }
    
	//Begin selectable dump perk code   
	var selector = document.getElementById('dumpPerk');
	var index = selector.selectedIndex;
    if(selector.value != "None") {
        var dumpPerk = AutoPerks.getPerkByName(selector[index].innerHTML);
        console.log(AutoPerks.capitaliseFirstLetter(dumpPerk.name) + " level pre-dump: " + dumpPerk.level);
        for(price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level); price <= helium; price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level)) {
            helium -= price;
            dumpPerk.spent += price;
            dumpPerk.level++;
        }
    }
    //end dump perk code.

    //re-arrange perk points and stuff
    AutoPerks.applyCalculations(perks);    
}

//Pushes the respec button, then the Clear All button, then assigns perk points based on what was calculated.
AutoPerks.applyCalculationsRespec = function(perks){ 
    // **BETA-version**: Apply calculations with respec
    if (game.global.canRespecPerks) {
        respecPerks();
    }
    if (game.global.respecActive) {
        clearPerks();
        var preBuyAmt = game.global.buyAmt;
        for(var i in perks) {
            game.global.buyAmt = perks[i].level;
            //console.log(perks[i].name + " " + perks[i].level);
            buyPortalUpgrade(AutoPerks.capitaliseFirstLetter(perks[i].name));
        }
        var FixedPerks = AutoPerks.getFixedPerks();
        for(var i in FixedPerks) {
            game.global.buyAmt = FixedPerks[i].level;
            //console.log(FixedPerks[i].name + " " + FixedPerks[i].level);
            buyPortalUpgrade(AutoPerks.capitaliseFirstLetter(FixedPerks[i].name));
        }
        game.global.buyAmt = preBuyAmt;
        numTab(1,true);
        cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
        //activateClicked();    //click OK for them (disappears the window).
    }
    else {
        console.log("Respec is not available. You used it already, try again next portal.");
        allocatorBtn1.setAttribute('class', 'settingsBtn settingBtnfalse');
        tooltip("Automatic Perk Allocation Error", "customText", event, "Respec is not available. You used it already, try again next portal. Press esc to close this tooltip." );
    }
}

//Assigns perk points without respeccing if nothing is needed to be negative.
AutoPerks.applyCalculations = function(perks){ 
    // **BETA-version**: Apply calculations without respec

    var preBuyAmt = game.global.buyAmt;
    var needsRespec = false;
    for(var i in perks) {        
        var capitalized = AutoPerks.capitaliseFirstLetter(perks[i].name);
        game.global.buyAmt = perks[i].level - game.portal[capitalized].level;
        //console.log(perks[i].name + " " + perks[i].level);
        if (perks[i].level < game.portal[capitalized].level)
            needsRespec = true;
        else
            buyPortalUpgrade(capitalized);
    }
    var FixedPerks = AutoPerks.getFixedPerks();
    for(var i in FixedPerks) {
        var capitalized = AutoPerks.capitaliseFirstLetter(FixedPerks[i].name);
        game.global.buyAmt = FixedPerks[i].level - game.portal[capitalized].level;
        //console.log(FixedPerks[i].name + " " + FixedPerks[i].level);
        if (perks[i].level < game.portal[capitalized].level)
            needsRespec = true;
        else
            buyPortalUpgrade(capitalized);
    }
    game.global.buyAmt = preBuyAmt;
    numTab(1,true);
    cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
    if (needsRespec == true){
        var whichscreen = game.global.viewingUpgrades;
        cancelPortal();
        if (whichscreen)
            viewPortalUpgrades();
        else
            portalClicked();
        AutoPerks.applyCalculationsRespec(perks);
    }

}

AutoPerks.capitaliseFirstLetter = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

AutoPerks.getPercent = function(spentHelium, totalHelium) {
    var frac = spentHelium / totalHelium;
    frac = (frac* 100).toPrecision(2);
    return frac + "%";
}

AutoPerks.lowercaseFirst = function(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
 
AutoPerks.FixedPerk = function(name, base, level, max) {
    this.id = -1;
    this.name = name;
    this.base = base;
    this.type = "exponential";
    this.fixed = true;
    this.level = level || 0;
    this.spent = 0;
    this.max = max || -1;
}

AutoPerks.VariablePerk = function(name, base, compounding, value, baseIncrease, level) {
    this.id = -1;
    this.name = name;
    this.base = base;
    this.type  = "exponential";
    this.fixed = false;
    this.compounding = compounding;
    this.value = value;
    this.updatedValue = -1;
    this.baseIncrease = baseIncrease;
    this.efficiency = -1;
    this.level = level || 0;
    this.spent = 0;
}

AutoPerks.ArithmeticPerk = function(name, base, increase, baseIncrease, parent, level) { // Calculate a way to obtain parent automatically.
    this.id = -1;
    this.name = name;
    this.base = base;
    this.increase = increase;
    this.type = "linear";
    this.fixed = false;
    this.compounding = false;
    this.baseIncrease = baseIncrease;
    this.parent = parent;
    this.relativeIncrease = parent.baseIncrease / baseIncrease;
    this.value = parent.value.map(function(me) { return me * this.relativeIncrease; });
    this.updatedValue = -1;
    this.efficiency = -1;
    this.level = level || 0;
    this.spent = 0;
}
//fixed perks.
var siphonology = new AutoPerks.FixedPerk("siphonology", 100000, 3, 3);
var anticipation = new AutoPerks.FixedPerk("anticipation", 1000, 10, 10);
var meditation = new AutoPerks.FixedPerk("meditation", 75, 7, 7);
var relentlessness = new AutoPerks.FixedPerk("relentlessness", 75, 10, 10);
var range = new AutoPerks.FixedPerk("range", 1, 10, 10);
var agility = new AutoPerks.FixedPerk("agility", 4, 20, 20);
var bait = new AutoPerks.FixedPerk("bait", 4, 30);
var trumps = new AutoPerks.FixedPerk("trumps", 3, 30);
var packrat = new AutoPerks.FixedPerk("packrat", 3, 30);
//the ratios are hardcoded into the following lines: example: looting: [20, 24, 42] as [zxv, truth, nsheetz, nsheetz(new)]
var looting = new AutoPerks.VariablePerk("looting", 1, false, [20, 24, 42, 160], 0.05);
var toughness = new AutoPerks.VariablePerk("toughness", 1, false, [0.5, 4, 1.75, 1.5], 0.05);
var power = new AutoPerks.VariablePerk("power", 1, false, [1, 4, 5, 5], 0.05);
var motivation = new AutoPerks.VariablePerk("motivation", 2, false, [1.5, 4, 4, 2.5], 0.05);
var pheromones = new AutoPerks.VariablePerk("pheromones", 3, false, [0.5, 4, 1.5, 1.5], 0.1);
var artisanistry = new AutoPerks.VariablePerk("artisanistry", 15, true, [1.5, 2, 5, 3.5], 0.1);
var carpentry = new AutoPerks.VariablePerk("carpentry", 25, true, [8, 24, 29, 18], 0.1);
var resilience = new AutoPerks.VariablePerk("resilience", 100, true, [1, 8, 3.5, 3], 0.1);
var coordinated = new AutoPerks.VariablePerk("coordinated", 150000, true, [25, 60, 100, 100], 0.1);
var resourceful = new AutoPerks.VariablePerk("resourceful", 50000, true, [2, 2, 1, 1], 0.05);
var overkill = new AutoPerks.VariablePerk("overkill", 1000000, true, [3, 3, 5, 10], 0.005);
//tier2 perks
var toughness_II = new AutoPerks.ArithmeticPerk("toughness_II", 20000, 500, 0.01, toughness);
var power_II = new AutoPerks.ArithmeticPerk("power_II", 20000, 500, 0.01, power);
var motivation_II = new AutoPerks.ArithmeticPerk("motivation_II", 50000, 1000, 0.01, motivation);
var carpentry_II = new AutoPerks.ArithmeticPerk("carpentry_II", 100000, 10000, 0.0025, carpentry);
var looting_II = new AutoPerks.ArithmeticPerk("looting_II", 100000, 10000, 0.0025, looting);


AutoPerks.getTierIIPerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder)
        if(AutoPerks.perkHolder[i].type == "linear") perks.push(AutoPerks.perkHolder[i]);
    return perks;
}

AutoPerks.getAllPerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) perks.push(AutoPerks.perkHolder[i]);
    return perks;
}

AutoPerks.getFixedPerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) 
        if(AutoPerks.perkHolder[i].fixed) perks.push(AutoPerks.perkHolder[i]);
    return perks;
}

AutoPerks.getVariablePerks = function() {
    var perks = [];
    for(var i in AutoPerks.perkHolder) 
        if(!AutoPerks.perkHolder[i].fixed) perks.push(AutoPerks.perkHolder[i]);
    return perks;
}

AutoPerks.getPerk = {};

AutoPerks.setPerks = function() {
    var perks = {};
    for(var i in AutoPerks.perkHolder)
        AutoPerks.getPerk[AutoPerks.perkHolder[i].name] = AutoPerks.perkHolder[i];
}

AutoPerks.perkHolder = [siphonology, anticipation, meditation, relentlessness, range, agility, bait, trumps, packrat, looting, toughness, power, motivation, pheromones, artisanistry, carpentry, resilience, coordinated, resourceful, overkill, 
    toughness_II, power_II, motivation_II, carpentry_II, looting_II];
AutoPerks.setPerks();

AutoPerks.getPerkByName = function(name) {
    name = AutoPerks.lowercaseFirst(name);
    return AutoPerks.getPerk[name];
}

AutoPerks.setDefaultRatios();

//populate dump perk dropdown list 
var dumpDropdown = document.getElementById('dumpPerk');
var html = "";
var dumpperks = AutoPerks.getVariablePerks();
for(var i = 0; i < dumpperks.length; i++)
    html += "<option id='"+dumpperks[i].name+"Dump'>"+AutoPerks.capitaliseFirstLetter(dumpperks[i].name)+"</option>"
html += "<option id='none'>None</option></select>";
dumpDropdown.innerHTML = html;
dumpDropdown.selectedIndex = dumpDropdown.length - 2; // Second to last element is looting_II