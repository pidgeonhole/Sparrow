<template>
    <div class="card" id="pg-preview">
        <div class="card-block" id="pg-preview-block">
            <h4 class="card-title"> {{ title }} </h4>
            <div class="card-text" v-html="markdown"></div>
        </div>
    </div>
</template>

<script type="text/babel">
    import showdown from 'showdown'
    import {katexConverter, syntaxHighlighter} from 'assets/showdownExtension'

    export default{
        props: {
            title: String,
            text: String
        },
        computed: {
            markdown() {
                return this.converter.makeHtml(this.text);
            }
        },
        data() {
            // syntaxHighlighter
            let converter = new showdown.Converter({
                extensions: [katexConverter, syntaxHighlighter]
            });

            return {
                converter
            }
        }
    }

</script>

<style scoped>

#pg-preview {
    min-height: 10rem;
    height: 100%;
    margin-bottom: 0;
}

</style>