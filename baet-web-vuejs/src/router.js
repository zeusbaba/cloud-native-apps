import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './views/Login'
import LinkHome from './views/LinkHome'
import LinksAll from './views/LinksAll'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: LinkHome
    },
    {
      path: '/link', redirect: { name: 'home' }
    },
    {
      path: '/links',
      name: 'links-all',
      component: LinksAll
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/info', redirect: { name: 'about' }
    },
  ]
})
