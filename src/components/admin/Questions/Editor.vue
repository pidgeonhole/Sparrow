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
            initial: function(present, previous) {
                if (previous === "") {
                    this.editor.setValue(this.initial, -1)
                }
            }
        },
        mounted () {
            let editor = ace.edit("pg-ace-editor");

            editor.setOptions({
                maxLines: 30,
                wrap: true,
                indentedSoftWrap: true,
                showLineNumbers: true,
                mode: 'ace/mode/markdown',
                highlightActiveLine: true,
                theme: 'ace/theme/chrome'
            });

            editor.$blockScrolling = Infinity;

            this.editor = editor;

            editor.getSession().on('change', () => {
                this.codeCapture(editor.getValue());
            });
        }
    }


</script>

<style scoped>
#pg-ace-editor {
    min-height: 10rem;
    width: 100%;
    height: 100% !important;
    border: grey solid 0.5px;
}

</style>
