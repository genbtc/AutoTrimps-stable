MODULES["import-export"] = {};
//2018 AutoTrimps - genBTC, copied from SettingsGUI.js
//Create settings profile selection dropdown box in DOM. (import/export section)
function settingsProfileMakeGUI() {
    var settingsProfilesLabel = document.createElement("Label");
    settingsProfilesLabel.id = 'settingsProfiles Label';
    settingsProfilesLabel.innerHTML = "Settings Profile: ";
    if (game.options.menu.darkTheme.enabled == 2) settingsProfilesLabel.setAttribute("style", "margin-left: 1.2vw; margin-right: 0.8vw; color: #C8C8C8; font-size: 0.8vw;");
    else settingsProfilesLabel.setAttribute("style", "margin-left: 1.2vw; margin-right: 0.8vw; color:white; font-size: 0.8vw;");
    var settingsProfiles = document.createElement("select");
    settingsProfiles.id = 'settingsProfiles';
    settingsProfiles.setAttribute('class', 'noselect');
    settingsProfiles.setAttribute('onchange', 'settingsProfileDropdownHandler()');
    var oldstyle = 'text-align: center; width: 160px; font-size: 1.1vw;';
    if(game.options.menu.darkTheme.enabled != 2) settingsProfiles.setAttribute("style", oldstyle + " color: black;");
    else settingsProfiles.setAttribute('style', oldstyle);
    //Create settings profile selection dropdown
    var settingsProfilesButton = document.createElement("Button");
    settingsProfilesButton.id = 'settingsProfiles Button';
    settingsProfilesButton.setAttribute('class', 'btn btn-info');
    settingsProfilesButton.innerHTML = "&lt;Delete Profile";
    settingsProfilesButton.setAttribute('style', 'margin-left: 0.5vw; margin-right: 0.5vw; font-size: 0.8vw;');    
    settingsProfilesButton.setAttribute('onclick','onDeleteProfile()');
    //Add the settingsProfiles dropdown to UI
    var ietab = document.getElementById('Import Export');
    ietab.insertBefore(settingsProfilesLabel, ietab.childNodes[2]);
    ietab.insertBefore(settingsProfiles, ietab.childNodes[3]);
    ietab.insertBefore(settingsProfilesButton, ietab.childNodes[4]);
    //populate with a Default (read default settings):
    var innerhtml = "<option id='customProfileCurrent'>Current</option>";    
    //populate with a Default (read default settings):
    innerhtml += "<option id='customProfileDefault'>Defaults</option>";
    //Append a 2nd default item named "Save New..." and have it tied to a write function();
    innerhtml += "<option id='customProfileNew'>Save New...</option>";
    //dont forget to populate the rest of it with stored items:
    settingsProfiles.innerHTML = innerhtml;
}
settingsProfileMakeGUI();

//This should switch into the new profile when the dropdown is selected.
//called by "onchange" of the profile dropdown
function settingsProfileDropdownHandler() {
    var sp = document.getElementById("settingsProfiles");
    if (sp == null) return;
    var index = sp.selectedIndex;
    var id = sp.options[index].id;
    //Current: placeholder.
    if (id == 'customProfileCurrent') {
        index = 0;   //do nothing.
    }
    //Default: simply calls Reset To Default:
    if (id == 'customProfileDefault')
    {
        resetAutoTrimps();
        index = 1;
    }
    //Save new...: asks a name and saves new profile
    else if (id == 'customProfileNew')
    {
        ImportExportTooltip('NameSettingsProfiles');  //calls nameAndSaveNewProfile() below
        index = (sp.length-1);
    }
    //Reads the existing profile name and switches into it.
    // TODO: validation?
    else if (id == 'customProfileRead') {        
        var profname = sp.options[index].text;
        //load the stored profiles from browser
        var loadLastProfiles = JSON.parse(localStorage.getItem('ATSelectedSettingsProfile'));
        if (loadLastProfiles != null) {
            var results = loadLastProfiles.filter(function(elem,i){
                return elem.name == profname;
            });
            if (results.length > 0) {
                resetAutoTrimps(results[0].data,profname);
                debug("Successfully loaded existing profile: " + profname);
            }
        }
    }
    //Wait 200ms for everything to reset and then re-select the old index.
    setTimeout(function(){var sp = document.getElementById("settingsProfiles");sp.selectedIndex = index;},200);
}

//called by ImportExportTooltip('NameSettingsProfiles')
function nameAndSaveNewProfile() {
    //read the name in from tooltip
    try {
        var profname = document.getElementById("setSettingsNameTooltip").value.replace(/[\n\r]/gm, "");
        if (profname == null) {
            debug("Error in naming, the string is empty.");
            return;
        }
    } catch (err) {
        debug("Error in naming, the string is bad." + err.message);
        return;
    }
    var profile = {
        name: profname,
        data: JSON.parse(serializeSettings())
    }
    //load the old data in,
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    //rewrite the updated array in
    var presetlists = [profile];
    //add the two arrays together, string them, and store them.
    safeSetItems('ATSelectedSettingsProfile', JSON.stringify(oldpresets.concat(presetlists)));
    debug("Successfully created new profile: " + profile.name);
    ImportExportTooltip('message', 'Successfully created new profile: ' + profile.name);
    //Update dropdown menu to reflect new name:
    let optionElementReference = new Option(profile.name);
    optionElementReference.id = 'customProfileRead';
    var sp = document.getElementById("settingsProfiles");
    if (sp == null) return;
    sp.add(optionElementReference);
    sp.selectedIndex = sp.length-1;
}

//event handler for profile delete button
function onDeleteProfile() {
    var sp = document.getElementById("settingsProfiles");
    if (sp == null) return;
    var index = sp.selectedIndex;
    //Remove the option
    sp.options.remove(index);
    //Stay on the same index (becomes next item) - so we dont have to Toggle into a new profile again and can keep chain deleting.
    sp.selectedIndex = (index > (sp.length-1)) ? sp.length-1 : index;
    //load the old data in:
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    //rewrite the updated array in. string them, and store them.
    var target = (index-3); //subtract the 3 default choices out
    oldpresets.splice(target, 1);
    safeSetItems('ATSelectedSettingsProfile', JSON.stringify(oldpresets));
    debug("Successfully deleted profile #: " + target);
}

//Populate dropdown menu with list of AT SettingsProfiles
function initializeSettingsProfiles() {
    var sp = document.getElementById("settingsProfiles");
    if (sp == null) return;
    //load the old data in:
    var loadLastProfiles = localStorage.getItem('ATSelectedSettingsProfile');
    var oldpresets = loadLastProfiles ? JSON.parse(loadLastProfiles) : new Array(); //load the import.
    oldpresets.forEach(function(elem){
        //Populate dropdown menu to reflect new name:
        let optionElementReference = new Option(elem.name);
        optionElementReference.id = 'customProfileRead';
        sp.add(optionElementReference);        
    });
    sp.selectedIndex = 0;
}
initializeSettingsProfiles();


//Handler for the popup/tooltip window for Import/Export/Default
function ImportExportTooltip(what, event) {
    if (game.global.lockTooltip)
        return;
    var elem = document.getElementById("tooltipDiv");
    swapClass("tooltipExtra", "tooltipExtraNone", elem);
    var ondisplay = null; // if non-null, called after the tooltip is displayed
    var tooltipText;
    var costText = "";
    var titleText = what;
    if (what == "ExportAutoTrimps") {
        tooltipText = "This is your AUTOTRIMPS save string. There are many like it but this one is yours. Save this save somewhere safe so you can save time next time. <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + serializeSettings() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportAutoTrimps") {
        //runs the loadAutoTrimps() function.
        tooltipText = "Import your AUTOTRIMPS save string! It'll be fine, I promise.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); loadAutoTrimps();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "DefaultAutoTrimps") {
        resetAutoTrimps();
        tooltipText = "Autotrimps has been successfully reset to its defaults! ";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
        debug(tooltipText, "other");
    } else if (what == "CleanupAutoTrimps") {
        cleanupAutoTrimps();
        tooltipText = "Autotrimps saved-settings have been attempted to be cleaned up. If anything broke, refreshing will fix it, but check that your settings are correct! (prestige in particular)";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == "ExportModuleVars") {
        tooltipText = "These are your custom Variables. The defaults have not been included, only what you have set... <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + exportModuleVars() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportModuleVars") {
        tooltipText = "Enter your Autotrimps MODULE variable settings to load, and save locally for future use between refreshes:<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); importModuleVars();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "ResetModuleVars") {
        resetModuleVars();
        tooltipText = "Autotrimps MODULE variable settings have been successfully reset to its defaults!";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == 'MagmiteExplain') {
        tooltipText = "<img src='" + basepath + "mi.png'>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>Thats all the help you get.</div></div>";
    } else if (what == 'NameSettingsProfiles') {
        //Shows a Question Popup to set the name:
        titleText = "Enter New Settings Profile Name"
        tooltipText = "What would you like the name of the Settings Profile to be?<br/><br/><textarea id='setSettingsNameTooltip' style='width: 100%' rows='1'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); nameAndSaveNewProfile();'>Import</div><div class='btn btn-info' onclick='cancelTooltip();document.getElementById(\"settingsProfiles\").selectedIndex=0;'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('setSettingsNameTooltip').focus();
        };
    } else if (what == 'message') {
        titleText = "Generic message";
        tooltipText = event;
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    }
    //Common:
    game.global.lockTooltip = true;
    elem.style.left = "33.75%";
    elem.style.top = "25%";
    document.getElementById("tipTitle").innerHTML = titleText;
    document.getElementById("tipText").innerHTML = tooltipText;
    document.getElementById("tipCost").innerHTML = costText;
    elem.style.display = "block";
    if (ondisplay !== null)
        ondisplay();
}
//reset autotrimps to defaults (also handles imports)
function resetAutoTrimps(imported,profname) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpSettings');
        //delete,remake,init defaults, recreate everything:
        autoTrimpSettings = imported ? imported : new Object(); //load the import.
        var settingsrow = document.getElementById("settingsRow");
        settingsrow.removeChild(document.getElementById("autoSettings"));
        automationMenuSettingsInit();
        initializeAllTabs();
        initializeAllSettings();
        initializeSettingsProfiles();
        updateCustomButtons();
        saveSettings();
        checkPortalSettings();
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
    if (imported) {
        debug("Successfully imported new AT settings...");
        if (profname)   //pass in existing profile name to use:
            ImportExportTooltip("message", "Successfully Imported Autotrimps Settings File!: " + profname);    
        else            //or prompt to create a new name:
            ImportExportTooltip('NameSettingsProfiles');
    } else {
        debug("Successfully reset AT settings to Defaults...");
        ImportExportTooltip("message", "Autotrimps has been successfully reset to its defaults!");
    }
}

//import autotrimps settings from a textbox
//For importing a new AT Config on the fly and reloading/applying all the settings.
function loadAutoTrimps() {
    //try the import
    try {
        var thestring = document.getElementById("importBox").value.replace(/[\n\r]/gm, "");
        var tmpset = JSON.parse(thestring);
        if (tmpset == null) {
            debug("Error importing AT settings, the string is empty.");
            return;
        }
    } catch (err) {
        debug("Error importing AT settings, the string is bad." + err.message);
        return;
    }
    debug("Importing new AT settings file...");
    resetAutoTrimps(tmpset);
}

//remove stale values from past autotrimps versions
function cleanupAutoTrimps() {
    for (var setting in autoTrimpSettings) {
        var elem = document.getElementById(autoTrimpSettings[setting].id);
        if (elem == null)
            delete autoTrimpSettings[setting];
    }
}

//export MODULE variables to a textbox
function exportModuleVars() {
    return JSON.stringify(compareModuleVars());
}

//diff two modules to find the difference;
function compareModuleVars() {
    var diffs = {};
    var mods = Object.keys(MODULES);
    for (var i=0,leni=mods.length;i<leni;i++) {
        var vars = Object.keys(MODULES[mods[i]]);
        for (var j=0,lenj=vars.length;j<lenj;j++) {
            var a = MODULES[mods[i]][vars[j]];
            var b = MODULESdefault[mods[i]][vars[j]];
            if (JSON.stringify(a)!=JSON.stringify(b)) {
                if (diffs[mods[i]] === undefined)
                    diffs[mods[i]] = {};
                diffs[mods[i]][vars[j]] = a;
            }
        }
    }
    //console.log(diffs);
    return diffs;
}

//import MODULE variables from a textbox
function importModuleVars() {
    //try the import
    try {
        var thestring = document.getElementById("importBox").value;
        var strarr = thestring.split(/\n/);
        for (var line in strarr) {
            var s = strarr[line];
            s = s.substring(0, s.indexOf(';')+1); //cut after the ;
            s = s.replace(/\s/g,'');    //regexp remove ALL(/g) whitespaces(\s)
            eval(s);
            strarr[line] = s;
        }
        var tmpset = compareModuleVars();
    } catch (err) {
        debug("Error importing MODULE vars, the string is bad." + err.message);
        return;
    }
    localStorage.removeItem('ATMODULES');
    safeSetItems('ATMODULES', JSON.stringify(tmpset));
}

//reset MODULE variables to default, (and/or then import)
function resetModuleVars(imported) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('ATMODULES');
        MODULES = JSON.parse(JSON.stringify(MODULESdefault));
        //load everything again, anew
        safeSetItems('ATMODULES', JSON.stringify(ATMODULES));
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}