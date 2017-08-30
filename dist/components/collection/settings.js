angular.module('app').component('collection.settings', {
	bindings: { organizationId: '<', collectionTypeId: '<', collectionId: '<' },
	templateUrl: './components/collection/settings.html',
	controller: ['$scope', '$collectionService', '$mdDialog', '$mdToast', '$state',
	function($scope, $collectionService, $mdDialog, $mdToast, $state){

		var self = this;


		$scope.collection = $collectionService.getCollection(self.collectionId);

		$scope.collection.$bindTo($scope, 'collection');

		$scope.removeCollection = function(){
			var confirm = $mdDialog.confirm()
			.title('Delete this item?')
			//.textContent('Are you sure?')
			//.ariaLabel('TutorialsPoint.com')
			//.targetEvent(event)
			.ok('Yes')
			.cancel('No');
				  
			$mdDialog.show(confirm).then(function() {
				
				$collectionService.removeCollection(self.collectionId).then(function(){
					$state.go('editor.organization.collections', {
						organizationId: self.organizationId,
						collectionType: self.collectionTypeId
					})
				});

				$mdToast.show(
					$mdToast.simple()
					.textContent('Item removed.')
					.position('bottom right')
				);

			}, function() {
				//$mdToast.showSimple('User not removed.');
			});
		}

	}]
});