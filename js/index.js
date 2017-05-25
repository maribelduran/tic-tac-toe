//http://javascript.info/settimeout-setinterval
const MAX_PLAYERS = 2;

function TicTacToe(){
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = null;
	this.winner = null
	this.finished = false;
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
	var getTurn = flipCoin(0,MAX_PLAYERS);
	this.currentPlayer = (getTurn == 0) ? this.player1 : this.player2;
};

//returns a random number between 0 and max-1
function flipCoin(min, max){
 	return Math.floor(Math.random() * (max - min)) + min;
}

TicTacToe.prototype.play = function(player, row, col){
	if (player == "computer"){
		var position = this.getMove();
		this.board[position.row][position.col] = this.player2.symbol;
	}
	else{
		this.board[row][col] = this.player1.symbol;

	}
		
	var isWinner = this.checkWinner();	
	if (isWinner){
		console.log("Winner is:", player);
	}
	
	var gameFinished = this.isGameFinished()
	if (gameFinished){
		console.log("Game has ended!");
	}
	//Switch players
	this.currentPlayer = (this.currentPlayer == this.player1) ? this.player2 : this.player1;

	return position;
};

//loop through all of the rows to see if there is a  horizontal, vertical, or diagonal line of 3 of one's own discs    
TicTacToe.prototype.checkWinner = function(){
	return false;
}

TicTacToe.prototype.isGameFinished = function(){
	//if there is  a winner return true;
	//else check if all of the 
	return false;
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

TicTacToe.prototype.reset = function(){
	//clear all properties
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = null;
	this.finished = false;
	this.winner = null;
	this.board = [
	[0,0,0],
	[0,0,0],
	[0,0,0]
	];
}

//model
var model = {
	game: {},
	initializeGame: function(){
		this.game = new TicTacToe();
		console.log("Initialized a new TicTacToe game! ")
		return this.game;
	},
	resetGame: function(){
		this.game.reset();
	}
};

var controller = {
	initializeGame: function(){
		console.log(model.initializeGame());
		console.log("Player1 choose your symbol");
	},
	setPlayers: function(name, symbol){
		model.game.setPlayers(name, symbol);
		console.log("Player1 is: ", model.game.player1.name, model.game.player1.symbol);
		console.log("Player2 is: ", model.game.player2.name, model.game.player2.symbol);
		console.log("Current player is: ", model.game.currentPlayer.name, model.game.currentPlayer.symbol);
		this.playGame();
	},
	playGame: function(){
		//Need a way to use setTimeout and clearTimeout to implement this function
		//while the game is not finished continue switching between players and let them select a move
		if (!model.game.finished){
			//if the curent player is the computer, then disable the board and let currentPlayer take a turn.
			if (model.game.currentPlayer.name == "computer"){
				console.log("It's the computer's turn!");
				//display that it is the computers turn to take a turn and disable board game
				var move = model.game.play("computer");
				console.log("Computer's move was: ", move);
				//show the computer's move on the screen
				this.playGame();
			}
			else{
				console.log("It's", model.game.currentPlayer.name, "'s turn!");
				//this.player1Turn();
				//display that it is player1's turn and enable board game
				//wait for player1 to make a turn
			}
		}else{
				this.stopGame();
		}
	
	},
	stopGame: function(){
		//display who won
		//if player1  won, then it's their turn
		//if computer  won, then it's their turn
		this.playGame();
	},
		//Once the game is finished, display who won or if it was a tie. 
		//Change current player to winner, and start game again
		//if game is reset, then stop game and display option to let player1 choose their symbol
	player1Turn: function(player1, row, col){
			
			model.game.play(player, row, col);
			console.log("Player1's move was: ", row,col);
			this.playGame();
	},
	resetGame: function(){
		//clearTimeout
		model.game.resetGame();
	}
};

//1) initialize game when this script is loaded
controller.initializeGame();
//2) Player 1 chooses whether they want to play as "X" or "O";
//3) Start game after player 1 chooses their symbol
//4) Check if player1 goes first or player 2 goes first then 
//5) Keep letting each player take turns on seelcting a position until someone 
//wins or the game is finished.
//6) Automatically start new game