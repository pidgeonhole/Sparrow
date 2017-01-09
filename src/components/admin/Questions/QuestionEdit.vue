<template>
    <div class="container-fluid">

        <div class="row form-group">
            <label class="col-2 col-form-label" for="title-input"> Title </label>
            <div class="col row">
                <input class="form-control"
                       type="text"
                       id="title-input"
                       v-model="title">
            </div>
        </div>

        <br>

        <div class="form-group row">
            <label class="col-2 col-form-label"> Category </label>
            <select class="col form-control"
                    v-model="category_id">
                <option v-for="c in categories" :value="c.id">{{ c.name }}</option>
            </select>
        </div>

        <br>

        <div class="row mdl-shadow--6dp">
            <div class="col-6" style="padding: 0">
                <pg-editor :codeCapture="grabCode" :initial="desc"></pg-editor>
            </div>
            <div class="col-6 card" id="pg-preview">
                <div class="card-block">
                    <h4 class="card-title">{{ title }}</h4>
                    <div class="card-text" v-html="markdown"></div>
                </div>
            </div>
        </div>
        <br>

        <div class="row mdl-shadow--6dp">
            <div id="tc-settings-parent" class="layout-fill">
                <div class="card">
                    <div class="card-header accordion-header mdl-color--pink-400 mdl-color-text--white"
                         data-toggle="collapse"
                         data-parent="#tc-settings-parent"
                         href="#tc-settings">
                        <span><i class="material-icons">toc</i> Test Case Settings</span>
                    </div>

                    <div class="collapse" id="tc-settings">

                        <div class="d-flex flex-column">
                            <div class="d-flex flex-column" v-for="(tc, i) in testCases">

                                <div class="form-group">
                                    <h6 class="form-control-static">Test Case #{{ i + 1 }}</h6>
                                </div>

                                <div class="form-group row">
                                    <label class="col-2 col-form-label" :for="'tc-input-' + i">Input</label>
                                    <div class="col">
                    <textarea class="form-control"
                              :id="'tc-input-' + i"
                              v-model="testCases[i].input"></textarea>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-2 col-form-label" :for="'tc-output-' + i">Answer</label>
                                    <div class="col">
                                        <input class="form-control"
                                               :id="'tc-output-' + i"
                                               type="text"
                                               v-model="testCases[i].output">
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-2 col-form-label"
                                           :for="'tc-type-' + i">
                                        Type
                                    </label>
                                    <div class="col">
                                        <select class="form-control"
                                                v-model="testCases[i].types"
                                                :id="'tc-type-' + i">

                                            <option v-for="(name, key) in testCaseTypes"
                                                    :value="key">
                                                {{ name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="d-flex flex-row">
                                    <button class="ml-auto mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--red-500 mdl-color-text--white"
                                            data-toggle="tooltip"
                                            data-placement="left"
                                            title="Currently Unavailable">
                                        Delete
                                    </button>
                                </div>

                            </div>

                            <br>

                            <div class="d-flex flex-column">
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--teal-500 mdl-color-text--white btn-block"
                                        data-toggle="modal" data-target="#new-test-case-modal">
                                    Add New Test Cases
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <br>

        <div class="row" v-if="qSuccess">
            <div class="submit-success alert alert-success mdl-shadow--6dp">
                Submission completed!
            </div>
        </div>
        <div class="row mdl-shadow--6dp" v-else>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect btn-block submit-button"
                    :class="questionCSS"
                    :disabled="isSendQuestion"
                    @click="submit()">
                Submit
            </button>
        </div>

        <div class="modal fade" id="new-test-case-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header mdl-color--indigo-600 mdl-color-text--white">
                        <h5 class="modal-title">New Test Case</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <i class="material-icons mdl-color-text--white">clear</i>
                        </button>
                    </div>
                    <div class="modal-body">

                        <div class="row alert alert-danger"
                             v-if="!validNewTestCase.all_valid && sendTestStatus === 'Send'">
                            Form is invalid
                        </div>

                        <div class="row alert alert-success"
                             v-if="tcSuccess">
                            New test case sent successfully
                        </div>

                        <div class="form-group row">
                            <label class="col-2 col-form-label">Input</label>
                            <div class="col">
                                <textarea class="form-control" v-model="newTestCase.input" required></textarea>
                                <div v-if="!validNewTestCase.input"
                                     class="form-control-feedback mdl-color-text--red-900">
                                    Input cannot be empty
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-2 col-form-label">Answer</label>
                            <div class="col">
                                <input class="form-control"
                                       type="text"
                                       v-model="newTestCase.output"
                                       required>
                                <div v-if="!validNewTestCase.output"
                                     class="form-control-feedback mdl-color-text--red-900">
                                    Answer cannot be Empty
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-2 col-form-label"> Type
                            </label>
                            <div class="col">
                                <select class="form-control"
                                        v-model="newTestCase.types"
                                        required>
                                    <option v-for="(name, key) in testCaseTypes"
                                            :value="key">
                                        {{ name }}
                                    </option>
                                </select>
                                <div v-if="!validNewTestCase.types"
                                     class="form-control-feedback mdl-color-text--red-900">
                                    Type cannot be Empty
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                                :class="testCaseCSS"
                                :disabled="!validNewTestCase.all_valid"
                                @click="submitNewTestCase()">
                            {{ sendTestStatus }}
                        </button>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--grey-400"
                                data-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import _ from 'lodash'
    import showdown from 'showdown'
    import {katexConverter, syntaxHighlighter} from 'assets/showdownExtension'
    import pgEditor from './Editor.vue'

    export default{
        components: {
            "pg-editor": pgEditor
        },
        data(){

            let converter = new showdown.Converter({
                extensions: [katexConverter, syntaxHighlighter]
            });

            let testCaseTypes = {
                int: "Integer",
                double: "Double",
                string: "String"
            };

            let newTestCase = {
                input: "",
                output: "",
                types: "int"
            };

            return {
                category_id: 0,
                categories: [],
                converter,
                desc: "",
                id: this.$route.params.id,
                isSendQuestion: false,
                isSendTestCase: false,
                newTestCase,
                originalTestCases: [],
                qSuccess: false,
                sendTestStatus: "Send",
                tcSuccess: false,
                testCases: [],
                testCaseTypes,
                title: ""
            }
        },
        computed: {
            markdown () {
                return this.converter.makeHtml(this.desc);
            },
            questionCSS() {
                return {
                    "mdl-color-text--white": true,
                    "mdl-color--indigo-400": !this.isSendQuestion,
                    "mdl-color--grey-400": this.isSendQuestion
                }
            },
            testCaseCSS() {

                if (!this.validNewTestCase.all_valid) {
                    // disable button look
                    return {
                        "mdl-color--red-900": true,
                        "mdl-color-text--white": true
                    }
                }

                return {
                    "mdl-color--green-600": !this.isSendTestCase,
                    "mdl-color-text--white": true,
                    "mdl-color--grey-400": this.isSendTestCase,
                }
            },
            validNewTestCase() {
                let all_valid = false;
                let valid = {
                    input: this.newTestCase.input.length > 0,
                    output: this.newTestCase.output.length > 0,
                    types: this.newTestCase.types.length > 0
                };

                all_valid = valid.input && valid.output && valid.types;
                return {...valid, all_valid}
            }
        },
        methods: {
            grabCode(code) {
                this.desc = code;
            },
            submit() {

                let update_problem_data = {
                    category_id: this.category_id,
                    title: this.title,
                    description: this.desc
                };

                console.log(this.originalTestCases);
                console.log(this.testCases);

                // Compare original test cases with with data from form. If changed then send
                let update_test_cases = [];
                for (let i = 0; i < this.testCases.length; i++) {
                    let o = this.originalTestCases[i];
                    let n = this.testCases[i];

                    if (!_.isEqual(o, n)) {
                        update_test_cases.push(n)
                    }
                }

                this.isSendQuestion = true;

                setTimeout(() => {
                    this.isSendQuestion = false;
                    this.qSuccess = true;

                    setTimeout(() => {
                        this.qSuccess = false;
                    }, 4000);

                }, 2000);

                // this.$http.all([
                //     this.$http.put(`/problems/${this.id}`, data),
                //     ...update_test_cases.map(tc => this.$http.put(`test-cases/${id}`))
                // ])
                //         .then((prob, ...tc) => {
                //             console.log(prob);
                //             console.log(tc);
                //             this.isSendQuestion = false;
                //         })
                //         .catch(err => {
                //             console.log(err)
                //         });

                // setTimeout(() => {
                //     this.isSendQuestion = false;
                // }, 2500);
            },
            deepCopy(data) {
                return JSON.parse(JSON.stringify(data));
            },
            submitNewTestCase() {

                for (let key in this.newTestCase) {
                    if (this.newTestCase[key] === "") return
                }

                this.isSendTestCase = true;
                this.sendTestStatus = "Sending";

                this.$http.post(`/problems/${this.id}/test-cases`, this.newTestCase)
                        .then(res => {

                            let types = this.newTestCase.types;

                            this.sendTestStatus = "Send";
                            this.isSendTestCase = false;
                            this.tcSuccess = true;

                            setTimeout(() => {
                                this.tcSuccess = false;
                            }, 3500);

                            this.testCases.push(res.data);
                            this.originalTestCases.push(this.deepCopy(res.data));

                            this.newTestCase = {
                                input: "",
                                output: "",
                                types
                            };
                        })
                        .catch(err => {
                            console.log("Error Sending New Test Case");
                        });
            }
        },
        created() {
            let id = this.id;

            this.$http.all([
                this.$http.get(`categories`),
                this.$http.get(`problems/${id}/test-cases`),
                this.$http.get(`problems/${id}`)
            ])
                    .then(this.$http.spread((categories, testCases, problem) => {

                        this.testCases = testCases.data;

                        // Deep Copy original Testcases
                        this.originalTestCases = this.deepCopy(testCases.data);

                        problem = problem.data;
                        this.desc = problem.description;
                        this.title = problem.title;
                        this.category_id = problem.category_id;
                        console.log(problem, this.category_id);

                        this.categories = categories.data;

                        console.log(this.categories);

                        // this.editor.setValue(this.desc);

                    }))
                    .catch(err => {
                        console.error(err);
                    });

            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            });

        }
    }
</script>

<style scoped>

div.collapse, div.collapsing {
    padding: 1rem;
}

i {
    vertical-align: middle;
    font-size: 2.5rem;
}

#pg-preview {
    height: inherit;
    margin-bottom: 0;
}

.accordion-header {
    cursor: pointer;
    font-size: 1.5rem;
    height: 4rem;
    text-align: center;
    display: inline-block;
}

.accordion-header > span {
    vertical-align: -webkit-baseline-middle
}


.layout-fill {
    height: 100%;
    width: 100%
}

.submit-button {
    font-size: 2rem;
    height: 4rem;
}

.submit-success {
    font-size: 1.3rem;
    height: 4rem;
    line-height: 2;
    text-align: center;
    width: 100%;
}

.modal-title {
    font-weight: 700;
    font-size: 1.75rem;
}

</style>

<!--
##### Question

Many countries has money in different denominations. For example, in Singapore, currencies come in 10c, 20c, 50c, $1, $2, $5, $10, $50, $100, $1000 and $10000.

Your challenge is to find the number of ways to form `katex x` using any number of the given denominations.

##### Instructions

For each test case, you will be provided with:
 1. an integer `katex x \geq 1 ` which represents the currency target you are trying to achieve
    - i.e. `katex x = 200 ` means we are asking how many ways are there to make 200 units
 2. A sequence of integers separated by commas representing the different denomiations
    - i.e. 1, 5, 10, 20 means you must form 200 units with these denominations

Your task is to print the number of ways to achieve `katex x `.

```
# Sample Input
200
1 2 5 10 20 50 100 200
# Your output
73682
```

How you should output
```python
target = int(input())  # first input = target. convert to integer
coins = [int(i) for i in input().split()]
# coins become from string to list of ints. "1 2 3" -> [1, 2, 3]

# ... your function here
answer = "Integer value of your result"

print(answer)
```

-->