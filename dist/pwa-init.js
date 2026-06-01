/**
 * PWA solo en http/https. Evita errores de CORS y Service Worker con file://
 */
(function () {
    const protocol = window.location.protocol;
    if (protocol !== 'http:' && protocol !== 'https:') {
        return;
    }

    if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement('link');
        manifest.rel = 'manifest';
        manifest.href = 'manifest.json';
        document.head.appendChild(manifest);
    }

    if (!('serviceWorker' in navigator)) {
        return;
    }

    window.addEventListener('load', function () {
        const swUrl = new URL('service-worker.js', window.location.href).href;
        navigator.serviceWorker.register(swUrl).catch(function () { });
    });
})();
