var gmail;


function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}


var main = function(){
  // NOTE: Always use the latest version of gmail.js from
  // https://github.com/KartikTalwar/gmail.js
  gmail = new Gmail();
  console.log('Hello,', gmail.get.user_email())

  gmail.observe.on("compose", function(compose, type) {

	  // type can be compose, reply or forward
	  console.log('api.dom.compose object:', compose, 'type is:', type );  // gmail.dom.compose object
  		setTimeout(function (){
        $('.LW-avf').html('nerb shing');
        $('.aoT').val('my subect');
    }, 100);
	});


}

$(document).ready(function(){
  console.log('test');
  gmail = new Gmail();
  $("#button1").on('click', function(){
    alert('button clicked');
    gmail.compose.start_compose();
  })
})



