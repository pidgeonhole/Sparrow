import QuestionsList from 'components/admin/Questions/QuestionList.vue'
import QuestionEdit from 'components/admin/Questions/QuestionEdit.vue'
import QuestionAdd from 'components/admin/Questions/QuestionAdd.vue'

export const question_routes = [
    {path: '/admin/questions', component: QuestionsList, name: 'questions-home'},
    {path: '/admin/questions/add', component: QuestionAdd, name: 'question-add'},
    {path: '/admin/questions/:id/edit', component: QuestionEdit},
];

/*
 import ProblemsList from '../components/common/ProblemsList.vue'
 import CodeEditor from '../components/common/CodeEditor/CodeEditor.vue'


 export const problem_routes = [
 {path: '/problems',component: ProblemsList, name: 'problem-home'},
 {path: '/problems/:id',component: CodeEditor}
 ];

 */