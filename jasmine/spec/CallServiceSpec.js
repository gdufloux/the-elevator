
describe("singleCall: a call service for elevators that can fulfill one request at a time", function() {

  var callService;

  beforeEach(function() {
    module('elevator');
    inject(function (_singleCall_) {
      callService = _singleCall_;
    });
    expect(callService.calls).toBeEmpty();
  });

  describe("#addFloor: to register a new floor call", function() {
    it("should register a floor call", function() {
      callService.addFloor(5);
      expect(callService.calls).toContain(5);
    });
    it("should not register a new floor call while busy", function() {
      callService.calls = [2];
      callService.addFloor(5);
      expect(callService.calls).not.toContain(5);
    });
  });
  
  describe("#nextFloor: to fetch the next target floor", function() {
    it("should return next floor to go", function() {
      callService.calls = [2];
      expect(callService.nextFloor()).toBe(2);
    });
  });
  
  describe("#removeFloor: to unregister a floor call once complete", function() {
    it("should remove floor call from the stack", function() {
      callService.calls = [5];
      callService.removeFloor(5);
      expect(callService.calls).not.toContain(5);
    });
  });

});
