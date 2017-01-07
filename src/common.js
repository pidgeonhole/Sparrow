import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import axios from 'axios'
import {ROOKERY} from './shared_info'

Vue.use(VueRouter);                 // Setup routes

axios.defaults.baseURL = ROOKERY;   // Setup base HTTP path
Vue.prototype.$http = axios;        // Setup function prototype


// Component imports
import Problems from './Problems.vue'
import {problem_routes} from './routes/common_routes'

const problem_router = new VueRouter({
    routes: problem_routes,
    mode: 'history'
});

new Vue({
    el: '#problems',
    router: problem_router,
    render: h => h(Problems)
});

