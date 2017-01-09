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
                            {{ key | capitalize }} <span v-if="canSort(key)" class="arrow"
                                                         :class="sortOrders[key] > 0 ? 'up' : 'down'"> </span>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="entry in filteredData">

                    <td v-for="value in entry">
                        <div v-if="!value.type">
                            {{ value }}
                        </div>
                        <div v-else-if="value.type === 'html'" v-html="value"></div>
                        <div v-else-if="value.type === 'link'">
                            <router-link :to="value.endpoint">
                                <span>
                                    <i class="material-icons" v-if="value.icon">{{ value.icon }}</i>
                                    {{ value.text }}
                                </span>
                            </router-link>
                        </div>
                        <div v-else> Unknown Value Type</div>
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
            values: Array,
            columns: Array,
            sortable: {
                type: Array,
                default: () => []
            },
            unsortable: {
                type: Array,
                default: () => []
            }
        },
        data(){

            let sortOrders = {};
            this.columns.forEach(key => {
                sortOrders[key] = 1
            });

            let _sortable = [];
            let _unsortable = [];
            if (this.sortable.length === 0 &&
                    this.unsortable.length === 0) {

                _sortable = this.columns;

            } else if (this.sortable.length === 0 &&
                    this.unsortable.length < this.columns.length &&
                    this.unsortable.length > 0) {

                let columns = new Set(this.columns);
                let b = new Set(this.unsortable);

                let difference = new Set([...columns].filter(x => !b.has(x)));
                _sortable = Array.from(difference);
                _unsortable = Array.from(this.unsortable);

            } else if (this.unsortable.length === 0 &&
                    this.sortable.length <= this.columns.length &&
                    this.sortable.length > 0) {

                let columns = new Set(this.columns);
                let b = new Set(this.sortable);

                let difference = new Set([...columns].filter(x => !b.has(x)));
                _unsortable = Array.from(difference);
                _sortable = Array.from(this.unsortable);
            }

            return {
                filterKey: '',
                selectedCategories: [],
                sortKey: '',
                sortOrders,
                _sortable,
                _unsortable
            }
        },
        computed: {
            categories () {
                let s = new Set();
                for (let i of this.values) {
                    s.add(i.Category);
                }
                return [...s]
            },
            filteredData() {
                let sortKey = this.sortKey;
                let filterKey = this.filterKey && this.filterKey.toLowerCase();
                let order = this.sortOrders[sortKey] || 1;
                let data = this.values.slice();

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
            }
        },
        methods: {
            sortBy (key) {
                this.sortKey = key;
                if (this.canSort(key)) {
                    this.sortOrders[key] = this.sortOrders[key] * -1;
                }
            },
            canSort (key) {
                for (let i of this.$data._unsortable.slice()) {
                    if (key === i)
                        return false
                }
                return true;
            }
        },
        filters: {
            capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
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