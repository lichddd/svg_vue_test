import Vue from 'vue'
import Router from 'vue-router'
import column from '@/components/column'
import radar from '@/components/radar'
import pie_and_ring from '@/components/pie_and_ring'
import force from '@/components/force'
import bp from '@/components/bp'
import chord from '@/components/chord'
import visio from '@/components/visio'
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
      name: 'column图 柱状图',
      component: column
    },
    {
      path: '/radar',
      name: 'radar图 雷达图',
      component: radar
    },
    {
      path: '/pie_and_ring',
      name: 'pie_and_ring图 饼图和环图',
      component: pie_and_ring
    },
    {
      path: '/force',
      name: 'force图 节点关系图',
      component: force
    },
    {
      path: '/bp',
      name: 'bp图 各大次世代主机保有量',
      component: bp
    },
    {
      path: '/chord',
      name: '弦图 各经济体交易量',
      component: chord
    },
    {
          path: '/visio',
          name: '流程图',
          component: visio
        },
  ]
})
