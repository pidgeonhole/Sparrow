import axios from 'axios';
import {ROOKERY} from 'shared_info'

axios.defaults.baseURL = ROOKERY;   // Setup base HTTP path

export const setProblem = ({commit}, payload) => {
    let bomb = {
        id: payload.id,
        title: payload.title,
        description: payload.description
    };

    commit("setProblem", bomb);
};

export const retrieveProblem = ({commit}, id) => {

    if (!id) {
        throw TypeError("id argument cannot be null");
    }

    axios.get(`problems/${id}`)
        .then(res => {
            let problem = res.data;
            delete problem.test_cases;

            commit("setProblem", problem);
        });
};

export const retrieveTestCases = ({commit}, id) => {

    if (!id) {
        throw TypeError("id argument cannot be null");
    }

    axios.get(`problems/${id}/test-cases`)
        .then(res => {
            let test_cases = res.data;

            commit("setProblem", {id, test_cases});
        });
};