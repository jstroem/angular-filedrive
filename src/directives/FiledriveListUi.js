angular.module("Filedrive").directive('filedriveListUi', ['FiledriveController', function(controller) {
	return {
		restrict: 'E',
		scope: {
			'defaultOptions': '=options',
			'interface': '=interface'
		},
		template: '<div ng-if="state == \'loading\'" class="filedrive"><h2 class="ui center aligned header" ng-bind-html="options.loadingHtml"></h2></div>' +
			'<div ng-if="state == \'error\'" class="filedrive"><h2 class="ui center aligned header" ng-bind-html="options.errorHtml"></h2></div>' +
			'<div ng-if="state == \'show\'" class="filedrive">' +
			'	<table class="ui striped table" context-menu data-target="context-menu-directory">' +
			'		<thead>' +
			'		<tr>' +
			'			<th>Filename:</th>' +
			'			<th>Oprettet:</th>' +
			'			<th>Sidst redigeret:</th>' +
			'			<th>Størrelse:</th>' +
			'			<th>Type:</th>' +
			'		</tr>' +
			'		</thead>' +
			'		<tbody>' +
			'		<tr class="directory entity" ng-if="directory != options.directory">' +
			'			<td><a href ng-click="openFile(getParentDirectory(directory), $event)">..</a></td>' +
			'			<td></td>' +
			'			<td></td>' +
			'			<td></td>' +
			'			<td></td>' +
			'		</tr>' +
			'		<tr ng-repeat="file in files" ng-class="{\'directory\': file.directory, \'file\': !file.directory, \'uploading\': file.uploading}" ' +
			'			class="entity" ng-if="directory != file.path" context-menu data-target="context-menu-{{$index}}">' +
			'			<td class="filename">' +
			'				<a href ng-click="openFile(file, $event)" ng-if="!file.uploading">{{getFilename(file)}}</a>' +
			'				<span ng-if="file.uploading"><i class="fa fa-spinner fa-pulse"></i> {{getFilename(file)}}</span>' +
			'			</td>' +
			'			<td class="created">' +
			'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getDate(file.created_at, options.dateFormat)}}</a>' +
			'				<span ng-if="file.uploading">{{getDate(file.created_at, options.dateFormat)}}</span>' +
			'			</td>' +
			'			<td class="last_modified">' +
			'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getDate(file.last_modified, options.dateFormat)}}</a>' +
			'				<span ng-if="file.uploading">{{getDate(file.last_modified, options.dateFormat)}}</span>' +
			'			</td>' +
			'			<td class="size">' +
			'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getSize(file)}}</a>' +
			'				<span ng-if="file.uploading">{{getSize(file)}}</span>' +
			'			</td>' +
			'			<td class="type">' +
			'				<a href ng-click="openFile(file, $event)" ng-if="!file.directory && !file.uploading">{{getMimetype(file)}}</a>' +
			'				<span ng-if="file.uploading">{{getMimetype(file)}}</span>' +
			'			</td>' +
			'		</tr>' +
			'		</tbody>' +
			'	</table>' +
			'	<div ng-repeat="file in files" class="ui vertical menu context-menu" id="context-menu-{{$index}}" ng-if="directory != file.path">' +
			'		<a class="item" href ng-click="renameFile(file)">{{options.renameContextMenuText}}</a>' +
			'		<a class="item" href ng-click="newFolder()">{{options.newFolderContextMenuText}}</a>' +
			'		<a class="item" href ng-click="deleteFile(file)">{{options.deleteContextMenuText}}</a>' +
			'	</div>' +
			'	<div class="ui vertical menu context-menu" id="context-menu-directory">' +
			'		<a href class="item" ng-click="newFolder()">{{options.newFolderContextMenuText}}</a>' +
			'	</div>' +
			'	<filedrop class="filedrop" data-drop="dropFile" data-drop-html="options.dropHtml"></filedrop>' +
			'</div>',
		link: controller
	};
}]);