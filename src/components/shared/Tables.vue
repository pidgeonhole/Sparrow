<template>
    <div class="container">
        <form class="form">
                <div class="form-group">
                    <label for="filter-key">Search Bar</label>
                    <input class="form-control" id="filter-key" type="text" v-model="filterKey" title="Filter Key">
                </div>

                <div>
                    <label>Category Filter</label>
                    <multiselect
                            v-model="selectedCategories"
                            :options="categories"
                            :multiple="true"
                            placeholder="Filter Categories"
                            :close-on-select="false"
                            :clear-on-select="false"
                            :hide-selected="true"></multiselect>
                </div>

        </form>
        <br class="row">
        <div class="row">
            <table class="table table-bordered table-hover">
                <thead class="thead-default">
                <tr>
                    <th v-for="key in columns"
                        @click="sortBy(key)"
                        :class="{ active: sortKey == key}">
                        <div>
                            {{ key | capitalize }} <span class="arrow"
                                                         :class="sortOrders[key] > 0 ? 'up' : 'down'"> </span>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="entry in filteredData">
                    <td v-for="key in columns">
                        <div v-if="isHtml(key)" v-html="entry[key]"></div>
                        <div v-else> {{ entry[key] }}</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script type="text/babel">

    import Multiselect from 'vue-multiselect'

    export default {
        components: {
            "multiselect": Multiselect
        },
        props: {
            data: Array,
            columns: Array,
            sortable: {
                type: Array,
                default: () => {
                    return []
                }
            },
            unsortable: {
                type: Array,
                default: () => {
                    return []
                }
            },
            htmlCols: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data(){

            let sortOrders = {};
            this.columns.forEach(key => {
                sortOrders[key] = 1
            });

            return {
                filterKey: '',
                sortKey: '',
                sortOrders,
                categories: [],
                selectedCategories: []
            }
        },
        computed: {
            filteredData() {
                let sortKey = this.sortKey;
                let filterKey = this.filterKey && this.filterKey.toLowerCase();
                let order = this.sortOrders[sortKey] || 1;
                let data = this.data;

                if (filterKey) {
                    data = data.filter(row => {
                        return Object.keys(row).some(key => {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                        })
                    })
                }

                let sc = this.selectedCategories;
                if (sc.length > 0) {
                    sc = new Set(sc);
                    data = data.filter(row => {
                        return sc.has(row.Category)
                    });
                }

                if (sortKey) {
                    data = data.slice().sort((a, b) => {
                        a = a[sortKey];
                        b = b[sortKey];
                        return (a === b ? 0 : a > b ? 1 : -1) * order;
                    })
                }
                return data;
            },
            sortKeysToSkip: function () {
                if (this.unsortable.length > 0) {
                    return this.unsortable
                }

                if (this.sortable.length > 0 && this.sortable.length < this.columns.length) {
                    let a = new Set(this.columns);
                    let b = new Set(this.sortable);
                    let difference = new Set([...a].filter(x => !b.has(x)));
                    return Array.from(difference);
                }

                return [];
            }
        },
        methods: {
            isHtml: function (key) {
                for (let i of this.htmlCols) {
                    if (i === key)
                        return true;
                }
                return false;
            },
            sortBy (key) {
                this.sortKey = key;
                for (let i of this.sortKeysToSkip) {
                    if (key === i)
                        return;
                }
                this.sortOrders[key] = this.sortOrders[key] * -1;
            }
        },
        filters: {
            capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        },
        beforeUpdate() {
            let s = new Set();
            for (let i of this.data) {
                s.add(i.Category);
            }
            this.categories = [...s];
        }
    }


</script>

<style scoped>
th:hover {
    cursor: pointer
}

.arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
}

.down {
  border-left: 0.4em solid transparent;
  border-right: 0.4em solid transparent;
  border-top: 0.4em solid black;
}

.up {
  border-left: 0.4em solid transparent;
  border-right: 0.4em solid transparent;
  border-bottom: 0.4em solid black;
}



</style>