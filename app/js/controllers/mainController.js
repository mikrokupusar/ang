// Code here will be linted with JSHint.
/* jshint ignore:start */
// Code here will be ignored by JSHint.

angular
    .module('angTest')
    .controller('mainController', mainController);


function mainController() {
    'use strict';
    var vm = this;
    vm.list =  [
        {
            'id' : 1,
            'ime': 'math',
            'prezime': 'teacher'
        },
        {
            'id' : 2,
            'ime': 'miralem',
            'prezime': 'zjajo'
        }
    ];
}


/* jshint ignore:end */