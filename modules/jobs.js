
function safeBuyJob(jobTitle, amount) {
    if (amount === undefined) amount = 1;
    if (amount === 0) return false;
    preBuy();
    if (amount < 0) {
        amount = Math.abs(amount);
        game.global.firing = true;
        game.global.buyAmt = amount;
    } else{
        game.global.firing = false;
        game.global.buyAmt = amount;
        //if can afford, buy what we wanted,
        if (!canAffordJob(jobTitle, false)){
            game.global.buyAmt = 'Max'; //if we can't afford it, just use 'Max'. -it will always succeed-
            game.global.maxSplit = 1;
        }
    }
    debug((game.global.firing ? 'Firing ' : 'Hiring ') + prettify(game.global.buyAmt) + ' ' + jobTitle + 's', "jobs", "*users");
    buyJob(jobTitle, true, true);
    postBuy();
    return true;
}

function safeFireJob(job,amount) {
    //do some jiggerypokery in case jobs overflow and firing -1 worker does 0 (java integer overflow)
    var oldjob = game.jobs[job].owned;
    if (oldjob == 0 || amount == 0)
        return 0;
    var test = oldjob;
    var x = 1;
    if (amount != null)
        x = amount;
    if (!Number.isSafeInteger(oldjob)){
        while (oldjob == test) {
            test-=x;
            x*=2;
        }
    }
    preBuy();
    game.global.firing = true;
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    while (x >= 1 && freeWorkers == Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed) {
        game.global.buyAmt = x;
        buyJob(job, true, true);
        x*=2;
    }
    postBuy();
    return x/2;
}


//Hires and Fires all workers (farmers/lumberjacks/miners/scientists/trainers/explorers)
function buyJobs() {
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    var farmerRatio = parseInt(getPageSetting('FarmerRatio'));
    var lumberjackRatio = parseInt(getPageSetting('LumberjackRatio'));
    var minerRatio = parseInt(getPageSetting('MinerRatio'));
    var totalRatio = farmerRatio + lumberjackRatio + minerRatio;
    var scientistRatio = totalRatio / 25;
    if (game.jobs.Farmer.owned < 100) {
        scientistRatio = totalRatio / 10;
    }

    //FRESH GAME LOWLEVEL NOHELIUM CODE.
    if (game.global.world == 1 && game.global.totalHeliumEarned<=1000){
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9){
            if (game.resources.food.owned > 5 && freeWorkers > 0){
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned)
                    safeBuyJob('Farmer', 1);
                else if (game.jobs.Farmer.owned > game.jobs.Lumberjack.owned && !game.jobs.Lumberjack.locked)
                    safeBuyJob('Lumberjack', 1);
            }
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (game.resources.food.owned > 20 && freeWorkers > 0){
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned && !game.jobs.Miner.locked)
                    safeBuyJob('Miner', 1);
            }
        }
        return;
    //make sure the game always buys at least 1 farmer, so we can unlock lumberjacks.
    } else if (game.jobs.Farmer.owned == 0 && game.jobs.Lumberjack.locked && freeWorkers > 0) {
        safeBuyJob('Farmer', 1);
    //make sure the game always buys 10 scientists.
    } else if (game.jobs.Scientist.owned < 10 && scienceNeeded > 100)
        safeBuyJob('Scientist', 10);
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    if (game.global.challengeActive == 'Watch'){
        scientistRatio = totalRatio / 10;
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire){
            //so the game buys scientists first while we sit around waiting for breed timer.
            var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
            if (game.jobs.Scientist.owned < buyScientists && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.1){
                var toBuy = buyScientists-game.jobs.Scientist.owned;
                var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
                if((buyScientists > 0 && freeWorkers > 0) && (getPageSetting('MaxScientists') > game.jobs.Scientist.owned || getPageSetting('MaxScientists') == -1))
                    safeBuyJob('Scientist', toBuy <= canBuy ? toBuy : canBuy);
            }
            else
                return;
        }
    }
    else
    {   //exit if we are havent bred to at least 90% breedtimer yet...
        var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire) {
            if (breeding > game.resources.trimps.realMax() * 0.33) {
                //do Something tiny, so earlygame isnt stuck on 0 (down to 33% trimps. stops getting stuck from too low.)
                safeBuyJob('Miner', 1);
                safeBuyJob('Farmer', 1);
                safeBuyJob('Lumberjack', 1);
            }
            return;
        }
        //continue if we have >90% breedtimer:
    }
    var subtract = 0;
    //used multiple times below: (good job javascript for allowing functions in functions)
    function checkFireandHire(job,amount) {
        freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
        if (amount === null)
            amount = 1;
        if (freeWorkers < amount)
            subtract = safeFireJob('Farmer');
        if (canAffordJob(job, false, amount) && !game.jobs[job].locked)
            safeBuyJob(job, amount);
    }
    //Scientists:
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    if (getPageSetting('HireScientists') && !game.jobs.Scientist.locked && !breedFire) {
        var buyScientists = Math.floor((scientistRatio / totalRatio) * totalDistributableWorkers) - game.jobs.Scientist.owned - subtract;
        if((buyScientists > 0 && freeWorkers > 0) && (getPageSetting('MaxScientists') > game.jobs.Scientist.owned || getPageSetting('MaxScientists') == -1))
            safeBuyJob('Scientist', buyScientists);
    }
    //Trainers:
    if (getPageSetting('MaxTrainers') > game.jobs.Trainer.owned || getPageSetting('MaxTrainers') == -1) {
        // capped to tributes percentage.
        var trainerpercent = getPageSetting('TrainerCaptoTributes');
        if (trainerpercent > 0) {
            var curtrainercost = game.jobs.Trainer.cost.food[0]*Math.pow(game.jobs.Trainer.cost.food[1], game.jobs.Trainer.owned);
            var curtributecost = getBuildingItemPrice(game.buildings.Tribute, "food", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level);
            if (curtrainercost < curtributecost * (trainerpercent/100))
                checkFireandHire('Trainer');
        }
        // regular
        else
            checkFireandHire('Trainer');
    }
    //Explorers:
    if (getPageSetting('MaxExplorers') > game.jobs.Explorer.owned || getPageSetting('MaxExplorers') == -1) {
        checkFireandHire('Explorer');
    }

    //Buy Farmers:
    //Buy/Fire Miners:
    //Buy/Fire Lumberjacks:
    function ratiobuy(job, jobratio) {
        if(!game.jobs[job].locked && !breedFire) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
            var toBuy = Math.floor((jobratio / totalRatio) * totalDistributableWorkers) - game.jobs[job].owned - subtract;
            var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
            var amount = toBuy <= canBuy ? toBuy : canBuy;
            safeBuyJob(job, amount);
/*             if (amount > 0)
                debug("Jobbing: " + job + " " + amount); */
            return true;
        }
        else
            return false;
    }
    ratiobuy('Farmer', farmerRatio);
    if (!ratiobuy('Miner', minerRatio) && breedFire && game.global.turkimpTimer === 0)
        safeBuyJob('Miner', game.jobs.Miner.owned * -1);
    if (!ratiobuy('Lumberjack', lumberjackRatio) && breedFire)
        safeBuyJob('Lumberjack', game.jobs.Lumberjack.owned * -1);

    //Magmamancers code:
    if (game.jobs.Magmamancer.locked) return;
    //game.jobs.Magmamancer.getBonusPercent(true);
    var timeOnZone = Math.floor((new Date().getTime() - game.global.zoneStarted) / 60000);
    var stacks2 = Math.floor(timeOnZone / 10);
    if (getPageSetting('AutoMagmamancers') && stacks2 > tierMagmamancers) {
        preBuy();
        game.global.firing = false;
        game.global.buyAmt = 'Max';
        game.global.maxSplit = .1;
        //fire dudes to make room.
        var firesomedudes = calculateMaxAfford(game.jobs['Magmamancer'], false, false, true);
        if (game.jobs.Farmer.owned > firesomedudes)
            safeFireJob('Farmer', firesomedudes);
        else if (game.jobs.Lumberjack.owned > firesomedudes)
            safeFireJob('Lumberjack', firesomedudes);
        else if (game.jobs.Miner.owned > firesomedudes)
            safeFireJob('Miner', firesomedudes);
        //buy the Magmamancers
        buyJob('Magmamancer', true, true);
        postBuy();
        debug("Bought " + firesomedudes + ' Magmamancers', "other", "*users");
        tierMagmamancers += 1;
    }
    else if (stacks2 < tierMagmamancers) {
        tierMagmamancers = 0;
    }
}
var tierMagmamancers = 0;


function workerRatios() {
    if (game.buildings.Tribute.owned > 3000 && mutations.Magma.active()) {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '12';
        autoTrimpSettings.MinerRatio.value = '12';
    } else if (game.buildings.Tribute.owned > 1500) {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '2';
        autoTrimpSettings.MinerRatio.value = '22';
    } else if (game.buildings.Tribute.owned > 1000) {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '10';
    } else if (game.resources.trimps.realMax() > 3000000) {
        autoTrimpSettings.FarmerRatio.value = '3';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '4';
    } else if (game.resources.trimps.realMax() > 300000) {
        autoTrimpSettings.FarmerRatio.value = '3';
        autoTrimpSettings.LumberjackRatio.value = '3';
        autoTrimpSettings.MinerRatio.value = '5';
    } else {
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '1';
    }
    if (game.global.challengeActive == 'Watch'){
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '1';
    }
}