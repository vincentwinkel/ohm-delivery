angular
	.module('ohm-delivery', [])
	.controller('tracking', function($scope, $http) {
		$scope.sendData = function() {
			if (this.trackingId) {
				//The callbacks looks reversed
				//Info: https://stackoverflow.com/a/32191577
				$http.get(`/ohms/${this.trackingId}`)
					.then((result) => {
						this.result = result.data;
						this.errorMessage = this.result ? '' : `Sorry, the tracking ID #${this.trackingId} was not found.`;
					}, (error) => {
						this.errorMessage = 'Oops, this website is under construction, please come back later.';
					});
			} else {
				//Useless since I use the attribute 'required'
				this.errorMessage = 'Please choose a tracking ID.';
			}
		};
	});
