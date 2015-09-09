angular.module("elevator").

  // Call service for elevators that collect requests and complete them in call order
  service("simpleStackCall", function simpleStackCallService(){
    this.calls = [];
    this.addFloor = function(n) {
      if (!this.calledFloor(n)) {
        this.calls.push(n);
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
    this.reset = function(n) {
      this.calls = [];
    };
    this.calledFloor = function(n) {
      return this.calls.indexOf(n) > -1
    };
  });
