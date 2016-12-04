//"Auto Gather/Build"
function manualLabor() {
    //vars
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
    var trapTrimpsOK = getPageSetting('TrapTrimps');
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    
    //FRESH GAME LOWLEVEL NOHELIUM CODE.
    if (game.global.world <=3 && game.global.totalHeliumEarned<=1000) {
        if (game.global.buildingsQueue.length == 0 && (game.global.playerGathering != 'trimps' || game.buildings.Trap.owned == 0)){
            if (!game.triggers.wood.done || game.resources.food.owned < 10 || Math.floor(game.resources.food.owned) < Math.floor(game.resources.wood.owned)) {
                setGather('food');
                return;
            }
            else {
                setGather('wood');
                return;
            }
        }
    }
    //Traps and Trimps
    if (trapTrimpsOK && (breedingTrimps < 5 || targetBreed < getBreedTime(true))) {
        if (game.buildings.Trap.owned > 0) { 
            setGather('trimps');//gatherTrimps = true;
            return;
        }
        if (game.buildings.Trap.owned == 0 && canAffordBuilding('Trap'))
            safeBuyBuilding('Trap');//buyTraps = true;
    }
    //Buildings:
    //if we have more than 2 buildings in queue, or (our modifier is real fast and trapstorm is off), build
    if ((!game.talents.foreman.purchased && (game.global.buildingsQueue.length ? (game.global.buildingsQueue.length > 1 || game.global.autoCraftModifier == 0 || (getPlayerModifier() > 1000 && game.global.buildingsQueue[0] != 'Trap.1')) : false)) || 
    //if trapstorm is off (likely we havent gotten it yet, the game is still early, buildings take a while to build ), then Prioritize Storage buildings when they hit the front of the queue (should really be happening anyway since the queue should be >2(fits the clause above this), but in case they are the only object in the queue.)
    (!game.global.trapBuildToggled && (game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Forge.1')) || 
    //Build more traps if we have TrapTrimps on, and we own less than 1000 traps.
    (trapTrimpsOK && game.global.trapBuildToggled && game.buildings.Trap.owned < 1000)) {
        setGather('buildings');//buildBuildings = true;
        return;
    }
    //Sciencey:    
    //if we have some upgrades sitting around which we don't have enough science for, gather science
    if (document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        //if we have less than a minute of science
        if (game.resources.science.owned < 100 || (game.resources.science.owned < getPsString('science', true) * 60 && game.global.turkimpTimer < 1))
            if (getPageSetting('ManualGather2') != 2) {
                setGather('science');
                return;
            }
        if (game.resources.science.owned < scienceNeeded) {
            //if manual is less than science production and turkimp, metal. (or science is set as disallowed)
            if ((getPlayerModifier() < getPerSecBeforeManual('Scientist') && game.global.turkimpTimer > 0) || getPageSetting('ManualGather2') == 2)
                setGather('metal');
            else if (getPageSetting('ManualGather2') != 2) {
                setGather('science');
                return;
            }
        }
    }
    //If we got here, without exiting, gather Normal Resources:
    var manualResourceList = {
        'food': 'Farmer',
        'wood': 'Lumberjack',
        'metal': 'Miner',
    };
    var lowestResource = 'food';
    var lowestResourceRate = -1;
    var haveWorkers = true;
    for (var resource in manualResourceList) {
        var job = manualResourceList[resource];
        var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
        // debug('Current rate for ' + resource + ' is ' + currentRate + ' is hidden? ' + (document.getElementById(resource).style.visibility == 'hidden'));
        if (document.getElementById(resource).style.visibility != 'hidden') {
            //find the lowest resource rate
            if (currentRate === 0) {
                currentRate = game.resources[resource].owned;
                // debug('Current rate for ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                    // debug('New Lowest1 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
                    haveWorkers = false;
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
            if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                // debug('New Lowest2 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                lowestResource = resource;
                lowestResourceRate = currentRate;
            }
        }
        // debug('Current Stats ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
    }

    if (game.global.playerGathering != lowestResource && !haveWorkers && !breedFire) {
        if (game.global.turkimpTimer > 0)
            setGather('metal');
        else
            setGather(lowestResource);//gather the lowest resource
    } else if (game.global.turkimpTimer > 0)
        setGather('metal');
    else
        setGather(lowestResource);
    //ok
    return true;
}