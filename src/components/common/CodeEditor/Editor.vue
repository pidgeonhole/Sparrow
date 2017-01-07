<template>
    <div id="vue-ace-editor"></div>
</template>

<script type="text/babel">
    import ace from 'brace'

    // Supported languages
    import 'brace/mode/python'
    import 'brace/mode/r'

    export default{
        props: {
            lang: String,
            codeCapture: Function
        },
        data(){
            return {}
        },
        watch: {
            lang: function(present) {
                this.editor.getSession().setMode(`ace/mode/${present}`.toLowerCase());
            }
        },
        mounted() {
            let vm = this;

            let editor = ace.edit(this.$el);

            editor.getSession().on('change', () => {
                vm.text = editor.getValue();
                vm.codeCapture(vm.text)
            });

            editor.getSession().setMode(`ace/mode/${this.lang}`.toLowerCase());
            editor.getSession().setTabSize(4);

            vm.editor = editor;
        }
    }
</script>

<style scoped>
#vue-ace-editor {
    width: 100%;
    height: 100%;
}

</style>