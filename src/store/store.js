import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


import categories from "./modules/categories/categories"
import problems from "./modules/problems/problems"

export const admin_store = new Vuex.Store({
    modules: {
        categories,
        problems
    }
});

export const common_store = new Vuex.Store({
    modules: {
        categories,
        problems
    }
});