<template>
    <div class="card shadow-depth-1" v-if="desc.length > 0">
        <div class="card-block">
            <h4 class="card-title">{{ qtitle }}</h4>
            <div class="card-text" v-html="markdown"></div>
        </div>
    </div>
</template>

<script type='text/babel'>
    import showdown from 'showdown'
    import {katexConverter, syntaxHighlighter} from 'assets/showdownExtension'


    export default{
        props: {
            nameCapture: Function
        },
        data(){
            let converter = new showdown.Converter({
                extensions: [katexConverter, syntaxHighlighter]
            });
            return {
                converter,
                desc: "",
                qtitle: ""
            }
        },
        computed: {
            markdown() {
                return this.converter.makeHtml(this.desc);
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
                        this.qtitle = "Something's amiss.. :(";
                        this.desc = "The question requested cannot be detected in the server. " +
                                "We'll be redirecting you shortly";

                        setTimeout(() => {
                            this.$router.push({name: 'problem-home'});
                        }, 5000);

                    })
        }
    }


</script>