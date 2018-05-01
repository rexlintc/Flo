var gmail;


function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}


var main = function(){
  // initialize gmail.js
  gmail = new Gmail();
  var visibleEmails = gmail.get.visible_emails();
  for (var i = 0; i < visibleEmails.length; i++) {
    var excerpt = visibleEmails[i].excerpt;
    var subject = visibleEmails[i].title;
    var emailData = subject + excerpt;
    postRequest(emailData);
    // console.log(visibleEmails[i].sender);
    // console.log(label);
  }
}

function classifyEmail(emailData) {
  // Send Request to Model 
  var label;
  var xhr = new XMLHttpRequest();
  var url = "https://email-reply-bot.herokuapp.com/predict";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json.label);
          label = json.label;
      }
  };

  return label; // return Math.floor(Math.random() * 8) + 1;
}

function postRequest(emailData) {
  fetch('https://email-reply-bot.herokuapp.com/predict', {
    method: 'POST',
    body: emailData,
    mode: 'no-cors'
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(response) {
    console.log("postRequest failed.")
  });
}

refresh(main);
