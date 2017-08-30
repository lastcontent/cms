angular.module('app').component('editor', {
  templateUrl: './components/editor/editor.html',
  controller: function($scope, $organizationService, $userService, $collectionTypes){
  	"ngInject";

  	$scope.organizations = $organizationService.getOrganizations();
  	
  	$scope.getCollectionTypes = function(organizationId){
  		return $collectionTypes.getCollectionTypes();
  	}

  	$scope.config = window.config;

  }
});