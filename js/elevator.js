angular.module("elevator", []).
  
  // Elevator controller
  controller("ElevatorCtrl", ["$scope", "$interval", "singleCall", "floorLight", function ($scope, $interval, callService, lightService) {
    // Object representing the car
    var car = $scope.car = {
      active: function (n) {
        return this.floor == n;
      },
      state: function () {
        var r = this.occupied ? "Occpd " : "Empty ";
        switch (this.dir) {
          case -1: r += "↑↑↑↑"; break;
          case  1: r += "↓↓↓↓"; break;
          case  0: r += this.open ? "OPEN" : "STOP";
        }
        return r;
      },
      
      openOuterDoor: function(n) { floors[n].open = true },
      closeOuterDoor: function(n) { floors[n].open = false },
      canOpenOuterDoor: function(n) { return this.stationary() && this.active(n) && !floors[n].open },
      outerDoorOpen: function() { return floors[this.floor].open },
      automaticOuterDoorOpening: false,
      
      stepIn: function () { this.occupied = true },
      stepOut: function () { this.occupied = false },
      
      canStepIn: function() { return this.stationary() && this.open && !this.occupied && this.outerDoorOpen(this.floor) },
      canStepOut: function() { return this.stationary() && this.open && this.occupied && this.outerDoorOpen(this.floor) },
      
      openDoor: function() { this.open = true },
      closeDoor: function() { this.open = false },
      
      up: function() { this.dir = 1; this.floor += 1 },
      down: function() { this.dir = -1; this.floor -= 1 },
      stop: function() { 
        this.dir = 0; 
        this.automaticOuterDoorOpening && this.openOuterDoor(this.floor);
      },
      stationary: function() { return this.dir == 0 },
      
      dir: 0,
      floor: 3,
      open: false,
      occupied: false
    }

    // Object representing the control panel in the car
    $scope.panel = {
      btnClass: function (n) {
        // This can be used to emulate a LED light near or inside the button
        // to give feedback to the user.
        var cssClasses = [];
        if (car.active(n)) { cssClasses.push('currentFloor') };
        if (callService.calledFloor(n)) { cssClasses.push('called') };
        return cssClasses.join(' ');
      },
      press: function (n) {
        callService.addFloor(n);
      },
      stop: function () {
        car.stop();
        callService.reset();
      },
      showOpenDoorWarning: function() {
        return car.open && car.occupied && callService.calls.length > 0 
      }
    }

    // Floors
    var floors = $scope.floors = [];
    for (var i=10; i>0; i--) floors.push({title:i});
    floors.push({title:"G"});

    // Let's have them know their indices. Zero-indexed, from top to bottom.
    // Also let's initialize them.
    floors.forEach(function (floor,n) {
      floor.n = n;
      floor.open = false;
      floor.light = null;
      floor.call = function () {
        callService.addFloor(this.n);
      };
    });

    // Setup floor light service
    lightService.setFloors(floors);

    // The logic that moves the elevator 
    // Let's keep it outside $interval for testing reasons
    var move = $scope.move = function(n) {
      var nextFloor = callService.nextFloor();
      if (nextFloor !== undefined) {
        if (car.open && car.occupied) {
          // the elevator car shall not move if it's occupied _and_ the inner door is not shut (case stationary)
          // stop immediately if the inner door is opened during travel (case moving)
          car.stop();
        } else if (nextFloor == car.floor) {
          car.stop();
          callService.removeFloor(nextFloor);
        } else if (car.outerDoorOpen()) {
          car.closeOuterDoor(car.floor);
        } else if (nextFloor > car.floor) {
          car.up();
        } else {
          car.down();
        }
      }
      var calledFloors = callService.calls;
      lightService.updateLights(calledFloors, car);
    }
    
    $interval(function () {
      move();
    }, 1000);
  }]);
