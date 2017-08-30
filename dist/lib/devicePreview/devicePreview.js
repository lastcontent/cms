angular.module('devicePreview', [])
.directive('devicePreview', ['$compile', '$timeout', function($compile, $timeout) {

	/* Layers: 
	 * - base		Match height and width of preview area
	 * - parent		Take on actual dimensions of emulated device
	 * - iframe		Match height and width of parent, CSS and viewport isolation
	 * - child 		Scaled to hold preview and fit within preview area
	 */

	return {
		restrict: "E",
		scope: {
			device: '=',
			stylesheets: '<',
			copyParentStyles: '<'
		},
		transclude: true,
		replace: false,
		controller: ["$scope", "$element", "$attrs", "$transclude", function($scope, $element, $attrs, $transclude){

			$scope.scale = function(){
				var d = $scope.device;
				var p = {
					width: $scope.elements.base[0].offsetWidth, 
					height: $scope.elements.base[0].offsetHeight
				};

				var fit = (p.width / p.height > d.width / d.height);
				var scale = fit ? p.height / d.height : p.width / d.width;

				return scale;
				//var width = fit ? d.width * p.height / d.height : p.width;
				//var height = fit ? p.height : d.height * p.width / d.width;
			}

			$scope.styles = {
				base: function(){
					return {
						'display': 'flex',
						'align-items': 'center',
						'justify-content' : 'center',
						'width': '100%',
						'height': '100%'
					}
				},
				parent: function(){
					return {
						"flex-shrink": 0,
						"display": "flex",
						"align-items": "center",
						"justify-content": "center",
						"width": $scope.device.width + "px",
						"height": $scope.device.height + "px",
						//'transform': 'scale(' + $scope.scale() +')'
					}
				},
				iframe: function(){
					return {
						'display': 'flex',
						'align-items': 'center',
						'justify-content': 'center',
						'width': '100%',
						'height': '100%',
					}
				},
				child: function(){
					return {
						'width': $scope.device.width + 'px',
						'height': $scope.device.height + 'px',
						'transform': 'scale(' + $scope.scale() +')'
					}
				}
			}

			$scope.elements = {
				base: angular.element('<div>').css($scope.styles.base()),
				parent: angular.element('<div ng-style="styles.parent()">'),
				iframe: angular.element('<iframe>').css($scope.styles.iframe()),
				child: angular.element('<div ng-style="styles.child()">')
			}
		}],

		link: function($scope, $element, $attrs, $controller, $transclude) {
			
			$transclude($scope.$parent, function($children, otherScope) {

				$compile($scope.elements.parent)($scope, function(parent){

					$element.replaceWith(
						$scope.elements.base
						.append(parent
							.append($scope.elements.iframe)
						)
					);

				})
				console.log($scope.elements.base)
				var iframe = $scope.elements.iframe[0];

				iframe.onload = function() {
					
					//Load stylesheets specified by the stylesheets attr
					angular.forEach($scope.stylesheets, function(stylesheet){
						angular.element(iframe.contentWindow.document.head)
						.append('<link rel="stylesheet" href="' + stylesheet + '"/>')
					});

					//Copy parent styles if the copyParentStyles attr is true
					if ($scope.copyParentStyles){
						angular.forEach(
							angular.element(document)
							.find("style, link[rel='stylesheet'], link[type='text/css'], link[href$='.css']")
						, function(element){
							angular.element(iframe.contentWindow.document.head)
							.append(element.clone())
						})
					}

					$timeout(function(){
						$compile($scope.elements.child)($scope, function(child){
							$compile($children)($scope.$parent, function(children) {
								angular.element(iframe.contentWindow.document.body)
								.append(
									child
									.append(children)
								);
							});
						})
					});
				};

				iframe.src = '';
			});
		}
	};
}])