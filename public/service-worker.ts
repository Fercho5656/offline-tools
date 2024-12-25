const CACHE_NAME = 'cache-v1'

const OFFLINE_ASSETS = [
  '/'
]

const preCache = async () => {
  const cache = await caches.open(CACHE_NAME)
  return cache.addAll(OFFLINE_ASSETS)
}

const fetchAssets = async (event) => {
  try {
    const response = await fetch(event.request)
    return response
  } catch (e) {
    const cache = await caches.open(CACHE_NAME)
    return cache.match(event.request)
  }
}

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(preCache())
})

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
})

self.addEventListener('fetch', event => {
  console.log('Service worker fetching...');
  event.respondWith(fetchAssets(event))
})