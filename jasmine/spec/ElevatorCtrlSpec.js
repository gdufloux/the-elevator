
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
