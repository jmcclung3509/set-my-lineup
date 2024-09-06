<template>
    Here is the lineup

    <InputForm :players="lineups" :pprFormat="pprFormat" />
</template>

<script setup>

const supabase = useSupabaseClient();
const route = useRoute();
const lineupId = route.query.lineupId;

const {fetchLineup, lineups} = useFetchLineup(lineupId);

onMounted(fetchLineup);


</script>