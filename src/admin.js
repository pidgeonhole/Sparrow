import Vue from 'vue'
import VueRouter from 'vue-router'

// Global styles
import 'assets/katex/katex.min.css'
import 'assets/prism/prism.css'

Vue.use(VueRouter);

import axios from 'axios'
import {ROOKERY} from './shared_info'
import {admin_store} from './store/store'

Vue.use(VueRouter);                 // Setup router

axios.defaults.baseURL = ROOKERY;   // Setup base HTTP path
Vue.prototype.$http = axios;        // Setup function prototype


import {question_routes} from './routes/admin'
import Question from './features/QuestionControl.vue'

const question_setter_router = new VueRouter({
    routes: question_routes,
    mode: 'history'
});

if (document.querySelector('#admin-questions')) {
    new Vue({
        el: '#admin-questions',
        store: admin_store,
        router: question_setter_router,
        render: h => h(Question)
    });
}
