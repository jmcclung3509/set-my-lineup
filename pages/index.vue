<template>
  <div class="space-y-24">
    <h1 class="text-4xl">Let's set your lineup</h1>
    <UButton @click="clearLineup" color="green" variant="solid"
      >Clear Lineup</UButton
    >
    <section  class="form">
        <InputForm :players="lineups" :pprFormat="pprFormat"   
/> 
    </section>

  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const { lineups, pprFormat, fetchLineup } = useFetchLineup();





const clearLineup = () => {
  lineups.value = Array(16)
    .fill()
    .map(() => {
      return { position: "", playerName: "" };
    });
};



// Fetch data when the component mounts
onMounted(() => {
  fetchLineup();
});
</script>
