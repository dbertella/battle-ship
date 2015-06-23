(function() {
	// store the array of object of coordinates
	function protoCoordinate(xVal, yVal, array) {
		array.push({
		x: xVal,
		y: yVal,
		ship: false
		});
	}
	// creating the field that take the size as a parameter
	var createField = function(sizeXY) {
	var axis = [],
		alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();

	for (var y = 0; y < sizeXY; y++) {
		for (var x = 0; x < sizeXY; x++) {
		protoCoordinate(x, alphabet[y], axis);
		}
	}
	return axis;
	}
	var battleField = createField(10);
	var removedSquare = [];
	
	var createShip = function(ship) {
		var index = random();

		if (checkIfSpaceIsFree(index, ship.length)) {
			battleField[index].ship = true;
			removedSquare = removedSquare.concat([index, index + 1, index -1, index + 10, index -10]);
			
			// if random is even the ship is in vertical position
			if (index % 2 === 0) {
				for (var inc = 1; inc < ship.length; inc++) {
					if (battleField[index].x <= 5) {
						battleField[index + inc].ship = true;
						removedSquare = removedSquare.concat([index + inc, index + inc + 1, index + inc -1, index + inc + 10, index + inc -10]);
					} else {
						battleField[index - inc].ship = true;
						removedSquare = removedSquare.concat([index - inc, index - inc + 1, index - inc -1, index - inc + 10, index - inc -10]);
					}
				}
			} else {
				// else is horizzontal 
				for (var j = 1; j < ship.length; j++) {
					if (index <= 50) {
						battleField[index + j * 10].ship = true;
						removedSquare = removedSquare.concat([index + j * 10, index + j * 10 + 1, index + j * 10 -1, index + j * 10 + 10, index + j * 10 -10]);
					} else {
						battleField[index - j * 10].ship = true;
						removedSquare = removedSquare.concat([index - j * 10, index - j * 10 + 1, index - j * 10 -1, index - j * 10 + 10, index - j * 10 -10]);
					}
				}
			}
		} else {
			console.log(index);
			createShip(ship);
		}
	}
	var positionShips = function() {
		var ships = [{
			length: 5,
			name: "Battleship"
		},
		{
			length: 4,
			name: "Destroyer-1"
		},
		{
			length: 4,
			name: "Destroyer-2"
		}];
		for (var i = 0; i < ships.length; i++) {
			createShip(ships[i]);
		}
		return ships;
	}

	positionShips();
	console.log(removedSquare);
	// Check if the ship can stay in the space
	function checkIfSpaceIsFree(index, shipLength) {
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
	function random() {
		return Math.floor(Math.random() * 100);
	}

	// visual part to see and debug
	var battleFieldArray = battleField.map(function(s, i) {
		return s.y + s.x;
	});

	var htmlBattleField = '';
	for (var i = 1; i <= battleFieldArray.length; i++) {
		htmlBattleField += '<span class="ship-' + battleField[i - 1].ship + '">' + battleFieldArray[i - 1] + '</span>';
		if (i % 10 === 0) {
			htmlBattleField += '<br />';
		}
	}
	document.getElementById("content").innerHTML = htmlBattleField;

})()