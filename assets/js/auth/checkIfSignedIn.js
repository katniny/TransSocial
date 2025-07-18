// if signed in, redirect to /home
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.location.replace("/home");
    }
});