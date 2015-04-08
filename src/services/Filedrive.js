angular.module("Filedrive").service('FiledriveService', ['$q','$filter', '$sce', function($q, $filter, $sce){

	var self = this;

	this.setupOptions = function($atts, options){

		var attr_options = {};
		if ($atts['directory'] !== undefined) attr_options['directory'] = $atts['directory'];

		var trustHtml = ['loadingHtml', 'errorHtml', 'dropHtml',
						 'deleteContextMenuText','deleteConfirmText','renameContextMenuText','renamePromptText','newFolderContextMenuText','newFolderPromptText','newFolderDefaultText'];
		for(var i = 0; i < trustHtml; i++)
			if (options[trustHtml[i]]) options[trustHtml[i]] = $sce.trustAsHtml(options[trustHtml[i]]);

		return angular.extend({
			directory: '/',
			dateFormat: 'dd-MM-yyyy',
			loadingHtml: $sce.trustAsHtml('<i class="fa fa-spinner fa-pulse"></i> Loading'),
			dropHtml: $sce.trustAsHtml('<i class="fa fa-upload"></i> Upload'),
			errorHtml: $sce.trustAsHtml('<i class="fa fa-exclamation-triangle"></i> Error'),
			deleteContextMenuText: $sce.trustAsHtml('Delete'),
			deleteConfirmText: $sce.trustAsHtml('Are you sure you want to delete the file?'),
			renameContextMenuText: $sce.trustAsHtml('Rename'),
			renamePromptText: $sce.trustAsHtml('Please enter the new name for the file'),
			newFolderContextMenuText: $sce.trustAsHtml('New folder'),
			newFolderPromptText: $sce.trustAsHtml('Please enter the new name for the folder'),
			newFolderDefaultText: $sce.trustAsHtml('New folder')
		}, options, attr_options);
	};

	this.getParentDirectory = function(path){
		if (path.substr(-1) != '/')
			path = path.substr(0, path.lastIndexOf('/') + 1);
		else
			path = path.split('/', path.match(/\//g).length - 1 || 0).join('/') + '/';

		return {
			'directory': true,
			'path': path
		};
	};

	this.createNewFilename = function(fileEntry, exists, i, defer){
		if (defer === undefined)
			defer = $q.defer();
		if (i === undefined)
			i = 0;

		var name = fileEntry.name;
		if (i > 0)
			name = name.substr(0, name.lastIndexOf('.')) + ' ('+i+').' + self.getFiletype(name);

		exists(name).then(function(res){
			if (res)
				self.createNewFilename(fileEntry, exists, i+1, defer);
			else
				defer.resolve(name);
		}, defer.reject);
		return defer.promise;
	};

	this.getFilename = function(file){
		if (file === undefined || file === null)
			return '';
		var path = file.path || file;
		if (path.substr(-1) == '/')
			path = path.substr(0, path.length - 1);

		return decodeURIComponent(path.substr(path.lastIndexOf('/') + 1));
	};

	this.getDate = function(date, format){
		if (date === null || date === undefined)
			return '';
		if (format === null || format === undefined)
			format = 'dd-MM-yyyy';

		return $filter('date')(date, format);
	};

	this.getSize = function(file){
		if (file.size === null || file.size === undefined)
			return '';
		else 
			return global !== undefined ? global.filesize(file.size) : window.filesize(file.size);
			
	};

	this.getFiletype = function(file){
		if (file === undefined || file === null)
			return '';
		if (file.directory)
			return '';
		else {
			var filename = self.getFilename(file);
			var filetype = filename.substr(filename.lastIndexOf('.') + 1);
			return filetype;
		}
	};

	this.getMimetype = function(file){
		if (file.directory)
			return '';
		else
			return mimetype[self.getFiletype(file)];
	};
}]);