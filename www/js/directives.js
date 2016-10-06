(function() {
  'use strict';

  angular
    .module('ionnumerickeypad', [])
    .directive('ionNumericKeyboard', function() {

    var appendDefaultCss = function(headElem) {
      var css =  '<style type="text/css">@charset "UTF-8";' +
                    '.ion-numeric-keyboard {' +
                    '    bottom: 0;' +
                    '    left: 0;' +
                    '    right: 0;' +
                    '    position: absolute; ' +
                    '    width: 100%;' +
                    '}' +
                    '.ion-numeric-keyboard .row {' +
                    '    padding: 0;' +
                    '    margin: 0;' +
                    '}' +
                    '.ion-numeric-keyboard .key {' +
                    '    border: 0;' +
                    '    border-radius: 0;' +
                    '    padding: 0;' +
                    '    background-color: transparent;' +
                    '    font-size: 180%;' +
                    '    border-style: solid;' +
                    '    color: #fefefe;' +
                    '    border-color: #444;' +
                    '    background-color: #333;' +
                    '}' +
                    '.ion-numeric-keyboard .control-key {' +
                    '    background-color: #242424;' +
                    '}' +
                    '.ion-numeric-keyboard .key.activated {'+
                    '    box-shadow: inset 0 1px 4px rgba(0, 0, 0, .1);'+
                    '    background-color: rgba(68, 68, 68, 0.5);'+
                    '}' +
                    '.ion-numeric-keyboard .row:nth-child(1) .key {' +
                    '    border-top-width: 1px;' +
                    '}' +
                    '.ion-numeric-keyboard .row:nth-child(1) .key,' +
                    '.ion-numeric-keyboard .row:nth-child(2) .key,' +
                    '.ion-numeric-keyboard .row:nth-child(3) .key {' +
                    '    border-bottom-width: 1px;' +
                    '}' +
                    '.ion-numeric-keyboard .row .key:nth-child(1),' +
                    '.ion-numeric-keyboard .row .key:nth-child(2) {' +
                    '    border-right-width: 1px;' +
                    '}' +
                    '.has-ion-numeric-keyboard {' +
                    '    bottom: 188px;' +
                    '}' +
                  '</style>';
      headElem.append(css);
    };

    return {
      restrict: 'E',
      replace: true,
      template: '<div class="ion-numeric-keyboard">' +
                  '<div class="row">' +
                    '<ion-numeric-keyboard-key content="1" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="2" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="3" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                  '</div>' +
                  '<div class="row">' +
                    '<ion-numeric-keyboard-key content="4" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="5" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="6" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                  '</div>' +
                  '<div class="row">' +
                    '<ion-numeric-keyboard-key content="7" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="8" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="9" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                  '</div>' +
                  '<div class="row">' +
                    '<ion-numeric-keyboard-key content="options.leftControl" on-key-press="options.onKeyPress" source="\'LEFT_CONTROL\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="0" on-key-press="options.onKeyPress" source="\'NUMERIC_KEY\'"></ion-numeric-keyboard-key>' +
                    '<ion-numeric-keyboard-key content="options.rightControl" on-key-press="options.onKeyPress" source="\'RIGHT_CONTROL\'"></ion-numeric-keyboard-key>' +
                  '</div>' +
                '</div>',
      scope: {
            options: '='
      },
      link: function($scope, $element, $attr) {
        // add default css to <head>
        appendDefaultCss(angular.element(document).find('head'));

        // add .has-ion-numeric-keyboard to the content if exists
        var ionContentElem = $element.parent().find('ion-content');
        if (ionContentElem) {
          ionContentElem.addClass('has-ion-numeric-keyboard');
        }

      }
    };
  })
  /**
   * represents a key
   * either a button or a div element depending on the content
   */
  .directive('ionNumericKeyboardKey', ['$compile', function($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
            content: '=',
            source: '=',
            onKeyPress: '=',
      },
      link: function($scope, $element, $attr) {
        var extraClass = '';
        if ($scope.source === 'LEFT_CONTROL') {
          extraClass = 'control-key left-control-key';
        }
        else if ($scope.source === 'RIGHT_CONTROL') {
          extraClass = 'control-key right-control-key';
        }

        if (typeof $scope.content !== 'undefined') {
          $element.replaceWith($compile('<button class="col key button ' + extraClass +'" ng-click="onKeyPress(content, source)" ng-bind-html="content"></button>')($scope));
        }
        else {
          $element.replaceWith($compile('<div class="col key ' + extraClass +'"></div>')($scope));
        }
      }
    };
  }])
  // Add this directive where you keep your directives
    .directive('onLongPress', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $elm, $attrs) {
                $elm.bind('touchstart', function(evt) {
                    // Locally scoped variable that will keep track of the long press
                    $scope.longPress = true;

                    // We'll set a timeout for 600 ms for a long press
                    $timeout(function() {
                        if ($scope.longPress) {
                            // If the touchend event hasn't fired,
                            // apply the function given in on the element's on-long-press attribute
                            $scope.$apply(function() {
                                $scope.$eval($attrs.onLongPress)
                            });
                        }
                    }, 1000);
                });

                $elm.bind('touchend', function(evt) {
                    // Prevent the onLongPress event from firing
                    $scope.longPress = false;
                    // If there is an on-touch-end function attached to this element, apply it
                    if ($attrs.onTouchEnd) {
                        $scope.$apply(function() {
                            $scope.$eval($attrs.onTouchEnd)
                        });
                    }
                });
            }
        };
    }])
   .directive('dividerCollectionRepeat', ['$parse', function($parse) {
    return {
        priority: 1001,
        compile: compile
    };

    function compile (element, attr) {
        var height = attr.itemHeight || '73';
        attr.$set('itemHeight', 'item.isDivider ? 37 : ' + height);

        element.children().attr('ng-hide', 'notification.isDivider');
        element.prepend(
            '<div class="chat-box-single-line" ng-show="notification.isDivider" ><abbr class="timestamp">{{notification.divider}}</abbr> </div>'
            /*'<div class="item item-divider ng-hide" ng-show="notification.isDivider" ng-bind="notification.divider"></div>'*/
        );
    }
}])

/*countrycode limitto 2 digit*/
.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}])
.directive('tabsSwipable', ['$ionicGesture', '$ionicTabsDelegate',function($ionicGesture, $ionicTabsDelegate){
return {
  restrict: 'A',
  require: 'ionTabs',
  link: function($scope, element, attrs, tabsCtrl){
    var maxTabIndex = tabsCtrl.tabs.length - 1; // Holds the maximum tab index depending on the amount of tabs.

       /**
        * Changes selected tab on LEFT SWIPE gesture.
        */
        var selectedTabIndex;
       $ionicGesture.on('swipeleft', function(event) {

         selectedTabIndex = $ionicTabsDelegate.$getByHandle(attrs.delegateHandle).selectedIndex(); // Gets the currently displayed tab index.

         if ( selectedTabIndex >= 0 && selectedTabIndex <= maxTabIndex + 1 ) {
           $ionicTabsDelegate.$getByHandle(attrs.delegateHandle).select(selectedTabIndex + 1);
         }
       }, tabsCtrl.$element);


       /**
        * Changes selected tab on RIGHT SWIPE gesture.
        */
       $ionicGesture.on('swiperight', function(event) {

         selectedTabIndex = $ionicTabsDelegate.$getByHandle(attrs.delegateHandle).selectedIndex(); // Gets the currently displayed tab index.

         if ( selectedTabIndex <= 3 && selectedTabIndex >= maxTabIndex - 1 ) {

           $ionicTabsDelegate.$getByHandle(attrs.delegateHandle).select(selectedTabIndex - 1);

         }
       }, tabsCtrl.$element);
  }
};
}])
.directive("validemailmobile", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.validemailmobile = function(modelValue) {
                if(validator.isNumeric(modelValue)){
                   return validator.isMobilePhone(modelValue, 'en-IN');
                }else{
                   return validator.isEmail(modelValue);
                }
            }
        }
    };
})
.directive('formattedDate', function(dateFilter) {
  return {
    require: 'ngModel',
    scope: {
      format: "="
    },
    link: function(scope, element, attrs, ngModelController) {
      ngModelController.$parsers.push(function(data) {
        //convert data from view format to model format
        return dateFilter(data, scope.format); //converted
      });

      ngModelController.$formatters.push(function(data) {
        //convert data from model format to view format
        return dateFilter(data, scope.format); //converted
      });
    }
  }
})
})();
