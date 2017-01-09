<template>
    <div class="container-fluid">
        <div class="d-flex flex-rows justify-content-end">
            <router-link :to="{name: 'questions-home'}" v-if="searchButton">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-color--yellow-400 mdl-color-text--white mdl-button--ripple"
                        id="searchButton">
                    <i class="material-icons">search</i>
                </button>
                <div class="mdl-tooltip mdl-tooltip--large" for="searchButton">Search</div>
            </router-link>

            <router-link :to="{name: 'question-add'}" v-if="addButton">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-color--pink-400 mdl-color-text--white mdl-button--ripple"
                        id="addButton">
                    <i class="material-icons">add</i>
                </button>
                <div class="mdl-tooltip mdl-tooltip--large" for="addButton">Add Questions</div>
            </router-link>
        </div>
        <br>
    </div>
</template>

<script type="text/babel">
    export default {
        computed: {
            searchButton() {
                return this.$route.name !== "questions-home"
            },
            addButton() {
                return this.$route.name !== "question-add"
            }
        }
    }
</script>
<style scoped>
    button {
        margin: 0 0 0 0.5rem;
    }

</style>
