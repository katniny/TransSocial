let transsocialVersion = "v2025.4.12";
let transsocialUpdate = "v20250412-3";
let transsocialReleaseVersion = "pre-alpha";
let hasUpdateNotes = true;

const notices = document.getElementsByClassName("version-notice");
for (let notice of notices) {
   notice.innerHTML = `TransSocial is currently in the pre-alpha stage (version ${transsocialVersion}). A lot of features are missing or are in development and will be added with updates. <a href="/indev">Learn more</a>.`;
}