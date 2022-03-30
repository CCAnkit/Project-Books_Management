const mongoose = require('mongoose')


// -----------Validation Function-----------------------------------------------------------------------------------
const isValidValue = function(value) {      //if the value is undefined or null || string that length is 0 it will return false.
    if (typeof value === 'undefined' || value === null) return false        //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false    //it checks whether the string contain only space or not 
    return true;
};

const isValidDetails = function(requestBody) {
    return Object.keys(requestBody).length > 0;       // it checks, is there any key is available or not in request body
};

const isValidTitle = function(title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1      //enum validation
}

module.exports = {
    isValidValue,
    isValidDetails,
    isValidTitle
}