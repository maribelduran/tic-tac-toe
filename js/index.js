//http://javascript.info/settimeout-setinterval
//http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
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
		view.hideSymbolOptions();
		view.showBoard();
		view.showPlayers(model.game.player1, model.game.player2);
		this.playGame();
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
				}.bind(this),500);

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
			view.showPlayers(model.game.player1, model.game.player2);
			},500);

		 setTimeout(function (){
			model.game.clearBoard();
			view.clearBoard();
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
		var box = "";

		for (prop in this.btnEntry){
			if (this.btnEntry[prop][0] ==  row && this.btnEntry[prop][1] == col){
				box = prop;
				break;
			}
		}
		document.getElementById(box).innerHTML = symbol;
	},
	removeMove: function(col,row){
		var box = "";

		for (prop in this.btnEntry){
			if (this.btnEntry[prop][0] ==  row && this.btnEntry[prop][1] == col){
				box = prop;
				
				break;
			}
		}
		document.getElementById(box).innerHTML = "";
	},
	clearBoard: function(){
		var boxListItems = document.getElementsByTagName("li");
   		for (var i = 0; i < boxListItems.length; i++) {
    		boxListItems[i].innerHTML = "";
    	}
	},
	showBoard: function(){
		$(".board").fadeIn(1500);
		//	document.getElementsByClassName("boxList")[0].style.opacity = 1;
	},
	hideBoard: function(){
		$(".board").fadeOut(300);
		//document.getElementsByClassName("boxList")[0].style.opacity = 0;
	},
	showPlayers: function(player1, player2){
		//document.getElementsByClassName("players")[0].style.opacity = 1;
		document.getElementsByClassName("player1")[0].innerHTML = model.game.player1.name + ": " + model.game.player1.score;
		document.getElementsByClassName("draw")[0].innerHTML ="draw" + ": 0";
	
		document.getElementsByClassName("computer")[0].innerHTML = model.game.player2.name + ": " + model.game.player2.score;
		//document.getElementsByClassName("symbolOptions")[0].style.opacity = 0;
	},
	hidePlayers: function(){
		//document.getElementsByClassName("players")[0].style.opacity = 0;
	},
	hideSymbolOptions: function(){
		$(".symbolOptions").fadeOut(100);
		 //	document.getElementsByClassName("symbolOptions")[0].style.display = "none";
		 //document.getElementById("X").style.opacity = 0;
		//document.getElementById("O").style.opacity = 0;
	},
	showSymbolOptions: function(){
		$(".symbolOptions").fadeIn(1500);
		//document.getElementsByClassName("symbolOptions")[0].style.display = "block";
	},

	showTurn: function(player){
		if (player.name == "computer"){
			document.getElementsByClassName("computersTurn")[0].classList.add('show');
			document.getElementsByClassName("player1Turn")[0].classList.remove('show');
		}
		else{
				document.getElementsByClassName("player1Turn")[0].classList.add('show');
				document.getElementsByClassName("computersTurn")[0].classList.remove('show')
		}			
	},
	showWinningMove: function(winningMove){
		var box=[];
		for (var i=0; i<winningMove.length;i++){
			for (prop in this.btnEntry){
				if (this.btnEntry[prop][0] ==  winningMove[i][0] && this.btnEntry[prop][1] == winningMove[i][1]){
					box.push(prop);
					document.getElementById(prop).classList.add('winningBox');
					break;
				}
			}
		}
		var timeoutID = setTimeout(function (){
			box.forEach(function(id){
				document.getElementById(id).classList.remove('winningBox');
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
		this.clearBoard();
		$(".board").fadeOut(300, this.showSymbolOptions);
	}
};

//initializes the game when this script is loaded
controller.initializeGame();
view.setUpEventListeners();