let attemptingToLogin = false;
const errorTxt = document.getElementById("errorTxt");

export function login() {
    // dont do multiple login requests
    // if one is already in progress
    if (attemptingToLogin) return;
    attemptingToLogin = true;

    // reset displays
    changeButton();
    errorTxt.style.display = "none";

    // get the email and password
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // then, log the user in
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            attemptingToLogin = "success";
            changeButton();
        }).catch((error) => {
            attemptingToLogin = false;
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
            changeButton();
        });
}

// allow html to see it
window.login = login;

// show response
// changeButton() is called within login(), where appropriate
const loginBtn = document.getElementById("loginBtn");
function changeButton() {
    if (attemptingToLogin === true) {
        loginBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...`;
        loginBtn.style.opacity = "0.5";
        loginBtn.style.cursor = "not-allowed";
    } else if (attemptingToLogin === "success") {
        loginBtn.innerHTML = `Signed you in! Welcome back to Auride!`;
        loginBtn.style.opacity = "0.5";
        loginBtn.style.cursor = "not-allowed";
    } else {
        loginBtn.innerHTML = "Login";
        loginBtn.style.opacity = "1";
        loginBtn.style.cursor = "pointer";
    }
}