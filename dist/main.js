"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("firebase/app"));
require("firebase/auth");
require("firebase/firestore");
var snackbar_1 = require("@material/snackbar");
var snackbar = new snackbar_1.MDCSnackbar(document.querySelector('.mdc-snackbar'));
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = require("firebase-functions");
var enviroment_1 = require("./enviroments/enviroment");
var Main = /** @class */ (function () {
    function Main() {
        this.firebaseApp = app_1.default.initializeApp(enviroment_1.enviroment.firebaseConfig);
        this.fireStore = this.firebaseApp.firestore();
        this.setFormObjects();
    }
    Main.prototype.saveCustomerEnquiry = function () {
        console.log("In Main - saveCustomerEnquiry(), ");
        // alert("In saveCustomerEnquiry()");
        // alert("In saveCustomerEnquiry()2");
        // pull current collection from firestore
        this.getCollection();
        // set form data onto firestore DocumentData object
        this.setCustomerEnquiry();
        // save customer enquiry to firestore
        // this.customerEnquiryID = require("uuid/v5");
        // https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
        this.customers.add(this.customerEnquiry)
            .then(function (success) {
            if (success.path !== undefined) {
                // Message sent
                snackbar.labelText = "Your problem has been sent!  Expect a response shortly.";
                snackbar.open();
            }
            else {
                // Message failed to send
                snackbar.open();
            }
        });
    };
    Main.prototype.setCustomerEnquiry = function () {
        this.customerEnquiry = {
            firstName: this.firstNameElement.value,
            lastName: this.lastNameElement.value,
            email: this.emailElement.value,
            incidentDate: this.incidentDate,
            incidentDescription: this.incidentDescriptionElement.value,
            incidentType: this.incidentTypeElement.value,
            phone: this.phoneElement.value
        };
    };
    Main.prototype.getCollection = function () {
        this.customers = this.fireStore.collection("customers");
    };
    Main.prototype.setFormObjects = function () {
        var _this = this;
        this.firstNameElement = document.getElementById("firstName");
        this.lastNameElement = document.getElementById("lastName");
        this.emailElement = document.getElementById("email");
        this.incidentDate = new Date();
        this.incidentDescriptionElement = document.getElementById("description");
        this.incidentTypeElement = document.getElementById("incidentType");
        this.phoneElement = document.getElementById("phone");
        this.sendButton = document.getElementById("btnCustomerEnquiry");
        this.sendButton.addEventListener("click", function (e) { return _this.saveCustomerEnquiry(); });
    };
    return Main;
}());
exports.Main = Main;
// start the app
new Main();
