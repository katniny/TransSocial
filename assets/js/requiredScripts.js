// if a script is used on every page, we call it here
// as a "dependency"
function loadScript(src, async, type) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = async;
        if (type) {
            script.type = type;
        }
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

async function loadAllScripts() {
    try {
        // load firebase scripts
        await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js", false);
        await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js", false);
        await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-database.js", false);
        await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js", false);
        await loadScript("/assets/js/firebase.js", false, "module");
    } catch (error) {
        console.error("Error loading scripts: ", error);
    }
}

loadAllScripts();