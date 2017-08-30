angular.module('app')
.service('$organizationService', [
	'$firebaseArray',
	'$firebaseObject',
	'$firebaseStorage',
	'$userService',
	function($firebaseArray, $firebaseObject, $firebaseStorage, $userService){

	var self = this;

	self.users = {};
	self._users = {};

	//self.userId = firebase.auth().currentUser.uid;
	self.organizationsRef = firebase.database().ref('organizations');
	self.usersRef = firebase.database().ref('users');

	self.newOrganization = function(organization){
		return self.getOrganizations().$add(organization);
	}

	self.getOrganization = function(organizationId){
		return $firebaseObject(self.organizationsRef.child(organizationId));
	}

	self._getOrganizations = function(userId){
		if(!self._organizations)
			self._organizations = $firebaseArray(self.usersRef.child(userId).child('organizations'));
		return self._organizations;
	}

	//-Returns an array of $firebaseObject organizations belonging the current user
	self.getOrganizations = function(userId){

		userId = userId || firebase.auth().currentUser.uid

		if(!self.organizations){

			self.organizations = {};
			
			self._getOrganizations(userId).$loaded().then(function(){
				angular.forEach(self._organizations, function(organization){
					self.organizations[organization.$id] = $firebaseObject(self.organizationsRef.child(organization.$id));
				})
			});
			
		}

		return self.organizations;
	}

	//-Internal function that returns a $firebaseArray of users belonging to the specified organization
	self._getUsers = function(organizationId){
		if (!self._users[organizationId])
			self._users[organizationId] = $firebaseObject(self.organizationsRef.child(organizationId).child('users'));
		return self._users[organizationId];
	}

	//-Returns an array of $firebaseObject users belonging to the specified organization
	self.getUsers = function(organizationId){
		
		//TODO: wrap in a map with organizationId keys
		if(!self.users[organizationId]){
			self.users[organizationId] = {};

			var mapUsers = function(_users){
				angular.forEach(_users, function(_user, userId){
					self.users[organizationId][userId] = $userService.getUser(userId)
				})
			}

			self._getUsers(organizationId).$loaded().then(function(_users){
				//angular.forEach(self._users, function(user, id){
				//	self.users[id] = $userService.getUser(id)
				//})
				mapUsers(_users);
				_users.$watch(function(){
					mapUsers(_users)
				})
				//cb(self._users)
				//users.$watch(function(){
				//	cb(self._users)
				//})
			})
		}
		
		return self.users[organizationId];
	}

	//-TODO revisit this.
	/*self.addUser = function(email){
		var user = {};
		user[email] = true;
		self._getUsers().$add(user).then(function(ref) {
		  var id = ref.key;
		  console.log("added record with id " + id);
		});
	}*/

	self.addUser = function(organizationId, email){
		self._getUsers(organizationId)[email] = true;
		self._getUsers(organizationId).$save();
	}

	self.removeUser = function(organizationId, userId){
		delete self.getUsers(organizationId)[userId];
		delete self._getUsers(organizationId)[userId];
		self._getUsers(organizationId).$save();
	}

}]);