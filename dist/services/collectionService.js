angular.module('app')
.service('$collectionService', 
	["$firebaseObject", "$firebaseArray", function($firebaseObject, $firebaseArray){
	"ngInject";

	var self = this;

	self.collections = {};
	self.ref = firebase.database().ref('collections')

	self.getCollection = function(collectionId){
		//return self.getCollections(organizationId, collectionType).$getRecord(collectionId);
		return $firebaseObject(self.ref.child(collectionId))
	}

	self.getCollections = function(organizationId, collectionType){
		//if (!self.collections[organizationId] || !self.collections[organizationId][collectionType]){
		if (!_.has(self.collections, [organizationId, collectionType])){
			
			_.set(self.collections, [organizationId, collectionType], $firebaseArray(
				self.ref.orderByChild('oIdcType').equalTo(organizationId+collectionType)
			))
			//self.collections[organizationId] = {};
			/*self.collections[organizationId][collectionType] = $firebaseArray(
				firebase.database().ref('organizations')
				.child(organizationId)
				.child(collectionType)
			)*/
		}
		return self.collections[organizationId][collectionType];
	}

	self.addCollection = function(organizationId, collectionType, collection){
		collection.oIdcType = organizationId + collectionType;
		return self.getCollections(organizationId, collectionType).$add(collection)
	}

	self.removeCollection = function(organizationId, collectionType, collectionId){
		console.log('removing Item', organizationId, collectionType, collectionId);
		return self.getCollections(organizationId, collectionType).$loaded().then(function(collections){
			collections.$remove(
				self.getCollections(organizationId, collectionType).$indexFor(collectionId)
			);
		})
	}

}]);