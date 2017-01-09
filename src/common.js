import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import axios from 'axios'
import {ROOKERY} from './shared_info'

Vue.use(VueRouter);                 // Setup routes

axios.defaults.baseURL = ROOKERY;   // Setup base HTTP path
Vue.prototype.$http = axios;        // Setup function prototype


// Component imports
import Problems from './features/Problems.vue'
import {problem_routes} from './routes/common'

const problem_router = new VueRouter({
    routes: problem_routes,
    mode: 'history'
});


if (document.querySelector('#problems')) {
    new Vue({
        el: '#problems',
        router: problem_router,
        render: h => h(Problems)
    });

}
