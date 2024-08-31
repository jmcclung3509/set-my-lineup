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




const isPending = ref(false);
const error = ref(null);
const lineups = ref(Array(16).fill({ position: "", playerName: "" }));
const formState = ref({});
const pprFormat = ref("Standard");



const fetchLineup = async () => {
  isPending.value = true;
  error.value = null;

  try {
    const {data: user} = await supabase.auth.getUser()
    if(!user){
        throw new Error("User not found")
    }
    const { data, error: fetchError } = await supabase
      .from("fantasy_lineup_2")
      .select()
    
        .eq("user_id",  user.id)
      .order("created_at", {ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      error.value = fetchError;
      console.error("Error fetching lineup:", fetchError.message);
      return [];
    }
    lineups.value = Array.from({ length: 16 }, (_, index) => ({
      position: data[`position_${index + 1}`] || "",
      playerName: data[`player_${index + 1}`] || "",
    }));

    pprFormat.value = data.type || "Standard";
  } catch (err) {
    error.value = err;
    console.error("Unexpected error:", err);
  } finally {
    isPending.value = false;
  }
};



const clearLineup = () => {
  lineups.value = Array(16)
    .fill()
    .map(() => {
      return { position: "", playerName: "" };
    });
};



// Fetch data when the component mounts
onMounted(() => {
//   fetchLineup();
});
</script>
