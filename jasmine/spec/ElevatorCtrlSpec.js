
describe("ElevatorCtrl", function() {

  var scope, controller;
  
  beforeEach(function() {
    module('elevator');
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller('ElevatorCtrl', { $scope: scope });
    });
  });
  
  describe("car#active", function() {
    it("should be true when provided floor match current car floor", function() {
      scope.car.floor = 1;
      expect(scope.car.active(1)).toBe(true);
    });
    it("should be false when provided floor does not match current car floor", function() {
      scope.car.floor = 1;
      expect(scope.car.active(2)).toBe(false);
    });
  });
  
});