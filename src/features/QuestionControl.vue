<template>
    <div>
        <router-bar></router-bar>
        <router-view></router-view>
    </div>
</template>

<script type="text/babel">
    import RouterBar from "components/admin/Questions/RouterBar.vue"
    export default {
        components: {
            RouterBar
        }
    }
</script>

<style scoped>
    div {
        width: 100%;
        height: 100%;
    }
</style>