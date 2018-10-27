self.cacheName='cache-v1';
self.resources= new Set([
    '/index.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js'
]);

self.addEventListener('activate',function(event){
    console.log("sw: Activation of service worker")
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(
                keys.map(key=>{
                    if(key!=self.cacheName){
                        return caches.delete(key);
                    }
                })
            )
        })
    )
})

self.addEventListener('install',function(event){
    console.log("sw: install sw");
    console.log("Downloading resources for ",self.resources);
    event.waitUntil(
        caches.open(self.cacheName).then(function(cache){
            return cache.addAll(self.resources)
        })
    )
})


self.addEventListener('fetch',function(event){
    console.log("sw: Fetch event for url:",event.request.url);
    event.respondWith(
        caches.open(self.cacheName).then(cache=>{
            return cache.match(event.request).then(reponse=>{
                if(reponse){ 
                    console.log("sw: Available in cache");
                    return reponse;
                }
                console.log("sw: Fetching from network");
                self.resources.add(event.request.url);
                console.log("sw: Need to download resources",self.resources);
                return fetch(event.request);
            })
        })
    )
})
