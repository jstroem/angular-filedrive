angular.module("Filedrive").directive('filedrop', ['$timeout', function($timeout){

	var controller = function($scope, $element, $atts, ctrl){

		$scope.drag = false;

		var dragging = false, timeoutHandler = null;
		var onWindowDragOver = function(e){
			onWindowDragEnter(e);
		}

		var onWindowDragEnter = function(e) {
			dragging = true;
			$scope.$apply(function(){
				$scope.drag = true;
			});
		}

		var onWindowDragLeave = function(e) {
			dragging = false;

			if (timeoutHandler)
				$timeout.cancel(timeoutHandler);
			timeoutHandler = $timeout(function(){
				if (!dragging) $scope.drag = false;
			});
		}

		$scope.$watch('drag', function(){
			if ($scope.drag)
				$element.show();
			else
				$element.hide();
		});
		
		angular.element(window).bind('dragover', onWindowDragOver);
		angular.element(window).bind('dragenter', onWindowDragEnter);
		angular.element(window).bind('dragleave', onWindowDragLeave);

		var onDragOver = function(e){
			e.stopPropagation();
		    e.preventDefault();
			e.originalEvent.dataTransfer.effectAllowed = 'copy';
			onWindowDragOver(e);
			onDragEnter(e);
		}

		$scope.dragElement = false;
		var draggingElement = false, timeoutElementHandler = null;
		var onDragEnter = function(e) {
			draggingElement = true;
			$scope.$apply(function(){
				$scope.dragElement = true;
			});
		}

		var onDragLeave = function(e){
			draggingElement = false;

			if (timeoutElementHandler)
				$timeout.cancel(timeoutElementHandler);
			timeoutElementHandler = $timeout(function(){
				if (!draggingElement) $scope.dragElement = false;
			});
		}

		var onDrop = function(e){
			e.stopPropagation();
		    e.preventDefault();
		    $scope.drop(e.originalEvent.dataTransfer.files);
			onWindowDragLeave(e);
			onDragLeave(e);
		}

		$scope.$watch('dragElement', function(){
			if ($scope.dragElement)
				$element.addClass('hover');
			else
				$element.removeClass('hover');
		});

		$element.bind('dragover', onDragOver);
		$element.bind('dragenter', onDragEnter);
		$element.bind('dragleave', onDragLeave);
		$element.bind('drop', onDrop);
	};

  	return {
    	restrict: 'E',
    	scope: {
    		'dropHtml': '=dropHtml',
    		'drop': '=drop'
    	},
    	template: 	'<h2 ng-bind-html="dropHtml"></h2>',
    	link: controller
  };
}]);