angular.module('Filedrive').factory('FiledriveController', ['FiledriveService', 'FiledriveUploadCache', '$location', function(FiledriveService, UploadCache, $location) {
	var controller = function($scope, $element, $atts, ctrl) {
		$scope.options = FiledriveService.setupOptions($atts, $scope.defaultOptions);
		$scope.state = 'loading';
		$scope.files = [];
		$scope.directory = null;

		$scope.interface.on('Filedrive:ChangeDirectory', function(e, dir) {
			$scope.directory = dir || $scope.options.directory;
			$location.search('dir', $scope.directory);
			getFiles();
		});

		$scope.interface.on('Filedrive:UpdateDirectory', function(e) {
			getFiles();
		});
		$scope.interface.on('Filedrive:Error', function(e, obj) {
			onError(obj);
		});

		var getFiles = function() {
			$scope.state = 'loading';
			$scope.interface.getFiles($scope.directory).then(function(res) {
				$scope.$apply(function() {
					$scope.state = 'show';
					$scope.files = res.concat(UploadCache.getFiles($scope.directory));
				});
			}, onError);
		}

		var onError = function(obj) {
			$scope.$apply(function() {
				$scope.state = 'error';
				console.log(obj);
			});
		};


		$scope.openFile = function(file, e) {
			e.stopPropagation();
			e.preventDefault();
			$scope.interface.openFile(file);
		}


		var uploadFile = function(fileEntry) {
			FiledriveService.createNewFilename(fileEntry, $.proxy($scope.interface.exists, $scope.interface)).then(function(name) {
				$scope.files.push(UploadCache.addFile($scope.interface.upload(fileEntry, name), getFiles));
			}, onError);
		};

		$scope.dropFile = function(fileEntries) {
			if (!fileEntries || fileEntries.length === undefined)
				return;
			for (var i = 0; i < fileEntries.length; i++)
				uploadFile(fileEntries[i]);
		};

		$scope.deleteFile = function(file) {
			if (confirm($scope.options.deleteConfirmText)) {
				$scope.interface.deleteFile(file);
			}
		}

		$scope.renameFile = function(file) {
			var name = $scope.getFilename(file.path);
			if (name = prompt($scope.options.renamePromptText, name)) {
				$scope.interface.rename(file, name);
			}
		}

		$scope.newFolder = function() {
			var name = $scope.options.newFolderDefaultText;
			if (name = prompt($scope.options.newFolderPromptText, name)) {
				$scope.interface.createFolder(name);
			}
		}

		$scope.interface.changeDirectory($location.search().dir || $scope.options.directory);

		$scope.getParentDirectory = FiledriveService.getParentDirectory;
		$scope.getFilename = FiledriveService.getFilename;
		$scope.getDate = FiledriveService.getDate;
		$scope.getSize = FiledriveService.getSize;
		$scope.getMimetype = FiledriveService.getMimetype;
	}

	return controller;
}]);