<template>
    <div id="pg-ace-editor"></div>
</template>

<script type="text/babel">
    import ace from 'brace'
    import 'brace/mode/markdown'
    import 'brace/theme/chrome'

    export default{
        props: {
            codeCapture: Function,
            initial: {
                type: String,
                default: ""
            }
        },
        watch: {
            initial: function(present) {
                this.editor.setValue(present);
            }
        },
        data(){
            return {
                msg: 'hello vue'
            }
        },
        mounted () {
            let editor = ace.edit("pg-ace-editor");

            editor.setOptions({
                maxLines: Infinity,
                wrap: true,
                indentedSoftWrap: true,
                behavioursEnabled: true,
                showLineNumbers: true,
                mode: 'ace/mode/markdown',
                highlightActiveLine: true,
                theme: 'ace/theme/chrome'
            });

            editor.$blockScrolling = Infinity;

            editor.getSession().on('change', () => {
                this.codeCapture(editor.getValue());
            });

            editor.setValue(this.initial);

            this.editor = editor;
        }
    }


</script>

<style scoped>
#pg-ace-editor {
    width: 100%;
    height: 100% !important;
    border: black solid 0.5px;
}

</style>
