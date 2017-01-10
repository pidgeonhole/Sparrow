import axios from 'axios';
import {ROOKERY} from 'shared_info'

axios.defaults.baseURL = ROOKERY;   // Setup base HTTP path


export const retrieveCategories = ({commit}) => {
    let config = {
        params: {
            expand: 'problems'
        }
    };
    axios.get('categories', config)
        .then(res => {
            commit('setCategories', res.data);
        })
        .catch(err => {
            console.error("Error getting categories")
        });
};
