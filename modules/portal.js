MODULES["portal"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["portal"].timeout = 10000;  //time to delay before autoportaling in milliseconds

/////////////////////////////////////////////////////
//Portal Related Code)///////////////////////////////
/////////////////////////////////////////////////////
var lastHeliumZone = 0;
var zonePostpone = 0;
//Decide When to Portal
function autoPortal() {
    var autoFinishDaily = (game.global.challengeActive == "Daily" && getPageSetting('AutoFinishDaily'));
    switch (autoTrimpSettings.AutoPortal.selected) {
        //portal if we have lower He/hr than the previous zone (or buffer)
        case "Helium Per Hour":
            game.stats.bestHeliumHourThisRun.evaluate();    //normally, evaluate() is only called once per second, but the script runs at 10x a second.
            if(game.global.world > lastHeliumZone) {
                lastHeliumZone = game.global.world;
                if(game.global.world > (game.stats.bestHeliumHourThisRun.atZone + zonePostpone) && game.global.world >= getPageSetting('HeHrDontPortalBefore')) {
                    zonePostpone = 0;
                    var bestHeHr = game.stats.bestHeliumHourThisRun.storedValue;
                    var myHeliumHr = game.stats.heliumHour.value();
                    var heliumHrBuffer = Math.abs(getPageSetting('HeliumHrBuffer'));
                    if(myHeliumHr < bestHeHr * (1-(heliumHrBuffer/100)) && (!game.global.challengeActive || autoFinishDaily) ) {
                        debug("My HeliumHr was: " + myHeliumHr + " & the Best HeliumHr was: " + bestHeHr + " at zone: " +  game.stats.bestHeliumHourThisRun.atZone, "general");
                        tooltip('confirm', null, 'update', '<b>Auto Portaling NOW!</b><p>Hit Confirm to WAIT 1 more zone.', 'zonePostpone+=1', '<b>NOTICE: Auto-Portaling in 10 seconds....</b>');
                        setTimeout(cancelTooltip,MODULES["portal"].timeout);
                        setTimeout(function(){
                            if (zonePostpone > 0)
                                return;
                            if (autoFinishDaily){
                                abandonDaily();
                                document.getElementById('finishDailyBtnContainer').style.display = 'none';
                            }
                            pushData();
                            if (autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                                doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                            else
                                doPortal();
                            zonePostpone = 0;
                        },MODULES["portal"].timeout+100);
                    }
                }
            }
            break;
        case "Custom":
            if (game.global.world > getPageSetting('CustomAutoPortal') &&
                (!game.global.challengeActive || autoFinishDaily) ) {
                if (autoFinishDaily) {
                    abandonDaily();
                    document.getElementById('finishDailyBtnContainer').style.display = 'none';
                }
                pushData();
                if (autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                    doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                else
                    doPortal();
            }
            break;
        case "Balance":
        case "Decay":
        case "Electricity":
        case "Crushed":
        case "Nom":
        case "Toxicity":
        case "Watch":
        case "Lead":
        case "Corrupted":
            if(!game.global.challengeActive) {
                pushData();
                doPortal(autoTrimpSettings.AutoPortal.selected);
            }
            break;
        default:
            break;
    }
}

//Actually Portal.
function doPortal(challenge) {
    if(!game.global.portalActive) return;
    try {
        if (getPageSetting('AutoMagmiteSpender2')==1)
            autoMagmiteSpender();
    } catch (err) {
        debug("Error encountered in AutoMagmiteSpender: " + err.message,"general");
    }
    portalClicked();
    if(challenge) selectChallenge(challenge);
    activateClicked();
    activatePortal();
    lastHeliumZone = 0; zonePostpone = 0;
}