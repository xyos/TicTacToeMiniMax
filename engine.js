define([
  'crafty'
], function(crafty){
  var Engine = function(game){
    var that = this;
    this.game = game;
    this.squares = [];
    this.h = 3;
    this.w = 3;
    this.grid = {
      width:  128,
      height: 128,
      border: 10
    };
    this.square = Crafty.c('Square', {
      init : function() {
        this.requires('2D, DOM, Color, Mouse');
      },
      setPosition : function(pos) {
        this.pos = pos;
        return this;
      },
      setPlayer : function(player) {
        if (player === game.sign.NO_SIGN){
          this.color("white");
          // add a click event for unplayed cells
          if(!game.testEndGameConditions()){
            this.bind('Click', function(){
              game.playTicTacToeSign(this.pos.x,this.pos.y);
              console.log('clicked');
              console.log(game.testGameSomeoneWon());
              that.draw();
              if(game.testEndGameConditions()){
                console.log('end');
              }
            });
          } else {
              console.log(game.testGameSomeoneWon());
          }

        } else if (player === game.sign.X){
          this.color("green");
        } else if (player === game.sign.O){
          this.color("blue");
        }
        if (game.testGameSomeoneWon()){
          console.log('win');
        }
        return this;
      }
    });
    this.width = function(){
      return this.grid.width * this.w + this.grid.border;
    };
    this.height = function(){
      return this.grid.height * this.h + this.grid.border;
    };
    this.draw = function(){
      for (var x = 0; x < that.game.ticTacToeBoard.length; x++) {
        for (var y = 0; y < that.game.ticTacToeBoard[x].length; y++) {
          var pos = {x: x, y :y};
          var square = Crafty.e("Square")
          .attr({
            w : (that.grid.width - that.grid.border),
            h : (that.grid.height - that.grid.border),
            x : (that.grid.width  * x + that.grid.border),
            y : (that.grid.height * y + that.grid.border)
          })
          .setPosition(pos)
          .setPlayer(that.game.ticTacToeBoard[x][y]);
        };
      };
    };
    return {
      init : function(){
        Crafty.init(that.height(),that.width());
        Crafty.background('black');
      },
      draw : this.draw,
      restart : function(){
        Crafty.init(that.height(),that.width());
        Crafty.background('black');
        that.game.tryAgain();
        that.draw();
      }
    };
  }
  return Engine;
});
