MODULES["autobreedtimer"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["autobreedtimer"].buyGensIncrement = 1;     //buy this many geneticists at a time
MODULES["autobreedtimer"].fireGensIncrement = 10;   //Fire this many geneticists at a time
MODULES["autobreedtimer"].fireGensFloor = 10;       //Dont FIRE below this number (nothing to do with hiring up to it)
MODULES["autobreedtimer"].breedFireOn = 6;          //turn breedfire on at X seconds (if BreedFire)
MODULES["autobreedtimer"].breedFireOff = 2;         //turn breedfire off at X seconds(if BreedFire)
MODULES["autobreedtimer"].killTitimpStacks = 5;     //number of titimp stacks difference that must exist to Force Abandon
MODULES["autobreedtimer"].voidCheckPercent = 95;    //Void Check health %, for force-Abandon during voidmap, if it dips below this during the Void  (maybe this should be in automaps module)

//Controls "Auto Breed Timer" and "Geneticist Timer" - adjust geneticists to reach desired breed timer
function autoBreedTimer() {
    var customVars = MODULES["autobreedtimer"];
    var fWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    if(getPageSetting('ManageBreedtimer')) {
        if(game.portal.Anticipation.level == 0) setPageSetting('GeneticistTimer',0);
        else if(game.global.challengeActive == 'Electricity' || game.global.challengeActive == 'Mapocalypse') setPageSetting('GeneticistTimer',3.5);
        else if(game.global.challengeActive == 'Nom' || game.global.challengeActive == 'Toxicity') {

            if(getPageSetting('FarmWhenNomStacks7') && game.global.gridArray[99].nomStacks >= 5 && !game.global.mapsActive) {
                //if Improbability already has 5 nomstacks, do 30 antistacks.
                setPageSetting('GeneticistTimer',30);
                //actually buy them here because we can't wait.
                safeBuyJob('Geneticist', 1+(autoTrimpSettings.GeneticistTimer.value - getBreedTime())*2);
            }
            else
                setPageSetting('GeneticistTimer',10);
        }
        else setPageSetting('GeneticistTimer',30);
    }
    var inDamageStance = game.upgrades.Dominance.done ? game.global.formation == 2 : game.global.formation == 0;
    var inScryerStance = (game.global.world >= 60 && game.global.highestLevelCleared >= 180) && game.global.formation == 4;
    //(inDamageStance||inScryerStance);
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    //if we need to hire geneticists
    //Don't hire geneticists if total breed time remaining is greater than our target breed time
    //Don't hire geneticists if we have already reached 30 anti stacks (put off further delay to next trimp group)
    if (targetBreed > getBreedTime() && !game.jobs.Geneticist.locked && targetBreed > getBreedTime(true) && (game.global.lastBreedTime/1000 + getBreedTime(true) < autoTrimpSettings.GeneticistTimer.value) && game.resources.trimps.soldiers > 0 && !breedFire) {
        //insert 10% of total food limit here? or cost vs tribute?
        //if there's no free worker spots, fire a farmer
        if (fWorkers < customVars.buyGensIncrement)
            //do some jiggerypokery in case jobs overflow and firing -workers does 0 (java integer overflow)
            safeFireJob('Farmer', customVars.buyGensIncrement);
        if (canAffordJob('Geneticist', false, customVars.buyGensIncrement)) {
            //hire a geneticist
            safeBuyJob('Geneticist', customVars.buyGensIncrement);
        }
    }
    //if we need to speed up our breeding
    //if we have potency upgrades available, buy them. If geneticists are unlocked, or we aren't managing the breed timer, just buy them
    if ((targetBreed < getBreedTime() || !game.jobs.Geneticist.locked || !getPageSetting('ManageBreedtimer') || game.global.challengeActive == 'Watch') && game.upgrades.Potency.allowed > game.upgrades.Potency.done && canAffordTwoLevel('Potency') && getPageSetting('BuyUpgrades')) {
        buyUpgrade('Potency');
    }
    //otherwise, if we have some geneticists, start firing them
    else if ((targetBreed*1.02 < getBreedTime() || targetBreed*1.02 < getBreedTime(true)) && !game.jobs.Geneticist.locked && game.jobs.Geneticist.owned > customVars.fireGensFloor) {
        safeBuyJob('Geneticist', -1*customVars.fireGensIncrement);
        //debug('fired (10) geneticists');
    }
    //if our time remaining to full trimps is still too high, fire some jobs to get-er-done
    //needs option to toggle? advanced options?
    else if ((targetBreed < getBreedTime(true) || (game.resources.trimps.soldiers == 0 && getBreedTime(true) > customVars.breedFireOn)) && breedFire == false && getPageSetting('BreedFire') && game.global.world > 10) {
        breedFire = true;
    }

    //reset breedFire once we have less than 2 seconds remaining
    if(getBreedTime(true) < customVars.breedFireOff) breedFire = false;

    //Force Abandon Code (AutoTrimpicide):
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var nextgrouptime = (game.global.lastBreedTime/1000);
    if  (targetBreed > 30) targetBreed = 30; //play nice with custom timers over 30.
    var newstacks = nextgrouptime >= targetBreed ? targetBreed : nextgrouptime;
    //kill titimp if theres less than (5) seconds left on it or, we stand to gain more than (5) antistacks.
    var killTitimp = (game.global.titimpLeft < customVars.killTitimpStacks || (game.global.titimpLeft >= customVars.killTitimpStacks && newstacks - game.global.antiStacks >= customVars.killTitimpStacks))
    if (game.portal.Anticipation.level && game.global.antiStacks < targetBreed && game.resources.trimps.soldiers > 0 && killTitimp) {
        //if a new fight group is available and anticipation stacks aren't maxed, force abandon and grab a new group
        if (newSquadRdy && nextgrouptime >= targetBreed) {
            forceAbandonTrimps();
        }
        //if we're sitting around breeding forever and over (5) anti stacks away from target.
        else if (nextgrouptime >= 60 && newstacks - game.global.antiStacks >= customVars.killTitimpStacks) {
            forceAbandonTrimps();
        }
    }
}

//Abandon trimps function that should handle all special cases.
function abandonVoidMap() {
    var customVars = MODULES["autobreedtimer"];
    //do nothing if the button isnt set to on.
    if (!getPageSetting('ForceAbandon')) return;
    //exit out of the voidmap if we go back into void-farm-for-health mode (less than 95%, account for some leeway during equipment buying.)
    if (game.global.mapsActive && getCurrentMapObject().location == "Void") {        
        var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
        if(voidCheckPercent < customVars.voidCheckPercent) {
            //only exit if it happened for reasons other than random losses of anti-stacks.
            if (game.portal.Anticipation.level) {
                if (targetBreed == 0 || targetBreed == -1)
                    mapsClicked(true);
                else if (game.global.antiStacks == targetBreed)
                    mapsClicked(true);
            }
            else
                mapsClicked(true);
        }
        return;
    }
}
//Abandon trimps function that should handle all special cases.
function forceAbandonTrimps() {
    //do nothing if the button isnt set to on.
    if (!getPageSetting('ForceAbandon')) return;
    //dont if <z6 (no button)
    if (!game.global.mapsUnlocked) return;
    //dont if were in a voidmap
    if (game.global.mapsActive && getCurrentMapObject().location == "Void") return;
    //dont if were on map-selection screen.
    if (game.global.preMapsActive) return;
    //dont if we are in spire:
    if (game.global.world == 200 && game.global.spireActive && !game.global.mapsActive) return;
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    if (getPageSetting('AutoMaps')) {
        mapsClicked();
        //force abandon army
        if (game.global.switchToMaps || game.global.switchToWorld)
            mapsClicked();
    }
    //in map without automaps
    else if (game.global.mapsActive) {
        mapsClicked();
        if (game.global.switchToMaps)
            mapsClicked();
        runMap();
    }
    //in world without automaps
    else  {
        mapsClicked();
        if (game.global.switchToMaps)
            mapsClicked();
        mapsClicked();
    }
    debug("Killed your army! (to get " + targetBreed + " Anti-stacks). Trimpicide successful.","other");
}