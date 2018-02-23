if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('/sw.js')
  .then((registration) => {
    console.log('Service worker registered', registration);
  })
  .catch((error) => {
    console.error('Something went wrong with registering service worker', error);
  });
}
