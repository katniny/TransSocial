let sendingLink = false;

// show the modal itself
export function resetPassword() {
    // set the inner html
    const innerHTML = `
        <h1><i class="fa-solid fa-key"></i> Forgot password?</h1>
        <p>No worries! You can reset your password here. All we need is your email, and we'll send you a password reset link.</p>

        <input type="email" placeholder="Enter the email address associated with your Auride account" id="passwordResetEmail" />
        <p id="emailLinkstatus" style="display: none;">No status to display.</p>

        <br />
        <br />

        <button onclick="sendPasswordReset()" id="sendPasswordResetBtn">Send Password Reset</button> <button onclick="closeResetPassword()" id="nevermindBtn">Nevermind</button>
    `;

    // then, create the modal and display it
    const modal = document.createElement("dialog");
    modal.innerHTML = innerHTML;
    modal.setAttribute("id", "resetPasswordModal");
    document.body.appendChild(modal);
    modal.showModal();
}

// send link function
export function sendPasswordReset() {
    const emailLinkStatus = document.getElementById("emailLinkstatus");
    emailLinkStatus.style.display = "none";
    emailLinkStatus.classList.remove("infoCaution");

    // dont allow it to happen multiple times
    if (sendingLink === "sent") {
        emailLinkStatus.style.display = "inline-block";
        emailLinkStatus.textContent = "We already sent you a link! Check your email! If you don't see it, check your spam folder.";
        emailLinkStatus.classList.add("infoCaution");
        return;
    }
    if (sendingLink) return;
    console.log("test");

    // update ui
    sendingLink = true;
    updateUI();
    
    // get the email, then send it
    const email = document.getElementById("passwordResetEmail").value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            // update ui
            sendingLink = "sent";
            updateUI();

            // display success!
            emailLinkStatus.textContent = "Successfully sent password reset link, check your email!";
            emailLinkStatus.style.display = "inline-block";
            emailLinkStatus.classList.add("infoGood");
        }).catch((error) => {
            // get the error message and display it
            const errorMessage = error.message;
            emailLinkStatus.textContent = errorMessage;
            emailLinkStatus.style.display = "inline-block";
            emailLinkStatus.classList.add("infoCaution");

            sendingLink = false;
            updateUI();
        });
}

export function closeResetPassword() {
    // would not be good. this would cut off the function
    // at a random point
    if (sendingLink === true) return;

    // otherwise, just delete the modal
    const modal = document.getElementById("resetPasswordModal");
    modal.close();
    setTimeout(() => {
        modal.remove();
    }, 500);
}

// update ui code 
function updateUI() {
    // #define (C moment)
    const sendPasswordResetBtn = document.getElementById("sendPasswordResetBtn");
    const nevermindBtn = document.getElementById("nevermindBtn");
    const passwordResetEmail = document.getElementById("passwordResetEmail");

    if (sendingLink === true) {
        // sendPasswordResetBtn styling
        sendPasswordResetBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Working our magic...`;
        sendPasswordResetBtn.style.opacity = "0.5";
        sendPasswordResetBtn.style.cursor = "not-allowed";

        // just hide the nevermindBtn altogether lol
        nevermindBtn.style.display = "none";

        // prevent selecting the input
        passwordResetEmail.disabled = true;
    } else if (sendingLink === false || sendingLink === "sent") {
        // sendPasswordResetBtn styling
        sendPasswordResetBtn.innerHTML = `Send Password Reset`;
        sendPasswordResetBtn.style.opacity = "1";
        sendPasswordResetBtn.style.cursor = "pointer";

        // show the nevermindBtn
        nevermindBtn.style.display = "inline-block";

        // allow selecting the input
        passwordResetEmail.disabled = false;
    }
}

// allow html to see it
window.resetPassword = resetPassword;
window.sendPasswordReset = sendPasswordReset;
window.closeResetPassword = closeResetPassword;