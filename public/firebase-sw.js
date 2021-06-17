importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
// importScripts('/__/firebase/init.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

const CACHE_NAME = 'react-app';
const URLS_TO_CACHE = [
   "/offline.html",
   "/assets/icon/kanna-icon.png"
];

self.addEventListener("install", function(event) {
   event.waitUntil(
       caches.open(CACHE_NAME).then(function(cache) {
           return cache.addAll(URLS_TO_CACHE);
       })
   );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      // Try the cache
      caches.match(event.request).then(function(response) {
        // Fall back to network
        return response || fetch(event.request);
      }).catch(function() {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
        // However, in reality you'd have many different
        // fallbacks, depending on URL & headers.
        // Eg, a fallback silhouette image for avatars.
      })
    );
});
 
// firebase.initializeApp({
//     'messagingSenderId': '981835361202'
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// console.log(firebase.messaging());