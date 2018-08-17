import Vue from 'vue'
import Router from 'vue-router'
import column from '@/components/column'
import radar from '@/components/radar'
import pie_and_ring from '@/components/pie_and_ring'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: null
    },
    {
      path: '/column',
      name: 'column',
      component: column
    },
    {
      path: '/radar',
      name: 'radar',
      component: radar
    },
    {
      path: '/pie_and_ring',
      name: 'pie_and_ring',
      component: pie_and_ring
    },
  ]
})
