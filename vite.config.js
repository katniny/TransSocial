import { defineConfig } from "vite";

function customRewrite() {
    return {
        name: "custom-rewrite",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url.startsWith("/u/")) {
                    req.url = "/u.html";
                } else if (req.url.startsWith("/note/")) {
                    req.url = "/note.html";
                } else if (req.url.startsWith("/userstudio/")) {
                    req.url = "/userstudio.html";
                }
                next();
            });
        }
    }
}

export default defineConfig({
    plugins: [customRewrite()],
    server: {
        fs: {
            strict: true
        }
    },
    appType: "mpa"
});