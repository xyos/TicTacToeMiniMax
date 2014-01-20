require.config({
  paths: {
    crafty : 'crafty'
  }
});

define(
  [
  'ttt',
  'engine'
], function(Game, Engine){
  ticTacToe = new Game();
  ticTacToe.startTicTacToe();
  engine = new Engine(ticTacToe);
  engine.init();
  engine.draw();
  window.ttt = ticTacToe;
  window.engine = engine;
 });
