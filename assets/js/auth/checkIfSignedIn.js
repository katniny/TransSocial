let preventBehavior = false;
// if signed in, redirect to /home
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (preventBehavior) return;
        window.location.replace("/home");
    }
});

// allow preventing this behavior, if needed
export function preventLoggedInRedirect() {
    preventBehavior = true;
}
window.preventLoggedInRedirect = preventLoggedInRedirect;