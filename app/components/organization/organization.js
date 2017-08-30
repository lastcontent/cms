angular.module('app').component('organization', {
  bindings: { organizationId: '<' },
  templateUrl: './components/organization/organization.html',
  controller: ['$scope', '$organizationService', '$userService', '$mdDialog', '$mdToast',
  function($scope, $organizationService, $userService, $mdDialog, $mdToast){

	$scope.organizationId = this.organizationId;

	$scope.organization = $organizationService.getOrganization(this.organizationId);
	$scope.organization.$bindTo($scope, 'organization');
	$scope.users = $organizationService.getUsers(this.organizationId);
	/*$organizationService.getUsers(this.organizationId, function(users){
		//$scope.$apply(function(){
			$scope.users = [];
			angular.forEach(users, function(user, id){
				$scope.users.push($userService.getUser(id))
			})
		//})
	});*/
	
	// $scope.$watch(function(){return $organizationService.getUsers($scope.organizationId)}, function(users){
 //  		$scope.users = [];
 //  		console.log('watch users', $scope._users)
 //  		angular.forEach(users, function(user, id){
 //  			console.log(user, id)
 //  			$scope.users.push($userService.getUser(id))
 //  		})
 //  	})
		

	/*$scope.getUser = function(userId){
		console.log('getting user', userId)
		return $userService.getUser(userId);
	}*/

	$scope.getUser = function(userId){
		console.log(userId)
		return $userService.getUser(userId)
	}

	$scope.addUser = function(email){
		$organizationService.addUser(this.organizationId, $scope.newUserEmail);
		$scope.newUserEmail = '';
	}

	$scope.removeUser = function(userId){
		var confirm = $mdDialog.confirm()
			.title('Remove this user from ' + $scope.organization.name + '?')
			//.textContent('Are you sure?')
			//.ariaLabel('TutorialsPoint.com')
			//.targetEvent(event)
			.ok('Yes')
			.cancel('No');
				  
		$mdDialog.show(confirm).then(function() {
			$organizationService.removeUser($scope.organizationId, userId);
			$mdToast.show(
				$mdToast.simple()
				.textContent('User removed.')
				.position('bottom right')
			);
		}, function() {
			//$mdToast.showSimple('User not removed.');
		});
		
	}
  }]
});