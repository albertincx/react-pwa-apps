import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})
const entries = self.__WB_MANIFEST;
// self.__WB_MANIFEST is default injection point
entries.push({
  url: '/alarm-clock-short.mp3',
  revision: '00000',
})
precacheAndRoute(entries)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

// Click and open notification
self.addEventListener('notificationclick', event => {
  console.log('Data 1', event)
  event.notification.close();
  event.waitUntil(
      clients
          .matchAll({
            type: "window",
            includeUncontrolled: true,
          })
          .then((clientList) => {
            console.log('Data', clientList);
            for (const client of clientList) {
              // if (client.url === "/" && "focus" in client) return client.focus();
              if ("focus" in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow("/");
          }),
  );
});
