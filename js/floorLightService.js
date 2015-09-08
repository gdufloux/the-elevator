angular.module("elevator").
    
  // Light service that controls the light (red or green) at each floor
  service("floorLight", function floorLightService() {
    this.floors = [];
    this.setFloors = function(floors) {
      this.floors = floors;
    };
    this.updateLights = function(calledFloors, car) {
      var color;
      function calledFloor(n) {
        return calledFloors.indexOf(n) > -1;
      }
      if (calledFloors.length > 0) {
        // car is busy, color relies on called floors
        this.floors.forEach(function (floor) {
          color = calledFloor(floor.n) ? 'green' : 'red';
          floor.light = color;
        });
      } else {
        // car is stationary, color only relies on occupation
        color = car.occupied ? 'red' : '';
        this.floors.forEach(function (floor) {
          floor.light = color;
        });
      }
    };
  });