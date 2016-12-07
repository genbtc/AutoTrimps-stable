// ==UserScript==
// @name         AutoTrimpsV2+genBTC-GraphsOnly
// @namespace    http://tampermonkey.net/
// @version      2.1.3.8-genbtc-12-6-2016-GraphsOnly
// @description  try to take over the world!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
var script = document.createElement('script');
script.id = 'AutoTrimps-script';
script.src = 'https://genbtc.github.io/AutoTrimps/Graphs.js';
document.head.appendChild(script);