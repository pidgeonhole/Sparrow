import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import axios from 'axios'
import {ROOKERY} from './shared_info'

Vue.use(VueRouter);                 // Setup router

axios.defaults.baseURL = ROOKERY;   // Setup base HTTP path
Vue.prototype.$http = axios;        // Setup function prototype


import {question_routes} from './routes/admin'
import Question from './features/QuestionSetter.vue'

const question_setter_router = new VueRouter({
    routes: question_routes,
    mode: 'history'
});

new Vue({
    el: '#admin-questions',
    router: question_setter_router,
    render: h => h(Question)
});


/*
import Problems from './Problems.vue'
import {problem_routes} from './routes/common'

const problem_router = new VueRouter({
    routes: problem_routes,
    mode: 'history'
});

new Vue({
    el: '#problems',
    router: problem_router,
    render: h => h(Problems)
});
*/