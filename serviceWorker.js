

const staticCacheName = "cache-v1";
const assets = [
    "/index.html",
    "./img/",
    "./css/",
    "./js/"
];

// ajout fichier en cache

self.addEventListener("install", (e) => {
    // Perform install steps
    e.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            cache.addAll(assets);
        })
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Cloner la requête.
            // Une requete est un flux et est à consommation unique
            // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
            let fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
                let responseToCache = response.clone();

                caches.open(staticCacheName).then(function (cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }
            );
        })
    );

})

// supprimer les caches

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.addAll(
                keys
                    .filter((key) => key !== staticCacheName)
                    .map((key) => CacheStorage.delete(key))
            )
        })
    )
})
