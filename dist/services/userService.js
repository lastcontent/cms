angular.module('app')
.service('$userService', [
	'$firebaseObject',
	'$firebaseStorage',
	function($firebaseObject, $firebaseStorage){

	var self = this;
	self.users = {};

	self.ref = firebase.database().ref('users');

	self.setUser = function(firebaseUser){
		//if (firebaseUser){
		//	self.firebaseUser = firebaseUser;
		//	self.user = $firebaseObject(self.ref.child(self.firebaseUser.uid));
		//}
	}

	self.getUser = function(userId){

		userId = userId || firebase.auth().currentUser.uid

		if(!self.users[userId])
			self.users[userId] = $firebaseObject(self.ref.child(userId));
		
		return self.users[userId];
	}

}]);