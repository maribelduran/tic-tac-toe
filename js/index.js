//http://javascript.info/settimeout-setinterval
//http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
//https://stackoverflow.com/questions/8207897/jquery-waiting-for-the-fadeout-to-complete-before-running-fadein
const MAX_PLAYERS = 2;

function TicTacToe(){
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = null;
	this.winner = null;
	this.winningMoves = null;
	this.finished = false
	this.board = [
	[0,0,0],
	[0,0,0],
	[0,0,0]
	];
}

function player(name, symbol){
	this.name = name;
	this.symbol = symbol;
	this.score = 0;
}

TicTacToe.prototype.setPlayers = function(name, symbol){
	this.player1 = new player(name, symbol.toUpperCase());
	this.player2 = new player("computer", (this.player1.symbol.toUpperCase() == "X") ? "O": "X");
	//When a new game is started, the first turn is picked randomly.
	this.setCurrentPlayer("random");
};

TicTacToe.prototype.setCurrentPlayer = function(player){
	if (player === "random"){
		var getTurn = flipCoin(0,MAX_PLAYERS);
		this.currentPlayer = getTurn == 0 ? this.player1 : this.player2;
	}
	else{
		this.currentPlayer = player;
	}
};

//returns a random number between 0 and max-1
function flipCoin(min, max){
 	return Math.floor(Math.random() * (max - min)) + min;
}

//returns a succesful move or empty move;
TicTacToe.prototype.play = function(player, row, col){
	var move = {};
	//place symbol
	if (player == "computer"){
		move = this.getBestMove();
		this.board[move.row][move.col] = this.player2.symbol;
	}
	else{
		//if move hasn't already been taken then set that move to the player's symbol
		if (!this.moveFilled(row,col)){
			this.board[row][col] = this.player1.symbol;
			move.row = row;
			move.col = col;
		}else{
			//return an empty move to represent that the move was not available
			return move;
		}
	}
	//check if there is a winner	
	var isWinner = this.checkWinner();	
	if (isWinner){
		this.currentPlayer.score +=1;
		this.winner = this.currentPlayer;
		this.setCurrentPlayer(this.winner); 
		this.finished = true;
		return move;
	}
	//check if the game has finished;
	this.finished = this.isGameFinished();
	
	//Switch players
	this.currentPlayer = this.currentPlayer == this.player1 ? this.player2 : this.player1;
	return move;
};

TicTacToe.prototype.checkWinner = function(){
	var row = 0, col = 0;
	//checks if there is a horizontal line of 3 of one's own symbol
	 for (row=0; row<=2; row++){
	 		if (this.board[row][col] === this.board[row][col+ 1] && this.board[row][col] != 0){
	 			if (this.board[row][col+1] === this.board[row][col+ 2]){
	 				this.winningMoves = [[row,col],[row,col+1], [row,col+2]];
	 				if (this.board[row][col] == this.currentPlayer.symbol){
	 					return 10;
	 				}else{
	 					return -10;
	 				}
        }
      }
  }
  //checks if there is a vertical line of 3 of one's own symbol
  for (col=0, row=0; col<=2; col++){
  	if (this.board[row][col] === this.board[row+1][col] && this.board[row][col]!= 0){
  		if (this.board[row+1][col] === this.board[row+2][col]){
  			this.winningMoves= [[row,col],[row+1,col], [row+2,col]];
	 			if (this.board[row][col] == this.currentPlayer.symbol){
	 					return 10;
	 			}
	 			return -10;
	 		}
     }
   }

 	col=0, row=0;
 	//checks if there is a diagonal line of 3 of one's own symbol
  if (this.board[row][col] === this.board[row+1][col+1] && this.board[row][col]!= 0){
  	if (this.board[row+1][col+1] === this.board[row+2][col+2]){
  		this.winningMoves = [[row,col],[row+1,col+1],[row+2,col+2]];
	 		if (this.board[row][col] == this.currentPlayer.symbol){
	 			return 10;
	 		}
	 		return -10;
	 	}
   }
	
	col=0, row=0;
 	//checks if there is a diagonal line of 3 of one's own symbol
 	if (this.board[row+2][col] === this.board[row+1][col+1] && this.board[row+2][col]!=0){
 		if (this.board[row+1][col+1] == this.board[row][col+2]){
 			this.winningMoves= [[row+2,col],[row+1,col+1], [row,col+2]];
   		if (this.board[row+2][col] == this.currentPlayer.symbol){
	 			return 10;
	 		}
	 		return -10
   	}
  }
	return 0;
}

TicTacToe.prototype.isGameFinished = function(){
	for (var i=0; i<this.board.length; i++){
		var row = this.board[i];
		if (row.indexOf(0) != -1){
			return false;
		}
	}
	return true;
}

//returns an array that represents a cell in the board
TicTacToe.prototype.getBestMove = function(){
	var bestMove = {
		"row": -1,
		"col": -1,
		"val": -1000,
	};
	for (var row=0; row<3; row++){
		for (var col=0; col<3; col++){
			//check that cell is empty
			if (this.board[row][col] === 0){
				//make the move and call minimax
				this.board[row][col] = this.currentPlayer.symbol;
				var currentMoveVal = this.minimax(this.board, 0, false);
				//undo the move
				this.board[row][col] = 0;
				if (currentMoveVal > bestMove.val){
					bestMove.row = row;
					bestMove.col = col;
					bestMove.val = currentMoveVal;
				}
			}
		}
	}
	return bestMove;
}

TicTacToe.prototype.minimax = function(board, depth, isMaximizingPlayer){
	//if board is in terminal state, then return value of board
	var score = this.checkWinner();

	//If Maximizer or Minimizer has won the game return player's score
	if (score == 10){
		return score;
	}else if(score == -10){
		return score;
	}

	//If there are no more moves and no winner then it is a tie
	if (this.isGameFinished()){
		return 0;
	}

	//Maximizer's move
	if (isMaximizingPlayer){
		var bestVal = -Infinity;
		for (var row=0; row<3; row++){
			for (var col=0; col<3; col++){
				if (this.board[row][col] === 0){
					this.board[row][col] = this.currentPlayer.symbol;
					bestVal = Math.max(bestVal, this.minimax(board, depth+1, !isMaximizingPlayer));
					this.board[row][col] = 0;
				}
			}
		}
		return bestVal;
	//Minimizer's move
	}else{
		var bestVal = Infinity;
		for (var row=0; row<3; row++){
			for (var col=0; col<3; col++){
				if (this.board[row][col] === 0){
					this.board[row][col] = this.currentPlayer == this.player1 ? this.player2.symbol : this.player1.symbol;
					bestVal = Math.min(bestVal, this.minimax(board, depth+1, !isMaximizingPlayer));
					this.board[row][col] = 0;
				}
			}
		}
		return bestVal;
	}
}

//returns boolean reperesenting whether the cell in the board has been filled
TicTacToe.prototype.moveFilled = function(row,col){
	//if the cell is empty return false
	if (this.board[row][col] == 0){
		return false;
	}
	return true;
}

TicTacToe.prototype.reset = function(){
	//clear all properties
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = null;
	this.clearBoard();
}

TicTacToe.prototype.clearBoard = function(){
	this.finished = false;
	this.winner = null;
	this.winnerMove = null;
	this.board = [
	[0,0,0],
	[0,0,0],
	[0,0,0]
	];
}

//model
var model = {
	game: {},
	setupGame: function(){
		this.game = new TicTacToe();
	}
};

var controller = {
	initializeGame: function(){
		model.setupGame();
	},
	setPlayers: function(name, symbol){
		model.game.setPlayers(name, symbol);
		view.showScores(model.game.player1, model.game.player2);
		view.startGame();
		setTimeout(function (){
			this.playGame();
		}.bind(this),1000);
	},
	playGame: function(move){
		if (!model.game.finished){
			//if the curent player is the computer, then disable the board and let computer take a turn
			if (model.game.currentPlayer.name == "computer"){
				view.disableBoard();
				view.showTurn(model.game.currentPlayer);
				var move = model.game.play(model.game.currentPlayer.name);
				var timeoutID = setTimeout(function (){
						//show the computer's move on the screen
						view.showMove(model.game.player2.symbol, move.row, move.col);
						this.playGame();
				}.bind(this),1000);

			}else{
				view.enableBoard();
				view.showTurn(model.game.currentPlayer);
			}
		}else{
			//Once the game is finished, disable board and display who won or if it was a tie. 
			view.disableBoard();
			this.showWinnerAndReplay();
		}
	},
	resetAll: function(){
		model.game.reset();
		view.disableBoard();
		view.resetAll();
	},
	//shows winner and start new game round
	showWinnerAndReplay: function(){
		var timeoutID = setTimeout(function (){
			if (model.game.winner !== null){
				view.showWinningMove(model.game.winningMoves);
			}
			view.showWinner(model.game.winner);
			view.showScores(model.game.player1, model.game.player2);
			},1000);

		 setTimeout(function (){
			model.game.clearBoard();
			view.clearGameBoard();
			this.playGame();
			}.bind(this),1000);
	},	
	playerTurn: function(row, col){
		var move = model.game.play(model.game.currentPlayer.name, row, col);
		if (Object.keys(move).length !== 0){
			//show the computer's move on the screen
			view.showMove(model.game.player1.symbol, move.row, move.col, true);
		}
		this.playGame();				
	},
	checkMove: function(row,col){
		if (!model.game.moveFilled(row,col)){
			view.showMove(model.game.currentPlayer.symbol, row, col, false);
		}
	}
};

var view = {
	boardEnabled: false,
	btnEntry: {
		"box0": [0,0],
		"box1": [0,1],
		"box2": [0,2],
		"box3": [1,0],
		"box4": [1,1],
		"box5": [1,2],
		"box6": [2,0],
		"box7": [2,1],
		"box8": [2,2],
		},
		setUpEventListeners: function(){

		var boxList = document.querySelector("ul");

		boxList.addEventListener('click', function(event){
			if (view.boardEnabled){
				var boxClicked = event.target;
				//var boxClickedVal = boxClicked.className
				//console.log(boxClickedVal);
				controller.playerTurn(view.btnEntry[boxClicked.id][0], view.btnEntry[boxClicked.id][1]);
    		}
		});

		boxList.addEventListener('onmouseover', function(event){
			if (view.boardEnabled){
				var boxClicked = event.target;
				controller.checkMove(view.btnEntry[boxClicked.id][0], view.btnEntry[boxClicked.id][1]);
    		}
		});
		boxList.addEventListener('onmouseout', function(event){
			if (view.boardEnabled){
				var boxClicked = event.target;
				console.log(boxClicked);
				view.removeMove(view.btnEntry[boxClicked.id][0], view.btnEntry[boxClicked.id][1]);
    		}
		});

		document.getElementById("X").addEventListener("click", function(){
				controller.setPlayers("player1", "X");
		 });

		document.getElementById("O").addEventListener("click", function(){
				controller.setPlayers("player1", "O");
		 });

		document.getElementById("reset").addEventListener("click", function(){
			controller.resetAll();
		});
	},
	enableBoard: function(){
		this.boardEnabled = true;
	},
	disableBoard: function(){
		this.boardEnabled = false;
	},
	showMove: function(symbol,row, col, isClicked){
		var boxID = "";

		for (prop in this.btnEntry){
			if (this.btnEntry[prop][0] ==  row && this.btnEntry[prop][1] == col){
				boxID = prop;
				break;
			}
		}
		var box = document.getElementById(boxID);

		var circleIcon = "fa-circle-o";
		var timesIcon = "fa-times";

		if (symbol.toUpperCase() == "X"){
				box.getElementsByTagName("i")[0].classList.add(timesIcon);
		}else{
			box.getElementsByTagName("i")[0].classList.add(circleIcon);
		}
		
		//document.getElementById(box).innerHTML = symbol;
	},
	removeMove: function(col,row){
		var boxID = "";

		for (prop in this.btnEntry){
			if (this.btnEntry[prop][0] ==  row && this.btnEntry[prop][1] == col){
				box = prop;
				break;
			}
		}
		var box = document.getElementById(boxID);
	},
	clearGameBoard: function(){
		$("li>i").removeClass('fa-circle-o fa-times');
	},
	showBoard: function(){
		$(".board-container").fadeIn(1200);
	},
	hideBoard: function(){
		return $(".board-container").fadeOut(300);
	},
	showScores: function(player1, player2){
	//	document.getElementsByClassName("player1-score")[0].innerHTML = model.game.player1.name + ": " + model.game.player1.score;
		//document.getElementsByClassName("computer-score")[0].innerHTML = model.game.player2.name + ": " + model.game.player2.score;
		document.getElementsByClassName("player1-score")[0].innerHTML = model.game.player1.score;
		document.getElementsByClassName("computer-score")[0].innerHTML =model.game.player2.score;
	},
	hideSymbolOptions: function(){
		return $(".symbolOptions").fadeOut(200);
	},
	showSymbolOptions: function(){
		return $(".symbolOptions").fadeIn(1200);
	},
	startGame: function(){
		this.hideSymbolOptions().promise().done(function(){
    		this.showBoard();
		}.bind(this));
	},
	showTurn: function(player){
	
			document.getElementsByClassName("playersTurn-name")[0].innerHTML = player.name + "'s " + "turn";
	},
	clearTurn: function(player){
			document.getElementsByClassName("playersTurn-name")[0].innerHTML = "";
	},
	showWinningMove: function(winningMove){
		var boxId=[];
		for (var i=0; i<winningMove.length;i++){
			for (prop in this.btnEntry){
				if (this.btnEntry[prop][0] ==  winningMove[i][0] && this.btnEntry[prop][1] == winningMove[i][1]){
					boxId.push(prop);
					var box = document.getElementById(prop);
				//	box.getElementsByTagName("i")[0].classList.add("fa-5x");
				//	$('.symbol').addClass('winningMove');
					//document.getElementById(prop).classList.add('winningMove');
					break;
				}
			}
		}

		console.log(boxId);
		var timeoutID = setTimeout(function (){
			boxId.forEach(function(id){
				//document.getElementById(id).classList.remove('winningMove');
			});
		},1000);
	},
	showWinner: function(winner){
		var message = ""
		if (winner == null){
				message = "It was a tie..."
		}
		else if (winner.name == "player1"){
				message	= "You Won :)"
		}
		else if (winner.name == "computer"){
				message = "You lost this time :("
		}
		document.getElementById("winner_name").textContent = message;
		document.getElementById("winner_name").classList.remove("hide")
		
		setTimeout(function (){
			document.getElementById("winner_name").classList.remove("hide")
		},1000);
	},
	resetAll: function(){
		this.clearGameBoard();
		this.clearTurn();
		this.hideBoard().promise().done(function(){
    		this.showSymbolOptions();
		}.bind(this));
	}
};

//initializes the game when this script is loaded
controller.initializeGame();
view.setUpEventListeners();