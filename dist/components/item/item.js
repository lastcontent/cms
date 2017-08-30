angular.module('app').component('item', {
	bindings: { organizationId: '<', collectionTypeId: '<', collectionId: '<', itemId: '<' },
 	templateUrl: './components/item/item.html',
 	controller: ["$scope", "$itemService", "$collectionTypes", "$location", "$userService", "$mdDialog", function($scope, $itemService, $collectionTypes, $location, $userService, $mdDialog){
 		"ngInject";

 		var self = this;
 		//self.path = [self.organizationId, self.collectionTypeId, self.collectionId];

 		$scope.organizationId = self.organizationId;
 		$scope.collectionTypeId = self.collectionTypeId;

 		$scope.item = $itemService.getItem(self.itemId);
 		
 		$scope.item.$bindTo($scope, 'item');

 		$scope.$parent.$parent.item = $scope.item;
 		console.log('ITEM PARENT', $scope.$parent.$parent)

 		//$scope.itemId = self.itemId;
 		//$scope.states = ['editing', 'default', 'weights'];//$collectionTypes.getCollectionType(self.collectionId);

 		$scope.chooseTemplate = function(){
 			$mdDialog.show({
 				scope: $scope,
 				preserveScope: true,
 				templateUrl: './components/item/templateDialog.html',
 				clickOutsideToClose: true
 			})
 		}

 		$scope.getTemplates = function(collectionTypeId){
 			return $collectionTypes.getTemplates(collectionTypeId);
 		}

 		$scope.getStates = function(collectionTypeId, templateId){
 			return $collectionTypes.getStates(collectionTypeId, templateId);
 		}
 		/*$scope.setState = function(state){
 			$scope.selectedTab = $scope.states.indexOf(state)
 			$userService.setConfig('state', state);
 		}

 		$scope.setState($userService.getConfig('state'))*/
 	}]
});