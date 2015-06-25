(function() {

  var removedSquare = [],
    battleField = createField(10),
    feedback = '',
    battleFieldArray = battleField.map(function(s, i) {
      return s.y + s.x;
    }),
    shipsArray = [{
      size: 5,
      name: "battleship",
      hit: 0
    }, {
      size: 4,
      name: "destroyer-1",
      hit: 0
    }, {
      size: 4,
      name: "destroyer-2",
      hit: 0
    }],
    shipsToSunk = shipsArray.slice(0);

  function positionRandomShip(ship) {
    var index = randomElement();

    if (checkIfSpaceIsFree(index, ship.size)) {
      battleField[index].ship = ship.name;
      // removeSquare is the array to keep track of every square already used.
      //I'll add all the square around the one used to avoid ship collision
      removedSquare = removedSquare.concat([index, index + 1, index - 1, index + 10, index - 10]);

      // if random is even the ship is in vertical position 
      if (index % 2 === 0) {
        for (var inc = 1; inc < ship.size; inc++) {
          if (battleField[index].x <= 5) {
            battleField[index + inc].ship = ship.name;
            removedSquare = removedSquare.concat([index + inc, index + inc + 1, index + inc - 1, index + inc + 10, index + inc - 10]);
          } else {
            battleField[index - inc].ship = ship.name;
            removedSquare = removedSquare.concat([index - inc, index - inc + 1, index - inc - 1, index - inc + 10, index - inc - 10]);
          }
        }
      } else {
        // else is horizzontal position
        for (var j = 1; j < ship.size; j++) {
          if (index <= 50) {
            battleField[index + j * 10].ship = ship.name;
            removedSquare = removedSquare.concat([index + j * 10, index + j * 10 + 1, index + j * 10 - 1, index + j * 10 + 10, index + j * 10 - 10]);
          } else {
            battleField[index - j * 10].ship = ship.name;
            removedSquare = removedSquare.concat([index - j * 10, index - j * 10 + 1, index - j * 10 - 1, index - j * 10 + 10, index - j * 10 - 10]);
          }
        }
      }
    } else {
      positionRandomShip(ship);
    }
  }
  
  function initGame() {
   
    for (var i = 0; i < shipsArray.length; i++) {
      positionRandomShip(shipsArray[i]);
    }
    drawTheHtml();
  }

  // HELPERS
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
  function randomElement() {
      return Math.floor(Math.random() * 100);
  }
    // store the array of object of coordinates
  function protoCoordinate(xVal, yVal, array) {
      array.push({
        x: xVal,
        y: yVal,
        ship: false,
        shooted: false
      });
    }
    // creating the field that take the size as a parameter
  function createField(sizeXY) {
    var axis = [],
      alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();

    for (var y = 0; y < sizeXY; y++) {
      for (var x = 0; x < sizeXY; x++) {
        protoCoordinate(x, alphabet[y], axis);
      }
    }
    return axis;
  }

  function playerShooting(coord) {

    if (checkCoord(coord)) {
      if (isCoordNotUsed(coord)) {
        var playerShoot = coord.toUpperCase(),
          index = battleFieldArray.indexOf(playerShoot),
          shipName;

        if (battleField[index].ship) {
          shipName = battleField[index].ship;
          battleField[index].ship = 'hit';
          console.log('Player hit: ' + playerShoot);
          feedback = '<p class="user">Player hit: ' + playerShoot + '</p>' + feedback;
          if (isShipSunk(shipName)) {
            console.log(shipName + ' sunk');
            feedback = '<p class="red">!!! ' + shipName + ' sunk !!!</p>' + feedback;
            if (isGameFinish(shipName)) {
              console.log('You win!');
              feedback = '<p class="red">### You win! ###</p>' + feedback;
            } else {
              feedback = '<p class="user">Your turn again</p>' + feedback;
            }
          }
          //playerShooting();
        } else {
          battleField[index].ship = 'missed';
          console.log('Player missed: ' + playerShoot);

          feedback = '<p class="user">Player missed: ' + playerShoot + '</p>' + feedback;

          cpuShooting();
        }
      } else {
        console.log('coordinates used already, please insert again');
        feedback = '<p class="err">Coordinates used already, please insert again</p>' + feedback;
        //playerShooting();
      }
      document.getElementById('feedback').innerHTML = feedback;
      drawTheHtml();

    } else {
      console.log('wrong coordinates, please insert again');
      feedback = '<p class="err">Wrong coordinates, please insert again</p>' + feedback;
      document.getElementById('feedback').innerHTML = feedback;
      //playerShooting();
    }
  }

  function cpuShooting(i) {
    var index = i || randomElement();

    if (isCoordNotUsed(0, index)) {
      if (battleField[index].ship) {
        
        shipName = battleField[index].ship;
        battleField[index].ship = 'hit';
        console.log('CPU hit ' + battleField[index].x, battleField[index].y);
        feedback = '<p class="cpu">CPU hit</p>' + feedback;
        if (isShipSunk(shipName)) {
          console.log(shipName + ' sunk');
          feedback = '<p class="red">!!! ' + shipName + ' sunk !!!</p>' + feedback;
          if (isGameFinish(shipName)) {
            console.log('Cpu win!');
            feedback = '<p class="red">### CPU win! ###</p>' + feedback;
            return;
          } else {
            feedback = '<p class="cpu">CPU play again</p>' + feedback;
          }
        }
        var newIndex = cpuIntelligence(index);
        //debugger;
        cpuShooting(newIndex);

      } else {
        battleField[index].ship = 'missed';
        console.log('Cpu missed' + battleField[index].x, battleField[index].y);
        console.log('Is your turn');
        feedback = '<p class="cpu">Cpu missed! Is your turn</p>' + feedback;
      }
    } else {
      cpuShooting();
    }
  }

  function cpuIntelligence(index) {
    var possibleIndex = [],
    	returnIndexArray = [];

    if (index <= 10) {
    	if (index == 0) {
    		possibleIndex = [index + 10, index + 1];
    	} else {
    		possibleIndex = [index + 10, index + 1, index - 1];
    	}
    } else if (index >= 90) {
    	if (index == 99) {
    		possibleIndex = [index - 10, index - 1];
    	} else {
    		possibleIndex = [index - 10, index + 1, index - 1];
    	}
    } else {
    	possibleIndex = [index - 10, index + 10, index + 1, index - 1];
    }
    returnIndexArray = possibleIndex.slice(0);
    
    var rand = function (val) {
    	return Math.floor(Math.random() * val);
    }
    return returnIndexArray[rand(possibleIndex.length -1)];
  }

  function checkCoord(coord) {
      var alphabet = "abcdefghij".toUpperCase();
      if (coord) {
        coord = coord.toUpperCase();
        if (alphabet.indexOf(coord[0]) > -1 && coord[1] >= 0 && coord[1] < 10) {
          return true;
        }
      }
      return false;

    }
    // checking if the coordinate is already being used
  function isCoordNotUsed(coord, i) {
      var index;
      if (coord) {
        index = battleFieldArray.indexOf(coord.toUpperCase());
      } else {
        index = i;
      }
      if (battleField[index].shooted === true) {
        return false;
      } else {
        battleField[index].shooted = true;
        return true;
      }
    }
    // checking if ship is sunk
  function isShipSunk(shipName) {
      var ship = _.find(shipsToSunk, {
        "name": shipName
      });
      ship.hit++;
      if (ship.size === ship.hit) {
        return true;
      } else {
        return false;
      }
    }
    // checking if all the ships are sunk
  function isGameFinish(shipName) {
    var ship = _.find(shipsToSunk, {
      "name": shipName
    });
    var index = shipsToSunk.indexOf(ship);
    shipsToSunk.splice(index, 1);
    if (shipsToSunk.length > 0) {
      return false;
    } else {
    	document.getElementById("coordinates").disabled = true;
    	document.getElementById("submit").disabled = true;
      return true;
    }
  }

  // visual part to see and debug
  function drawTheHtml() {
    var htmlBattleField = '';
    for (var i = 1; i <= battleFieldArray.length; i++) {
      htmlBattleField += '<span class="ship-' + battleField[i - 1].ship + '">' + battleFieldArray[i - 1] + '</span>';
      if (i % 10 === 0) {
        htmlBattleField += '<br />';
      }
    }
    document.getElementById("content").innerHTML = htmlBattleField;
  }

  document.getElementById("submit").addEventListener('click', function(e) {
    e.preventDefault();
    playerShooting(document.getElementById("coordinates").value);
    document.getElementById("coordinates").value = '';
  });

  // game initialization
  initGame();
})()
