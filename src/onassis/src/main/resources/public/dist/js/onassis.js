'use strict';

function setVisible(element){
	var controllerElement = document.querySelector('body');
	var controllerScope = angular.element(controllerElement).scope();
	console.log("setVisible("+element+"): "+controllerScope.visible)
	controllerScope.setVisible();
	controllerScope.$apply();
}


//var app = angular.module('onassisApp',['ngTable']);
//var app = angular.module('onassisApp',['smart-table', 'gg.editableText']);
var app = angular.module('onassisApp',['smart-table']);

app.service('Globals', function() {
  this.language= 'en';
});


//app.controller('onassisCtrl', ['$scope', '$q', '$timeout', '$filter', function (scope, q, timeout, filter ) {
app.controller('onassisCtrl', ['$scope', '$filter', function (scope, filter ) {
	scope.visible = false;
    scope.rowCollection = [
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'},
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'},
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'},
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}

        
        ];
    
    scope.test = function(foo) {
    	console.log(foo)
    }
    
    scope.setVisible = function() {
    	console.log("setVisible:" + scope.visible)
    	scope.visible = true;
    	return scope.visible;
    }
    
    scope.isVisible = function(element) {
    	console.log("isVisible("+element+"): "+scope.visible)
    	return scope.visible;
    }
    
    
    
    
    /* copy 
    scope.myTitle = 'I\'m an Editable Title!';

    scope.validateNoColor = function (value) {
        var colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'],
            valid = true;
        angular.forEach(colors, function (color) {
            if (value.toLowerCase().indexOf(color) !== -1) {
                alert('Color ' + color + ' is not allowed!');
                valid = false;
            }
        });

        return valid ? value : false;
    };

    scope.validateLength = function (value) {
        return (value.length < 10) ? false : value;
    };

    scope.censorship = function (value) {
        var curses = ['fuck', 'shit', 'bitch', 'ass', 'bastard', 'asshole', 'dick', 'pussy', 'darn', 'crap', 'fag', 'slut'];
        var arr = value.split(' ');
        angular.forEach(arr, function (word, idx) {
            var found = false;
            angular.forEach(curses, function (curse) {
                if (!found && word.toLowerCase().indexOf(curse.toLowerCase()) !== -1) {
                    found = true;
                }
            });

            if (found) {
                arr[idx] = word.replace(/./g, '*');
            }
        });

        return arr.join(' ');
    };

    scope.enthusiastic = function (value) {
        if (!value.match(/.*!/)) {
            value += '!';
        }
        return value;
    };

    scope.saveToServer = function (value) {
        var dfd = q.defer();

        //2-7 secs delay
        var rand = (parseInt(Math.random() * 5) + 2) * 1000;

        timeout(function () {

            //simulate a 70% chance of success
            if (Math.random() > 0.3) {
                dfd.resolve(value);
            }
            else {
                dfd.reject();
                alert('Request failed!');
            }

        },rand);

        return dfd.promise;
    };

    scope.validateServer = function (value) {
        var dfd = q.defer();

        //2-7 secs delay
        var rand = (parseInt(Math.random() * 3) + 1) * 1000;

        timeout(function () {

            //simulate a 70% chance of success
            if (!value.match(/\d/)) {
                dfd.resolve(value);
            }
            else {
                dfd.reject();
                alert('No digits allowed..');
            }

        },rand);

        return dfd.promise;
    }
    end copy */

}]);

app.directive('csSelect', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });

            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                } else {
                    element.parent().removeClass('st-selected');
                }
            });
        }
    };
});

app.directive('stRatio',function(){
    return {
        link:function(scope, element, attr){
          var ratio=+(attr.stRatio);
          
          element.css('width',ratio+'%');
          
        }
      };
  });
/*app.controller('onassisCtrl', function ($scope, $filter, $interval, Globals) {
	
	    $scope.rowCollection = [
	        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
	        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
	        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
	    ];


});*/

//angular.bootstrap(document, ['onassisApp']);