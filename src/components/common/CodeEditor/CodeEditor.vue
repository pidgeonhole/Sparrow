<template>
    <div>
        <div>
            <problem-display :nameCapture="grabName"></problem-display>
        </div>

        <br/>

        <div style="height: 30em">
            <editor
                    :lang="lang"
                    :code="code"
                    :codeCapture="grabCode"></editor>
        </div>

        <div aria-label="settings"
             :id="settings_id"
             role="tablist"
             style="margin-top: 1.5rem">

            <div class="card">

                <div class="card-header mdc-bg-indigo-600 mdc-text-grey-100 hover-pointer"
                     role="tab"
                     data-toggle="collapse"
                     :data-parent="'#' + settings_id"
                     :href="'#' + settings_id + '-1'">
                    <div class="d-flex align-items-center">
                            <i class="material-icons icon-text-align">
                                settings_applications </i>
                            <span class="icon-text-align">Settings</span>
                    </div>
                </div>

                <div class="collapse"
                     :id="settings_id + '-1'"
                     role="tabpanel">
                    <div class="card-block">
                        <div class="form-group">

                            <label>Language</label>
                            <select class="form-control"
                                    v-model="lang">
                                <option v-for="l in languages">{{ l }}</option>
                            </select>

                        </div>
                    </div>
                </div>

            </div>
        </div>

        <br>

        <button class="mbtn btn-block"
                :class="{'button-loading': isLoading}"
                @click="submit"
                :disabled="isLoading">
            <div v-if="!isLoading">
                <i class="material-icons icon-text-align-3">cloud</i>
                <span class="icon-text-align-3">Submit</span>
            </div>
            <div v-else>
                <span class="icon-text-align-3">Loading</span>
            </div>
        </button>

        <div class="modal fade" tabindex="-1" role="dialog" id="resultsModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Results for {{ name }}</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Score: {{ results.tests_passed }} / {{ results.num_tests}}
                        </p>
                        <div>
                            <ul>
                                <li v-for="(item, index) in results.results">
                                    Test Case {{ index + 1 }}:
                                    <span v-if="item.result==='passed'" class="mdc-text-teal-800"> Passed </span>
                                    <span v-else class="mdc-text-red-800"> Failed </span>
                                </li>
                            </ul>
                        </div>
                        <p v-if="results.tests_errored > 0" class="mdc-text-red-600">
                            There has been some errors. Check if your code is correct or that you selected the right
                            language in the settings.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">

    import Editor from './Editor.vue'
    import ProblemDisplay from './ProblemDisplay.vue'

    // Change supported languages here. Require highlights from Editor.vue
    const languages = ['Python', 'R'];


    export default {
        data() {
            return {
                code: "",
                isLoading: false,
                lang: "Python",
                languages,
                name: "",
                results: {},
                settings_id: "Code-Editor-Settings"
            }
        },
        methods: {
            grabCode(text) {
                this.code = text;
            },
            grabName(text) {
                this.name = text;
            },
            submit() {

                let id = this.$route.params.id;

                this.isLoading = true;

                this.$http.post(`problems/${id}/submissions`, {
                    name: this.name,
                    source_code: this.code,
                    language: this.lang.toLowerCase()
                })
                        .then((res) => {
                            this.results = res.data;
                            $('#resultsModal').modal();
                            this.isLoading = false;
                        })
                        .catch((err) => {
                            alert('Trouble connecting with the server');
                            this.isLoading = false;
                        });
            }
        },
        components: {
            'editor': Editor,
            'problem-display': ProblemDisplay
        }
    }

</script>

<style scoped>
h5 {
    margin-bottom: 0em;
}

.icon-text-align {
    font-size: 2rem !important;
    font-weight: 100;
    margin-right: 0.25rem;
}

.icon-text-align-3 {
    vertical-align: middle;
    font-size: 4.5rem !important;
    font-weight: 100
}

.button-loading {
    background-color: grey;
}

#Code-Editor-Settings {
    cursor: pointer;
}


</style>

<!--
target = int(input())   # first input = target. convert to integer
coins = [int(i) for i in input().split()]

ways = [0] * (target + 1)
ways[0] = 1

for i in coins:
    for j in range(i, target + 1):
        ways[j] += ways[j-i]

print(ways[-1])
-->