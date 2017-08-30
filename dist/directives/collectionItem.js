/*angular.module('app').component('collectionItem', {
	
	bindings: { collectionType: '<', item: '=', state: '<' },
	
	template: '<div class="collection-item-template" ng-include="$ctrl.templateUrl" />',
	
	controller: function($scope, $collectionTypes){
		"ngInject";

		var self = this;

		//console.log('SDKFAJSDLFKAJSDKLFAJSDFKA', self.item)

		$scope.item = self.item;
		//$scope.item.$bindTo($scope, 'item');

		self.template = self.item.template || 'default';

		//self.$onChanges = function(changes) {
			console.log('CHANGES BABY')
			//if ((changes.template && self.template) || (changes.state && self.state)) {
				//console.log($collectionTypes, self.collectionType)
				//console.log('TYPE', self.collectionType)
				var collectionType = $collectionTypes.getCollectionType(self.collectionType)

				var path = ['templates', self.template, 'states', self.state];

				//console.log('PATH', collectionType, path);
				
				if (collectionType && _.has(collectionType, path))
					self.templateUrl = _.get(collectionType, path);
				else
					console.log('Could not find template', path)


				//var template = $collectionTypes[self.contentType][self.template];
				//self.templateUrl = template[self.state];
				//console.log(self.templateUrl)
			//}
		//}


		//TODO set $scope.props for child to use


		//$scope.props = $scope.item.props;
	}
});*/


angular.module('app').directive('collectionItem', ["$collectionTypes", "$log", function($collectionTypes, $log) {
		"ngInject";

		var link = function($scope, element, attrs){
			
			$log.debug('collection-item linked');

			$scope.$watch('item.template', function(){
				$scope.template = $scope.item.template; //|| 'likert_image_none';
				//console.log('STATES', $scope.states)
				//console.log('TEMPLATE', $scope.item.template)
				//console.log($collectionTypes, self.collectionType)
				//console.log('TYPE', $scope.collectionType)
				var collectionType = $collectionTypes.getCollectionType($scope.collectionTypeId)

				var path = ['templates', $scope.template, 'states', $scope.state, 'url'];

				//console.log('PATH', collectionType, path);
				
				if (collectionType && _.has(collectionType, path)){
					$log.debug('Found template', path)
					$scope.templateUrl = _.get(collectionType, path);
					console.log($scope.templateUrl)
				}
				else{
					$log.warn('Could not find template', path)
					//$scope.templateUrl = '<h1>not found</h1>'
				}
			});
			
		}

		return {
			restrict: 'E',
			replace: false,
			template: '<div class="collection-item-template" ng-include="templateUrl" />',
			link: link,
			scope: {
				item: '=',
				state: '=',
				collectionTypeId: '=',
			}
		};
}]);

/*
angular.module('app').directive('collectionItem', function($collectionTypes, $log) {
		"ngInject";

		var link = function($scope, element, attrs){
			
			$log.debug('collection-item linked');

			$scope.$watch('item.template', function(){
				console.log('STATE', $scope.state)
				$scope.templateUrl = $scope.state.url;

			});
			
		}

		return {
			restrict: 'E',
			replace: false,
			template: '<div class="collection-item-template" ng-include="templateUrl" />',
			link: link,
			scope: {
				item: '=',
				state: '=',
				collectionTypeId: '=',
			}
		};
});*/