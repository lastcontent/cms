angular.module('collectionType.survey', ['collectionTypes', 'rzModule'])
.run(['$collectionTypes', function($collectionTypes){

	var styles = {
		likert: {weights: true},
		multiple_choice: {weights: true},
		text: {weights: false}
	};

	var mods = {
		'_image_left': '_image_left',
		'_image_none': '_image_none',
		'_image_right': '_image_right'
	}

	var templates = {};

	angular.forEach(styles, function(style, styleId){
		angular.forEach(mods, function(mod, modId){
			var id = styleId+modId;

			templates[id] = {
				name: id,
				preview: './collectionTypes/survey/preview/' + id + '.png',
				states: {
					editing: {
						name: 'Editing',
						device: true,
						url: './collectionTypes/survey/editing/' + id + '.html'
					},
					default: {
						name: 'Preview',
						device: true,
						url: './collectionTypes/survey/default/' + id + '.html',
					}
				}
			}

			if(style.weights){
				templates[id].states.weights = {
					name: 'Weights',
					url: './collectionTypes/survey/weights/weights.html'
				}
			}
		})
	})

	console.log('TEMPLATES', templates);

	/*var templates = {
		'likert': {
			name: 'Likert',
			preview: './collectionTypes/survey/preview/likert_image_none.png',
			schema: './collectionTypes/survey/schemas/likert.json',
			states: {
				editing: {
					name: 'Editing',
					device: true,
					url: './collectionTypes/survey/editing/likert_image_none.html'
				},
				default: {
					name: 'Preview',
					device: true,
					url: './collectionTypes/survey/default/likert_image_none.html',
				},
				weights: {
					name: 'Weights',
					url: './collectionTypes/survey/weights/weights.html'
				}
			}
		},
		'multiple_choice':{
			name: 'Multiple Choice',
			preview: './collectionTypes/survey/preview/multiple_choice_image_none.png'
		},
		'text_image_none':{
			name: 'Text',
			preview: './collectionTypes/survey/preview/text_image_none.png'
		}
	};*/

	$collectionTypes.registerCollectionType('groups', {
		name: 'Groups',
		singularName: 'Group',
		itemName: 'Slide',
		icon: 'art_track',
		templates: templates
	})

	$collectionTypes.registerCollectionType('surveys', {
		name: 'Surveys',
		singularName: 'Survey',
		itemName: 'Slide',
		icon: 'aspect_ratio',
		templates: templates,
		allowedChildren: ['groups']
	})
}])
