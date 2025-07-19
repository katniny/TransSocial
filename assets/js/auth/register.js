import { createFirstUserRecord } from "./registration/createFirstUserRecord";

let attemptingToRegister = false;
const errorTxt = document.getElementById("errorTxt");

let currentStep = null;

export function register() {
    // dont do multiple register requests
    // if one is already in progress
    if (attemptingToRegister) return;
    attemptingToRegister = true;

    // reset displays
    changeUI();
    errorTxt.style.display = "none";

    // get the email and password
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // then, register the user
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // make sure that the page wont reload
            //preventLoggedInRedirect();

            // continue...
            const user = userCredential.user;
            attemptingToRegister = "success";
            currentStep = "username";
            changeUI();
        }).catch((error) => {
            attemptingToRegister = false;
            // get error
            const errorCode = error.code;
            const errorMessage = error.message;
            // then display error
            if (errorMessage !== "The password is invalid or the user does not have a password.") {
                errorTxt.textContent = errorMessage;
            } else {
                errorTxt.textContent = "Incorrect password.";
            }
            errorTxt.style.display = "block";
            changeUI();
        });
}

// allow html to see it
window.register = register;

// show response
// changeUI() is called within registration functions, where appropriate
const registerBtn = document.getElementById("registerBtn");
export function changeUI() {
    // when attempting to register...
    if (attemptingToRegister === true) {
        registerBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Registering...`;
        registerBtn.style.opacity = "0.5";
        registerBtn.style.cursor = "not-allowed";
    } else if (attemptingToRegister === "success") {
        registerBtn.innerHTML = `Success! Welcome to Auride!`;
        registerBtn.style.opacity = "0.5";
        registerBtn.style.cursor = "not-allowed";
    } else {
        registerBtn.innerHTML = "Login";
        registerBtn.style.opacity = "1";
        registerBtn.style.cursor = "pointer";
    }

    // when moving onto a new step
    switch (currentStep) {
        case "username":
            usernameStep();
            createFirstUserRecord();
            break;
    
        default:
            break;
    }
}

window.changeUI = changeUI;