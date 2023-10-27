import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/Index.vue'

import Layout from '@/layout/index.vue'

function lazyComponent(name) {
    return () => ({
        component: import(`@/pages/${name}.vue`)
    })
}
Vue.use(Router)

export default new Router({
    routes: [
        // {
        //     path: '/',
        //     component: Layout,
        //     //redirect: 'noRedirect',
        //     name: 'Prospectos',
        //     meta: {
        //         title: 'prospectos',
        //         icon: 'chart'
        //     },
        //     children: [
        //         {
        //             path: '',
        //             component: () => import('@/pages/prospectos/index'),
        //             name: 'mainProspectos',
        //             meta: { title: 'Prospectos', noCache: true }
        //         }
        //     ]
        // },
        {
            path: '/reservas',
            component: Layout,
            name: 'reservas',
            meta: {
                title: 'reservas',
                icon: 'chart'
            },
            children: [
                {
                    path: 'main',
                    component: () => import('@/pages/reservas/index.vue'),
                    name: 'mainReservas',
                    meta: { title: 'Reservas', noCache: true }
                }
            ]


        },
        {
            path: '/redirect',
            component: Layout,
            hidden: true,
            children: [
                {
                    path: '/redirect/:path(.*)',
                    component: () => import('@/pages/redirect/index')
                }
            ]
        },
        {
            path: '/login',
            component: Login,
            hidden: true
        },
        {
            path: '/',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'Dashboard',
                    component: lazyComponent('dashboard/index')
                }
            ]
        },
        {
            path: '/operador',
            component: Layout,
            //redirect: 'noRedirect',
            name: 'operador',
            meta: {
                title: 'operador',
                icon: 'chart'
            },
            children: [
                {
                    path: 'main',
                    component: () => import('@/pages/operador/index'),
                    name: 'mainCanales',
                    meta: { title: 'Canales', noCache: true }
                }
            ]
        },
        {
            path: '/colaboradores',
            component: Layout,
            //redirect: 'noRedirect',
            name: 'colaboradores',
            meta: {
                title: 'colaboradores',
                icon: 'chart'
            },
            children: [
                {
                    path: 'main',
                    component: () => import('@/pages/colaboradores/index'),
                    name: 'mainColaboradores',
                    meta: { title: 'Colaboradores', noCache: true }
                }
            ]
        },
        {
            path: '/productos',
            component: Layout,
            //redirect: 'noRedirect',
            name: 'productos',
            meta: {
                title: 'productos',
                icon: 'chart'
            },
            children: [
                {
                    path: 'main',
                    component: () => import('@/pages/productos/index.vue'),
                    name: 'mainProductos',
                    meta: { title: 'productos', noCache: true }
                }
            ]
        },
        {
            path: '/clientes',
            component: Layout,
            //redirect: 'noRedirect',
            name: 'clientes',
            meta: {
                title: 'clientes',
                icon: 'chart'
            },
            children: [
                {
                    path: 'main',
                    component: () => import('@/pages/clientes/index.vue'),
                    name: 'mainclientes',
                    meta: { title: 'clientes', noCache: true }
                }
            ]
        },
        {
            path: '/transportes',
            component: Layout,
            //redirect: 'noRedirect',
            name: 'transportes',
            meta: {
                title: 'transportes',
                icon: 'chart'
            },
            children: [
                {
                    path: 'main',
                    component: () => import('@/pages/transportes/index.vue'),
                    name: 'mainTransportes',
                    meta: { title: 'transportes', noCache: true }
                }
            ]
        },

    ],
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { x: 0, y: 0 }
    }
})
