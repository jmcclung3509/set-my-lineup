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


      @update:fantasyPosition="(value) => updateFantasyPosition(index, value)"
      @update:playerData="(value) => updatePlayerData(index, value)"
    />
  </div>
  <div
    class="button-container flex justify-center items-center gap-7"
    v-if="!lineupId"
  >
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
const route = useRoute();
const lineupId = route.query.lineupId;
const baseUrl = useRuntimeConfig().public.baseUrl;
console.log(baseUrl);
const props = defineProps({
  pprFormat: {
    type: String,
    default: 'Standard', // Add a default value here
  },
  players: Array,
  playerData: Object,
});

const localFantasyPosition = ref(props.fantasyPosition || '');
const supabase = useSupabaseClient();
const isLoading = ref(false);
const pprFormat = ref(props.pprFormat || "Standard");
const pprOptions = ["Standard", "Half-point", "Full-point"];


const players = ref(Array(16).fill().map(() => ({
  fantasyPosition: '',
  playerPosition: '',
  playerName: '',
  playerTeam: '',
  PlayerID: ''
})));

const updatePlayerData = (index, newData) => {
  console.log(`InputForm: Updating player ${index} with:`, newData);
  players.value[index] = { ...players.value[index], ...newData };
  console.log(`InputForm: Updated players array:`, players.value);
};


// watch(
//   () => props.players,
//   (newPlayers) => {
//     console.log("Updating players with new data:", newPlayers);

//     players.value = newPlayers.map((player) => ({
//       fantasyPosition: player.fantasyPosition || '',
//       playerPosition: player.playerPosition || '',
//       playerName: player.playerName || '',
//       playerTeam: player.playerTeam || '',
//       PlayerID: player.PlayerID || ''
//     }));
//   },
//   { immediate: true }
// );
// watch(players, (newPlayers) => {
//   console.log("InputForm: Players array changed:", newPlayers);
// }, { deep: true });

const getUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
  if (!user) {
    console.error("User not found");
    return null;
  }
  return user.id;
};

const saveLineup = async () => {
  isLoading.value = true;
  console.log("InputForm: Players data before saving:", JSON.parse(JSON.stringify(players.value)));

  const emptyFields = players.value
    .map((player, index) => {
      console.log(`Mapping player ${index + 1}:`, player); // Log each player being mapped
      return { player, index: index + 1 };
    })
    .filter(({ player }) => {
      console.log(player);
      const isPlayerPositionEmpty = !player.playerPosition;
      const isPlayerNameEmpty = !player.playerName;

      return isPlayerPositionEmpty || isPlayerNameEmpty;
    });

  console.log("Empty fields:", emptyFields); //

  try {
    const userId = await getUserId();
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    const lineupData = players.value.reduce((acc, player, index) => {
      acc[`playerPosition_${index + 1}`] = player.playerPosition;
      acc[`player_${index + 1}`] = player.playerName;
      acc[`fantasyPosition_${index + 1}`] = player.fantasyPosition;
      return acc;
    }, {});

    console.log("Lineup data:", lineupData);
    lineupData.type = pprFormat.value;

    lineupData.user_id = userId;

    console.log("Data being sent to Supabase:", lineupData);

    const { data, error: insertError } = await supabase
      .from("fantasy_lineup_2")
      .insert([lineupData], { defaultToNull: false })
      .select("lineup_id")
      .single();

    if (insertError) {
      console.error("Supabase error:", insertError);
      throw error;
    }

    console.log("Supabase response:", data);

    const lineupId = data.lineup_id;
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
  const userId = await getUserId(); // Define `getUserId` to fetch the user ID or pass it from elsewhere
  if (!userId) {
    console.error("User ID is not defined");
    return;
  }

  console.log("sending");
  isLoading.value = true;

  const recipientEmail = "jturner3509@gmail.com";
  const loginUrl = `${baseUrl}/view-lineup?userId=${userId}&lineupId=${lineupId}`;

  try {
    const response = await axios.post(
      "/api/send-email",
      {
        to: recipientEmail,
        subject: "View User Lineup",
        html: `<p>A user has sent you their lineup. Please <a href="${loginUrl}">log in</a> to view it.</p>`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email response:", response.data);

    if (response.data.status === "success") {
      alert("Email sent!");
    } else {
      console.error("Failed to send email:", response.data.message);
    }
  } catch (err) {
    console.error("Error sending lineup");
  } finally {
    isLoading.value = false;
  }
};
</script>
