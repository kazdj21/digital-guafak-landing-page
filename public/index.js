
// check if service worker is compatible with browser

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register("../service-worker.js").then(() => {
        console.log("Service Worker Registered!");
    });

}