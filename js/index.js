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

TicTacToe.prototype.play = function(player, row, col){
	//place symbol
	if (player == "computer"){
		var position = this.getMove();
		this.board[position.row][position.col] = this.player2.symbol;
	}
	else{
		this.board[row][col] = this.player1.symbol;
	}
	//check if there is a winner	
	var isWinner = this.checkWinner();	
	if (isWinner){
		console.log("found a winner!");
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
	 				return true;
        }
      }
  }
  //checks if there is a vertical line of 3 of one's own symbol
  for (col=0, row=0; col<=2; col++){
  	if (this.board[row][col] === this.board[row+1][col] && this.board[row][col]!= 0){
  		if (this.board[row+1][col] === this.board[row+2][col]){
	 				return true;
        }
   }
 	}
 	col=0, row=0;
 	//checks if there is a diagonal line of 3 of one's own symbol
  	if (this.board[row][col] === this.board[row+1][col+1] && this.board[row][col]!= 0){
  		if (this.board[row+1][col+1] === this.board[row+2][col+2]){
	 				return true;
        }
   }
	col=0, row=0;

 	//checks if there is a diagonal line of 3 of one's own symbol
 	if (this.board[row+2][col] === this.board[row+1][col+1] && this.board[row+2][col]!=0){
 		if (this.board[row+1][col+1] == this.board[row][col+2]){
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

TicTacToe.prototype.reset = function(){
	//clear all properties
	this.player1 = {};
	this.player2 = {};
	this.currentPlayer = null;
	this.winner = null;
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
		console.log("Initialized a new TicTacToe game! ")
		return this.game;
	}
};

var controller = {
	initializeGame: function(){
		model.setupGame();
		//console.log("Player1 choose your symbol");
	},
	setPlayers: function(name, symbol){
		model.game.setPlayers(name, symbol);
		//$(".player1").html(model.game.player1.symbol);
		document.getElementsByClassName("player1")[0].innerHTML = model.game.player1.symbol;
		document.getElementsByClassName("computer")[0].innerHTML = model.game.player2.symbol;

		document.getElementsByClassName("boxList")[0].style.opacity = 1;
		//document.getElementsByClassName("symbolOptions")[0].style.opacity = 0;
		 $('.symbolOptions').fadeOut();
		//document.getElementById("X").style.opacity = 0;
		//document.getElementById("O").style.opacity = 0;
		this.playGame();
	},
	playGame: function(move){
		console.log(move);
		//while the game is not finished continue switching between players and let them select a move
		if (!model.game.finished){
			//if the curent player is the computer, then disable the board and let computer take a turn
			if (model.game.currentPlayer.name == "computer"){
				console.log("It's the computer's turn!");
				document.getElementsByClassName("computersTurn")[0].classList.add('show');
				document.getElementsByClassName("player1Turn")[0].classList.remove('show');
				var move = model.game.play("computer");
				console.log("Computer's move was: ", move);
				//show the computer's move on the screen
				this.playGame();
			}
			//display that it is player1's turn and enable board game
			else{
				console.log("It's", model.game.currentPlayer.name, "'s turn!");
				document.getElementsByClassName("player1Turn")[0].classList.add('show');
				document.getElementsByClassName("computersTurn")[0].classList.remove('show');
			}
		}else{
			this.stopGame();
		}
	},
	stopGame: function(){
		//Once the game is finished, display who won or if it was a tie. 
		//if there is no winner, then set the player using the "random" setting
		console.log("Winner is:", model.game.winner);
		model.game.clearBoard();
		this.playGame();
	},	
	player1Turn: function(player1, row, col){
			model.game.play(player, row, col);
			console.log("Player1's move was: ", row,col);
			$(".player1").html(model.game.player1.symbol);
			this.playGame();
	},
	resetGame: function(){
		model.game.reset();
		console.log("Player1 choose your symbol");
	}
};

var view = {
	setUpEventListeners: function(){

		var btnEntry = {
			"box0": [0,0],
			"box1": [0,1],
			"box2": [0,2],
			"box3": [1,0],
			"box4": [1,1],
			"box5": [1,2],
			"box6": [2,0],
			"box7": [2,1],
			"box8": [2,2],
		};

		var boxListItems = document.getElementsByTagName("li");
   		for (var i = 0; i < boxListItems.length; i++) {
    		boxListItems[i].addEventListener("click", function(){
    		//controller.playGame(btnEntry[this.classList[0]);
    		controller.playGame(btnEntry[this.id]);
        	});
    	}
		/*for (var id in btnEntry){
			document.getElementById(id).addEventListener("click", function(){
				controller.playGame(btnEntry[this.id]);
		 	});
		}
		*/
		document.getElementById("X").addEventListener("click", function(){
				controller.setPlayers("player1", "X");
		 });

		document.getElementById("O").addEventListener("click", function(){
				controller.setPlayers("player1", "O");
		 });
	}
};

//initializes the game when this script is loaded
controller.initializeGame();
view.setUpEventListeners();