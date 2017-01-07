<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-6" id="vue-ace-editor">

            </div>
            <div class="col-sm-6" style="background-color: 'red'; height: inherit">

            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import ace from 'brace'
    import 'brace/mode/markdown'
    import 'brace/theme/chrome'

    export default{
        data(){
            return {
                desc: "",
                testCases: [],
                title: "",
                id: this.$route.params.id
            }
        },
        created() {
            let id = this.id;

            this.$http.all([
                this.$http.get(`problems/${id}/test-cases`),
                this.$http.get(`problems/${id}`)
            ])
                    .then(this.$http.spread((testCases, problem) => {

                        this.testCases = testCases.data;

                        problem = problem.data;
                        this.desc = problem.description;
                        this.title = problem.title;

                        this.editor.setValue(this.desc);
                    }))
                    .catch(err => {
                        console.error(err);
                    });
        },
        mounted() {
            let editor = ace.edit("vue-ace-editor");

            editor.setOptions({
                maxLines: Infinity,
                wrap: true,
                useWrapMode: true,
                indentedSoftWrap: true,
                behavioursEnabled: true,
                showLineNumbers: true,
                mode: 'ace/mode/markdown',
                highlightActiveLine: true,
                theme: 'ace/theme/chrome'
            });

            editor.getSession().on('change', () => {
                this.desc = editor.getValue();
            });

            // editor.getSession().setMode('ace/mode/markdown');
            this.editor = editor;
        }
    }
</script>

<style scoped>

#vue-ace-editor {
    height: 100%;
    border: black solid 0.5px;
}

</style>

<!--
##### Question

Many countries has money in different denominations. For example,
in Singapore, currencies come in
10c, 20c, 50c, $1, $2, $5, $10, $50, $100, $1000 and $10000.

Your challenge is to find the number of ways to form `katex x` using
any number of the given denominations.

##### Instructions

For each test case, you will be provided with:
 1. an integer `katex x \geq 1 ` which represents the currency target
    you are trying to achieve
    - i.e. `katex x = 200 ` means we are asking how many ways are there
        to make 200 units
 2. A sequence of integers separated by commas representing the different
    denomiations
    - i.e. 1, 5, 10, 20 means you must form 200 units with
        these denominations

Your task is to print the number of ways to achieve `katex x `.

```
# Sample Input
200
1 2 5 10 20 50 100 200
# Your output
73682
```

How you should output
```python
target = int(input())  # first input = target. convert to integer
coins = [int(i) for i in input().split()]
# coins become from string to list of ints. "1 2 3" -> [1, 2, 3]

# ... your function here
answer = "Integer value of your result"

print(answer)
```
-->