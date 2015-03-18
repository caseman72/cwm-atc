(function(ng) {
"use strict";

ng
	.module("myApp.atc", ["ngRoute", "myApp.atc.AcModel"])

	.config(["$routeProvider", function($routeProvider) {
		$routeProvider.when("/atc", {
			templateUrl: "atc/atc.html?v=0.0.5",
			controller: "AtcCtrl"
		});
	}])

	.controller("AtcCtrl", ["$scope", "AcModel", "$filter", function($scope, AcModel, $filter) {

		$scope.list = {
			planes: [],
			landing: [],
			arrived: []
		};

		$scope.error = {
			landing: false
		};

		$scope.info = {
			help: true
		};

		$scope.add_random_planes = function(count) {
			count = +count || 10;

			for (var i = 0; i<count; i++) {
				var random_type = Math.floor(Math.random() * 2);
				var random_size = Math.floor(Math.random() * 2);

				$scope.list.planes.push(AcModel({type: random_type ? "Cargo" : "Passenger", size: random_size ? "Large" : "Small"}));
			}
			$scope.reset_messages();
		};

		$scope.add_plane = function(props) {
			$scope.list.planes.push(AcModel(props));
			$scope.reset_messages();
		};

		$scope.reset_messages = function() {
			ng.forEach($scope.error, function(val, key) {
				if (val) {
					$scope.error[key] = false;
				}
			});

			ng.forEach($scope.info, function(val, key) {
				if (val) {
					$scope.info[key] = false;
				}
			});
		};

		$scope.land = function(plane) {
			$scope.reset_messages();

			if ($scope.list.landing.length) {
				$scope.error.landing = true;
			}
			else {
				plane.status = "Landing";
				$scope.list.landing.push(plane);
			}
		};

		$scope.arrive = function(plane) {
			$scope.reset_messages();

			plane.status = "Arrived";

			// remove from landing
			$scope.list.landing.splice($scope.list.landing.indexOf(plane), 1);

			// add to arrived
			$scope.list.arrived.push(plane);

			// reduce this to 1K if too big ~ note that they are pointers to planes objects
			var arrived_length = $scope.list.arrived.length;
			if (arrived_length > 1000) {
				//
				// todo ~ before removing here find in $scope.list.planes and remove to keep planes manageable
				//
				$scope.list.arrived.splice(0, arrived_length - 1000);
			}
		};

		// filter all planes for waiting ...
		// NB: this could slow down so we should garbage collect/remove the old "Arrived" planes (see above todo)
		Object.defineProperty($scope.list, "waiting", {
			get: function() {
				return $filter("orderBy") (
					$filter("filter") (
						$scope.list.planes,
						function(plane) {
							return plane.status === "Waiting";
						}
					),
					"rank"
				)
			}
		});

	}]);

})(window.angular);
