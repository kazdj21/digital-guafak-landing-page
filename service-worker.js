self.addEventListener('install', function(e) {

    console.log('Service worker is now being installed.', e)

});

self.addEventListener('activate', function(e) {

    console.log('Service worker is now being activated', e)

    return self.clients.claim(); //necessary line to prevent errors.

});

self.addEventListener('fetch', function(e) {
    
    console.log('service worker fetch event!');
    e.respondWith();
    
})

