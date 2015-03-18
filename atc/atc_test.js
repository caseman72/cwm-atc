"use strict";

describe("myApp.atc module", function() {

  var $scope;

  beforeEach(module("myApp.atc"));
  beforeEach(module("myApp.atc.AcModel"));

  describe("atc controller", function() {

    it("should ....", inject(function($rootScope, $controller, $filter, AcModel) {

      $scope = $rootScope.$new();

      var atcCtrl = $controller("AtcCtrl", {"$scope": $scope, "$filter": $filter, "AcModel": AcModel});
      expect(atcCtrl).toBeDefined();
    }));

    it("should be 10", inject(function($rootScope, $controller, $filter, AcModel) {

      $scope = $rootScope.$new();

      var atcCtrl = $controller("AtcCtrl", {"$scope": $scope, "$filter": $filter, "AcModel": AcModel});

      // simple test for 10 planes
      $scope.add_random_planes();
      expect( $scope.list.planes.length ).toBe(10);

    }));

  });
});