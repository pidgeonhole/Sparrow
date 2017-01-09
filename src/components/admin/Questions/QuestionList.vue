<template>
    <div>
        <v-tables :columns="columns" :values="questions" :unsortable="unsortable" :html-cols="htmlCols"></v-tables>

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

                        this.questions = questions;

                    })
                    .catch(error => {
                        console.log("Trouble getting data");
                    })
        }
    }

</script>
