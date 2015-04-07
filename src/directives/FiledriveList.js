angular.module("Filedrive").directive('filedriveList', ['FiledriveService','FiledriveUploadCache', '$location', '$q', function(FiledriveService,UploadCache, $location, $q){

	var controller = function($scope, $element, $atts, ctrl){

		$scope.options = FiledriveService.setupOptions($atts, $scope.defaultOptions);
		$scope.state = 'loading';
		$scope.files = [];
		$scope.directory = null;

		$scope.interface.on('Filedrive:ChangeDirectory', function(e, dir){
			$scope.directory = dir || $scope.options.directory;
			$location.search('dir', $scope.directory);
			getFiles();
		});

		$scope.interface.on('Filedrive:UpdateDirectory', function(e){ getFiles(); });

		var getFiles = function(){
			$scope.state = 'loading';
			$scope.interface.getFiles($scope.directory).then(function(res){
				$scope.$apply(function(){
					$scope.state = 'show';
					$scope.files = res.concat(UploadCache.getFiles($scope.directory));
				});
			}, onError);
		}

		var onError = function(obj){
			$scope.$apply(function(){
				$scope.state = 'error';
				console.log(obj);
			});
		};

		
		$scope.openFile = function(file, e){
			e.stopPropagation();
		    e.preventDefault();
		    $scope.interface.openFile(file);
		}

		$scope.dropFile = function(fileEntries){
			if (!fileEntries || fileEntries.length === undefined)
				return;
			for(var i = 0; i < fileEntries.length; i++) {
				var fileEntry = fileEntries[i];
				FiledriveService.createNewFilename(fileEntry, $.proxy($scope.interface.exists, $scope.interface)).then(function(name){
					$scope.files.push(UploadCache.addFile($scope.interface.upload(fileEntry, name), getFiles));
				}, onError);
			}
		};

		$scope.deleteFile = function(file){
			if (confirm($scope.options.deleteConfirmText)){
				$scope.interface.deleteFile(file);
			}
		}

		$scope.renameFile = function(file){
			var name = $scope.getFilename(file.path);
			if(name = prompt($scope.options.renamePromptText, name)) {
				$scope.interface.rename(file, name);
			}
		}

		$scope.newFolder = function(){
			var name = $scope.options.newFolderDefaultText;
			if(name = prompt($scope.options.newFolderPromptText, name)) {
				$scope.interface.createFolder(name);
			}
		}

		$scope.interface.changeDirectory($location.search().dir);

		$scope.getParentDirectory = FiledriveService.getParentDirectory;
		$scope.getFilename = FiledriveService.getFilename;
		$scope.getDate = FiledriveService.getDate;
		$scope.getSize = FiledriveService.getSize;
		$scope.getMimetype = FiledriveService.getMimetype;
	};


  	return {
    	restrict: 'E',
    	scope: {
    		'defaultOptions': '=options',
    		'interface': '=interface'
    	},
    	template: 	'<div ng-if="state == \'loading\'" class="filedrive"><h1 class="text-center" ng-bind-html="options.loadingHtml"></h1></div>' +
				  	'<div ng-if="state == \'error\'" class="filedrive"><h1 class="text-center" ng-bind-html="options.errorHtml"></h1></div>'+
				  	'<div ng-if="state == \'show\'" class="filedrive">'+
					'	<table class="table table-striped" context-menu data-target="context-menu-directory">'+
				    '		<tr>'+
					'			<th>Filename:</th>'+
					'			<th>Oprettet:</th>'+
					'			<th>Sidst redigeret:</th>'+
					'			<th>Størrelse:</th>'+
					'			<th>Type:</th>'+
					'		</tr>'+
					'		<tr class="directory entity" ng-if="directory != options.directory">'+
					'			<td><a href ng-click="openFile(getParentDirectory(directory), $event)">..</a></td>'+
					'			<td></td>'+
					'			<td></td>'+
					'			<td></td>'+
					'			<td></td>'+
					'		</tr>'+
					'		<tr ng-repeat="file in files" ng-class="{\'directory\': file.directory, \'file\': !file.directory, \'uploading\': file.uploading}" '+
					' 			class="entity" ng-if="directory != file.path" context-menu data-target="context-menu-{{$index}}">'+
					'			<td class="filename"><a href ng-click="openFile(file, $event)">{{getFilename(file)}}</a></td>'+
					'			<td class="created">'+
					'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getDate(file.created_at, options.dateFormat)}}</a>'+
					'				<span ng-if="file.uploading">{{getDate(file.created_at, options.dateFormat)}}</span>'+
					'			</td>'+
					'			<td class="last_modified">'+
					'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getDate(file.last_modified, options.dateFormat)}}</a>'+
					'				<span ng-if="file.uploading">{{getDate(file.last_modified, options.dateFormat)}}</span>'+
					'			</td>'+
					'			<td class="size">'+
					'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getSize(file)}}</a>'+
					'				<span ng-if="file.uploading">{{getSize(file)}}</span>'+
					'			</td>'+
					'			<td class="type">'+
					'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getMimetype(file)}}</a>'+
					'				<span ng-if="file.uploading">{{getMimetype(file)}}</span>'+
					'			</td>'+
					'		</tr>'+
					'	</table>'+
					'	<div ng-repeat="file in files" class="dropdown context-menu" id="context-menu-{{$index}}" ng-if="directory != file.path">'+
					'		<ul class="dropdown-menu" role="menu">'+
					'			<li><a href ng-click="renameFile(file)">{{options.renameContextMenuText}}</a></li>'+
					'			<li><a href ng-click="newFolder()">{{options.newFolderContextMenuText}}</a></li>'+
					'			<li><a href ng-click="deleteFile(file)">{{options.deleteContextMenuText}}</a></li>'+
					'		</ul>'+
					'	</div>'+
					'	<div class="dropdown context-menu" id="context-menu-directory">'+
					'		<ul class="dropdown-menu" role="menu">'+
					'			<li><a href ng-click="newFolder()">{{options.newFolderContextMenuText}}</a></li>'+
					'		</ul>'+
					'	</div>'+
					'	<filedrop class="filedrop" data-drop="dropFile" data-drop-html="options.dropHtml"></filedrop>' +
				  	'</div>',
    	link: controller
  };
}]);