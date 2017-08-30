/*
 * Firebase Ordered Array
 * Extends angularfire's $firebaseArray to allow for ordering
 * Dan Poindexter, http://danpoindexter.com
*/

angular.module('firebaseOrderedArray', ['firebase'])
.factory("$firebaseOrderedArray", ["$firebaseArray",
  function($firebaseArray) {

    var orderedArray = $firebaseArray.$extend({

    	$updateIndexes: function(item, _from, _to, callback){

    		var self = this;

			for(var i=0; i < self.$list.length; i++){

				var el = self.$list[i];

				if(item && el.$id == item.$id)
					el.index = _to;
				else if(el.index > _from && el.index <= _to)
					el.index = el.index - 1;
				else if(el.index < _from && el.index >= _to)
					el.index = el.index + 1;
			}

			for(var i=0; i < self.$list.length; i++)
				self.$list.$save(i);

			if (callback)
				callback();
		},

		$addOrdered: function(item, index){

			var self = this;
			index = index || self.$list.length;

			self.$updateIndexes(null, self.$list.length, index, function(){
				item.index = index;
				self.$list.$add(item);
			})
		},
		
		$removeOrdered: function(item){

			var self = this;

			self.$updateIndexes(item, item.index, self.$list.length, function(){
				self.$list.$remove(node);
			});
		}

    });

    return function(listRef) {
      return new orderedArray(listRef);
    }
  }
]);