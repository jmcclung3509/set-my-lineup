<template>
  <div class="form-container">
    <UForm class="p-4">
      <UFormGroup>
        <label for="ppr-format" class="label">PPR Format</label>
        <USelect
          v-model="pprFormat"
          id="ppr-format"
          class="select"
          :options="pprOptions"
        >
        </USelect> </UFormGroup
    ></UForm>
    <PlayerInput
      v-for="(player, index) in players"
      :key="index"
      :label="`Player ${index + 1}`"
      v-model:fantasyPosition="player.fantasyPosition"
      v-model:playerName="player.playerName"
    />
  </div>
  <div class="button-container flex justify-center items-center gap-7">
    <UButton @click="saveLineup" class="button" :loading="isLoading"
      >SAVE LINEUP</UButton
    >
    <UButton @click="sendLineup" class="button" :loading="isLoading"
      >SEND TO</UButton
    >
  </div>
</template>

<script setup>
import axios from "axios";

const baseUrl = useRuntimeConfig().public.baseUrl;
console.log(baseUrl);

const props = defineProps({
  pprFormat: String,
  players: Array,
});

const supabase = useSupabaseClient();
const isLoading = ref(false);
const pprFormat = ref(props.pprFormat || "Standard");
const pprOptions = ["Standard", "Half-point", "Full-point"];
const players = ref(props.players.map(player => ({ ...player })));


watch(
  () => props.players,
  (newPlayers) => {
    players.value = newPlayers.map(player => ({ ...player }));
  },
  { immediate: true }
);

const getUserId = async ()=>{
    const {data:{user}, error} = await supabase.auth.getUser();
    if (error){
        console.error("Error getting user ID:", error);
        return null;
    }if (!user){
        console.error("User not found");
        return null;
    }
    return user.id;
}

const saveLineup = async () => {
    isLoading.value = true;

  // const emptyFields = players.value
  //   .map((player, index) => ({ player, index: index + 1 }))
  //   .filter(({ player }) => !player.position || !player.playerName);

  // if (emptyFields.length > 5) {
  //   const emptyFieldsList = emptyFields
  //     .map(({ index }) => `Player ${index}`)
  //     .join(", ");
  //   alert(
  //     `Please fill in all player positions and names. Empty fields: ${emptyFieldsList}`
  //   );
  //   return;
  // }

  isLoading.value = true;
  try {
    const userId = await getUserId();
    if(!userId){
        console.error("No user ID found");
        return;
    }
    const lineupData = players.value.reduce((acc, player, index) => {
      const playerName =
        typeof player.playerName === "object"
          ? player.playerName.label || JSON.stringify(player.playerName)
          : player.playerName;
      acc[`position_${index + 1}`] = player.position;
      acc[`player_${index + 1}`] = playerName;
      return acc;
    }, {});

    lineupData.type = pprFormat.value;
    lineupData.user_id = userId;
 

    console.log("Data being sent to Supabase:", lineupData);

    const { data, error: insertError } = await supabase
      .from("fantasy_lineup_2")
      .insert([lineupData], { defaultToNull: false })
      .select('lineup_id')
      .single();

    if (insertError) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Supabase response:", data);


    const lineupId = data.lineup_id;
    console.log("Lineup ID:", lineupId);
    return lineupId;

  } catch (e) {
    console.error("Error saving lineup:", e);
    alert(`Error saving lineup: ${e.message}`);
  } finally {
    isLoading.value = false;
  }
};

const sendLineup = async () => {
  const lineupId = await saveLineup();
    if (!lineupId) {
        console.error("No lineup ID found");
        return;
    }
  console.log("sending", lineupId, "lineupId");
  isLoading.value = true;


  const recipientEmail = "criticalhits8@gmail.com";


  const loginUrl = `${baseUrl}/auth/login?redirectTo=/view-lineup`
//   const loginUrl = `${baseUrl}/auth/login?redirectTo=/view-lineup&userId=${userId}&lineupId=${lineupId}`;


  try {
   const response =  await axios.post("/api/send-email", {
      to: recipientEmail,
      subject: "View User Lineup",
      text: `A user has sent you their lineup. Please log in to view it: ${loginUrl}`,
    });
    console.log("Email response:", response.data);

    if(response.data.status=== 'success'){
        alert("Email sent!");
    }else{
        console.error ("Failed to send email:", response.data.message)
    }
  } catch (err) {

    console.error("Error sending lineup");
  } finally {
    isLoading.value = false;
  }
};
</script>
