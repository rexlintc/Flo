// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete') {
//     chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
//       thisToken = token
//       chrome.runtime.onMessage.addListener(
//         function(request,sender,sendResponse){
//           var gapiRequestUrlAndToken = "https://www.googleapis.com/gmail/v1/users/me/threads?access_token=" + thisToken

//           var makeGetRequest = function (gapiRequestURL)
//             {
//                 var xmlHttp = new XMLHttpRequest();
//                 xmlHttp.open( "GET", gapiRequestURL, false );
//                 xmlHttp.send( null );
//                 return xmlHttp.responseText;
//             }

//           makeGetRequest(gapiRequestUrlAndToken);
//         }
//       );
//     });
//   }
//   console.log("authentication complete");
//   console.log("Your token: thisToken");
// })

//oauth2 auth
chrome.identity.getAuthToken(
	{'interactive': true},
	function(){
	  //load Google's javascript client libraries
		window.gapi_onload = authorize;
		loadScript('https://apis.google.com/js/client.js');
	}
);

console.log("getAuthToken wasn't loaded");

function loadScript(url){
  var request = new XMLHttpRequest();

	request.onreadystatechange = function(){
		if(request.readyState !== 4) {
			return;
		}

		if(request.status !== 200){
			return;
		}

    eval(request.responseText);
	};

	request.open('GET', url);
	request.send();
}

function authorize(){
  gapi.auth.authorize(
		{
			client_id: '576476512220-g8s9soucu2tkv6jeb840vv91s76vcp1r.apps.googleusercontent.com',
			immediate: true,
			scope: 'https://www.googleapis.com/auth/gmail.modify'
		},
		function(){
		  gapi.client.load('gmail', 'v1', gmailAPILoaded);
		}
	);
}

function gmailAPILoaded(){
    //do stuff here
    console.log("Gmail API has successfully loaded.")
}


/* here are some utility functions for making common gmail requests */
function getThreads(query, labels){
  return gapi.client.gmail.users.threads.list({
		userId: 'me',
		q: query, //optional query
		labelIds: labels //optional labels
	}); //returns a promise
}

//takes in an array of threads from the getThreads response
function getThreadDetails(threads){
  var batch = new gapi.client.newBatch();

	for(var ii=0; ii<threads.length; ii++){
		batch.add(gapi.client.gmail.users.threads.get({
			userId: 'me',
			id: threads[ii].id
		}));
	}

	return batch;
}

function getThreadHTML(threadDetails){
  var body = threadDetails.result.messages[0].payload.parts[1].body.data;
	return B64.decode(body);
}

function archiveThread(id){
  var request = gapi.client.request(
		{
			path: '/gmail/v1/users/me/threads/' + id + '/modify',
			method: 'POST',
			body: {
				removeLabelIds: ['INBOX']
			}
		}
	);

	request.execute();
}