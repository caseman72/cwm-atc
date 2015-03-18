/**
 *
 * ac_model ~ Air Craft Model
 *
 * @author - casey@manion.com
 *
 */
(function(ng) {

	// order matters - order by precedence
	var types = [
		"Passenger",
		"Cargo"
	];

	// order matters - order by precedence
	var sizes = [
		"Large",
		"Small"
	];

	// air traffic control states
	var states = [
//	"Departing",
//	"Flying",
		"Waiting",
		"Landing",
		"Arrived"
	];

	// base model constructor uses prototype methods below
	var ac_model = function(props) {
		this.type_index = -1;
		this.type = props.type;

		this.size_index = -1;
		this.size = props.size;

		this.status_index = -1;
		this.status = props.status || "Waiting";

		this.time = epoch_rounded_to_minute();
		this.guid = guid();
	};

	Object.defineProperty(ac_model.prototype, "date", {
		/* date */
		enumerable: true,
		get: function() {
			// the else shouldn't happen ~ only for the prototype ~ but I always want to return a date object
			return this.time ? new Date(this.time) : new Date(epoch_rounded_to_minute());
		},
		set: function(date_val) {
			// checking to see if date_val has method getTime otherwise use now
			date_val = date_val && ng.isObject(date_val) && ng.isFunction(date_val.getTime) ? date_val : epoch_rounded_to_minute()
			this.time = date_val.getTime();
		}
	});

	Object.defineProperty(ac_model.prototype, "type", {
		/* string */
		enumerable: true,
		get: function() {
			return this.type_index > -1 && this.type_index < types.length ? types[this.type_index] : "";
		},
		set: function(val) {
			this.type_index = find_string_in_array(val, types);
		}
	});

	Object.defineProperty(ac_model.prototype, "size", {
		/* string */
		enumerable: true,
		get: function() {
			return this.size_index > -1 && this.size_index < sizes.length ? sizes[this.size_index] : "";
		},
		set: function(val) {
			this.size_index = find_string_in_array(val, sizes);
		}
	});

	Object.defineProperty(ac_model.prototype, "status", {
		/* string */
		enumerable: true,
		get: function() {
			return this.status_index > -1 && this.status_index < states.length ? states[this.status_index] : "";
		},
		set: function(val) {
			this.status_index = find_string_in_array(val, states);
		}
	});

	Object.defineProperty(ac_model.prototype, "rank", {
		/* integer */
		enumerable: true,
		get: function() {
			return (100 * (1+this.type_index)) + (10 * (1+this.size_index)) + (this.time/1E13)
		}
	});

	// helpers...
	
	Object.defineProperty(ac_model.prototype, "color", {
		/* string */
		enumerable: true,
		get: function() {
			return this.guid ? this.guid.slice(0,6) : "ffffff";
		}
	});

	Object.defineProperty(ac_model.prototype, "rgb", {
		/* string */
		enumerable: true,
		get: function() {
			var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
			return (result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0,0,0]).join(",");
		}
	});

	Object.defineProperty(ac_model.prototype, "inverted_rgb", {
		/* string */
		enumerable: true,
		get: function() {
			var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
			return (result ? [255-parseInt(result[1], 16), 255-parseInt(result[2], 16), 255-parseInt(result[3], 16)] : [0,0,0]).join(",");
		}
	});


	// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	var guid = function() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = Math.floor(Math.random() * 16);
			return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
		});
	};

	// epoch ms rounded to minute (math: 60s = 60E3 ms = 1 minute)
	var epoch_rounded_to_minute = function() {
		return Math.floor((new Date()).getTime() / 60E3) * 60E3;
	};

	// similar to indexOf so -1 is not found, otherwise index of string in array
	var find_string_in_array = function(str, arr) {
		str = (str+"").toLowerCase();

		var index = -1;
		ng.forEach(arr, function(item, i) {
			if (index === -1 && ng.isString(item) && str === item.toLowerCase()) {
				index = i;
			}
		});

		return index;
	};

	/* model factory */
	ng
		.module("myApp.atc.AcModel", [])
		.factory("AcModel", [function() {
			return function(props) {
				return new ac_model(props);
			};
		}]);

})(window.angular);
