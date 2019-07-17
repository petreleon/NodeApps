const routes = [
  { path: '/', component: mediaItems },
  { path: '/page/:page', component: mediaItems },
  { path: '/addItem', component: addMedia },
];

const router = new VueRouter({
  routes // short for `routes: routes`
});