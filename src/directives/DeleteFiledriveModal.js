angular.module("Filedrive").directive('deleteFiledriveModal', ['FiledriveService',function(FiledriveService){

	var controller = function($scope, $element, $atts, ctrl){
		$scope.getFilename = FiledriveService.getFilename; 
	};

  	return {
    	restrict: 'E',
    	scope: {
    		'file': '=file',
    		'onDeleteFile': '&onDeleteFile',
    		'name': '=name',
    		'title': '=title',
    		'content': '=content',
    		'accept': '=accept',
    		'reject': '=reject'
    	},
    	template: ''+
    		'<div class="modal fade" id="{{name}}" tabindex="-1" role="dialog" aria-labelledby="{{name}}Title" aria-hidden="true">'+
  			'	<div class="modal-dialog">'+
    		'		<div class="modal-content">'+
      		'			<div class="modal-header">'+
        	'				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
        	'				<h4 class="modal-title" id="{{name}}Title">{{title}}: {{getFilename(file)}}</h4>'+
      		'			</div>'+
      		'			<div class="modal-body">'+
      		'				{{content}}'+
      		'			</div>'+
      		'			<div class="modal-footer">'+
      		'				<button type="button" class="btn btn-default" data-dismiss="modal">{{reject}}</button>'+
        	'				<button type="button" class="btn btn-primary" ng-click="onDeleteFile">{{accept}}</button>'+
      		'			</div>'+
      		'		</div>'+
      		'	</div>'+
      		'</div>',
    	link: controller
  };
}]);