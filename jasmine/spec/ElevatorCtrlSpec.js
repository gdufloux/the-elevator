
describe("ElevatorCtrl: the elevator controller", function() {

  var scope, controller, callService;
  
  beforeEach(function() {
    module('elevator');
    inject(function($rootScope, $controller, _singleCall_) {
      scope = $rootScope.$new();
      controller = $controller('ElevatorCtrl', { $scope: scope });
      callService = _singleCall_;
    });
  });
  
  describe("car#active: indicate if the car is stationary at a given floor", function() {
    it("should be true when provided floor match current car floor", function() {
      scope.car.floor = 1;
      expect(scope.car.active(1)).toBe(true);
    });
    it("should be false when provided floor does not match current car floor", function() {
      scope.car.floor = 1;
      expect(scope.car.active(2)).toBe(false);
    });
  });
  
  // User controls
  
  describe("car#stepIn: action to enter the car", function() {
    it("should be detected as an occupied car", function() {
      scope.car.occupied = false
      scope.car.stepIn();
      expect(scope.car.occupied).toBe(true);
    });
  });
  
  describe("car#stepOut: action to leave the car", function() {
    it("should be detected as an empty car", function() {
      scope.car.occupied = true
      scope.car.stepOut();
      expect(scope.car.occupied).toBe(false);
    });
  });
    
  describe("car#canStepIn: conditions to enter the car", function() {
    it("should be true when the car is stationary and open", function() {
      scope.car.occupied = false;
      scope.car.dir = 0;
      scope.car.open = true;
      expect(scope.car.canStepIn()).toBe(true);
    });
    it("should be false when the car is moving", function() {
      scope.car.occupied = false;
      scope.car.dir = 1;
      scope.car.open = true;
      expect(scope.car.canStepIn()).toBe(false);
    });
    it("should be false when the door is close", function() {
      scope.car.occupied = false;
      scope.car.dir = 1;
      scope.car.open = false;
      expect(scope.car.canStepIn()).toBe(false);
    });
    it("should be false when the car is occupied", function() {
      scope.car.occupied = true;
      scope.car.dir = 0;
      scope.car.open = true;
      expect(scope.car.canStepIn()).toBe(false);
    });
  });
  
  describe("car#canStepOut: conditions to leave the car", function() {
    it("should be true when the car is stationary and open", function() {
      scope.car.occupied = true;
      scope.car.dir = 0;
      scope.car.open = true;
      expect(scope.car.canStepOut()).toBe(true);
    });
    it("should be false when the car is moving", function() {
      scope.car.occupied = true;
      scope.car.dir = 1;
      scope.car.open = true;
      expect(scope.car.canStepOut()).toBe(false);
    });
    it("should be false when the door is close", function() {
      scope.car.occupied = true;
      scope.car.dir = 1;
      scope.car.open = false;
      expect(scope.car.canStepOut()).toBe(false);
    });
    it("should be false when the car is empty", function() {
      scope.car.occupied = false;
      scope.car.dir = 0;
      scope.car.open = true;
      expect(scope.car.canStepOut()).toBe(false);
    });
  });
  
  describe("car#openDoor: action to open the car door", function() {
    it("should set the car as open", function() {
      scope.car.open = false;
      scope.car.openDoor();
      expect(scope.car.open).toBe(true);
    });
  });
  
  describe("car#closeDoor: action to close the car door", function() {
    it("should set the car as close", function() {
      scope.car.open = true;
      scope.car.closeDoor();
      expect(scope.car.open).toBe(false);
    });
  });
  
  // Car movement
  
  describe("car#up: moves the car up", function() {
    it("should set direction to 1 and go to floor+1", function() {
      scope.car.floor = 1;
      scope.car.dir = 0;
      scope.car.up();
      expect(scope.car.dir).toBe(1);
      expect(scope.car.floor).toBe(2);
    });
  });
  
  describe("car#down: moves the car down", function() {
    it("should set direction to -1 and go to floor-1", function() {
      scope.car.floor = 1;
      scope.car.dir = 0;
      scope.car.up();
      expect(scope.car.dir).toBe(1);
      expect(scope.car.floor).toBe(2);
    });
  });
  
  describe("car#stop: stops the car", function() {
    it("should set direction to 0", function() {
      scope.car.dir = 1;
      scope.car.stop();
      expect(scope.car.dir).toBe(0);
    });
  });
  
  describe("panel#press: action to press a button on the panel of the car", function() {
    it("should register floor call", function() {
      scope.panel.press(5);
      expect(callService.calls).toContain(5);
    });
  });
  
  describe("floor#call: action to press the call button at a given floor", function() {
    it("should register floor call", function() {
      scope.floors[3].call();
      expect(callService.calls).toContain(3);
    });
  });
  
  describe("move: the logic that moves the elevator", function() {
    // Helper function to simulate timelapse
    function moves(n) {
      for (var i=1; i<=n; i++) scope.move();
    }
    it("should do nothing without call", function() {
      scope.car.floor = 1;
      moves(2);
      expect(scope.car.floor).toBe(1);
    });
    it("should move the car up to the expected floor", function() {
      scope.car.floor = 1;
      scope.panel.press(3);
      moves(2);
      expect(scope.car.floor).toBe(3);
    });
    it("should move the car down to the expected floor", function() {
      scope.car.floor = 3;
      scope.panel.press(1);
      moves(2);
      expect(scope.car.floor).toBe(1);
    });
  });
  
});

describe("floorLight: the light service that controls the light at each floor", function() {

  var lightService, car, floors, upcomingFloors;
  
  beforeEach(function() {
    module('elevator');
    inject(function(_floorLight_) {
      lightService = _floorLight_
    });
    // stub car and floors
    car = {occupied: false};
    floors = [];
    for (var i=10; i>0; i--) floors.push({title:i, light: null});
    floors.forEach(function (floor,n) { floor.n = n });
    lightService.setFloors(floors);
  });
  
  describe("#updateLights: triggers the light update according to upcoming floors and car occupation", function() {
    /*
      Red should mean that the car is occupied, 
      green should mean that it's coming to this floor, 
      and no light should mean that it's free to call.
    */
    it("should turn lights red when car is occupied", function() {
      upcomingFloors = [];
      car.occupied = true;
      lightService.updateLights(upcomingFloors, car);
      floors.forEach(function (floor) {
        expect(floor.light).toBe('red');
      });
    });
    it("should turn the light green at the floor the car is coming to", function() {
      upcomingFloors = [5,8];
      lightService.updateLights(upcomingFloors, car);
      expect(floors[5].light).toBe('green');
      expect(floors[6].light).toBe('red');
      expect(floors[8].light).toBe('green');
    });
    it("should turn lights off when car is free to call", function() {
      upcomingFloors = [];
      car.occupied = false;
      lightService.updateLights(upcomingFloors, car);
      floors.forEach(function (floor) {
        expect(floor.light).toBe('');
      });
    });
  });
  
});
