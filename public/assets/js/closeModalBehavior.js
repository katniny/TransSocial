// prevent .close(); from closing a modal without an animation
// save the original close method ofc tho
const originalClose = HTMLDialogElement.prototype.close;

HTMLDialogElement.prototype.close = function() {
    const modal = this;

    // apply the animation
    modal.style.animation = "closePopup 0.5s ease";

    // wait for the animation to finish before actually closing the modal
    setTimeout(() => {
        // call the original close moethod
        originalClose.call(modal);

        // remove the animation
        modal.style.animation = "";
    }, 100);
};

// prevent modals from being closed with esc as it can breaks things (such as)
// letting the user use auride without verifying their email... oopsies)
// this is just default <dialog> behavior, not something i manually coded :p
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        const openDialog = document.querySelector("dialog[open]");
        if (openDialog) {
            // this will prevent it
            event.preventDefault();
            event.stopPropagation(); 
        }
    }
});