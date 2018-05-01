var gmail;

// on the listening side
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        if (message.acknowledgment) {
            // do stuff you need to do
            var visible_emails = refresh(main);
            port.postMessage({
                acknowledgment: message.acknowledgment
                data: visible_emails
            });
        }
    });
});

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
  return gmail.get.visible_emails();
}

//refresh(main);
