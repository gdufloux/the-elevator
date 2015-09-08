angular.module("elevator").

  // Call service for elevators that can fulfill one request at a time
  service("singleCall", function singleCallService(){
    this.calls = [];
    this.addFloor = function(n) {
      if (this.calls.length == 0) {
        this.calls = [n];
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
