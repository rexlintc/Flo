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
  window.gmail = gmail;
  var visibleEmails = gmail.get.visible_emails();
  for (var i = 0; i < visibleEmails.length; i++) {
    var excerpt = visibleEmails[i].excerpt;
    var subject = visibleEmails[i].title;
    var emailData = [{"text": subject + " "+ excerpt}];
    //console.log(emailData);
    postRequest(emailData);
    // console.log(visibleEmails[i].sender);
    // console.log(label);
  }
}

function postRequest(emailData) {
  //console.log(emailData);
  fetch('https://cors-anywhere.herokuapp.com/https://email-reply-bot.herokuapp.com/predict', {
    method: 'POST',
    mode: 'no-cors',
    headers: new Headers({
    'Content-Type': 'application/json',
   }),
    body: JSON.stringify(emailData)
  })
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
 
}

//refresh(main);
