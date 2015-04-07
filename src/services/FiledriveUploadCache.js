angular.module("Filedrive").service('FiledriveUploadCache', ['FiledriveService','$q', function(FiledriveService, $q){
	var files = {};

	this.addFile = function(file, cb){
		if (!file.uploading)
			return file;
		var directory = FiledriveService.getParentDirectory(file.path).path;
		var directoryFiles = files[directory] = files[directory] || [];
		file.promise.done(function(){
			var i = directoryFiles.indexOf(file);
			if (i > -1)
				directoryFiles.splice(i, 1);
			if (angular.isFunction(cb)) 
				cb();
		});
		return file;
	};

	this.getFiles = function(dir){
		return files[dir] || [];
	};
}]);