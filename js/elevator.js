angular.module("elevator", []).

  // Call service for elevators that can fulfill one request at a time
  service("singleCall", function singleCallService(){
    this.calls = [];
    this.addFloor = function(n) {
      if (this.calls.length == 0) {
        this.calls = [n];
      }
    };
    this.nextFloor = function() {
      return this.calls[0];
    };
    this.removeFloor = function(n) {
      if (this.calls.indexOf(n) > -1) {
        this.calls.splice(this.calls.indexOf(n), 1);
      }
    };
  }).
  
  // Elevator controller
  controller("ElevatorCtrl", ["$scope", "$interval", "singleCall", function ($scope, $interval, callService) {
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
      canOpen: function (n) {
        // TODO
        return false;
      },
      stepIn: function () { this.occupied = true },
      stepOut: function () { this.occupied = false },
      
      up: function() { this.dir = 1; this.floor += 1 },
      down: function() { this.dir = -1; this.floor -= 1 },
      stop: function() { this.dir = 0 },
      
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
        return null;
      },
      press: function (n) {
        callService.addFloor(n);
      },
      stop: function () {
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

    // The logic that moves the elevator 
    // Let's keep it outside $interval for testing reasons
    var move = $scope.move = function(n) {
      var nextFloor = callService.nextFloor();
      if (nextFloor !== undefined) {
        if (nextFloor == car.floor) {
          car.stop();
          callService.removeFloor(nextFloor);
        } else if (nextFloor > car.floor) {
          car.up();
        } else {
          car.down();
        }
      }
    }
    
    $interval(function () {
      move();
    }, 1000);
  }]);
