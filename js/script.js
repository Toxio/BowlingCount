$( document ).ready(function() {

 
  var user = "Test";
  $('.totalScore').text("Total ( )");

 //create user fields
  createUserFields();

  function createUserFields(){    
    for(var i=1; i < 10; i++){    
      $(".frame").first().clone().appendTo(".frames"); 
      //last frame hav 3 rolls
      if (i == 9){
        var lastFrame = $($(".frame")[i]).find('.rolls');
        $(".roll").eq(0).clone().appendTo(lastFrame);     
      }             
    }
  }

 // scoreKeeper.resetGame();
  //input points
  $("#enter_score").on("keypress change", function(e){
    var score = Number(this.value);
  
    // check value
    if (score < 0 || score > 10){
      alert("You have entered the wrong data. Entered points should be in the range of 0-10");
      e.target.value = '';
      return false;
    }  
    //check max second score
    var arr = scoreKeeper.scoreArr;
    var arrLastEl = arr[arr.length -1];
    var maxScore = 10 - arr[arr.length -1]
    if (scoreKeeper.currentFrameRoll == 2) {
      if(score > maxScore){
        alert("You have entered the wrong data. Second points should be in the range of 0-" + maxScore);
        e.target.value = '';
        return false;
      }
    }

    // check for Enter key
    if(e.which == 13) {
      e.target.value = '';  
      scoreKeeper.addScore(score);
    }
  });

});

var TOTAL_FRAMES = 10; TOTAL_ROLLS =2;

var scoreKeeper = {
  data: {},
  scoreArr: [],
  currentFrame: 1,
  currentFrameRoll: 1,
  currentRoll: -1,
  gameCompleted: false,
  isExtraFrame: false,
  extraFrameRollCount: 0,
  totalScore: 0,

  // resets game
  resetGame: function() {
    this.data = {};
    this.scoreArr = [];
    this.currentFrame = 1;
    this.currentFrameRoll = 1;
    this.currentRoll = -1;
    this.gameCompleted = false;
    this.isExtraFrame = false;
    this.extraFrameRollCount = 0;
    this.totalScore = 0;
  },
  // adds score from input
  addScore: function(score) {
    if(this.gameCompleted) {

      if(this.extraFrameRollCount === 0) {
        startNewGame();
        return;
      } else {
        console.log('Ended on stike or spare, continue...');
        this.currentFrame ++;
        this.isExtraFrame = true;
        this.extraFrameRollCount--;
      }
    }     

    isFinalFrame = false;
    this.currentRoll++;

    if (score == 10)

        if(this.isExtraFrame ) {
          // extra frame, keep adding score for bonus points
          this.scoreArr.push(10); 
        } else {
          // this is a strike
          this.data[this.currentFrame] = {strike: true, score: 10, spare: false, roll: this.currentRoll};
          this.scoreArr.push(10);
          if(this.currentFrame < TOTAL_FRAMES) {
            this.currentFrame++;
          } else {
            isFinalFrame = true;
            this.extraFrameRollCount = 2;
          }
          this.currentFrameRoll = 1;         
    } else {
        if(!this.isExtraFrame ) {
          if(this.data[this.currentFrame]) {
            this.data[this.currentFrame].score += parseInt(score);
            if (this.data[this.currentFrame].score == 10) {
              // both rolls = 10, this is a spare
              this.data[this.currentFrame].spare = true;
              this.data[this.currentFrame].roll = this.currentRoll;
            }
          }
          else {
            this.data[this.currentFrame] = {strike: false, score: parseInt(score), spare: false, roll: this.currentRoll};
          }
         
          if(this.currentFrameRoll  % TOTAL_ROLLS === 0) {
            if(this.currentFrame < TOTAL_FRAMES) {
              this.currentFrame++;
            } else {
              isFinalFrame = true;
            }
            this.currentFrameRoll = 1;
            isFrameComplete = true;
          } else {
            this.currentFrameRoll++;
          }
        } 
        //spare in the end
         if(isFinalFrame && this.currentFrameRoll == 1){
            var arr = scoreKeeper.scoreArr;
            var arrLastEl = arr[arr.length -1];
            if(arrLastEl !=10 && arrLastEl + score == 10 ){
              this.extraFrameRollCount = 1;              
            }
          } 

        this.scoreArr.push(parseInt(score));
    }

    this.getAllScores();

    if(isFinalFrame) {
      this.gameCompleted = true;      
    }
  },

 
  getAllScores: function() { 
    this.totalScore = 0;
    for (var x =1; x<= TOTAL_FRAMES; x++) {
      if(this.data[x]) {
        var frame = this.data[x];
        if(frame.strike) {
          var bonusRolls = this.scoreArr.slice(frame.roll+1, frame.roll+3);
          var addtlPnts = addRolls(bonusRolls);
          frame.score = 10 + addtlPnts;

        } else if (frame.spare) {
          var bonusRolls = this.scoreArr.slice(frame.roll+1, frame.roll+2);
          var addtlPnts = addRolls(bonusRolls);
          frame.score = 10 + addtlPnts;
        }
        this.totalScore += frame.score;
        fillForm (x,this,frame);       
      }
    }
   
    if(this.gameCompleted) {
      if(this.extraFrameRollCount === 0) {
        startNewGame();
      return;
      }
    }     
  }

}

function fillForm(x,scoreKeeper,frame){
   
    var arr = scoreKeeper.scoreArr;
    var arrLastEl = arr[arr.length -1];
    if (arrLastEl == 0) arrLastEl = "-";

    $('.totalScore').text("Total (" + scoreKeeper.totalScore + ")");

    var curFrame = $('.frame')[x-1];       
    $(curFrame).find('.score').html(frame.score);
    rolls = $(curFrame).find('.roll');
    //input poins in current frame
    if(scoreKeeper.currentFrameRoll == 2 && rolls[0].innerHTML == ""){
        rolls.eq(0).html(arrLastEl);
        if(arrLastEl == 10){
          rolls.eq(0).html(" ");           
          rolls.eq(1).html("X");
        }       
    } else if(rolls[1].innerHTML == "") {        
      //if strike or spare
    if(arrLastEl == 10){
          rolls.eq(0).html(" "); 
          arrLastEl = "X";
       } else if (frame.spare) {
          arrLastEl = "/";
      } 
      rolls.eq(1).html(arrLastEl);               
    } 
    //for last extra frame
    if (scoreKeeper.isExtraFrame){        
        var lastFrame = $('.frame')[9];       
        var lastRolls = $(lastFrame).find('.roll');
        var preLastRolls = arr[arr.length -2];
        if (arrLastEl == 10) arrLastEl = "X";
        if (preLastRolls == 10) preLastRolls = "X";

        if (scoreKeeper.extraFrameRollCount == 1) {
          lastRolls.eq(0).html(preLastRolls); 
          lastRolls.eq(1).html(arrLastEl);
        } else lastRolls.eq(2).html(arrLastEl);;    
      }     
}

// adds roll values from array and returns sum
function addRolls(arr) {
  if(arr.length === 0) {
    return 0;
  }
  var total = arr.reduce(function(a, b) {
      return a + b;
  });
  return total;
}

//press button test
$("#test").on("click",runTest);
//press button newGame
$("#newGame").on("click",startNewGame);

function runTest(){
  if(scoreKeeper.totalScore > 0){
    startNewGame();
  }    
  var min = 0;
  var max ;
  var arr = scoreKeeper.scoreArr;
  for(var i = 1; i < 21 ; i++){
    //second points shoud be less than 10 - previous
    if(i%2 == 0){
      max = 10 - arr[arr.length -1];   
    } else max = 10;
          
    var n = Math.floor(Math.random() * (max - min + 1)) + min;
    scoreKeeper.addScore(n);        
  }  
}

function startNewGame(){ 
    var newGame = confirm('This is the end of game, yor total score = ' + scoreKeeper.totalScore + " Do you want to start а new game?");
    if(newGame) {
      //savnewGamee score before new game
      var storage = window.localStorage.getItem("stor");
      if(storage) {
        storage = JSON.parse(storage);
      } else {
        storage = new Array();
      }  
      storage.push(scoreKeeper.totalScore);
      storage.sort();
      window.localStorage.setItem("stor", JSON.stringify(storage));

      //refresh
      scoreKeeper.resetGame();  
      $('.totalScore').text("Total ( )");
      $(".roll").html('');
      $(".score").html('&nbsp');
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
