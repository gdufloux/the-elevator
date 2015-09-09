angular.module("elevator").

  // Call service for elevators that collect requests and complete them in call order
  service("optimizedStackCall", function optimizedStackCallService() {
    this.calls = [];
    this.addFloor = function(n) {
      if (!this.calledFloor(n)) {
        this.calls.push(n);
      }
    };
    this.nextFloor = function(currentFloor) {
      this.sortCalls(currentFloor);
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
    
    this.sortCalls = function(currentFloor) { 
      if(currentFloor === undefined) {
        return
      }
      
      var result = [];
      var calls = this.calls;
      var targetFloor;
      
      // mark a called floor as reordered is result output
      function moveFromCallsToResult(i){
        if (calls.indexOf(i) > -1) {
          calls.splice(calls.indexOf(i), 1);
          result.push(i);
        }
      }
       
      while (calls[0] !== undefined) {
        targetFloor = calls[0];
        if (currentFloor < targetFloor) {
          for (var i=currentFloor; i<targetFloor; i++) { moveFromCallsToResult(i) }
        } else if (currentFloor > targetFloor) {
          for (var i=currentFloor; i>targetFloor; i--) { moveFromCallsToResult(i) }
        }
        moveFromCallsToResult(targetFloor);
      }
      
      this.calls = result;
    }
  });
