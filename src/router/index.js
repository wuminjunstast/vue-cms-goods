import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout.vue'
import {
  Message
} from 'element-ui'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    // 别名，告诉服务器，启动App时应该跳转到该页面
    alias: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/goods/',
    name: 'Goods',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [{
        path: 'category',
        name: 'GoodsCategory',
        component: () => import('@/views/Goods/Category.vue')
      }, {
        path: 'release',
        name: 'GoodsRelease',
        component: () => import('@/views/Goods/Release.vue')
      },{
        path: 'edit/:id',
        name: 'GoodsEdit',
        component: () => import('@/views/Goods/Edit.vue')
      }, {
        path: 'list',
        name: 'GoodsList',
        component: () => import('@/views/Goods/List.vue')
      }
      // , {
      //   path: 'sing',
      //   name: 'GoodsSing',
      //   component: () => import('@/views/Goods/sing.vue')
      // }
    ]
  },
  {
    path: '/order/',
    name: 'Order',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/Order/List.vue')
    }]
  },
  {
    path: '/user/',
    name: 'Account',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: 'info',
      name: 'AccountInfo',
      component: () => import('@/views/Account/Info.vue')
    }]
  },
  {
    path: '/user/',
    name: 'User',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/User/List.vue')
    }]
  },
  {
    path: '/auth/',
    name: 'Power',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: 'role',
      name: 'PowerRole',
      component: () => import('@/views/Power/Role.vue')
    }, {
      path: 'menu',
      name: 'PowerMenu',
      component: () => import('@/views/Power/Menu.vue')
    }]
  }

]

const router = new VueRouter({
  routes
})

export default router