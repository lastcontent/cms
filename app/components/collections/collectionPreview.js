angular.module('app').component('collectionPreview', {
	bindings: {collection: '<', organizationId: '<', collectionTypeId: '<', collectionId: '<' },
	templateUrl: './components/collections/collectionPreview.html',
	controller: function($scope, $collectionService){
		"ngInject";

		$scope.collection = this.collection || $collectionService.getCollection(this.organizationId, this.collectionTypeId, this.collectionId);;
		

	}
});