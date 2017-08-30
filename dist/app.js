var app = angular.module('app', [
	'ConsoleLogger',				// For logging UI Router state changes
	'firebase',						// angularfire - Firebase js wrapper
	'firebaseOrderedArray',			// To order angularfire $firebaseArray
	'dndLists',						// For drag and drop lists
	'ui.router',					// Routing
	'ncy-angular-breadcrumb',		// UI Router breadcrumbs
	'angular-content-editable',		// In place content editing
	'devicePreview',				// Preview on phones, tablet, etc.
	'material.core',				// < Angular Material >
	'material.components.icon',
	'material.components.button',
	'material.components.slider',
	'material.components.tabs',
	'material.components.backdrop',
	'material.components.dialog',
	'material.components.select',
	'material.components.menu',
	'material.components.menuBar',
	'material.components.toast',	// </ Angular Material>
	'collectionTypes',				// To register and get collection types
	'collectionType.survey'			// Survey collection type
])
.config(["$mdThemingProvider", function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette(window.config.colors.primaryPalette)
    .accentPalette(window.config.colors.accentPalette);
}])
//.constant("$MD_THEME_CSS","")
.run(['PrintToConsole', function(PrintToConsole) {

	// When this value is true, UI Router state changes will
	// be logged to console.

    PrintToConsole.active = false;
}])
.run(['$userService', '$state', function($userService, $state){
	
	// This listener is called when the page is loaded, or
	// authentication state changes. If the user is valid,
	// update the current user. Otherwise, redirect to login

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			//console.log('user', user)
			$userService.setUser(user);
		} else {
			$state.go('login');
		}
	});
}])
.run(['$rootScope', function($rootScope){

	// Global vars are generally bad, but the hell of
	// UI router resolve drove me to do this.

	$rootScope.breadcrumb = {};
}])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$breadcrumbProvider", "$mdAriaProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $breadcrumbProvider, $mdAriaProvider) {
		"ngInject";
	
		// Some Angular Material components were throwing lots of warnings.
		$mdAriaProvider.disableWarnings();

		// Use a custom template for the breadcrumbs
		$breadcrumbProvider.setOptions({
	      templateUrl: '/lib/breadcrumb/breadcrumb.html'
	    });

		// Set html5 mode to disable the /#/ in the url.
		// Requires the <base> to be set in html
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	 
	 	// Declare the routing states
		var states = [
			{
				name: 'login',
				url: '/login',
				views: {
					'root@': {
						component: 'login'
					}
				}
			},
			{
				name: 'editor',
				url: '',
				abstract: true,				
				views: {
					'root@': {
						component: 'editor'
					}
				}
			},
			{
				name: 'editor.home',
				url: '/',
				views: {
					'main@editor': 'home'
				},
				ncyBreadcrumb:{
					skip: true
				}
			},
			{
				name: 'editor.organization',
				url: '/organization/{organizationId}',
				//component: 'organization',
				views: {
					'main@editor' : {
						component: 'organization'
					}
				},
				resolve: {
					organizationId: function($stateParams){
						return $stateParams.organizationId;
					},
					organizationLabel: function($stateParams, $organizationService, $rootScope){
						//"ngInject";
						
						$rootScope.breadcrumb.organization = $organizationService.getOrganization($stateParams.organizationId);
					}
				},
				ncyBreadcrumb:{
					label: '{{$root.breadcrumb.organization.name}}'
				}
			},
			{
				name: 'editor.organization.collections',
				url: '/collections/{collectionTypeId}',
				views: {
					'main@editor': {
						component: 'collections',
					}
				},
				resolve: {
					/*collections: ['$collectionService', '$stateParams', function($collectionService, $stateParams){
						console.log($collectionService.getCollections(null, $stateParams.collectionType))
						return $collectionService.getCollections(null, $stateParams.collectionType);
					}],*/
					//organizationId: function($stateParams){
					//	console.log('checking stateParams', $stateParams)
					//	return $stateParams.organizationId;
					//},
					editing: function(){
						return true;
					},
					collectionTypeId: function($stateParams){
						return $stateParams.collectionTypeId;
					},
					collectionsLabel: ["$stateParams", "$rootScope", function($stateParams, $rootScope){
						"ngInject";

						$rootScope.breadcrumb.collections = $stateParams.collectionTypeId;
					}]
				},
				ncyBreadcrumb: {
					label: '{{$root.breadcrumb.collections | underscoreless | camelcase}}'
				}
				
			},
			{
				name: 'editor.organization.collections.collection',
				url: '/{collectionId}',
				views: {
					'main@editor': {
						component: 'collection'
					}
				},
				resolve: {
					collectionId: function($stateParams){
						return $stateParams.collectionId;
					},
					collectionLabel: ["$stateParams", "$rootScope", "$collectionService", function($stateParams, $rootScope, $collectionService){
						"ngInject";

						$rootScope.breadcrumb.collection = $collectionService.getCollection(
							$stateParams.collectionId
						);
					}]
				},
				ncyBreadcrumb: {
					label: '{{$root.breadcrumb.collection.name}}'
				}
			},
			/*{
				name: 'editor.Organization.collections.collection.empty',
				url: '',
				views: {
					'item@editor.organization.collections.collection':{
						template: '<h1>Empty</h1>>'
					}
				}
			},*/
			{
				name: 'editor.organization.collections.collection.item',
				url: '/item/{itemId}',
				mainView: 'item',
				views: {
					'item@editor.organization.collections.collection' : {
						component: 'item'
					}
				},
				//component: 'item',
				resolve: {
					itemId: function ($stateParams){
						//console.log($stateParams);
						return $stateParams.itemId;
					},
					itemLabel: ["$rootScope", "$stateParams", function($rootScope, $stateParams){
						"ngInject"

						$rootScope.breadcrumb.item = $stateParams.itemId;
					}]
				},
				ncyBreadcrumb: {
					skip: true
					//label: 'Item {{$root.breadcrumb.item}}'
				}

			},
			{
				name: 'editor.organization.collections.collection.settings',
				url:'/settings',
				views: {
					'main@editor':{
						component: 'collection.settings'
					}
				},
				ncyBreadcrumb:{
					label: 'Settings'
				}
			},
			{
				name: 'editor.profile',
				url: '/profile',
				views: {
					'main@editor':{
						component: 'profile'
					}
				},
				ncyBreadcrumb:{
					label: 'Profile'
				}
			},
			{
				name: 'editor.profile.newOrganization',
				url: '/organizations/new',
				views: {
					'main@editor': {
						component: 'newOrganization'
					}
				},
				ncyBreadcrumb: {
					label: 'New Organization'
				}
			}
		]

		// Loop over the state definitions and register them
		states.forEach(function(state) {
			$stateProvider.state(state);
		});

	
		//$urlRouterProvider.otherwise('/');
}])
  .filter('keyboardShortcut', ["$window", function($window) {
	return function(str) {
	  if (!str) return;
	  var keys = str.split('-');
	  var isOSX = /Mac OS X/.test($window.navigator.userAgent);

	  var seperator = (!isOSX || keys.length > 2) ? '+' : '';

	  var abbreviations = {
		M: isOSX ? '⌘' : 'Ctrl',
		A: isOSX ? 'Option' : 'Alt',
		S: 'Shift'
	  };

	  return keys.map(function(key, index) {
		var last = index == keys.length - 1;
		return last ? key : abbreviations[key];
	  }).join(seperator);
	};
  }])
  .filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value };
      });
    }
  };
})
  .filter('underscoreless', function () {
	return function(input) {
		if (input)
			return input.replace(/[_-]/g, ' ');
		else
			return '';
	};
})
.filter('camelcase', function(){
	return function(input){
		if (input)
			return input
				.split(' ')
				.map(function(word){
					return word.charAt(0).toUpperCase() + word.slice(1)
				})
				.join(' ') || '';
		else
			return '';
	};
})
/*  Todo:
 *  *remove jquery dep
 *  *combine directives
 *  *on window resize
 *  *support iframe templates
 *  *clean up
 *  *publish to github
 *  *publish to npm
 */
 /*
.directive('devicePreview', function() {

  var link = function($scope, el, attrs) {

    var parent = angular.element(el).parent();
    var child = angular.element(el);

    child.css({
      'background': 'white',
    })
      
    parent.css({
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    });

    $scope.$watch('device',
     function() {

      var device = {width: 1080, height: 1920};

      if (!angular.element(el).parent()[0])
        return false;

      parent.width = $scope.$parent.frame_size.width;
      parent.height = $scope.$parent.frame_size.height;

      var fit = (parent.width / parent.height > device.width / device.height);
      var scale = fit ? parent.height / device.height : parent.width / device.width;
      var width = fit ? device.width * parent.height / device.height : parent.width;
      var height = fit ? parent.height : device.height * parent.width / device.width;
      


      child.css({
        'transform': 'scale(' + scale +')',
        //'zoom': scale,
        'width': width / scale + 'px',
        'height': height / scale + 'px',
      });


      var use = {
        x: Math.max(device.width, width),
        y: Math.max(device.height, height)
      }
      var translate = {
        x: -1 * ((use.x - parent.width) / 2),
        y: -1 * ((use.y - parent.height) / 2)
      };

      $scope.$parent.iframe.css({
        'width': use.x,
        'height': use.y,
        'transform': 'translate(' + translate.x + 'px,' + translate.y + 'px)'
      })

      console.log('device', device.width, device.height);
      console.log('parent', parent.width, parent.height);
      console.log('scale', scale);
      console.log('new', width, height);
    });
  };

  return {
    restrict: 'E',
    link: link,
    scope: {
      'device': '='
    }
  }
})*/

//http://plnkr.co/edit/KRfAyc5haHyFq7FyCnxg?p=preview
.directive("wrapInFrame", [
  '$compile',
  '$timeout',
  function($compile, $timeout) {
  return {
    restrict: "E",
    scope: {
    	device: '=',
    	stylesheets: '<'
    },
    transclude: true,
    replace: false,
    link: function($scope, $directiveElement, $attrs, $controller, $transclude) {
      //console.log($directiveElement.parent())

      $scope.$parent.frame_size = {
        width: $directiveElement.parent().scrollWidth,
        height: $directiveElement.parent().scrollHeight
      }
      
      $transclude($scope.$parent, function($children, otherScope) {

        $directiveElement.html("<iframe width='100%' height='100%'></iframe>");
        var iframe = $directiveElement.find("iframe")[0];

        $scope.$parent.iframe = angular.element(iframe);

        iframe.onload = function() {

          $scope.stylesheets = ['./css/viewer.css', 'https://fonts.googleapis.com/icon?family=Material+Icons']

          angular.forEach($scope.stylesheets, function(stylesheet){
          	angular.element(iframe.contentWindow.document.head).append('<link rel="stylesheet" href="' + stylesheet + '"/>')
          });

          $timeout(function(){
          	$compile($children)($scope.$parent, function(elem) {
            	angular.element(iframe.contentWindow.document.body).append(elem);
          	});
          });
        };

        iframe.src = '';
      });
    }
  };
}])