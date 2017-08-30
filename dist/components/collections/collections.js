angular.module('app').component('collections', {
	bindings: { organizationId: '<', collectionTypeId: '<', editing: '<' },
	templateUrl: './components/collections/collections.html',
	controller: ["$scope", "$collectionService", "$organizationService", "$state", "$mdDialog", function($scope, $collectionService, $organizationService, $state, $mdDialog){
		"ngInject";

		var self = this;
		
		self.$onInit = function(){
			$scope.isGrid = true;
			$scope.editing = self.editing;
			console.log($scope.organizationId)
			console.log('collections', self.organizationId, self.collectionTypeId)
			$scope.collections = $collectionService.getCollections(self.organizationId, self.collectionTypeId);
		}
		

		$scope.addCollection = function(){

			var collection = {
				name: 'Untitled Collection'
			};

			$collectionService.addCollection(self.organizationId, self.collectionTypeId, collection).then(function(data){
				$state.go('editor.organization.collections.collection.settings', {
					organizationId: self.organizationId,
					collectionTypeId: self.collectionTypeId,
					collectionId: data.key
				})
			})
		}

		$scope.toggleGrid = function(){
			$scope.isGrid = !$scope.isGrid;
		}

		$scope.selectCollection = function(collection){
			console.log('select Collection', $scope.editing)
			if($scope.editing)
				$state.go('editor.organization.collections.collection', {collectionId: collection.$id})
			else
				$mdDialog.hide(collection);
		}

	}]
});