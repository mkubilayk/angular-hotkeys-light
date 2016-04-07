(function (angular) {
  'use strict';

  var app = angular.module('ngTestApp', ['fps.hotkeys']);

  app.directive('hotkeyCheetsheet', function(){
    return {
      restrict: 'E',
      scope: { onToggle: '&' },
      template: '<div>Hotkeys Cheetsheet</div>',
      bindToController: true,
      controllerAs: 'vm',
      controller: function($scope, Hotkeys) {
        var ctrl = this;

        ctrl.show = false;

        var toggleKey = Hotkeys.createHotkey({
          key: 'meta+enter',
          callback: function() {
            ctrl.show = !ctrl.show;
          }
        });

        Hotkeys.registerHotkey(toggleKey);

        $scope.$watch('vm.show', function(value) {
          if (value === void 0) return;
          ctrl.onToggle({show: value});
        });

        $scope.$on('$destroy', function() {
          Hotkeys.deregisterHotkey(toggleKey);
        });
      }
    };
  });

}(window.angular));
