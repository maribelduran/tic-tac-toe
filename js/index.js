function TicTacToe(){
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = {};
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

TicTactoToe.prototype.setPlayer = function(player, symbol){
	this.player1 = new player(player, symbol);
	this.player2 = new player("computer", (player1.symbol == "X") ? "O": "X");
};

TicTactoToe.prototype.play = function(player, row, col){
//update board with the location the player chose
	if (player == "computer"){
		var position = getMove();
		this.board[position.row][position.col] = this.player2.symbol;
	}
	else{
		this.board[row][col] = this.player1.symbol;
	}
		
	var isWinner = this.checkWinner	
	//if there is a winner, display who won and restart (reset) the game
	if (isWinner){
		console.log("Winner is:", player);

	}
		//if the game has finished display a tie game and restart (reset) game
	if (finished){
		console.log("Game has ended!");
	}
	//Switch players
};

//loop through all of the rows to see if there is a  horizontal, vertical, or diagonal line of 3 of one's own discs    
TicTactoToe.prototype.checkWinner = function(){
	return false;
}

//returns an array that represents the row and column position
TicTactoToe.prototype.getMove = function(){
	var position = {
		"row": 0,
		"col": 0
	}
	return position;
}

TicTactoToe.prototype.reset = function(){
	//clear all properties
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = {};
	this.finished = false;
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
		console.log("Initialized a new TicTacToe game! woo!")
	}
};

var controller = {
	initializeGame: function(){
		model.initializeGame();
	},
	setPlayer: function(symbol){
		model.game.setPlayer(symbol);
	}
};


//1) initialize game when this script loaded
//controller.initializeGame();
//2) Player 1 chooses whether they want to play as "X" or "O";
//3) Start game after player 1 chooses their symbol
//4) Check if player1 goes first or player 2 goes first then 
//5) Keep letting each player take turns on seelcting a position until someone 
//wins or the game is finished.
//6) Automatically start new game