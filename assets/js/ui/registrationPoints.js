// this makes registration fancy
// anims, etc., etc.
// also always us to not have several pages for
// each regisration step
export function usernameStep() {
    // start with the animation
    // the auride logo coming up, getting bigger,
    // having the yellow outline run across the logo, then
    // falling into place
    const formBox = document.querySelector(`div[class="formBox"]`);
    formBox.setAttribute("style", `
        transition: all 1s ease;
        opacity: 0;
    `);

    // create the logo that'll be used
    const logo = document.createElement("img");
    logo.src = "/assets/imgs/favicon.png";
    logo.classList.add("welcomeLogo");
    logo.classList.add("goToTop");
    logo.draggable = false;
    document.body.appendChild(logo);

    // then, make it slightly bigger, and do the
    // outline effect
    setTimeout(() => {
        logo.classList.remove("goToTop");
        logo.classList.add("sizeIncrease");
    }, 1350);

    // then, show the formbox again and have the
    // logo slam into it
    setTimeout(() => {
        // set the new innerHTML
        formBox.innerHTML = `
            <img class="formBoxLogo" id="formBoxLogo" draggable="false" src="/assets/imgs/favicon.png" style="opacity: 0;" />
            <h1>Welcome to Auride!</h1>
            <p>We hope you enjoy your time here! Let's start personalizing your account! Starting simple with your display name and username.</p>

            <br />

            <input id="displayName" placeholder="Set your display name" />
            <input id="username" placeholder="Set your username" />
            <p id="errorTxt" class="infoCaution" style="display: none;">No error to display.</p>

            <br />
            <br />

            <button onclick="setDisplayAndUsername()">Set Display Name and Username</button>
        `;

        // then, show the formbox again with new class
        formBox.setAttribute("style", `
            transition: all 0.5s ease;
            opacity: 0;
        `);
        formBox.classList.add("center");

        // and animation :p
        logo.classList.remove("sizeIncrease");
        logo.classList.add("slam");
    }, 2850);

    // finish
    setTimeout(() => {
        formBox.style.opacity = "0.5";
        logo.setAttribute("style", `
            transform: translate(-50%, -300%) scale(1);   
        `);

        formBox.classList.add("impactShake");
        logo.remove();
        document.getElementById("formBoxLogo").style.opacity = "1";
        formBox.style.opacity = "1";
        setTimeout(() => {
            formBox.classList.remove("impactShake");
        }, 500);
    }, 4140);
} 

// define all the functions
window.usernameStep = usernameStep;