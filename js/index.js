//http://javascript.info/settimeout-setinterval
//http://neverstopbuilding.com/minimax
const MAX_PLAYERS = 2;

function TicTacToe(){
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = null;
	this.winner = null
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

//returns a succesful move or null
TicTacToe.prototype.play = function(player, row, col){

	var position = {};

	//place symbol
	if (player == "computer"){
		position = this.getMove();
		this.board[position.row][position.col] = this.player2.symbol;
	}
	else{
		//if position hasn't already been taken then set the position to the player's symbol
		if (!this.positionFilled(row,col)){
			this.board[row][col] = this.player1.symbol;
			position.row = row;
			position.col = col;
			//return an empty position to represent that the move was not available
		}else{
			return position;
		}
		
	}
	//check if there is a winner	
	var isWinner = this.checkWinner();	
	if (isWinner){
		this.currentPlayer.score +=1;
		this.winner = this.currentPlayer;
		this.setCurrentPlayer(this.winner);
		//need to save the position that won the game to show 
		this.finished = true;
		return position;

	}
	this.finished = this.isGameFinished();
	//Switch players
	this.currentPlayer = this.currentPlayer == this.player1 ? this.player2 : this.player1;
	return position;
};

TicTacToe.prototype.checkWinner = function(){
	var row = 0, col = 0;
	//checks if there is a horizontal line of 3 of one's own symbol
	 for (row=0; row<=2; row++){
	 		if (this.board[row][col] === this.board[row][col+ 1] && this.board[row][col] != 0){
	 			if (this.board[row][col+1] === this.board[row][col+ 2]){
	 				this.winningMoves = [[row,col],[row,col+1], [row,col+2]];
	 				return true;
        }
      }
  }
  //checks if there is a vertical line of 3 of one's own symbol
  for (col=0, row=0; col<=2; col++){
  	if (this.board[row][col] === this.board[row+1][col] && this.board[row][col]!= 0){
  		if (this.board[row+1][col] === this.board[row+2][col]){
  			this.winningMoves= [[row,col],[row+1,col], [row+2,col]];
	 				return true;
        }
   }
 	}
 	col=0, row=0;
 	//checks if there is a diagonal line of 3 of one's own symbol
  	if (this.board[row][col] === this.board[row+1][col+1] && this.board[row][col]!= 0){
  		if (this.board[row+1][col+1] === this.board[row+2][col+2]){
  			this.winningMoves = [[row,col],[row+1,col+1],[row+2,col+2]];
	 				return true;
        }
   }
	col=0, row=0;

 	//checks if there is a diagonal line of 3 of one's own symbol
 	if (this.board[row+2][col] === this.board[row+1][col+1] && this.board[row+2][col]!=0){
 		if (this.board[row+1][col+1] == this.board[row][col+2]){
 			this.winningMoves= [[row+2,col],[row+1,col+1], [row,col+2]];
   		return true;
   	}
  }
	return false;
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

//returns an array that represents the row and column position
TicTacToe.prototype.getMove = function(){
	var position = {
		"row": 0,
		"col": 0
	}
	//if position is already taken you can't use it
	return position;
}

//returns boolean reperesenting whether the position in the board has been filled
TicTacToe.prototype.positionFilled = function(row,col){
	//if the position is empty return false
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
	this.winner = null;
	this.winnerMove = null;
	this.finished = false;
	this.board = [
	[0,0,0],
	[0,0,0],
	[0,0,0]
	];
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
		//show player symbols options
		console.log("Initialized a new TicTacToe game!")
	}
};

var controller = {
	initializeGame: function(){
		model.setupGame();
	},
	setPlayers: function(name, symbol){
		view.hidePlayerOptions();
		model.game.setPlayers(name, symbol);
		view.showBoard();
		view.showPlayers(model.game.player1, model.game.player2);
		this.playGame();
	},
	playGame: function(move){
		if (!model.game.finished){
			//if the curent player is the computer, then disable the board and let computer take a turn
			if (model.game.currentPlayer.name == "computer"){
				view.disableBoard();
				console.log("It's the computer's turn!");
				view.showTurn(model.game.currentPlayer);
				var move = model.game.play(model.game.currentPlayer.name);
				console.log("Computer's move was: ", move.row, move.col);
				var timeoutID = setTimeout(function (){
						//show the computer's move on the screen
						view.showMove(model.game.player2.symbol, move.row, move.col);
						this.playGame();
				}.bind(this),500);
				

			}else{
				console.log("It's", model.game.currentPlayer.name, "'s turn!");
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
		view.hideBoard();
		view.hidePlayers();
		view.showPlayerOptions();
	},
	//shows winner and start new game round
	showWinnerAndReplay: function(){
		var timeoutID = setTimeout(function (){
			view.showWinningMove(model.game.winningMoves);
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
			view.showMove(model.game.player1.symbol, move.row, move.col);
		}	
		else{
			console.log("Move is already taken! Try again.");
		}

		this.playGame();
					
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
	showMove: function(symbol,row, col){
		var box = "";

		for (prop in this.btnEntry){
			if (this.btnEntry[prop][0] ==  row && this.btnEntry[prop][1] == col){
				box = prop;
				
				break;
			}
		}
		document.getElementById(box).innerHTML = symbol;
	},
	clearBoard: function(){
			var boxListItems = document.getElementsByTagName("li");
   		for (var i = 0; i < boxListItems.length; i++) {
    		boxListItems[i].innerHTML = "";
    	}
	},
	showBoard: function(){
		document.getElementsByClassName("boxList")[0].style.opacity = 1;
	},
	hideBoard: function(){
		document.getElementsByClassName("boxList")[0].style.opacity = 0;
	},
	showPlayers: function(player1, player2){
			document.getElementsByClassName("players")[0].style.opacity = 1;
		document.getElementsByClassName("player1")[0].innerHTML = model.game.player1.name + ": " + model.game.player1.score;
		document.getElementsByClassName("computer")[0].innerHTML = model.game.player2.name + ": " + model.game.player2.score;
		//document.getElementsByClassName("symbolOptions")[0].style.opacity = 0;
	},
	hidePlayers: function(){
		document.getElementsByClassName("players")[0].style.opacity = 0;
	},
	hidePlayerOptions: function(){
		 	document.getElementsByClassName("symbolOptions")[0].style.display = "none";
		 //document.getElementById("X").style.opacity = 0;
		//document.getElementById("O").style.opacity = 0;
	},
	showPlayerOptions: function(){
		console.log("Hello");
		document.getElementsByClassName("symbolOptions")[0].style.display = "block";
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
		if (winner.name == "player1"){
				message	= "You Won :)"
		}
		else if (winner.name == "computer"){
			message = "You lost this time :("
		}
		else {
			message = "It was a tie..."
		}
		document.getElementById("winner_name").textContent = message;
	}

};

//initializes the game when this script is loaded
controller.initializeGame();
view.setUpEventListeners();