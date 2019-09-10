import firebase, { firestore } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { MDCSnackbar } from '@material/snackbar';
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = require("firebase-functions");

import { enviroment } from "./enviroments/enviroment";

export class Main {
    customerEnquiryID: string;
    emailElement: HTMLInputElement;
    firebaseApp: firebase.app.App;
    fireStore: firestore.Firestore;
    firstNameElement: HTMLInputElement;
    lastNameElement: HTMLInputElement;
    incidentDate: Date;
    incidentDescriptionElement: HTMLTextAreaElement;
    incidentTypeElement: HTMLSelectElement;
    phoneElement: HTMLInputElement;
    customerEnquiry: firestore.DocumentData;
    customers: firestore.CollectionReference;
    sendButton: HTMLButtonElement;

    constructor() {
        this.firebaseApp = firebase.initializeApp(enviroment.firebaseConfig);

        this.fireStore = this.firebaseApp.firestore();

        this.setFormObjects();
    }

    private saveCustomerEnquiry(): void {
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
            .then(success => {
                if (success.path !== undefined) {
                    // Message sent
                    snackbar.labelText = "Your problem has been sent!  Expect a response shortly."
                    snackbar.open()
                } else {
                    // Message failed to send
                    snackbar.open()
                }
            });
    }

    private setCustomerEnquiry(): void {
        this.customerEnquiry = {
            firstName: this.firstNameElement.value,
            lastName: this.lastNameElement.value,
            email: this.emailElement.value,
            incidentDate: this.incidentDate,
            incidentDescription: this.incidentDescriptionElement.value,
            incidentType: this.incidentTypeElement.value,
            phone: this.phoneElement.value
        };
    }

    private getCollection(): void {
        this.customers = this.fireStore.collection("customers");
    }

    private setFormObjects(): void {
        this.firstNameElement = document.getElementById("firstName") as HTMLInputElement;
        this.lastNameElement = document.getElementById("lastName") as HTMLInputElement;
        this.emailElement = document.getElementById("email") as HTMLInputElement;
        this.incidentDate = new Date();
        this.incidentDescriptionElement = document.getElementById("description") as HTMLTextAreaElement;
        this.incidentTypeElement = document.getElementById("incidentType") as HTMLSelectElement;
        this.phoneElement = document.getElementById("phone") as HTMLInputElement;

        this.sendButton = document.getElementById("btnCustomerEnquiry") as HTMLButtonElement;

        this.sendButton.addEventListener("click", (e: Event) => this.saveCustomerEnquiry());

    }
}

// start the app
new Main();