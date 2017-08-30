angular.module('app')
.service('$itemService', ["$collectionService", "$firebaseOrderedArray", "$firebaseObject", function($collectionService, $firebaseOrderedArray, $firebaseObject){
	"ngInject";

	var self = this;

	self.items = {};
	self.ref = firebase.database().ref('items');

	self.getItems = function(collectionId){

		if (!self.items[collectionId])
			self.items[collectionId] = $firebaseOrderedArray(
				self.ref.orderByChild('collectionId').equalTo(collectionId)
			)

		return self.items[collectionId];
	}

	self.getItem = function(itemId){
		return $firebaseObject(self.ref.child(itemId));
	}

	self.addItem = function(collectionId, item){
		item.collectionId = collectionId;
		return self.getItems(collectionId).$addOrdered(item)
	}
}])