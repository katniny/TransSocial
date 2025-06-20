// alert dev console users to be careful :p
// if not literally developing though
if (!window.location.origin.startsWith("http://127.0.0.1") && !window.location.origin.startsWith("http://localhost")) {
   console.log("%cStop!", "color: red; font-size: 35px;");
   console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a TransSocial feature or 'hack' someone's account, it is a scam and will give them access to your TransSocial account.", "color: white; font-size: 15px; font-family: sans-serif;");
   console.log(" ");
}

// if a script is used on every page, we can call it here
// as a "dependency"
function loadScript(src, async, type) {
   return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = async;
      if (type)
         script.type = type;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
   });
}

async function loadAllScripts() {
   try {
      // required before ts_fas_acih.js
      await loadScript("/assets/js/pathName.js", false);
      await loadScript("/assets/js/versioning.js", false);

      // firebase initialization
      await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js", false);
      await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js", false);
      await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-database.js", false);
      await loadScript("https://www.gstatic.com/firebasejs/8.6.8/firebase-storage.js", false);
      await loadScript("/assets/js/firebase.js", false, "module");
      await loadScript("/assets/js/utils.js", false);
      await loadScript("/assets/js/ts_fas_acih.js", false, "module");

      // page loader
      await loadScript("/assets/js/setTheme.js", false);
      await loadScript("/assets/js/pageLoader.js", false);

      // our icons
      await loadScript("https://kit.fontawesome.com/be7c331826.js", false);

      // the sidebar opener
      await loadScript("/assets/js/sidebarOpen.js", false);

      // our emojis
      await loadScript("/assets/js/twemoji.js", false);

      // our note creation modal
      await loadScript("/assets/js/ui/createNotePopup.js", false);

      // notifications
      await loadScript("/assets/js/notifications.js", false);

      // temp
      await loadScript("/assets/js/ui/editNoteUI.js", false);
      await loadScript("/assets/js/cwDescriptions.js", false);

      // finished!
      console.log("All-page scripts loaded successfully.");
      document.dispatchEvent(new Event("scriptsLoaded"));
   } catch (error) {
      console.error("Error loading Firebase scripts: ", error);
   }
}

loadAllScripts();
