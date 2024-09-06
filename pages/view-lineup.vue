<template>
   
  <h2> Your Lineup</h2>
    <InputForm :players="lineups" :pprFormat="pprFormat" />
</template>


<script setup>

const route  = useRoute()
const lineupId = route.query.lineupId;
console.log(lineupId)
const { lineups, pprFormat, isPending, error, fetchLineup} = useFetchLineup(lineupId);
console.log(lineups, 'lineups')




onMounted(()=>{
const results = fetchLineup()
console.log(results)


})
</script>