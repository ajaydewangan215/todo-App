// const isLocalhost = Boolean(
//     window.location.hostname === 'localhost' ||
//     // [::1] is the IPv6 localhost address.
//     window.location.hostname === '[::1]' ||
//     // 127.0.0.0/8 are considered localhost for IPv4.
//     window.location.hostname.match(
//         /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
//     )
// );

// install service worker
let CACHE_NAME = 'site-static-v1'
let dynamiCcache = 'site-dynamic-v1'
let assets;
if( this.location.hostname === 'localhost'){
    assets = [
        '/',
        '/static/js/bundle.js',
        '/static/js/main.chunk.js',
        '/static/js/vendors~main.chunk.js',
        '/favicon.ico',
        '/logo192.png',
        '/manifest.json',
        '/static/media/delete.604f17ae.svg'
    ]
} else {
    assets = [              
        '/todo-App/static/css/main.8fd52917.chunk.css',
        '/todo-App/static/js/2.ec554d33.chunk.js',
        '/todo-App/static/js/main.45159212.chunk.js',
        '/todo-App/favicon.ico',     
        '/todo-App/manifest.json'
    ]
}

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Open a cache and cache our files
                // console.log('caching shell assets')
                return cache.addAll(assets)
            })
    )
})

// activate service worker
this.addEventListener('activate', event => {
    // console.log('Service worker has been Activated')
    event.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        })
    )
    return self.clients.claim()
})


// fetch event
this.addEventListener('fetch', event => {
    if(!navigator.onLine) {
        // console.log(event.request.url)
        event.respondWith(
            caches.match(event.request).then((response) => {
                // console.log('fetch caches')
                return response || fetch(event.request).then(fetchRes => {
                    return caches.open(dynamiCcache).then(cache => {
                        cache.put(event.request.url, fetchRes.clone())
                        return fetchRes
                    })
                }).catch(e => console.log('Error matching cache', e))
            })
        );
    }
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(async function() {
//        try{
//          var res = await fetch(event.request);
//          var cache = await caches.open('cache');
//          cache.put(event.request.url, res.clone());
//          return res;
//        }
//        catch(error){
//          return caches.match(event.request);
//         }
//       }());
//   });
