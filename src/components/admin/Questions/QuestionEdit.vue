<template>
    <div class="container-fluid">

        <div class="row borders">

            <h4 class="col-12"> Main Settings </h4>

            <div class="col-12 form-group d-flex flex-row p-2">
                <label class="col-2" for="title-input"> Title </label>
                <div class="col row">
                    <input class="form-control"
                           type="text"
                           id="title-input"
                           v-model="title">
                </div>
            </div>

            <div class="col-12 form-group d-flex flex-row p-2">
                <label class="col-2"> Category </label>
                <select class="col form-control"
                        v-model="category_id">
                    <option v-for="c in categories" :value="c.id">{{ c.name }}</option>
                </select>
            </div>

        </div>


        <br>

        <div class="row mdl-shadow--6dp">
            <div class="col-6" style="padding: 0">
                <pg-editor :codeCapture="grab_code" :initial="desc"></pg-editor>
            </div>
            <div class="col-6" style="padding: 0">
                <pg-previewer :title="title" :text="desc"></pg-previewer>
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
                        <span><i class="material-icons">toc</i> Edit Test Case Settings</span>
                    </div>

                    <div class="collapse" id="tc-settings">

                        <div class="d-flex flex-column">
                            <div class="d-flex flex-column" v-for="(tc, i) in test_cases">

                                <div class="form-group">
                                    <h5 class="form-control-static">Test Case #{{ i + 1 }}</h5>
                                </div>

                                <div class="form-group row">
                                    <label class="col-2" :for="'tc-input-' + i">Input</label>
                                    <div class="col">
                    <textarea class="form-control"
                              :id="'tc-input-' + i"
                              v-model="test_cases[i].input"></textarea>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-2" :for="'tc-output-' + i">Answer</label>
                                    <div class="col">
                                        <input class="form-control"
                                               :id="'tc-output-' + i"
                                               type="text"
                                               v-model="test_cases[i].output">
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-2"
                                           :for="'tc-type-' + i">
                                        Type
                                    </label>
                                    <div class="col">
                                        <select class="form-control"
                                                v-model="test_cases[i].types"
                                                :id="'tc-type-' + i">

                                            <option v-for="(name, key) in TEST_CASE_TYPES"
                                                    :value="key">
                                                {{ name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="d-flex flex-row">
                                    <button class="ml-auto mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--red-500 mdl-color-text--white"
                                            :id="'tc-delete-button-' + i">
                                        Delete
                                    </button>
                                    <div class="mdl-tooltip mdl-tooltip--left mdl-color--indigo-700"
                                         :for="'tc-delete-button-' + i">
                                        Currently Unavailable
                                    </div>
                                </div>

                            </div>

                            <br>

                            <div class="d-flex flex-row">
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--yellow-700 mdl-color-text--white"
                                        data-toggle="modal" data-target="#new-test-case-modal">
                                    Add New Test Case
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <br>

        <div class="row" v-if="q_success">
            <div class="submit-success alert alert-success mdl-shadow--6dp">
                Submission completed!
            </div>
        </div>
        <div class="row d-flex flex-column mdl-shadow--6dp" v-else>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color-text--white submit-button"
                    :class="question_css"
                    @click="submit()">
                {{ form_valid ? "Submit" : "Invalid Form" }}
            </button>

        </div>

        <br>

        <div class="row alert alert-warning d-flex flex-column" v-if="!form_valid">
            <h4>Errors!</h4>
            <div class="d-flex flex-row">
                <h5 class="col-2 p-2">No.</h5>
                <h5 class="col p-2">Error Message</h5>
            </div>
            <div class="d-flex flex-row" v-for="(error, i) in form_errors">
                <div class="col-2 p-2"> {{ i + 1 }}</div>
                <div class="col p-2"> {{ error }}</div>
            </div>
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

                        <div class="row alert alert-danger br-0"
                             v-if="!valid_new_test_case.all_valid && send_test_status === 'Send'">
                            Form is invalid
                        </div>
                        <div v-else class="row alert alert-info br-0">
                            Form looks okay now!
                        </div>

                        <div class="row alert alert-success br-0"
                             v-if="tc_success">
                            New test case sent successfully
                        </div>

                        <div class="form-group row">
                            <label class="col-2">Input</label>
                            <div class="col">
                                <textarea class="form-control" v-model="new_test_case.input" required></textarea>
                                <div v-if="!valid_new_test_case.input"
                                     class="form-control-feedback mdl-color-text--red-900">
                                    Input cannot be empty
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-2">Answer</label>
                            <div class="col">
                                <input class="form-control"
                                       type="text"
                                       v-model="new_test_case.output"
                                       required>
                                <div v-if="!valid_new_test_case.output"
                                     class="form-control-feedback mdl-color-text--red-900">
                                    Answer cannot be Empty
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-2"> Type </label>
                            <div class="col">
                                <select class="form-control"
                                        v-model="new_test_case.types"
                                        required>
                                    <option v-for="(name, key) in TEST_CASE_TYPES"
                                            :value="key">
                                        {{ name }}
                                    </option>
                                </select>
                                <div v-if="!valid_new_test_case.types"
                                     class="form-control-feedback mdl-color-text--red-900">
                                    Type cannot be Empty
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">

                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                                :class="test_case_css"
                                :disabled="!valid_new_test_case.all_valid"
                                @click="submit_new_test_case()"
                                id="submit-new-test-case-button">
                            {{ send_test_status }}
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
    import {mapGetters, mapActions} from 'vuex'
    import _ from 'lodash'
    import pgEditor from './Editor.vue'
    import pgPreviewer from './Previewer.vue'
    import {TEST_CASE_TYPES} from 'shared_info'

    export default{
        components: {
            pgEditor,
            pgPreviewer
        },
        data(){

            let new_test_case = {
                input: "",
                output: "",
                types: "int"
            };

            return {
                category_id: 0,
                desc: "",
                id: this.$route.params.id,
                new_test_case,
                original_test_cases: [],
                q_success: false,
                send_test_status: "Send",
                sending_question: false,
                sending_test_case: false,
                tc_success: false,
                test_cases: [],
                TEST_CASE_TYPES,
                title: ""
            }
        },
        watch: {
            category_id (n, p) {
                if (n === undefined) {
                    this.category_id = p
                }
            }
        },
        computed: {
            form_errors () {
                let errors = [];

                if (!this.title)
                    errors.push("Title is missing");
                if (!this.desc)
                    errors.push("Description is missing");
                if (this.test_cases.length < 1)
                    errors.push("There are no test cases");
                if (this.category_id <= 0) {
                    errors.push("Invalid Category ID. MAJOR ERROR. Check ROOKERY")
                }

                this.test_cases.forEach((e, i) => {
                    if (!e.input)
                        errors.push(`Test Case #${i + 1} has missing inputs`);
                    if (!e.output)
                        errors.push(`Test Case #${i + 1} has missing output`)
                });

                return errors;
            },
            form_valid () {
                return this.form_errors.length === 0;
            },
            ...mapGetters({
                categories: "getCategoriesOnly"
            }),
            question_css() {
                if (this.sending_question) {
                    return ["mdl-color--grey-400"]
                }
                return {
                    "mdl-color--teal-400": this.form_valid,
                    "mdl-color--red-400": !this.form_valid
                }
            },
            test_case_css() {

                if (!this.valid_new_test_case.all_valid) {
                    // disable button look
                    return {
                        "mdl-color--red-900": true,
                        "mdl-color-text--white": true
                    }
                }

                return {
                    "mdl-color--green-600": !this.sending_test_case,
                    "mdl-color-text--white": true,
                    "mdl-color--grey-400": this.sending_test_case,
                }
            },
            valid_new_test_case() {
                let all_valid = false;
                let valid = {
                    input: this.new_test_case.input.length > 0,
                    output: this.new_test_case.output.length > 0,
                    types: this.new_test_case.types.length > 0
                };

                all_valid = valid.input && valid.output && valid.types;
                return {...valid, all_valid}
            }
        },
        methods: {
            ...mapActions({
                getCategories: "retrieveCategories"
            }),
            grab_code(code) {
                this.desc = code;
            },
            submit() {

                if (!this.form_valid)
                    return;

                let update_problem_data = {
                    category_id: this.category_id,
                    title: this.title,
                    description: this.desc
                };

                console.log(update_problem_data);

                console.log(this.original_test_cases);
                console.log(this.test_cases);

                // Compare original test cases with with data from form. If changed then send
                let update_test_cases = [];
                for (let i = 0; i < this.test_cases.length; i++) {
                    let o = this.original_test_cases[i];
                    let n = this.test_cases[i];

                    if (!_.isEqual(o, n)) {
                        update_test_cases.push(n)
                    }
                }

                this.sending_question = true;

                setTimeout(() => {
                    this.sending_question = false;
                    this.q_success = true;

                    setTimeout(() => {
                        this.q_success = false;
                    }, 4000);

                }, 2000);

                // this.$http.all([
                //     this.$http.put(`/problems/${this.id}`, data),
                //     ...update_test_cases.map(tc => this.$http.put(`test-cases/${id}`))
                // ])
                //         .then((prob, ...tc) => {
                //             console.log(prob);
                //             console.log(tc);
                //             this.sending_question = false;
                //         })
                //         .catch(err => {
                //             console.log(err)
                //         });

                // setTimeout(() => {
                //     this.sending_question = false;
                // }, 2500);
            },
            deep_copy(data) {
                return JSON.parse(JSON.stringify(data));
            },
            submit_new_test_case() {

                for (let key in this.new_test_case) {
                    if (this.new_test_case[key] === "") return
                }

                this.sending_test_case = true;
                this.send_test_status = "Sending";

                this.$http.post(`/problems/${this.id}/test-cases`, this.new_test_case)
                        .then(res => {

                            let types = this.new_test_case.types;

                            this.send_test_status = "Send";
                            this.sending_test_case = false;
                            this.tc_success = true;

                            setTimeout(() => {
                                this.tc_success = false;
                            }, 3500);

                            this.test_cases.push(res.data);
                            this.original_test_cases.push(this.deep_copy(res.data));

                            this.new_test_case = {
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

            if (!this.categories.length) {
                this.getCategories();
            }

            this.$http.all([
                this.$http.get(`problems/${id}/test-cases`),
                this.$http.get(`problems/${id}`)
            ])
                    .then(this.$http.spread((test_cases, problem) => {

                        this.test_cases = test_cases.data;

                        // Deep Copy original test_cases
                        this.original_test_cases = this.deep_copy(test_cases.data);

                        problem = problem.data;
                        this.desc = problem.description;
                        this.title = problem.title;
                        this.category_id = problem.category_id;

                    }))
                    .catch(err => {
                        console.error(err);
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