MODULES["buildings"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["buildings"].nursCostRatio = 0.05;   //nursery to warpstation/collector cost ratio. Also for extra gems.
MODULES["buildings"].storageMainCutoff = 0.85;      //when to buy more storage. (85% )
MODULES["buildings"].storageLowlvlCutoff1 = 0.7;    //when to buy more storage at zone 1
MODULES["buildings"].storageLowlvlCutoff2 = 0.5;    //when to buy more storage from zone 2-10   (more leeway so it doesnt fill up)

var housingList = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation'];

//An error-resilient function that will actually purchase buildings and return a success status
function safeBuyBuilding(building) {
    if (isBuildingInQueue(building)) return false;
    //check if building is locked, or else it can buy 'phantom' buildings and is not exactly safe.
    if (game.buildings[building].locked)
        return false;
    preBuy();
    //build 2 at a time if we have the mastery for it.
    //Note: Bypasses any "Max" caps by 1 if they are odd numbers and we can afford the 2nd one.
    if (game.talents.doubleBuild.purchased) {
        game.global.buyAmt = 2;
        if (!canAffordBuilding(building)) {
            game.global.buyAmt = 1;
            if (!canAffordBuilding(building)) {
                postBuy();
                return false;
            }
        }
    }
    else {
        game.global.buyAmt = 1;
        if (!canAffordBuilding(building)) {
            postBuy();
            return false;
        }
    }
    game.global.firing = false;
    if (building == 'Gym' && getPageSetting('GymWall')){
        game.global.buyAmt = 1;
    }
    //buy max warpstations when we own <2 (ie: after a new giga)
    //thereafter, buy only 1 warpstation
    if (building == 'Warpstation'){
        if (game.buildings.Warpstation.owned < 2) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
        } else {
            game.global.buyAmt = 1;
        }
        buyBuilding(building, true, true);
        debug('Building ' + game.global.buyAmt + ' ' + building + 's', "buildings", '*rocket');
        postBuy();
        return;
    }
    debug('Building ' + building, "buildings", '*hammer2');
    buyBuilding(building, true, true);
    postBuy();
    return true;
}


//Outlines the most efficient housing based on gems (credits to Belaith)
function highlightHousing() {
    var allHousing = ["Mansion", "Hotel", "Resort", "Gateway", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (var house in allHousing) {
        if (game.buildings[allHousing[house]].locked === 0) {
            unlockedHousing.push(allHousing[house]);
        }
    }
    if (unlockedHousing.length) {
        var obj = {};
        for (var house in unlockedHousing) {
            var building = game.buildings[unlockedHousing[house]];
            var cost = 0;
            cost += getBuildingItemPrice(building, "gems", false, 1);
            var ratio = cost / building.increase.by;
            //don't consider Gateway if we can't afford it right now - hopefully to prevent game waiting for fragments to buy gateway when collector could be bought right now
            if(unlockedHousing[house] == "Gateway" && !canAffordBuilding('Gateway')) continue;
            obj[unlockedHousing[house]] = ratio;
            document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
        }
        var keysSorted = Object.keys(obj).sort(function(a, b) {
            return obj[a] - obj[b];
        });
        bestBuilding = null;
        //loop through the array and find the first one that isn't limited by max settings
        for (var best in keysSorted) {
            var max = getPageSetting('Max' + keysSorted[best]);
            if (max === false) max = -1;
            if (game.buildings[keysSorted[best]].owned < max || max == -1) {
                bestBuilding = keysSorted[best];
                document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
                if (getPageSetting('WarpstationCap') && bestBuilding == "Warpstation") {
                    //Warpstation Cap - if we are past the basewarp+deltagiga level, "cap" and just wait for next giga.
                    if (game.buildings.Warpstation.owned >= (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')))
                        bestBuilding = null;
                }
                var warpwallpct = getPageSetting('WarpstationWall3');
                if (warpwallpct > 1 && bestBuilding == "Warpstation") {
                    //Warpstation Wall - allow only warps that cost 1/n'th less then current metal (try to save metal for next prestige)
                    if (getBuildingItemPrice(game.buildings.Warpstation, "metal", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.metal.owned / warpwallpct))
                        bestBuilding = null;
                }
                break;
            }
        }
    } else {
        bestBuilding = null;
    }
}

//Helper function to buy best "Food" Buildings
function buyFoodEfficientHousing() {
    var houseWorth = game.buildings.House.locked ? 0 : game.buildings.House.increase.by / getBuildingItemPrice(game.buildings.House, "food", false, 1);
    var hutWorth = game.buildings.Hut.increase.by / getBuildingItemPrice(game.buildings.Hut, "food", false, 1);
    var hutAtMax = (game.buildings.Hut.owned >= autoTrimpSettings.MaxHut.value && autoTrimpSettings.MaxHut.value != -1);
    //if hutworth is more, but huts are maxed , still buy up to house max
    if ((houseWorth > hutWorth || hutAtMax) && canAffordBuilding('House') && (game.buildings.House.owned < autoTrimpSettings.MaxHouse.value || autoTrimpSettings.MaxHouse.value == -1)) {
        safeBuyBuilding('House');
    } else {
        if (!hutAtMax) {
            safeBuyBuilding('Hut');
        }
    }
}

//Main Decision Function that determines cost efficiency and Buys all housing (gems), or calls buyFoodEfficientHousing, and also non-storage buildings (Gym, Tribute, Nursery)s
function buyBuildings() {
    var customVars = MODULES["buildings"];
    
    //Preemptively halt all building purchases during Trapper if any kind of AT autobattle is on and pop < 75%, or vanilla autobattle is on and pop < 100% to help avoid prolonged stalling
    if(game.global.challengeActive == 'Trapper' && (getPageSetting('BetterAutoFight') != 0 && game.resources.trimps.owned < game.resources.trimps.realMax() * .75 || !game.global.pauseFight && game.resources.trimps.owned < game.resources.trimps.realMax())) return;

    if(game.global.world!=1 && ((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist")))
        return;
    highlightHousing();

    //if housing is highlighted
    if (bestBuilding !== null) {
        if (!safeBuyBuilding(bestBuilding)) {
            buyFoodEfficientHousing();
        }
    } else {
        buyFoodEfficientHousing();
    }

    if(getPageSetting('MaxWormhole') > 0 && game.buildings.Wormhole.owned < getPageSetting('MaxWormhole') && !game.buildings.Wormhole.locked) safeBuyBuilding('Wormhole');

    //Buy non-housing buildings
    if (!game.buildings.Gym.locked && (getPageSetting('MaxGym') > game.buildings.Gym.owned || getPageSetting('MaxGym') == -1)) {
        var gymwallpct = getPageSetting('GymWall');
        var skipGym = false;
        if (gymwallpct > 1) {
            //Gym Wall - allow only gyms that cost 1/n'th less then current wood (try to save wood for nurseries for new z230+ Magma nursery strategy)
            if (getBuildingItemPrice(game.buildings.Gym, "wood", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.wood.owned / gymwallpct))
                skipGym = true;
        }
        if (getPageSetting('DynamicGyms')) {
            //getBattleStats calculation comes from battlecalc.js and shows the tooltip-table block amount. calcBadGuyDmg is in that file also
            if (!game.global.preMapsActive && getBattleStats("block",true) > calcBadGuyDmg(getCurrentEnemy(),null,true,true))
                skipGym = true;
        }
        if (needGymystic) skipGym = true;
        if (!skipGym)
            safeBuyBuilding('Gym');
    }
    if (!game.buildings.Tribute.locked && (getPageSetting('MaxTribute') > game.buildings.Tribute.owned || getPageSetting('MaxTribute') == -1)) {
        safeBuyBuilding('Tribute');
    }
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    //NoNurseriesUntil', 'No Nurseries Until z', 'For Magma z230+ purposes. Nurseries get shut down, and wasting nurseries early on is probably a bad idea. Might want to set this to 230+ as well.'
    var nursminlvl = getPageSetting('NoNurseriesUntil');
    if (game.global.world < nursminlvl)
        return;
    //only buy nurseries if enabled,   and we need to lower our breed time, or our target breed time is 0, or we aren't trying to manage our breed time before geneticists, and they aren't locked
    //even if we are trying to manage breed timer pre-geneticists, start buying nurseries once geneticists are unlocked AS LONG AS we can afford a geneticist (to prevent nurseries from outpacing geneticists soon after they are unlocked)
    if ((targetBreed < getBreedTime() || targetBreed <= 0 ||
        (targetBreed < getBreedTime(true) && game.global.challengeActive == 'Watch') ||
        (!game.jobs.Geneticist.locked && canAffordJob('Geneticist', false, 1))) && !game.buildings.Nursery.locked)
    {
        var nwr = customVars.nursCostRatio; //nursery to warpstation/collector cost ratio. Also for extra gems.
        var nursCost = getBuildingItemPrice(game.buildings.Nursery, "gems", false, 1);
        var warpCost = getBuildingItemPrice(game.buildings.Warpstation, "gems", false, 1);
        var collCost = getBuildingItemPrice(game.buildings.Collector, "gems", false, 1);
        var resomod = Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level);    //need to apply the resourceful mod when comparing anything other than building vs building.
        //buy nurseries irrelevant of warpstations (after we unlock them) - if we have enough extra gems that its not going to impact anything. note:(we will be limited by wood anyway - might use a lot of extra wood)
        var buyWithExtraGems = (!game.buildings.Warpstation.locked && nursCost * resomod < nwr * game.resources.gems.owned);
        //refactored the old calc, and added new buyWithExtraGems tacked on the front
        if ((getPageSetting('MaxNursery') > game.buildings.Nursery.owned || getPageSetting('MaxNursery') == -1) &&
            ( buyWithExtraGems ||
            ((nursCost < nwr * warpCost || game.buildings.Warpstation.locked) &&
             (nursCost < nwr * collCost || game.buildings.Collector.locked || !game.buildings.Warpstation.locked))
            )
           )
        {
            safeBuyBuilding('Nursery');
        }
    }
}

//Buys more storage if resource is over 85% full (or 50% if Zone 2-10) (or 70% if zone==1)
function buyStorage() {
    var customVars = MODULES["buildings"];
    var packMod = 1 + game.portal.Packrat.level * game.portal.Packrat.modifier;
    var Bs = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };
    for (var B in Bs) {
        var jest = 0;
        var owned = game.resources[Bs[B]].owned;
        var max = game.resources[Bs[B]].max * packMod;
        max = calcHeirloomBonus("Shield", "storageSize", max);
        if(game.global.mapsActive && game.unlocks.imps.Jestimp) {
            jest = simpleSeconds(Bs[B], 45);
            jest = scaleToCurrentMap(jest);
        }
        if ((game.global.world==1 && owned > max * customVars.storageLowlvlCutoff1) || 
            (game.global.world >= 2 && game.global.world < 10 && owned > max * customVars.storageLowlvlCutoff2) || 
            (owned + jest > max * customVars.storageMainCutoff)) {
            // debug('Buying ' + B + '(' + Bs[B] + ') at ' + Math.floor(game.resources[Bs[B]].owned / (game.resources[Bs[B]].max * packMod * 0.99) * 100) + '%');
            if (canAffordBuilding(B) && game.triggers[B].done) {
                safeBuyBuilding(B);
            }
        }
    }
}
