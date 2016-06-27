angular.module('starter.directives', ['ngTouch'])

.directive('wordSearchPuzzle', function(wordSearchPuzzle) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<table class="word-search-puzzle" cellspacing="0" ng-class="{\'puzzle-solved\': puzzle.solved}">' +
                '<tr ng-repeat="items in puzzle.matrix">' +
                '<td ng-repeat="item in items" unselectable="on"' +
                ' class="swipe"' +
                ' ng-class="{\'puzzle-found\': item.found, \'puzzle-selected\': item.selected, \'puzzle-message\': puzzle.solved && !item.found}"' +
                ' on-drag="selectStart(item)" on-release="selectEnd(item)" >' +
                ' <span>{{item.letter}}</span>' +
                '</td>' +
                '</tr>' +
                '</table>',
            scope: {
                matrix: '=',
                words: '=',
                api: '='
            },
            link: function(scope, element, attrs) {
                var selectFrom;

                // setup puzzle
                scope.$watch('matrix', function(matrix) {
                    scope.puzzle = wordSearchPuzzle(matrix, scope.words);

                    // link service
                    if (attrs.api) {
                        scope.api = scope.puzzle;
                    }
                });

                /**
                 * Selected items
                 * @type {Array}
                 */
                scope.selected = [];
                scope.touched = false;
                /**
                 * Selection start
                 * @param item
                 */
                scope.selectStart = function(item) {
                    selectFrom = item;
                    //alert(selectFrom.col+"start");
                    //alert(scope.touched+"start");
                };

                /**
                 * Selection enter (over)
                 * @param item
                 */
                scope.selectEnter = function(item) {
                    if (selectFrom) {
                        scope.selected = scope.puzzle.getItems(selectFrom.col, selectFrom.row, item.col, item.row);
                        //alert("move");
                    }
                    
                };

                /**
                 * Selection end
                 */
                scope.selectEnd = function(item) {
                        if (selectFrom) {
                            //alert(item.col+"end");
                            //scope.touched = false;
                            scope.selected = scope.puzzle.getItems(selectFrom.col, selectFrom.row, item.col, item.row);                      
                        }
                    //selectFrom = null;
                    scope.puzzle.lookup(scope.selected);
                    scope.selected = [];
                    //alert("end");
                    
                };

                // propagate selection state to matrix
                scope.$watch('selected', function(newItems, oldItems) {
                    angular.forEach(oldItems, function(item) {
                        item.selected = false;
                    });
                    angular.forEach(newItems, function(item) {
                        item.selected = true;
                    });
                });
            }
        };
    })
.directive('myTouchstart', [function() {

    return function(scope, element, attr) {

        element.on('touchstart', function(event) {
            scope.$apply(function() { 
                scope.$eval(attr.myTouchstart); 
            });
        });
    };
}]).directive('myTouchcancel', [function() {
    return function(scope, element, attr) {

        element.on('touchcancel', function(event) {
            event.preventDefault();
            scope.$apply(function() { 
                scope.$eval(attr.myTouchcancel); 
            });
        });
    };
}]);

