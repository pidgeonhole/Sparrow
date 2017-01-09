<template>
    <div class="container d-flex flex-column">
        <div id="all-probs" role="tablist" aria-multiselectable="true">
            <div v-for="c in categories" class="card shadow-depth-1">

                <div class="card-header problem-card" role="tab" data-toggle="collapse"
                     data-parent="#all-probs" :href="'#' + c.ref_id">
                    <h4>{{ c.name }}</h4>
                    <small>{{ c.description}}</small>
                </div>

                <div :id="c.ref_id" class="collapse" role="tabpanel">
                    <div v-if="c.problems.length === 0" class="card-block shadow-depth-1">
                        <p> Coming soon! </p>
                    </div>
                    <div v-else class="card-block shadow-depth-1 no-pad">
                        <ul class="problem-list">
                            <li class="problem-item" v-for="p in c.problems">
                                <router-link :to="String(p.id)" class="router-anchor">
                                    <h5> {{ p.title }} </h5>
                                    <hr class="mdc-bg-grey-300" style="margin: 0">
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script type="text/babel">

    export default {
        data() {
            return {
                categories: []
            }
        },
        created() {

            let config = {
                params: {
                    expand: 'problems'
                }
            };

            this.$http.get('categories', config).then(
                    (response) => {

                        this.categories = response.data;

                        this.categories.forEach((cat, i) => {

                            cat.ref_id = `category${i}`;
                            cat.href_id = `#category${i}`;

                            cat.problems = cat.problems.map((e, j) => {
                                e.ref_id = `category${j}`;
                                e.href_id = `#category${j}`;
                                return e;
                            })
                        });
                    },
                    (error) => {
                        console.error("Trouble getting data");
                    }
            )

        }
    }
</script>

<style scoped>

.card {
    margin-bottom: 1rem;
}

.router-anchor, .router-anchor:visited {
    color: #616161;
    text-decoration: none;
}


.problem-card {
    background-color: #FAFAFA;
    color: #616161;
}

.problem-card:hover {
    background-color: #616161;
    color: #FAFAFA;
    cursor: pointer;
}

.problem-list {
    list-style: none;
    padding-left: 0rem;
    margin-bottom: 0.5rem;
}

.problem-item {
    margin-bottom: 0rem;
    margin-top: 1rem;
    padding: 1rem 2rem
}

.problem-item:hover {
    background-color: #009688;
    font-weight: 400;
    cursor: pointer;
}

.problem-item:hover .router-anchor {
    color: white;
}

</style>