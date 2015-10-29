 $(document).ready(function() { 
    var points, total = []; 

  function initPointsObject(){
    points = {
      frameRolls: 0,
      frameNum: 0,
      frameSum: 0,
      strike: false,
      spare: false,
      arrSumField: [],
      endGame: false,
      extraPoint: false,
      score: 0
  };}

  var user = prompt("Enter the name of the player");
  //var user = "Test";
  $('.player').text(user);

  //create user fields
  createUserFields();

  function createUserFields(){
    initPointsObject();
    for(var i=1; i < 10; i++){    
      $(".frame").first().clone().appendTo(".frames");              
      }
  }

  //input points
  $("#enter_score").on("keypress change", function(e){
   //check end of the game
    var point = Number(this.value);

    if (points.endGame){
      var newGame = confirm('This is the end of game, yor total score = ' + points.score + " Do you want to start а new game?");
      if(newGame){
        startNewGame();
      }                     
    }                
    // check value
    if ( (point < 0 || point > 10)|| ((points.frameSum + point > 10) && total.length < 10) ) {
    // reset value
      alert('You have entered the wrong data. Entered points should be in the range of 0-'+  + (10 - points.frameSum));
      e.target.value = '';
    return false;
    }            
    // check for Enter key
    if (e.keyCode === 13) {
      e.target.value = '';   
      prepearForm(point);    
     }
    })


  //fill user form
  function prepearForm(point){      
      //change frame
      if( points.frameRolls == 2){
        points.frameNum ++;
        points.frameRolls = 0;
      }        
      

      var currentFrame = $('.frame')[points.frameNum];   
      //take current frame    
      points.score += point;
      checkStrikeSpare(point);
      
      //check for strike or spare
      var mutePoint = changePoint(point);
      //input date in frame
      fillForm(point,currentFrame,mutePoint);

      checkEnd(point); 
      
      //need for cheking second point
      if(points.frameRolls == 0){
          points.frameSum +=point ;
      } else {
         points.arrSumField.push(points.frameSum + point); 
         points.frameSum = 0 ; 
      }   
      points.frameRolls ++;
      points.totalRolls ++;

      //save point
      if(points.strike){
            total.push({1: point});
      } else {
          if(points.frameRolls == 1) {
              total.push({1: point, 2: 0});
          } else {
              total[total.length -1][2] = point; 
          }  
      }
         
  }

  function checkStrikeSpare(point){      
      //change previous score
      if(points.frameNum != 0){
          var previousFrame = $('.frame')[points.frameNum -1]
          var localScore = points.arrSumField[points.frameNum -1];
          if(points.strike){
              $(previousFrame).find('.score').html(localScore + point);
              points.arrSumField[points.frameNum -1] = localScore + point;
              points.score += point;
              points.spare = true;
              points.strike = false;
          } else if(points.spare) {
            $(previousFrame).find('.score').html(localScore + point);
              points.score += point;
              points.spare = false; 
          }
      }
  }

  function fillForm(point,currentFrame,mutePoint){
   //input point in frame
      $('.player').text(user+" (" + points.score + ")");
      $(currentFrame).find('.score').html(points.frameSum + point);
      rolls = $(currentFrame).find('.roll');
      //correckt output for strike
      if(point ==10 && total.length < 9) {
        rolls.eq(0).html(changePoint(mutePoint))
      } else {
        rolls.eq(points.frameRolls).html(changePoint(mutePoint))
      }
  }

  function changePoint(point){
      var mutePoint = point;
      //check for strike
      if (point == 10) {
          mutePoint = "X";
          points.strike = true;
          if (total.length < 9){
            points.frameRolls ++;
            points.frameSum = 0 ;
            points.totalRolls ++;
            console.log(total);
          }   
       } // check for spare 
       else if(points.frameSum + point == 10){
        mutePoint = "/";
          points.spare = true;
       } else if(point == 0){
        mutePoint = "-";
       }    
      return mutePoint;
  }

  function checkEnd(point){
    if (total.length == 10 && points.frameRolls == 1 ){ 
        points.endGame = true;
    }        
  }

  function startNewGame(){  
    //save score before new game
    var storage = window.localStorage.getItem("stor");
    if(storage) {
      storage = JSON.parse(storage);
    } else {
      storage = new Array();
    }  
    storage.push(points.score);
    storage.sort();
    window.localStorage.setItem("stor", JSON.stringify(storage));

    //refresh
    $('.player').text(user);
    total = [];
    $(".roll").html('');
    $(".score").html('&nbsp');
    initPointsObject();
  }

  //press button test
  $("#test").on("click",runTest);
  //press button newGame
  $("#newGame").on("click",startNewGame);

  function runTest(){
    if(points.score > 0){
      startNewGame();
    }    
    var min = 0;
    var max = 10;
    for(var i = 0; i < 21 ; i++){
      max = 10 - points.frameSum;        
      var n = Math.floor(Math.random() * (max - min + 1)) + min;
      if(n == 10) i++; 
            
      prepearForm(n);        
    }    
  }
  
  //show result of game
    $("input[name=count]").on("click change", function(e){
      var storage = window.localStorage.getItem("stor"), text;
      if(storage){
        storage = JSON.parse(storage);
        if(storage.length < this.value) text = ' - ' + storage.join(', ');
        else{
          text = ' - ' + storage.splice(storage.length - this.value,storage.length).join(', ');
        }
      }
      else text = ' Not found saved games';

      $('span#best').html(text);
    });

});
