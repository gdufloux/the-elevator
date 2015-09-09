
describe("optimizedStackCall: a call service for elevators that collect requests and optimize travel", function() {

  var callService;

  beforeEach(function() {
    module('elevator');
    inject(function (_optimizedStackCall_) {
      callService = _optimizedStackCall_;
    });
    expect(callService.calls).toBeEmpty();
  });
  
  describe("#addFloor: to register a new floor call", function() {
    it("should register floor call", function() {
      callService.addFloor(5);
      expect(callService.calls).toContain(5);
    });
    it("should allow register a new floor call even if busy", function() {
      callService.calls = [2];
      callService.addFloor(5);
      expect(callService.calls).toContain(5);
    });
    it("should avoid duplicated calls", function() {
      callService.calls = [2];
      callService.addFloor(2);
      expect(callService.calls).toEqual([2]);
    });
  });
  
  describe("#nextFloor: to fetch the next target floor", function() {
    it("should return next floor to go", function() {
      callService.calls = [2,5,3];
      expect(callService.nextFloor()).toBe(2);
    });
    it("should reorder calls according to current car floor before returning next floor to go", function() {
      callService.calls = [2,5,3];
      expect(callService.nextFloor(1)).toBe(2); // 1->2,3,5
      expect(callService.nextFloor(6)).toBe(5); // 6->5,3,2
    });
  });
  
  describe("#removeFloor: to unregister a floor call once complete", function() {
    it("should remove floor call from the stack", function() {
      callService.calls = [2,5,3];
      callService.removeFloor(5);
      expect(callService.calls).not.toContain(5);
    });
  });
  
  describe("#reset: to unregister all floor calls from the stack", function() {
    it("should remove all floor calls from the stack", function() {
      callService.calls = [2,5];
      callService.reset();
      expect(callService.calls).toBeEmpty();
    });
  });
  
  describe("#calledFloor: indicate if the given floor is in the call stack", function() {
    it("should be true when the floor is in the stack", function() {
      callService.calls = [2,5];
      expect(callService.calledFloor(5)).toBe(true);
    });
    it("should be false when the floor is not in the stack", function() {
      callService.calls = [2,5];
      expect(callService.calledFloor(3)).toBe(false);
    });
  });
  
  describe("#sortCalls: reorder calls according to current car floor", function() {
    it("should sort calls according to current car floor", function() {
      callService.calls = [2,5,3];
      callService.sortCalls(1);
      expect(callService.calls).toEqual([2,3,5]); // // 1->2,3,5
      callService.sortCalls(6);
      expect(callService.calls).toEqual([5,3,2]); // 6->5,3,2
    });
    it("should do nothing if no current floor given", function() {
      callService.calls = [2,5,3];
      callService.sortCalls();
      expect(callService.calls).toEqual([2,5,3]);
    });
  });

});
