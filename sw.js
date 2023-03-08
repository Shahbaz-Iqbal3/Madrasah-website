const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/scripts/index.js',
  '/styles/head-foot.css',
  '/styles/colors.css',
  '/styles/main.css',
  '/images/dome.png',
  '/images/fb.png',
  '/images/tw.png',
  '/images/insta.png',
  'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500&family=Poppins:wght@300;400;600;900&display=swap',
  'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
  'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
  'https://fonts.gstatic.com/s/lexenddeca/v17/K2F1fZFYk-dHSE0UPPuwQ5qnJy8.woff2',
  '/pages/fallback.html'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/404.html');
        } 
      })
    );
  }
});