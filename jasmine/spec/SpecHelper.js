beforeEach(function () {
  jasmine.addMatchers({
    // Usage: expect(array).toBeEmpty();
    toBeEmpty: function () {
      return {
        compare: function (actual) {
          return {
            pass: actual.length == 0
          };
        }
      };
    },
    // Usage: expect(scope.car).toBeAtFloor(1);
    toBeAtFloor: function () {
      return {
        compare: function (car, expectedFloor) {
          return {
            pass: car.floor == expectedFloor,
            message: "Expected car to be at floor " + expectedFloor + " but was at floor " + car.floor
          };
        }
      };
    },
    // Usage: expect(scope.car).toBeStopped();
    toBeStopped: function () {
      return {
        compare: function (car) {
          return {
            pass: car.dir == 0
          };
        }
      };
    }
  });
});
