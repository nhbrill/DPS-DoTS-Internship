//https://rawgit.com/adrotec/knockout-file-bindings/master/knockout-file-bindings.js
/*
 * knockout-file-bindings
 * Copyright 2014 Muhammad Safraz Razik
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: Muhammad Safraz Razik
 * Project: https://github.com/adrotec/knockout-file-bindings
 */

(function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"));
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko);
    }
}(function (ko) {

    var windowURL = window.URL || window.webkitURL;

    ko.bindingHandlers.fileInput = {
        init: function (element, valueAccessor) {
            var fileData = ko.utils.unwrapObservable(valueAccessor()) || {};
            if (fileData.dataUrl) {
                fileData.dataURL = fileData.dataUrl;
            }
            fileData.file = fileData.file || ko.observable();
            fileData.fileArray = fileData.fileArray || ko.observableArray([]);
            var currentAcceptValue = element.getAttribute('accept');

            function fillData(file, index) {
                var fileProperties = ['dataURL'];
                var doneFileProperties = {};
                var checkDoneFileProperties = function (doneProperty) {
                    var done = true;
                    doneFileProperties[doneProperty] = true;
                }
                fileProperties.forEach(function (property) {
                    var reader = new FileReader();
                    var method = 'readAs' + (property.substr(0, 1).toUpperCase() + property.substr(1));
                    reader.onload = function (e) {
                        function fillDataToProperty(result, prop) {
                            if (index == 0 && fileData[prop] && ko.isObservable(fileData[prop])) {
                                fileData[prop](result);
                            }
                        }
                        if (method == 'readAsDataURL' && (fileData.base64String || fileData.base64StringArray)) {
                            var resultParts = e.target.result.split(",");
                            if (resultParts.length === 2) {
                                fillDataToProperty(resultParts[1], 'base64String');
                            }
                        }
                        fillDataToProperty(e.target.result, property);
                        checkDoneFileProperties(property);
                    };

                    reader[method](file);
                });
            }
            //adds file array necessary for dataURL
            fileData.fileArray.subscribe(function (fileArray) {
                fileArray.forEach(function (file, index) {
                    fillData(file, index, function () {
                        checkDoneFiles(index);
                    });
                });
            });
            //allows the file to be changed
            element.onchange = function () {
                var file = this.files[0];
                var fileArray = [];
                if (file) {
                    for (var i = 0; i < this.files.length; i++) {
                        fileArray.push(this.files[i]);
                    }

                }
                fileData.fileArray(fileArray);
            };
        },
    };
}));