// Monitoreo CNE · guarda la pantalla del operador en el teléfono para poder abrirla SIN SEÑAL
var C='mon-op-v2';
function aTiempo(p,ms){return new Promise(function(ok,mal){var t=setTimeout(function(){mal(new Error('lento'))},ms);p.then(function(r){clearTimeout(t);ok(r)},function(e){clearTimeout(t);mal(e)})})}
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(['index.html'])}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  var pagina=u.origin===self.location.origin&&(u.pathname==='/'||/\/index\.html$/.test(u.pathname));
  var tgjs=u.hostname==='telegram.org'&&/telegram-web-app\.js$/.test(u.pathname);
  if(!pagina&&!tgjs)return;
  var clave=pagina?'index.html':e.request.url;
  e.respondWith(aTiempo((pagina?fetch(e.request.url,{cache:'no-store'}):fetch(e.request)),7000).then(function(r){if(r&&(r.ok||r.type==='opaque')){var cp=r.clone();caches.open(C).then(function(c){c.put(clave,cp)})}return r})
    .catch(function(){return caches.match(clave).then(function(r){return r||Response.error()})}));
});
