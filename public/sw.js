self.addEventListener('push', event => {
  if (!event.data) return;
  const { title, body, data } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  let url = '/';
  if (data.type === 'order' && data.orderId) {
    url = `/orders/${data.orderId}`;
  } else if (data.type === 'price_drop' || data.type === 'morning_digest') {
    url = '/prices';
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
