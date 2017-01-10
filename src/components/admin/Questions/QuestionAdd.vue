<template>
    <div class="container-fluid">

        <div class="row borders">

            <h4 class="col-12">Main Settings</h4>

            <div class="col-12 form-group d-flex flex-row p-2">
                <label class="col-2 col-form-label" for="title-input"> Title </label>
                <div class="col row">
                    <input class="form-control"
                           type="text"
                           id="title-input"
                           v-model="title">
                </div>
            </div>

            <div class="col-12 form-group d-flex flex-row p-2" v-if="!new_cat">
                <label class="col-2 col-form-label"> Category </label>
                <multiselect v-model="category"
                             :allow-empty="false"
                             :value="category"
                             :options="categories"
                             label="name"
                             track-by="id">
                </multiselect>
            </div>
            <div v-else class="col-12 form-group d-flex flex-row p-2">
                <label class="col-2 col-form-label" for="category-input"> New Category </label>
                <div class="col row">
                    <input class="form-control"
                           type="text"
                           id="category-input"
                           v-model="category.name">
                </div>
            </div>

            <div class="col-12 form-group d-flex flex-row p-2">
                <label class="col-2 col-form-label" for="category-description"> Description </label>
                <div class="col row">
                    <input class="form-control"
                           type="text"
                           id="category-description"
                           v-model="category.description"
                           :disabled="!new_cat">
                </div>
            </div>

            <div class="d-flex flex-row-reverse col-12">
                <div>
                    <input type="checkbox"
                           id="new-category"
                           class="cbx hidden"
                           v-model="new_cat"/>
                    <label for="new-category" class="lbl"></label>
                </div>
                <div class="lead" style="margin-right: 2rem">
                    {{ new_cat ? "Adding New Category" : "Using Existing Categories"}}
                </div>
            </div>

        </div>

        <br>

        <div class="row mdl-shadow--6dp editor">
            <div class="col-6" style="padding: 0">
                <pg-editor :codeCapture="grabCode"></pg-editor>
            </div>
            <div class="col-6" style="padding: 0">
                <pg-previewer :title="title" :text="desc"></pg-previewer>
            </div>
        </div>

        <br>

        <div class="row borders">
            <h4 class="col-12">Initial Test Case{{test_cases.length > 0 ? "s": ""}}</h4>

            <div class="col-12" v-for="(tc, i) in test_cases">
                <div class="d-flex flex-column">
                    <h5 class="d-flex p-2">Case #{{ i + 1 }}</h5>
                    <div class="d-flex flex-row p-2">
                        <div class="col-2"> Input</div>
                        <div style="white-space: pre" class="col">{{ tc.input }}</div>
                    </div>
                    <div class="d-flex flex-row p-2">
                        <div class="col-2"> Output</div>
                        <div class="col">{{ tc.output }}</div>
                    </div>
                    <div class="d-flex flex-row p-2">
                        <div class="col-2">Type</div>
                        <div class="col">{{ tc.types }}</div>
                    </div>
                    <div class="d-flex flex-row-reverse p2">
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--orange-600 mdl-color-text--white"
                                @click="delete_test_case(i)">
                            Delete
                        </button>
                    </div>
                </div>
                <hr class="mdl-color--grey-200">
            </div>

            <div v-if="!test_cases.length" class="col-12 alert alert-danger">
                You have 0 test case right now. You must have at least 1
            </div>
            <br>

            <div class="col-12 d-flex flex-column">
                <div class="d-flex flex-row form-group">
                    <label class="col-2 form-control-label" for="new-tc-input">Input</label>
                    <div class="col">
                        <textarea class="form-control" id="new-tc-input" v-model="test_case.input"></textarea>
                    </div>
                </div>
                <div class="d-flex flex-row form-group">
                    <label class="col-2 form-control-label" for="new-tc-output">Output</label>
                    <div class="col">
                        <input class="form-control" type="text" id="new-tc-output" v-model="test_case.output">
                    </div>
                </div>
                <div class="d-flex flex-row form-group">
                    <label class="col-2"> Type </label>
                    <div class="col">
                        <select class="form-control"
                                v-model="test_case.types"
                                required>
                            <option v-for="(name, key) in TEST_CASE_TYPES"
                                    :value="key">
                                {{ name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-12 d-flex flex-row-reverse">
                        <button class="mdl-button mdl-js-button mdl-color-text--white mdl-js-ripple-effect"
                                @click="add_test_case()"
                                :class="tc_style"
                                id="test-case-add-button">
                            Add
                        </button>
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
                                @click="reset_test_case()"
                                style="margin-right: 1.5rem;">
                            Reset
                        </button>
                        <span v-if="!tc_valid" for="test-case-add-button"
                              class="mdl-tooltip mdl-tooltip--large mdl-tooltip--bottom">
                            Entries cannot be null
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <br>

        <div class="row">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white submit-button btn-block"
                    :class="form_valid_style"
                    @click="submit()">
                {{ !form_valid ? "No Empty Fields are allowed!" : "Submit" }}
            </button>
        </div>

    </div>
</template>

<script type="text/babel">
    import {mapGetters, mapActions} from 'vuex'
    import {TEST_CASE_TYPES} from 'shared_info'
    import pgEditor from './Editor.vue'
    import pgPreviewer from './Previewer.vue'
    import Multiselect from 'vue-multiselect'

    export default{
        components: {
            pgEditor,
            pgPreviewer,
            Multiselect
        },
        data(){
            return {
                desc: '',
                title: '',
                category: {
                    id: 1,
                    name: "",
                    description: ""
                },
                new_cat: false,
                prev: {
                    category: {
                        id: -1,
                        name: "",
                        desciption: ""
                    }
                },
                test_case: {
                    input: "",
                    output: "",
                    types: ""
                },
                test_cases: [],
                TEST_CASE_TYPES
            }
        },
        computed: {
            ...mapGetters({
                categories: "getCategoriesOnly"
            }),
            form_valid () {
                return this.title &&
                        this.desc &&
                        this.test_cases.length &&
                        this.category.description &&
                        this.category.name;
            },
            form_valid_style () {
                if (this.form_valid) {
                    return ["mdl-color--teal-600", "mdl-button--raised"]
                }
                return ["mdl-color--red-600"]
            },
            tc_valid () {
                for (let key in this.test_case) {
                    if (this.test_case.hasOwnProperty(key))
                        if (this.test_case[key] === "")
                            return false;
                }
                return true
            },
            tc_style () {
                if (this.tc_valid) {
                    return ["mdl-color--teal-400", "mdl-button--raised"]
                }
                return ["mdl-color--red-600"]
            }
        },
        watch: {
            new_cat (isTrue) {
                let previous = this.deepCopy(this.prev.category);
                this.prev.category = this.deepCopy(this.category);
                this.category = previous;
            },
            categories (e, f) {
                this.category = e[0]
            }
        },
        methods: {
            deepCopy(obj) {
                return JSON.parse(JSON.stringify(obj));
            },
            grabCode(text) {
                this.desc = text;
            },
            log() {
                console.log("New Data: ", this.new_data);
                console.log("ID: ", this.category.id);
            },
            ...mapActions({
                getCategories: "retrieveCategories"
            }),
            add_test_case() {
                if (!this.tc_valid)
                    return;
                this.test_cases.push(this.test_case);
                this.reset_test_case();
            },
            delete_test_case(i) {
                let tcs = this.test_cases;
                this.test_cases = tcs.slice(0, i).concat(tcs.slice(i + 1, tcs.length));
            },
            reset_test_case() {
                this.test_case = {
                    input: "",
                    output: "",
                    types: ""
                };
            },
            submit() {
                if (!this.form_valid)
                    return;
                console.log(this.$data);
            }
        },
        created() {
            if (!this.categories.length) {
                this.getCategories();
            }
        }

    }
</script>

<style scoped>
.editor {
    padding: 0;
    min-height: 30rem;
};

.lbl {
  position: relative;
  display: block;
  height: 20px;
  width: 44px;
  background: #898989;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lbl:after {
  position: absolute;
  left: -2px;
  top: -3px;
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 100px;
  background: #fff;
  box-shadow: 0px 3px 3px rgba(0,0,0,0.05);
  content: '';
  transition: all 0.3s ease;
}

.lbl:active:after { transform: scale(1.15, 0.85); }

.cbx:checked ~ label { background: #6fbeb5; }

.cbx:checked ~ label:after {
  left: 20px;
  background: #179588;
}

.cbx:disabled ~ label {
  background: #d5d5d5;
  pointer-events: none;
}

.cbx:disabled ~ label:after { background: #bcbdbc; }

.hidden { display: none; }

.submit-button {
    font-size: 2rem;
    height: 4rem;
}

</style>