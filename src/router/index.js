import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Home.vue'
import Login from '../views/Login.vue'
import Case from '../views/Case.vue'
import CaseDetail from '../views/CaseDetail.vue'
import Rule from '../views/Rule.vue'
import Category from '../views/Category.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/rule',
    name: 'rule',
    component: Rule
  },
  {
    path: '/category',
    name: 'category',
    component: Category
  },
  {
    path: '/case',
    name: 'case',
    component: Case
  },
  {
    path: '/case/:id/:date',
    name: 'caseDetail',
    component: CaseDetail
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { fullPage: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
