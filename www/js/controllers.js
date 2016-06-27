angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})


.controller('NewGameCtrl', function($scope, $rootScope, $stateParams, Wordsmatrix, wordSearchPuzzle) {
        //var randommatrixnumber = Math.floor(Math.random() * (20 - 0)) + 0; 
        var randommatrixnumber = 1;
        console.log (randommatrixnumber);
        $scope.words = Wordsmatrix.get(randommatrixnumber).words.split(' ');
        $scope.matrix1d = Wordsmatrix.get(randommatrixnumber).matrix.split(' ');
        $scope.matrix = [];
        while($scope.matrix1d.length) $scope.matrix.push($scope.matrix1d.splice(0,12));
        $scope.category = Wordsmatrix.get(randommatrixnumber).category;
        console.log ($scope.category);

    //=============Start: timer====================
    $scope.duration = "2:0"  
    //==================END: Timer
    //=======initialize all settings===========
    if ( $rootScope.settings==undefined) {
        $scope.timeroption = true; 
    } else {
        $scope.timeroption = $rootScope.settings.enableTimer;
    }
    //=========END:initialize all settings
   
})


.controller('AccountCtrl', function($rootScope, $scope) {
  $rootScope.settings = {
    enableTimer: false
  };
})
