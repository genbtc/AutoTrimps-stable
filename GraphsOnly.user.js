// ==UserScript==
// @name         AutoTrimpsV2+genBTC-GraphsOnly
// @namespace    https://github.com/genbtc/AutoTrimps
// @version      2.1.6.4b-genbtc-3-4-2018+Mod+Uni+coderpatsy
// @description  Graphs Module (only) from AutoTrimps
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
function safeSetItems(name,data) {
    try {
        localStorage.setItem(name, data);
    } catch(e) {
      if (e.code == 22) {
        // Storage full, maybe notify user or do some clean-up
        debug("Error: LocalStorage is full, or error. Attempt to delete some portals from your graph or restart browser.");
      }
    }
}
var script = document.createElement('script');
script.id = 'AutoTrimps-script';
script.src = 'https://genbtc.github.io/AutoTrimps/Graphs.js';
document.head.appendChild(script);