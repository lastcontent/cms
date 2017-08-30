angular.module('app').component('collection', {
	bindings: { organizationId: '<', collectionTypeId: '<', collectionId: '<'},
 	templateUrl: './components/collection/collection.html',
 	controller: function($scope, $itemService, $collectionTypes, $mdDialog, $rootElement, $collectionService){
 		"ngInject";

 		var self = this;

 		console.log('loading collection')
 		//self.path = [self.organizationId, self.collectionTypeId, self.collectionId];

 		$scope.loading = true;

 		$scope.organizationId = self.organizationId;
 		$scope.collectionTypeId = self.collectionTypeId;
 		$scope.collectionType = $collectionTypes.getCollectionType(self.collectionTypeId)
 		
 		$scope.allowedChildren = {};

 		angular.forEach($scope.collectionType.allowedChildren, function(child){
 			$scope.allowedChildren[child] = $collectionTypes.getCollectionType(child);
 		})

 		$scope.items = $itemService.getItems(self.collectionId);
 		//$scope.item = $itemService.getItem(self.itemId);
 		$scope.itemId = self.itemId;

 		$scope.addItem = function(){
 			var item = {
 				blah: true,
 				template: 'likert'
 			}
 			$itemService.addItem(self.collectionId, item)
 		}

 		$scope.addCollection = function(collectionTypeId){

 			var template = '<collections organization-id="\'' + self.organizationId + '\'" collection-type-id="\'' + collectionTypeId + '\'" editing="false"></collections>';
 			console.log(template);

 			$mdDialog.show({
 				//parent: $rootElement,
 				//scope: $scope,
 				//preserveScope: true,
 				clickOutsideToClose: true,
 				fullscreen: true,
 				template: template
 			}).then(function(collection){
 				console.log('selected collection', collection);
 				$itemService.addItem(self.collectionId, {
 					collectionRefTypeId: collectionTypeId,
 					collectionRef: collection.$id
 				})
 			})
 		}

 		$scope.onDrop = function(item, index){
 			var from = item.index;
			var to = (index > item.index) ? index - 1 : index;

			console.log('Moving item from ' + from + ' to ' + to)
 			$scope.items.$updateIndexes(item, from, to)

 			//Prevent array from changing client side
 			return false;
 		}

 	}
});