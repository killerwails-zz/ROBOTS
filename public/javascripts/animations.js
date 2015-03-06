// toggle class active function
$(function(){
  var count= 0;
  $('.panel-logo').eq(1).addClass('show');
  $('h1').hide();
  $('#twitter-pop-up').hide();
  setInterval(function(){ 
    $('#greeting').toggleClass('loading');
   }, 1000);
  setInterval(function(){ 
    $('#status').toggleClass('on');
   }, 700);

  var setInstructionCounter = function(x) {
    setTimeout(function(){
      $('#instruction-counter').text(x);
    }, count+= 1000)
  }

  for(var i=10; i>0; i--){
    setInstructionCounter(i);
  }
  
  setTimeout(function(){
    $('#instructions').hide();
    $('#instruction-background').hide();
  },11000)
  /*
    binding event to certain 'gesture events'
    -on certain gestures, transition the page 
      -the page layout should change
      -panel logos should change based on page displayed
  */

  $('#picture-gesture').on('click', function(){
    var counter = 0;
    var finalCounter = "Sassy";
    var cameraCounter = function(x) {
      setTimeout(function(){
        if(x == 0){
          $('h1').text(finalCounter);
        }else{
          $('h1').text(x);}
      }, counter += 1000)
    }

    $('#greeting').hide();
    $('h1').show();
    $('.panel-logo').eq(1).addClass('active')
    
    for(var i=5; i>=0; i--){
      cameraCounter(i);
    }

    setTimeout(function(){
      $('h1').text("").delay(25).addClass('flash');
    }, 6200)

    setTimeout(function(){
      $('h1').removeClass('flash').hide();
      $('.panel-logo').eq(1).hide();
      $('.panel-logo').eq(0).addClass('show');
      $('.panel-logo').eq(2).addClass('show');
      $('#greeting').show();
      $('#greeting').text("Like or Dislike");
    }, 6500)

  });

  $('#thumbs-down').on('click', function(){
    var counter = 0;
    var phrase = "Sassy";
    var cameraCounter = function(x) {
      setTimeout(function(){
        if(x == 0){
          $('h1').text(phrase);
        }else{
          $('h1').text(x);}
      }, counter += 1000)
    }

    $('#greeting').hide();
    $('h1').show();
    $('.panel-logo').eq(0).addClass('active')
    
    for(var i=5; i>=0; i--){
      cameraCounter(i);
    }

    setTimeout(function(){
      $('h1').text("").delay(25).addClass('flash');
    }, 6200)

    setTimeout(function(){
      $('h1').removeClass('flash').hide();
      $('.panel-logo').each(function(i){
        $('.panel-logo').eq(i).removeClass('active');
      });
      $('.panel-logo').eq(1).removeClass('show');
      $('.panel-logo').eq(0).addClass('show');
      $('.panel-logo').eq(2).addClass('show');
      $('#greeting').show();
      $('#greeting').text("Like or Dislike");
    }, 6500)

  });


  $('#thumbs-up').on('click', function(){
    $('#greeting').hide();
    $('.panel-logo').eq(2).addClass('active');
    $('#twitter-pop-up').delay(100).show(1000).delay(2500).fadeOut();
    setTimeout(function(){
      $('.panel-logo').each(function(i){
        $('.panel-logo').eq(i).removeClass('active');
        $('.panel-logo').eq(i).removeClass('show');
      });
      $('.panel-logo').eq(1).addClass('show');
      $('.panel-logo').eq(1).show();
      $('#greeting').text("Strike a pose");
      $('#greeting').show('slow');
    },3650);
  });


});
