const ScriptLoader = (() => {
    const loadedScripts = new Set();
    const pendingPromises = {};
    const scriptQueue = [];
    let scriptsAreReady = false;

    // process the script queue once "scriptsLoaded" is dispatched
    document.addEventListener("scriptsLoaded", () => {
        scriptsAreReady = true;
        while (scriptQueue.length) {
            const { resolve, reject, script } = scriptQueue.shift();
            document.head.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
        }
    });

    function loadScript({ src, async = true, type }) {
        if (loadedScripts.has(src)) return Promise.resolve();

        if (pendingPromises[src]) return pendingPromises[src];

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = async;
            if (type) {
                script.type = type;
            }

            if (scriptsAreReady) {
                // if scripts are ready, append immediately
                document.head.appendChild(script);
                script.onload = () => {
                    loadedScripts.add(src);
                    resolve();
                };
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            } else {
                // otherwise, queue the script
                scriptQueue.push({ resolve, reject, script });
            }
        });

        pendingPromises[src] = promise;
        return promise;
    }

    return {
        load: (...scripts) => Promise.all(scripts.map(loadScript)),
        isLoaded: (src) => loadedScripts.has(src),
    };
})();

export { ScriptLoader };