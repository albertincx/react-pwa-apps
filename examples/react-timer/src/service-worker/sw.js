/// <reference lib="webworker" />
// declare const self: ServiceWorkerGlobalScope;
import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

// Click and open notification
self.addEventListener('notificationclick', event => {
    console.log('Data 1', event)
    event.notification.close();
    event.waitUntil(
        clients
            .matchAll({
                type: "window",
                includeUncontrolled: true
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
