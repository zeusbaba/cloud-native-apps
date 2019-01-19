import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './views/Login'
import Link from './views/Link'
import Links from './views/Links'
//import LinksOne from './views/LinksOne';
import About from '@/views/About';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Link
    },
    {
      path: '/link', redirect: { name: 'home' }
    },
    {
      path: '/links',
      name: 'links-all',
      component: Links,
      children: [
        {
          path: ':linkid',
          component: Links
        },
        {
          path: ':linkid/*',
          component: Links
        }
      ]
    },
    /*{
      path: '/links/:linkid',
      name: 'links-one',
      component: LinksOne,
      children: [
        {
          path: '*', // 'show'
          component: LinksOne
        }
      ]
    },*/
    {
      path: '/about',
      name: 'about',
      component: About
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/info', redirect: { name: 'about' }
    },
    {
      path: '/terms', redirect: { name: 'about' }
    },
    {
      path: '/developers', redirect: { name: 'about' }
    },
  ]
})
