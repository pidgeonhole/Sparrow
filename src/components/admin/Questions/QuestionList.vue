<template>
    <div>
        <v-tables :columns="columns" :values="questions" :unsortable="unsortable" :html-cols="htmlCols"></v-tables>
    </div>
</template>

<script type="text/babel">

    import Tables from 'components/shared/Tables.vue'
    import {mapGetters, mapActions} from "vuex"

    export default{
        components: {
            'v-tables': Tables
        },
        computed: {
            ...mapGetters([
                "getCategories"
            ]),
            questions () {

                let payload = this.getCategories;

                if (payload.length === 0) {
                    this.retrieveCategories();
                    return []
                } else {
                    let questions = [];

                    payload.forEach(category => {
                        let name = category.name;

                        category.problems.forEach(prob => {

                            questions.push({
                                ID: prob.category_id,
                                Title: prob.title,
                                Category: name,
                                Actions: {
                                    type: 'link',
                                    endpoint: `/admin/questions/${prob.id}/edit`,
                                    icon: 'mode_edit'
                                }
                            });
                        })
                    });

                    return questions
                }
            }
        },
        data() {
            return {
                columns: ['ID', 'Title', 'Category', 'Actions'],
                unsortable: ['Actions'],
                htmlCols: ['Actions']
            }
        },
        methods: {
                ...mapActions([
                    "retrieveCategories"
                ])
        }
    }

</script>
