angular.module('collectionTypes', [])
.service('$collectionTypes', function(){

	var self = this;
	self.types = {};
	
	this.registerCollectionType = function(collectionTypeId, type){
		self.types[collectionTypeId] = type;
	}

	this.getCollectionTypes = function(){
		return self.types;
	}

	this.getCollectionType = function(collectionTypeId){
		return self.types[collectionTypeId]
	}

	this.getTemplates = function(collectionTypeId){
		return self.types[collectionTypeId].templates;
	}

	this.getStates = function(collectionTypeId, templateId){
		if (!collectionTypeId || !templateId)
			return null;
		
		return self.types[collectionTypeId].templates[templateId].states;
	}
	
	//-Empty service to be inherited by child Collection Types
})