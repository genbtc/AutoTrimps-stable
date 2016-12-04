//Activate Robo Trimp
function autoRoboTrimp() {
    //exit if the cooldown is active, or we havent unlocked robotrimp.
    if (game.global.roboTrimpCooldown > 0 || !game.global.roboTrimpLevel) return;
    var robotrimpzone = parseInt(getPageSetting('AutoRoboTrimp'));
    //exit if we have the setting set to 0
    if (robotrimpzone == 0) return;
    //activate the button when we are above the cutoff zone, and we are out of cooldown (and the button is inactive)
    if (game.global.world >= robotrimpzone && !game.global.useShriek){
        magnetoShriek();
        debug("Activated Robotrimp MagnetoShriek Ability", "other", '*podcast');
    }
}

//Version 3.6 Golden Upgrades
function autoGoldenUpgrades() {
    //get the numerical value of the selected index of the dropdown box
    try {
        var setting = document.getElementById('AutoGoldenUpgrades').value;
        if (setting == "Off") return;   //if disabled, exit.
        var num = getAvailableGoldenUpgrades();
        if (num == 0) return;       //if we have nothing to buy, exit.
        //buy one upgrade per loop.
        buyGoldenUpgrade(setting);
    } catch(err) { debug("Error in autoGoldenUpgrades: " + err.message); }
}

//Exits the Spire after completing the specified cell.
function exitSpireCell() {
    if(game.global.world == 200 && game.global.spireActive && game.global.lastClearedCell >= getPageSetting('ExitSpireCell')-1)
        endSpire();
}

//Auto Magmite spender before portal
function autoMagmiteSpender() {
    var didSpend = false;
    //Part #1:
    //list of available permanent one-and-done upgrades
    var permanames = ["Slowburn","Shielding","Storage","Hybridization"];
    //cycle through:
    for (var i=0; i < permanames.length; i++) {
        var item = permanames[i];
        var upgrade = game.permanentGeneratorUpgrades[item];
        if (typeof upgrade === 'undefined')
            return; //error-resistant
        //skip owned perma-upgrades
        if (upgrade.owned)
            continue;
        var cost = upgrade.cost;
        //if we can afford anything, buy it:
        if (game.global.magmite >= cost) {
            buyPermanentGeneratorUpgrade(item);
            debug("Auto Spending " + cost + " Magmite on: " + item, "general");
            didSpend = true;
        }
    }
    //Part #2
    var repeat = true;
    while (repeat) {
        try {
            //list of available multi upgrades
            var names = ["Efficiency","Capacity","Supply"];
            var lowest = [null,null];   //keep track of cheapest one
            //cycle through:
            for (var i=0; i < names.length; i++) {
                var item = names[i];
                var upgrade = game.generatorUpgrades[item];
                if (typeof upgrade === 'undefined')
                    return; //error-resistant
                var cost = upgrade.cost();
                //store the first upgrade once
                if (lowest[1] == null)
                    lowest = [item,cost];
                //always load cheapest one in.
                else if (cost < lowest[1])
                    lowest = [item,cost];
            }
            //if we can afford anything, buy it:
            if (game.global.magmite >= lowest[1]) {
                buyGeneratorUpgrade(lowest[0]);
                debug("Auto Spending " + lowest[1] + " Magmite on: " + lowest[0] + " #" + game.generatorUpgrades[lowest[0]].upgrades, "general");
                didSpend = true;
            }
            //if we can't, exit the loop
            else
                repeat = false;
        }
        //dont get trapped in a while loop cause something stupid happened.
        catch (err) {
            debug("AutoSpendMagmite Error encountered: " + err.message,"general");
            repeat = false;
        }
    }
    //print the result
    if (didSpend)
        debug("Leftover magmite: " + game.global.magmite,"general");
    return;
}
