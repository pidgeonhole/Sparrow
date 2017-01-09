<template>
    <div>
        <v-tables :columns="columns" :data="questions" :unsortable="unsortable" :html-cols="htmlCols"></v-tables>
    </div>
</template>

<script type="text/babel">

    import Tables from 'components/shared/Tables.vue'

    export default{
        components: {
            'v-tables': Tables
        },
        data() {
            return {
                columns: ['ID', 'Title', 'Category', 'Actions'],
                questions: [],
                unsortable: ['Actions'],
                htmlCols: ['Actions']
            }
        },
        mounted () {
            let config = {
                params: {
                    expand: 'problems'
                }
            };

            this.$http.get('categories', config)
                    .then((response) => {
                        // this.questions = response.data;
                        let all = response.data;
                        let questions = [];

                        all.forEach(category => {
                            let name = category.name;

                            category.problems.forEach(prob => {
                                let action = `<a href='questions/${prob.category_id}'
                                                 data-toggle="tooltip"
                                                 data-placement="right"
                                                 title="Edit">
                                                    <i class="material-icons">mode_edit</i>
                                                 </a>`;
                                questions.push({
                                    ID: prob.category_id,
                                    Title: prob.title,
                                    Category: name,
                                    Actions: `<a href='${prob.category_id}' data-toggle="tooltip" data-placement="right" title="Edit"><i class="material-icons">mode_edit</i></a>`
                                });
                            })
                        });

                        this.questions = questions;

                        // Initialize all tooltips
                        $(function () {
                            $('[data-toggle="tooltip"]').tooltip()
                        });

                    })
                    .catch(error => {
                        console.log("Trouble getting data");
                    })
        }
    }

</script>
