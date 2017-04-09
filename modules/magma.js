
/**
 * Auto Generator:
 * [Early Mode (autogen2)]
 * -> (Reach Z / optimal fuel from Supply) ->
 * [Late Mode (for now: switch to primary mode)] // soon: autogen3
 */
function autoGenerator() {
  const world = game.global.world;
  if (world < 230)
    return; // Magma only

  const endZ = getPageSetting('AutoGen2End');
  const endS = getPageSetting('AutoGen2SupplyEnd');
  var endEarly = (endZ > 0 && world >= endZ) || (endS && world >= (230 + game.generatorUpgrades.Supply.upgrades));
  if (endEarly) {
    //if (autoGenerator3);
    changeGeneratorState(getPageSetting('AutoGen3'));
  } else autoGenerator2();
}

/** Early Mode */
function autoGenerator2() {
  const FUEL = 0, MI = 1, HYBRID = 2;
  // Respect overrides first.
  if (getPageSetting('AutoGen2Override')) {
    const overriden = overrides();
    if (overriden)
      return changeGeneratorState(overriden == 1 ? FUEL : HYBRID);
  }
  const mode = getPageSetting('AutoGen2');
  if (!mode) // Default: move on
    return;

  const fuel = game.global.magmaFuel;
  const want = mode == 1 ? getFuelBurnRate() : getGeneratorFuelCap();
  if (game.global.generatorMode) { // Currently: Gain Mi
    if (fuel < want)
      changeGeneratorState(game.permanentGeneratorUpgrades.Hybridization.owned ? HYBRID : FUEL);
  } else if (fuel >= want) // Not gaining Mi when we should
    changeGeneratorState(MI);
}

/**
 * Apply the necessary tweaks the user wants.
 * @return false or 0 if unnecessary; 1 fuel; 2 hybrid
 */
function overrides() {
  return (game.global.runningChallengeSquared && getPageSetting('AutoGenC2')) || (game.global.dailyChallenge.seed && getPageSetting('AutoGenDC'));
}
