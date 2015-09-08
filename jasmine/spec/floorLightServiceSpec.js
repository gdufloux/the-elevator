
describe("floorLight: the light service that controls the light at each floor", function() {

  var lightService, car, floors, calledFloors;
  
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
  
  describe("#updateLights: triggers the light update according to called floors and car occupation", function() {
    /*
      Red should mean that the car is occupied, 
      green should mean that it's coming to this floor, 
      and no light should mean that it's free to call.
    */
    it("should turn lights red when car is occupied", function() {
      calledFloors = [];
      car.occupied = true;
      lightService.updateLights(calledFloors, car);
      floors.forEach(function (floor) {
        expect(floor.light).toBe('red');
      });
    });
    it("should turn the light green at the floor the car is coming to", function() {
      calledFloors = [5,8];
      lightService.updateLights(calledFloors, car);
      expect(floors[5].light).toBe('green');
      expect(floors[6].light).toBe('red');
      expect(floors[8].light).toBe('green');
    });
    it("should turn lights off when car is free to call", function() {
      calledFloors = [];
      car.occupied = false;
      lightService.updateLights(calledFloors, car);
      floors.forEach(function (floor) {
        expect(floor.light).toBe('');
      });
    });
  });
  
});
