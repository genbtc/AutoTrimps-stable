//Create blank AutoPerks object
AutoPerks = {};

//Import the Library
var head = document.getElementsByTagName('head')[0];
var queuescript = document.createElement('script');
queuescript.type = 'text/javascript';
queuescript.src = 'https://genbtc.github.io/AutoTrimps/FastPriorityQueue.js';
head.appendChild(queuescript);

//Create and Add button to Trimps Perk Window
var buttonbar = document.getElementById("portalWrapper");
var btnParent = document.createElement("DIV");
btnParent.id = 'allocatorBtnContainer';
btnParent.setAttribute('style', 'display: inline-block; margin-left: 1vw; margin-right: 1vw; margin-bottom: 1vw; margin-top: 1vw; width: 10vw;');
var allocatorBtn1 = document.createElement("DIV");
allocatorBtn1.id = 'allocatorBTN1';
if (game.global.canRespecPerks) {
    allocatorBtn1.setAttribute('class', 'settingsBtn settingBtntrue');
    allocatorBtn1.setAttribute('onclick', 'AutoPerks.parseData()');
}
else
    allocatorBtn1.setAttribute('class', 'settingsBtn settingBtnfalse');
allocatorBtn1.textContent = 'Automatically Allocate Perks';
btnParent.appendChild(allocatorBtn1);
buttonbar.appendChild(btnParent);

//Create all perk customRatio boxes in Trimps perk window.
AutoPerks.createInput = function(perkname,div) {
    var perk1input = document.createElement("Input");
    perk1input.id = perkname + 'Ratio';
    perk1input.setAttribute('style', 'text-align: center; width: 60px; color: black;');
    var perk1label = document.createElement("Label");
    perk1label.id = perkname + 'Label';
    perk1label.innerHTML = perkname;
    perk1label.setAttribute('style', 'margin-right: 1vw; center; width: 120px; ');
    //add to the div.
    div.appendChild(perk1input);
    div.appendChild(perk1label);
}
var customRatios = document.createElement("DIV");
customRatios.id = 'customRatios';
var ratios1 = document.createElement("DIV");
ratios1.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
AutoPerks.createInput("Overkill",ratios1);
AutoPerks.createInput("Resourceful",ratios1);
AutoPerks.createInput("Coordinated",ratios1);
AutoPerks.createInput("Resilience",ratios1);
AutoPerks.createInput("Carpentry",ratios1);
var ratios2 = document.createElement("DIV");
ratios2.setAttribute('style', 'display: inline-block; text-align: left; width: 100%');
AutoPerks.createInput("Artisanistry",ratios2);
AutoPerks.createInput("Pheromones",ratios2);
AutoPerks.createInput("Motivation",ratios2);
AutoPerks.createInput("Power",ratios2);
AutoPerks.createInput("Looting",ratios2);
customRatios.appendChild(ratios1);
customRatios.appendChild(ratios2);
// var challengecol = document.getElementById("challengeCol");
// challengecol.appendChild(customRatios);
buttonbar.appendChild(customRatios);

//BEGIN AUTOPERKS SCRIPT CODE:>
AutoPerks.calculatePrice = function(perk, level) { // Calculate price of buying *next* level 
	if(perk.type == 'exponential') return Math.ceil(level/2 + perk.base * Math.pow(1.3, level));
	else if(perk.type == 'linear') return Math.ceil(perk.base + perk.increase * level);
}

AutoPerks.calculateTotalPrice = function(perk, finalLevel) {
	var totalPrice = 0;
	for(var i = 0; i < finalLevel; i++) {
		totalPrice += AutoPerks.calculatePrice(perk, i)
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

AutoPerks.initialise = function() {
	var perks = AutoPerks.getOwnedPerks();	
	for(var i in perks) {
		perks[i].level = 0;
		perks[i].spent = 0;
        perks[i].updatedValue = perks[i].value;
	}
    toughness.updatedValue = resilience.updatedValue / 2;
    // Manually update tier II perks
    var tierIIPerks = AutoPerks.getTierIIPerks();
    for(var i in tierIIPerks) tierIIPerks[i].updatedValue = tierIIPerks[i].parent.updatedValue / tierIIPerks[i].relativeIncrease;    
}

AutoPerks.parseData = function() {
	AutoPerks.initialise(); // Reset all fixed perks to 0
	var preSpentHe = 0;
	//helium = game.global.totalHeliumEarned;    // == AutoPerks.getHelium(true)  //use this when respeccing at portaling (call with argument=true)
    var helium = AutoPerks.getHelium()   //for respec during this run we need to cancel out this run

	// Get owned perks
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

AutoPerks.getHelium = function(portal) {
    if (portal)
        return game.global.totalHeliumEarned;
    else
        return game.global.totalHeliumEarned - game.resources.helium.owned;
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
	var totalHelium = AutoPerks.getHelium();
    
    AutoPerks.applyCalculations(perks);
    
    //TODO: Use Dump perks and all that (sitting in bottom of this file).
}


AutoPerks.applyCalculations = function(perks){ 
	// **BETA-version**: Apply calculations
    if (game.global.canRespecPerks) {
        respecPerks();
    }
    if (game.global.respecActive) {
        clearPerks();
        var preBuyAmt = game.global.buyAmt;
        for(var i in perks) {
            game.global.buyAmt = perks[i].level;
            console.log(perks[i].name + " " + perks[i].level);
            buyPortalUpgrade(AutoPerks.capitaliseFirstLetter(perks[i].name));
        }
        var FixedPerks = AutoPerks.getFixedPerks();
        for(var i in FixedPerks) {
            game.global.buyAmt = FixedPerks[i].level;
            console.log(FixedPerks[i].name + " " + FixedPerks[i].level);
            buyPortalUpgrade(AutoPerks.capitaliseFirstLetter(FixedPerks[i].name));
        }
        game.global.buyAmt = preBuyAmt;
        cancelTooltip();    //displays the last perk we bought's tooltip without this. idk why.
        //activateClicked();    //click OK for them (disappears the window).
    }
    else {
        console.log("Respec is not available. You used it already, try again next portal.");
        allocatorBtn1.setAttribute('class', 'settingsBtn settingBtnfalse');
        tooltip("Automatic Perk Allocation Error", "customText", event, "Respec is not available. You used it already, try again next portal. Press esc to close this tooltip." );
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

// Thanks to genr8_ for refactoring this!
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
	this.value = parent.value * this.relativeIncrease;
	this.updatedValue = -1;
	this.efficiency = -1;
	this.level = level || 0;
	this.spent = 0;
}

var siphonology = new AutoPerks.FixedPerk("siphonology", 100000, 3, 3);
var anticipation = new AutoPerks.FixedPerk("anticipation", 1000, 10, 10);
var meditation = new AutoPerks.FixedPerk("meditation", 75, 7, 7);
var relentlessness = new AutoPerks.FixedPerk("relentlessness", 75, 10, 10);
var range = new AutoPerks.FixedPerk("range", 1, 10, 10);
var agility = new AutoPerks.FixedPerk("agility", 4, 20, 20);
var bait = new AutoPerks.FixedPerk("bait", 4, 30);
var trumps = new AutoPerks.FixedPerk("trumps", 3, 30);
var packrat = new AutoPerks.FixedPerk("packrat", 3, 30);

var looting = new AutoPerks.VariablePerk("looting", 1, false, 20, 0.05);
var toughness = new AutoPerks.VariablePerk("toughness", 1, false, 1, 0.05);
var power = new AutoPerks.VariablePerk("power", 1, false, 1, 0.05);
var motivation = new AutoPerks.VariablePerk("motivation", 2, false, 1.5, 0.05);
var pheromones = new AutoPerks.VariablePerk("pheromones", 3, false, 0.5, 0.1);
var artisanistry = new AutoPerks.VariablePerk("artisanistry", 15, true, 1.5, 0.1);
var carpentry = new AutoPerks.VariablePerk("carpentry", 25, true, 8, 0.1);
var resilience = new AutoPerks.VariablePerk("resilience", 100, true, 1, 0.1);
var coordinated = new AutoPerks.VariablePerk("coordinated", 150000, true, 25, 0.1);
var resourceful = new AutoPerks.VariablePerk("resourceful", 50000, true, 2, 0.05);
var overkill = new AutoPerks.VariablePerk("overkill", 1000000, true, 3, 0.005);

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

function lastpartfromSpendHelium(){
    //left off from var totalHelium = AutoPerks.getHelium();
    
	var nextCoordAt = totalHelium - helium // Need to initialise this before rounding.

	var roundFlag = true; //document.getElementById("roundTier_II").checked;
	var perksII = AutoPerks.getTierIIPerks();
	var preLevels = perksII.map(function(me) { return me.level; }); // To restore levels for "next coordinated" calculations.
	var preSpent = perksII.map(function(me) { return me.spent; }); // To restore levels for "next coordinated" calculations.
	var buffer = new Array(5);
	var diff = new Array(5);
	for(var i = 0; i < buffer.length; i++) {
		diff[i] = 0;
		buffer[i] = 0;
	}
	
	if(roundFlag) {
		// Calculate price of rounding up or down to nearest multiple of 10.
		for(var i = 0; i < perksII.length; i++) {
			diff[i] = perksII[i].level % 10;
			if(diff[i] >= 5) { // Round up
				diff[i] = 10 - diff[i];  // Maps 5 -> 5, 6 -> 4, 7 -> 3 etc. 
				for(var j = 0; j < diff[i]; j++)
					buffer[i] += AutoPerks.calculatePrice(perksII[i], perksII[i].level + j);
			} else { // Round down
				diff[i] = -diff[i];
				for(var j = -1; j >= diff[i]; j--)
					buffer[i] -= AutoPerks.calculatePrice(perksII[i], perksII[i].level + j);
			}
		}
		var tempCost = 0;
		for(var i = 0; i < buffer.length; i++) tempCost += buffer[i];
		if(tempCost <= helium) {
			for(var i in perksII) {
				perksII[i].level += diff[i];
				perksII[i].spent += buffer[i]
			}
			helium -= tempCost;
		} else { // Can't afford to round up and down, so round everything down.
			console.log("Rounding Down");
			for(var i in perksII) {
				perksII[i]
			}
			buffer = 0;
			diff = toughness_II.level % 10;
			for(var i = 0; i < diff; i++) {
				toughness_II.level--;
				buffer = AutoPerks.calculatePrice(toughness_II, toughness_II.level);
				toughness_II.spent -= buffer;
				helium += buffer;
			}
			diff = power_II.level % 10;
			for(var i = 0; i < diff; i++) {
				power_II.level--;
				buffer = AutoPerks.calculatePrice(power_II, power_II.level);
				power_II.spent -= buffer;
				helium += buffer;
			}
			diff = motivation_II.level % 10;
			for(var i = 0; i < diff; i++) {
				motivation_II.level--;
				buffer = AutoPerks.calculatePrice(motivation_II, motivation_II.level);
				motivation_II.spent -= buffer;
				helium += buffer;
			}
			diff = carpentry_II.level % 10;
			for(var i = 0; i < diff; i++) {
				carpentry_II.level--;
				buffer = AutoPerks.calculatePrice(carpentry_II, carpentry_II.level);
				carpentry_II.spent -= buffer;
				helium += buffer;
			}
			diff = looting_II.level % 10;
			for(var i = 0; i < diff; i++) {
				looting_II.level--;
				buffer = AutoPerks.calculatePrice(looting_II, looting_II.level);
				looting_II.spent -= buffer;
				helium += buffer;
			}
		}
	}

    /*
	for(var i in perks) {
		document.getElementById(perks[i].name + "Level").value = perks[i].level; // set the final levels for each perk
		document.getElementById(perks[i].name + "Spent").innerHTML = " " + capitaliseFirstLetter(perks[i].name) + " (" + getPercent(perks[i].spent, totalHelium) + " of total helium)";
	}
    */
	
	// Rounding should not affect "next coordinated" calculations.
	if(roundFlag) {
		toughness_II.level = preLevels[0];
		power_II.level = preLevels[1];
		motivation_II.level = preLevels[2];
		carpentry_II.level = preLevels[3];
		looting_II.level = preLevels[4];
	}

    /*
	// Initiate dump perk prep and save for use after calculating next Coordinated
	var selector = document.getElementById('dumpPerk').getElementsByTagName('select')[0];
	var index = selector.selectedIndex;
	var dumpFlag = true; 
	if(selector.value != "None") { // Only dump if "none" is not selected.
		var dumpPerk = AutoPerks.getPerkByName(selector[index].innerHTML);
		var dumpLevel = dumpPerk.level;
		console.log(capitaliseFirstLetter(dumpPerk.name) + " level pre-dump: " + dumpPerk.level);
	}
	else dumpFlag = false;
    */
	// Initiate dump perk prep and save for use after calculating next Coordinated
	var index = 0;
	var dumpFlag = true;
    var dumpPerk = AutoPerks.getPerkByName("Looting_II");
    var dumpLevel = dumpPerk.level;
	
	// Calculate when next Coordinated
	var heliumNeeded = 0;
	var coordOwned = false;
	for(var i = 0; i < perks.length; i++) {
		if(perks[i].name == "coordinated") coordOwned = true;
	}
	
	if(coordOwned) {
		while(mostEff.name != "coordinated") {
			heliumNeeded += price;
			mostEff.level++;
			// Reduce its efficiency
			inc = AutoPerks.calculateIncrease(mostEff, mostEff.level);
			price = AutoPerks.calculatePrice(mostEff, mostEff.level);
			mostEff.efficiency = inc/price;
			// Add back into queue run again until out of helium
			effQueue.add(mostEff);
			mostEff = effQueue.poll();
			price = AutoPerks.calculatePrice(mostEff, mostEff.level);
		}
		heliumNeeded += price;
	}

	nextCoordAt += heliumNeeded;
	var length = Math.floor(Math.log(nextCoordAt)/Math.log(10));
	var suffix = "";
	var bigFlag = false; // For numbers larger than 1000T
	if(length < 3) suffix = "";
	else if(length < 6) suffix = "K";
	else if(length < 9) suffix = "M";
	else if(length < 12) suffix = "B";
	else if(length < 15) suffix = "T";
	else bigFlag = true;
	if(!bigFlag) {
		var pow = Math.floor(length / 3);
		nextCoordAt = (nextCoordAt/Math.pow(1000, pow)).toPrecision(3);
	}
	if(coordOwned) document.getElementById("nextCoordinated").innerHTML = "Next Coordinated at: " + nextCoordAt + suffix;
	else document.getElementById("nextCoordinated").innerHTML = "";
	if(dumpFlag) {
		// Reload dump perk level and commence dumping.
		dumpPerk.level = dumpLevel;
		for(price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level); price <= helium; price = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level)) {
			helium -= price;
			dumpPerk.spent += price;
			dumpPerk.level++;
		}

		if(roundFlag  && dumpPerk.type == "linear") { // Can't round up at this stage, so round down.
			buffer = 0;
			diff = dumpPerk.level % 10;
			for(var i = 0; i < diff; i++) {	
				dumpPerk.level--;
				buffer = AutoPerks.calculatePrice(dumpPerk, dumpPerk.level);
				dumpPerk.spent -= buffer;
			}
		}
		document.getElementById(dumpPerk.name + "Level").value = dumpPerk.level;
		document.getElementById(dumpPerk.name + "Spent").innerHTML = " " + capitaliseFirstLetter(dumpPerk.name) + " (" + getPercent(dumpPerk.spent, totalHelium) + " of total helium)";
	}
	//storeData();
}