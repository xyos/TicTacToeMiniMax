define([], function(){
  var TicTacToe = function() {
    this.score = {
      wins:  0,
      draws: 0,
      loses: 0
    }
    // Data structure for a grid position
    var Pos = function(x,y){
      return {
        'x' : x,
        'y' : y
      }
    };
    // signs enum
    this.sign = {
      NO_SIGN: 0,
      X : 1,
      O : 2
    };
    // states enum
    this.state = {
      PLAYING : 0,
      NOBODY_WINS : 1,
      YOU_LOSE : 2
    };
    // minimaxReturn value object
    this.minimaxReturnValue = function(){
      return {
        bestPosition : null,
        bestScore    : null
      }
    };
    var that = this;
    this.clone = function (board) {
      // Create the new board
      var newBoard = [];
      for (var i = 0; i < board.length; i++) {
        newBoard.push(board[i].slice(0));
      }
      // Return the new board
      return newBoard;
    };
    this.evaluate = function (board) {
      // The score
      var score = 0;

      // Evaluate all the lines
      score += this.evaluateLine(board, 0, 0, 1, 0, 2, 0);
      score += this.evaluateLine(board, 0, 1, 1, 1, 2, 1);
      score += this.evaluateLine(board, 0, 2, 1, 2, 2, 2);
      score += this.evaluateLine(board, 0, 0, 0, 1, 0, 2);
      score += this.evaluateLine(board, 1, 0, 1, 1, 1, 2);
      score += this.evaluateLine(board, 2, 0, 2, 1, 2, 2);
      score += this.evaluateLine(board, 0, 0, 1, 1, 2, 2);
      score += this.evaluateLine(board, 0, 2, 1, 1, 2, 0);

      // Return the score
      return score;
    };
    this.evaluateLine = function (board, row1, col1, row2, col2, row3, col3) {
      // The score
      var score = 0;

      if (board[row1][col1] == that.sign.O)
        score = 1;
      else if (board[row1][col1] == that.sign.X)
        score = -1;
      if (board[row2][col2] == that.sign.O) {
        if (score == 1)
          score = 10;
        else if (score == -1)
          return 0;
        else
          score = 1;
      } else if (board[row2][col2] == that.sign.X) {
        if (score == 1)
          return 0;
        else if (score == -1)
          score = -10;
        else
          score = -1;
      }
      if (board[row3][col3] == that.sign.O) {
        if (score > 0)
          score *= 10;
        else if (score < 0)
          return 0;
        else
          score = 1;
      } else if (board[row3][col3] == that.sign.X) {
        if (score > 0)
          return 0;
        else if (score < 0)
          score *= 10;
        else
          score = -1;
      }
      // Return the score
      return score;
    };
    this.minimax = function (board, playerSign, depth) {
      if (typeof depth === "undefined") { depth = 2; }
      // Variables
      var tempBoard;
      var currentScore;
      var returnValue = new that.minimaxReturnValue();
      var gameFull = true;

      if (playerSign == that.sign.O)
        returnValue.bestScore = -99999999;
      else
        returnValue.bestScore = 99999999;

      if (depth > 0) {
        for (var i = 0; i <= 2; i++) {
          for (var j = 0; j <= 2; j++) {
            if (board[i][j] == that.sign.NO_SIGN) {
              // We found at least one non-empty cell : the game isn't full
              gameFull = false;

              // Set the temp board from the real board
              tempBoard = this.clone(board);

              // Try to play on this cell using the temp board
              tempBoard[i][j] = playerSign;
              if (playerSign == that.sign.O) {
                currentScore = this.minimax(tempBoard, that.sign.X, depth - 1).bestScore;
                if (returnValue.bestScore <= currentScore) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(i, j);
                }
              } else {
                currentScore = this.minimax(tempBoard, that.sign.O, depth - 1).bestScore;
                if (returnValue.bestScore >= currentScore) {
                  returnValue.bestScore = currentScore;
                  returnValue.bestPosition = new Pos(i, j);
                }
              }
            }
          }
        }

        if (gameFull)
          returnValue.bestScore = this.evaluate(board);
      } else
        returnValue.bestScore = this.evaluate(board);

      // Return the return value (best position found + the score)
      return returnValue;
    };

    this.testEndGameConditions = function () {
      // Variables
      var shouldEnd = false;

      switch (this.testGameSomeoneWon()) {
        case that.sign.O:
          this.ticTacToeStep = that.state.YOU_LOSE;
        return true;
        break;
        case that.sign.X:
          // add object to the player here
          this.nextStep();
        return true;
        break;
      }

      if (this.testGameFull()) {
        this.ticTacToeStep = that.state.NOBODY_WINS;
        return true;
      }

      // Nothing happens, we return false
      return false;
    };

    this.testGameFull = function () {
      // Variables
      var isFull = true;

      for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
          if (this.ticTacToeBoard[i][j] == that.sign.NO_SIGN) {
            isFull = false;
            break;
          }
        }
        if (isFull == false)
          break;
      }

      if (isFull)
        return true;

      // Else, return false
      return false;
    };

    this.testGameSomeoneWon = function () {
      // Variables
      var returnSign;

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARow(i, 0, 0, 1);
        if (returnSign != null)
          return returnSign;
      }

      for (var i = 0; i < 5; i++) {
        returnSign = this.threeInARow(0, i, 1, 0);
        if (returnSign != null)
          return returnSign;
      }

      if ((returnSign = this.threeInARow(0, 0, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(0, 1, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(1, 0, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(0, 2, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(2, 0, 1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(4, 0, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(3, 1, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(3, 0, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(4, 2, -1, 1)) != null)
        return returnSign;
      if ((returnSign = this.threeInARow(2, 0, -1, 1)) != null)
        return returnSign;

      // No won won, we return NO_SIGN
      return that.sign.NO_SIGN;
    };

    this.threeInARow = function (x1, y1, x2, y2) {
      // Variables
      var column = x1;
      var row = y1;
      var counter = 0;
      var currentSign = null;

      while (column >= 0 && column < 3 && row >= 0 && row < 3) {
        if (this.ticTacToeBoard[column][row] != that.sign.NO_SIGN) {
          if (this.ticTacToeBoard[column][row] != currentSign) {
            currentSign = this.ticTacToeBoard[column][row];
            counter = 1;
          } else
            counter++;
        } else
          counter = 0;

        if (currentSign != null && counter == 3)
          return currentSign;

        column += x2;
        row += y2;
      }

      return null;
    };

    this.tryAgain = function () {
      if(this.testEndGameConditions()){
        if(this.testGameSomeoneWon()){
          if(this.testGameSomeoneWon() === this.sign.X){
            this.score.wins++;
          } else {
            this.score.loses++;
          }
        } else {
          this.score.draws++;
        }
      }
      this.startTicTacToe();
    };

    this.playTicTacToeSign = function (xIndex, yIndex) {
      // Add the sign
      this.ticTacToeBoard[xIndex][yIndex] = that.sign.X;

      if (this.testEndGameConditions() == false) {
        // IA
        var bestPosition = this.minimax(this.ticTacToeBoard, that.sign.O).bestPosition;
        this.ticTacToeBoard[bestPosition.x][bestPosition.y] = that.sign.O;

        // Test end game conditions
        this.testEndGameConditions();
      }

      // Update
      //this.update();
      //this.getGame().updatePlace();
    };
    this.startTicTacToe = function () {
      // Reset the array
      this.ticTacToeBoard = [];

      for (var i = 0; i < 3; i++) {
        this.ticTacToeBoard.push([]);
        for (var j = 0; j < 3; j++) {
          this.ticTacToeBoard[i].push(that.sign.NO_SIGN);
        }
      }

      // Set the step
      this.ticTacToeStep = that.state.PLAYING;
    };
  }
  return TicTacToe;
});
