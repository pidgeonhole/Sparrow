import QuestionsList from '../components/admin/QuestionList.vue'
import QuestionEdit from '../components/admin/QuestionEdit.vue'

export const question_routes = [
    {path: '/admin/questions', component: QuestionsList, name: 'questions-home'},
    {path: '/admin/questions/:id', component: QuestionEdit}
];

/*
 import ProblemsList from '../components/common/ProblemsList.vue'
 import CodeEditor from '../components/common/CodeEditor/CodeEditor.vue'


 export const problem_routes = [
 {path: '/problems',component: ProblemsList, name: 'problem-home'},
 {path: '/problems/:id',component: CodeEditor}
 ];

 */