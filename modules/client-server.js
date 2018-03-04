var ATServer = 
{
	SERVER_IP: '207.246.77.188',
    SERVER_HOSTNAME: 'autotrimps.site'
}


/*
	Usage-example (NOTE: ASYNCHRONOUS): 

	ATServer.GetID(function(id) 
	{ 
		console.log(id); 
	});

*/

ATServer.GetID = function(callback)
{
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			callback(JSON.parse(req.responseText).data.id);
		}
	}

	req.open('GET', 'https://' + ATServer.SERVER_HOSTNAME, true);
	req.setRequestHeader('req', 'get_id');
	req.send();
}

/*
	Usage-example (NOTE: ASYNCHRONOUS): 

	ATServer.SaveData('ff6e3508-cb6a-4042-8170-8ea1178d3175', {"test": 123}, function(response) 
	{ 
		console.log(response); 
	});

*/

ATServer.SaveData = function(id, data, callback)
{
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			callback(JSON.parse(req.responseText));
		}
	}

	req.open('POST', 'https://' + ATServer.SERVER_HOSTNAME + '?id=' + id, true);
	req.setRequestHeader('req', 'save_data');
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(data));
}

var ulData = {
    version: autoTrimpSettings.ATversion,
    settings: autoTrimpSettings
}

ATServer.Upload = function(data)
{
    ATServer.GetID(function(id) 
    { 
        ATServer.SaveData(id, data, function(response) 
        { 
            console.log(response);
        });
    });
}
ATServer.UploadSettings = function() {
    ATServer.Upload(ulData);
    console.log("AutoTrimps Settings File was Uploaded for analytics/usage!");
}();