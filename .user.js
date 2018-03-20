// ==UserScript==
// @name         AutoTrimps-genBTC
// @namespace    https://github.com/genbtc/AutoTrimps
// @version      2.1.6.6-genbtc-3-13-2018+Mod+Uni+coderpatsy
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC
// @include        *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-script';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://genbtc.github.io/AutoTrimps/AutoTrimps2.js';
document.head.appendChild(script);
