import ProblemsList from '../components/common/ProblemsList.vue'
import CodeEditor from '../components/common/CodeEditor/CodeEditor.vue'


export const problem_routes = [
    {path: '/problems',component: ProblemsList, name: 'problem-home'},
    {path: '/problems/:id',component: CodeEditor},
    {path: '/problems/:id/*', redirect: { name: 'problem-home'}}
];
