import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

import getters from './getters'

import { VersionAPP } from '../utils/auth.js'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
let moduleNames = []
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    moduleNames.push(moduleName)
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})
console.log("moduleName v1",moduleNames)
moduleNames = moduleNames.filter(x=>x!="reportes" )
console.log("moduleName v2",moduleNames)

export default new Vuex.Store({
    plugins: [
        createPersistedState({
            key: VersionAPP,paths:moduleNames
        })
    ],
    modules,
    getters
})
