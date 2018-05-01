var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-1.10.2.min.js');
(document.head || document.documentElement).appendChild(j);

var g = document.createElement('script');
g.src = chrome.extension.getURL('gmail.js');
(document.head || document.documentElement).appendChild(g);

var s = document.createElement('script');
s.src = chrome.extension.getURL('main.js');
(document.head || document.documentElement).appendChild(s);

/**
* The category names we will be using are as follows:
* 1. miscl. -- Any miscellaneous emails that don't belong to one of the categories above (anything that we can't generate a generic response to)
* 2. conflicts -- Anything related to midterm/final scheduling conflicts
* 3. attendance -- 
* 4. hw -- Anything related to homework (e.g. submissions)
* 5. enrollment -- Anything related to Calcentral/course enrollment issues
* 6. `internal`-- Anything related to course logistics, hiring, or other administrative issues
* 7. dsp 
* 8. regrades
*/


var emailLabelDict = {
	1 : 'Miscellaneous',
	2 : 'Conflicts',
	3 : 'Attendance',
	4 : 'Homework',
	5 : 'Enrollment',
	6 : 'Internal',
	7 : 'DSP',
	8 : 'Regrades'
};

var labelColorDict = {
	1 : '#f77189',
 	2 : '#ce9032',
 	3 : '#97a431',
 	4 : '#32b166',
 	5 : '#36ada4',
 	6 : '#39a7d0',
 	7 : '#a48cf4',
 	8 : '#f561dd'
};

var labelColorDict_l = {
 	1 : '#db5f57',
 	2 : '#dbc257',
 	3 : '#91db57',
 	4 : '#57db80',
 	5 : '#57d3db',
 	6 : '#5770db',
 	7 : '#a157db',
 	8 : '#db57b2'
};

var labelColorDict_1 = {
 	1 : '#e08a85',
 	2 : '#e0cf85',
 	3 : '#ade085',
 	4 : '#85e0a1',
 	5 : '#85dbe0',
 	6 : '#8596e0',
 	7 : '#b885e0',
 	8 : '#e085c4'
}


InboxSDK.load('1', 'sdk_autoreply_c87f866c58').then(function(sdk){

	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){

		// a compose view has come into existence, do something with it!
		composeView.addButton({
			title: "Generate Draft",
			iconUrl: chrome.runtime.getURL('images/compose.png'), //<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
			// onClick: generateDraft(event),
			onClick: function(event) {
				generateDraft(event);
			},
		});
	});

	sdk.Conversations.registerThreadViewHandler(threadView => {
		const el = document.createElement("div");
		el.innerHTML = 'Hello world!';

		threadView.addSidebarContentPanel({
			title: 'Sidebar Example',
			iconUrl: chrome.runtime.getURL('images/analytics.png'),
			el
		});
	});

	chrome.runtime.onConnect.addListener(function (port) {
  		console.assert(port.name == "getEmailThread");
  		port.onMessage.addListener(function (msg) {
    		if (msg.joke == "Knock knock")
    			port.postMessage({question: "Who's there?"})
    			consolge.log(msg.answer);
  		});
	});

	sdk.Lists.registerThreadRowViewHandler(function(threadRowView) {

		//for (var i = 0; i < visibleThreads.legnth; i++) {
			//var sender = visibleThreads[i].sender;
			//var currentUserEmail = sdk.User.getEmailAddress();
			//console.log(i);
		// 	if (getBerkeleyEmail(sender, currentUserEmail)) {
		// 		addEmailLabelToThreadRow(threadRowView, visibleThreads[i]);
		// 	}
		//}
		var contacts = threadRowView.getContacts();
		for (var i = 0; i < contacts.length; i++) {
			var contact = contacts[i];
			//console.log(contact);
			if (getBerkeleyEmail(contact, sdk.User.getEmailAddress())) {
				addEmailLabelToThreadRow(threadRowView, contact.emailAddress);
      			//addEmailIndicatorToThreadRow(threadRowView, contact.emailAddress);
      		}
		}
	});
});

function generateDraft(event) {
	email_body = 'Hello , \n\n this is an automated email generated by Autoreply. Thank you for using our services. \n\n -Autobot'
	event.composeView.insertTextIntoBodyAtCursor(email_body);
}

function addEmailIndicatorToThreadRow(threadRowView, email) {
	threadRowView.addImage({
		imageUrl: chrome.runtime.getURL('images/checked.png'), //<div>Icons made by <a href="https://www.flaticon.com/authors/maxim-basinski" title="Maxim Basinski">Maxim Basinski</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
		tooltip: email,
    imageClass: 'rounded_check'
	});
}

function getBerkeleyEmail(contact, currentUserEmail) {
	if (contact.emailAddress.split("@")[1] === currentUserEmail.split("@")[1]) {
		return true;
	} else {
		return false;
	}
}


function classifyEmail(emailData) {
	// Send Request to Model 
	// var label;
	// var xhr = new XMLHttpRequest();
	// var url = "https://email-reply-bot.herokuapp.com/predict";
	// xhr.open("POST", url, true);
	// xhr.setRequestHeader("Content-Type", "application/json");
	// xhr.onreadystatechange = function () {
	//     if (xhr.readyState === 4 && xhr.status === 200) {
	//         var json = JSON.parse(xhr.responseText);
	//         console.log(json.label);
	//         label = json.label;
	//     }
	// };
	// var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
	// xhr.send(data);

	// return label; // 
	return Math.floor(Math.random() * 8) + 1;
}

/**
* Add label icon to each threadRowView
* @param threadRowView : current threadRow in view
* @param emailData : emailData of current thread
*/
function addEmailLabelToThreadRow(threadRowView, emailData) {
	var emailClass = classifyEmail(emailData); //int class of label
	var label = emailLabelDict[emailClass]; // label string
	var labelColor = labelColorDict_1[emailClass]; // HEX val of label color

	threadRowView.addLabel({
		title: label,
		foregroundColor: '#ffffff',
		backgroundColor: labelColor,
		iconUrl: chrome.runtime.getURL('images/tag_64.png')
	});
}

// Asynchronous hpptGet function
// function httpGetAsync(theUrl, callback)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
//     xmlHttp.send(null);
// }
