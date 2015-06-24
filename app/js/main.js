(function() {
	
	var removedSquare = [],
		battleField = __createField(10);
	
	var positionRandomShip = function(ship) {
		var index = __randomElement();

		if (__checkIfSpaceIsFree(index, ship.length)) {
			battleField[index].ship = ship.name;
			removedSquare = removedSquare.concat([index, index + 1, index -1, index + 10, index -10]);
			
			// if random is even the ship is in vertical position
			if (index % 2 === 0) {
				for (var inc = 1; inc < ship.length; inc++) {
					if (battleField[index].x <= 5) {
						battleField[index + inc].ship = ship.name;
						removedSquare = removedSquare.concat([index + inc, index + inc + 1, index + inc -1, index + inc + 10, index + inc -10]);
					} else {
						battleField[index - inc].ship = ship.name;
						removedSquare = removedSquare.concat([index - inc, index - inc + 1, index - inc -1, index - inc + 10, index - inc -10]);
					}
				}
			} else {
				// else is horizzontal 
				for (var j = 1; j < ship.length; j++) {
					if (index <= 50) {
						battleField[index + j * 10].ship = ship.name;
						removedSquare = removedSquare.concat([index + j * 10, index + j * 10 + 1, index + j * 10 -1, index + j * 10 + 10, index + j * 10 -10]);
					} else {
						battleField[index - j * 10].ship = ship.name;
						removedSquare = removedSquare.concat([index - j * 10, index - j * 10 + 1, index - j * 10 -1, index - j * 10 + 10, index - j * 10 -10]);
					}
				}
			}
		} else {
			positionRandomShip(ship);
		}
	}
	var initGame = function() {
		var ships = [
			{
				length: 5,
				name: "battleship",
				hit: 0
			},
			{
				length: 4,
				name: "destroyer-1",
				hit: 0
			},
			{
				length: 4,
				name: "destroyer-2",
				hit: 0
			}
		];

		for (var i = 0; i < ships.length; i++) {
			positionRandomShip(ships[i]);
		}
	}
	
	// game initialization
	initGame();


	// HELPERS
	// Check if the ship can stay in the space
	function __checkIfSpaceIsFree(index, shipLength) {
		if (removedSquare.indexOf(index) === -1) { 
			if (index % 2 === 0) {
				for (var inc = 1; inc < shipLength; inc++) {
					if (battleField[index].x <= 5) {
						if (removedSquare.indexOf(index + inc) > -1) {
							return false;
						} 
					} else {
						if (removedSquare.indexOf(index - inc) > -1) {
							return false;
						}
					}
				}
			} else {
				// else is horizzontal 
				for (var j = 1; j < shipLength; j++) {
					if (index <= 50) {
						if (removedSquare.indexOf(index + j * 10) > -1) {
							return false;
						}
					} else {
						if (removedSquare.indexOf(index - j * 10) > -1) {
							return false;
						}
					}
				}
			}
			return true;
		} else {
			return false;
		}
	}

	// Get a random position
	function __randomElement() {
		return Math.floor(Math.random() * 100);
	}
	// store the array of object of coordinates
	function __protoCoordinate(xVal, yVal, array) {
		array.push({
		x: xVal,
		y: yVal,
		ship: false
		});
	}
	// creating the field that take the size as a parameter
	function __createField(sizeXY) {
		var axis = [],
			alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();

		for (var y = 0; y < sizeXY; y++) {
			for (var x = 0; x < sizeXY; x++) {
			__protoCoordinate(x, alphabet[y], axis);
			}
		}
		return axis;
	}

	var battleFieldArray = battleField.map(function(s, i) {
		return s.y + s.x;
	});

	function playerShooting (coord) {
		var playerShoot = coord,
			alphabet = "abcdefghij".toUpperCase();



		if (playerShoot != null) {
			playerShoot = playerShoot.toUpperCase()
			if(alphabet.indexOf(playerShoot[0]) > -1 && playerShoot[1] >= 0 && playerShoot[1] < 10 ) {

			    var index = battleFieldArray.indexOf(playerShoot),
			    	shipName;

			    if (battleField[index].ship) {
			    	shipName = battleField[index].ship;
			    	battleField[index].ship = 'hit';
			    	console.log('Player hit: ' + playerShoot);
			    	if (isShipSunk(shipName)) {
			    		console.log(shipName + ' sunk');
			    		if(isGameFinish(shipName)) {
			    			console.log('You win!');	
			    		};
			    	} 
			    	playerShooting();
			    } else {
			    	battleField[index].ship = 'missed';
			    	console.log('Player missed: ' + playerShoot);
			    	cpuShooting();
			    }
			} else {
				console.log('wrong coordinates, please insert again');
				playerShooting();
			}
		}
	}
	function cpuShooting() {
		var index = __randomElement();
		if (battleField[index].ship) {
			battleField[index].ship = 'hit';
			console.log('Cpu hit' );
			cpuShooting();
		} else {
			battleField[index].ship = 'missed';
			console.log('Cpu missed');
			playerShooting();
		}
	}
	var shipsToSunk = [
		{
			size: 5,
			name: "battleship",
			hit: 0
		},
		{
			size: 4,
			name: "destroyer-1",
			hit: 0
		},
		{
			size: 4,
			name: "destroyer-2",
			hit: 0
		}
	];
	function isShipSunk(shipName) {
		var ship = _.find(shipsToSunk, {"name": shipName});
		ship.hit++;		
		if(ship.size === ship.hit) {
			return true;
		} else {
			return false;
		}
	}

	function isGameFinish(shipName) {
		var ship = _.find(shipsToSunk, {"name": shipName});
		var index = shipsToSunk.indexOf(ship);
		shipsToSunk.splice(index, 1);
		if (shipsToSunk.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	// visual part to see and debug
	
	var htmlBattleField = '';
	for (var i = 1; i <= battleFieldArray.length; i++) {
		htmlBattleField += '<span class="ship-' + battleField[i - 1].ship + '">' + battleFieldArray[i - 1] + '</span>';
		if (i % 10 === 0) {
			htmlBattleField += '<br />';
		}
	}
	document.getElementById("content").innerHTML = htmlBattleField;

	document.getElementById("submit").addEventListener('click', function (e) {
		e.preventDefault();
		playerShooting(document.getElementById("coordinates").value);
	});

})()