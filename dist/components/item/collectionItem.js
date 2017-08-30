'use strict';

angular.module('app').directive('collectionItem', ["$collectionTypes", "$log", function ($collectionTypes, $log) {
	"ngInject";

	var link = function link($scope, element, attrs) {

		$log.debug('collection-item linked');

		$scope.$watch('item.template', function () {
			$scope.template = $scope.item.template || 'default';
			console.log('TEMPLATE', $scope.item.template);

			var collectionType = $collectionTypes.getCollectionType($scope.collectionTypeId);

			var path = ['templates', $scope.template, 'states', $scope.state];

			if (collectionType && _.has(collectionType, path)) {
				$log.debug('Found template', path);
				$scope.templateUrl = _.get(collectionType, path);
			} else $log.warn('Could not find template', path);
		});
	};

	return {
		restrict: 'E',
		replace: false,
		template: '<div class="collection-item-template" ng-include="templateUrl" />',
		link: link,
		scope: {
			item: '=',
			state: '=',
			collectionTypeId: '='
		}
	};
}]);