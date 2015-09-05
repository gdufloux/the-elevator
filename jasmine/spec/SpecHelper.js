beforeEach(function () {
  jasmine.addMatchers({
    // Usage: expect(scope.car).toBeAtFloor(1);
    toBeAtFloor: function () {
      return {
        compare: function (car, expectedFloor) {
          return {
            pass: car.floor == expectedFloor
          };
        }
      };
    }
  });
});
