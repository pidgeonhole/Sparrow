<template>
    <div class="card shadow-depth-1" v-if="desc.length > 0">
        <div class="card-block">
            <h4 class="card-title">{{ qtitle }}</h4>
            <div class="card-text" id="innerMD" v-html="markdown"></div>
        </div>
    </div>
</template>

<script type='text/babel'>
    import showdown from 'showdown'
    import katex from 'katex'
    import 'assets/katex/katex.min.css'

    let ext = require('./ShowDownExtension');


    export default{
        props: {
            nameCapture: Function
        },
        data(){
            return{
                desc: "",
                qtitle: ""
            }
        },
        computed: {
            markdown() {
                let converter = new showdown.Converter({
                    extensions: ['sdkatex']
                });

                return converter.makeHtml(this.desc);
            }
        },
        created() {
            let id = this.$route.params.id;

            this.$http.get(`problems/${id}`)
                .then((res) => {
                    let data = res.data;

                    this.qtitle = data.title;
                    this.desc = data.description;
                    this.nameCapture(data.title);
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    }




</script>