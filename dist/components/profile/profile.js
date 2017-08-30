angular.module('app').component('profile', {
  bindings: { collection: '<' },
  templateUrl: './components/profile/profile.html',
  controller: ['$scope', '$userService', '$organizationService', function($scope, $userService, $organizationService){
  	
  	/*$scope.$watch(function(){return $userService.user}, function(){
  		$scope.user = $userService.user;
  		$scope.user.$bindTo($scope, 'user');
  	})*/

  	$scope.organizations = $organizationService.getOrganizations();
  	$scope.user = $userService.getUser();
  	$scope.user.$bindTo($scope, 'user');
  	
  	//this.service = $userService;
  	

  }]
});