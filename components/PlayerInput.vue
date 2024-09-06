<template>
  <UForm :state="state" :schema="schema" class="p-4">
    <UFormGroup :label="label" name="player" class="mb-4">
      <USelect
        v-model="state.fantasyPosition"
        :options="positions"
        placeholder="Select a position"
        @update:modelValue="updateFantasyPosition"
      />
      <USelectMenu
        searchable
        searchable-placeholder="Search a player.."
        v-model="state.playerName"
        label="Player Name"
        placeholder="Select a player"
        :options="playerOptions"
        :loading="isLoading"
        class="mb-4"
        :loadingIcon="isLoading ? 'i-heroicons-arrow-path-20-solid' : null"
        @update:modelValue="updatePlayerData"
      />
    </UFormGroup>
  </UForm>
</template>

<script setup>
import { z } from "zod";

const props = defineProps({
  label: String,
  fantasyPosition: String,
  playerName: String,
  playerPosition: String,
  playerData: Object,
});


const emit = defineEmits(["update:playerData", "update:fantasyPosition"]);

const playerOptions = ref([]);
const isLoading = ref(false);
const allPlayers = ref([]);
const route = useRoute();
const lineupId = route.query.lineupId;
const supabase = useSupabaseClient();

const positions = [
  { label: "QB", value: "QB" },
  { label: "RB", value: "RB" },
  { label: "WR", value: "WR" },
  { label: "TE", value: "TE" },
  { label: "K", value: "K" },
  { label: "DEF", value: "DEF" },
  { label: "Bench", value: "Bench" },

];

const state = ref({
  playerPosition: props.playerPosition,
  fantasyPosition: props.fantasyPosition,
  playerName: props.playerName,

});

const schema = z.object({
  playerPosition: z.string(),
  fantasyPosition: z.string(),
  playerData: z.object({
    FirstName: z.string(),
    LastName: z.string(),
    Team: z.string(),
    PlayerID: z.string(),
    Position: z.string(),
  }),
  playerName: z.string(),
  label: z.string(),
});

const updateFantasyPosition = (value) => {
  console.log("updating fantasy position", value);  
  state.value.fantasyPosition = value;
  emit("update:fantasyPosition", value);
  updatePlayerOptions();
};


const updatePlayerData = (value) => {
  console.log(value, "value");
  console.log(playerOptions.value, "playerOptions");
  state.value.playerName = value;

  const selectedPlayer = playerOptions.value.find(
    (option) => option.value === value
  );
  console.log(selectedPlayer, "selectedPlayer");

  if (selectedPlayer) {
    // Set playerData to selected player
    state.value.playerData = selectedPlayer;

    // Emit the entire playerData object
    emit("update:playerData", selectedPlayer);
  }


};

const updatePlayerOptions = () => {
  console.log("Updating player options");
  if (!lineupId) {
    console.log(playerOptions.value)
    playerOptions.value = filterPlayersByFantasyPosition(
      state.value.fantasyPosition
    );
  } else {
    console.log(playerOptions.value)
    playerOptions.value = allPlayers.value.map((player) => ({
      label: `${player.FirstName} ${player.LastName}  (${player.Team})`,
      value: player.PlayerID,
      playerPosition: player.playerPosition, 
      team: player.Team,
    }));
    console.log("Updated player options:", playerOptions.value);
  }
};

const extractPlayerData = (data, index) => {
  console.log(data, "data");
  const playerField = `player_${index + 1}`;
  const playerPositionField = `position_${index + 1}`;
  const fantasyPositionField = `fantasy_position_${index + 1}`;

  const playerStr = data[playerField] || "";
  const playerPosition = data[playerPositionField] || "Unknown";
  const fantasyPosition = data[fantasyPositionField] || "Unknown";

  // Extract name and team from playerStr
  const nameMatch = playerStr.match(/^(.+?)\s\((.+?)\)$/);
  const name = nameMatch ? nameMatch[1] : "Unknown";
  const team = nameMatch ? nameMatch[2] : "";

  return {
    playerPosition,
    fantasyPosition,
    playerName: name,
    team,
  };
};

const fetchPlayers = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    if (lineupId) {
      const { data, error } = await supabase
        .from("fantasy_lineup_2")
        .select("*")
        .eq("lineup_id", lineupId)
        .single();
      if (error) throw new Error(error.message);

      const players = Array.from({ length: 16 }, (_, index) =>
        extractPlayerData(data, index)
      );

      allPlayers.value = Array.isArray(players) ? players : [];

      playerOptions.value = allPlayers.value || [];
    } else {
      // Fetch players from external API
      const playerResponse = await $fetch(
        "https://api.sportsdata.io/v3/nfl/scores/json/Players",
        {
          params: { key: "541c6c83330c47569d28936b449f5f80" },
        }
      );
      const defenseResponse = await $fetch(
        "https://api.sportsdata.io/v3/nfl/scores/json/Teams",
        {
          params: { key: "541c6c83330c47569d28936b449f5f80" },
        }
      );

      const defenseData = defenseResponse.map((team) => ({
        FirstName: team.Name,
        LastName: "Defense",
        Team: team.Key,
        PlayerID: team.TeamID,
        Position: "DEF",
      }));

      allPlayers.value= playerResponse
        .filter((player) => player.Team !== null)
        .slice(0, 500)
        .map((player) => ({
          FirstName: player.FirstName || "Unknown",
          LastName: player.LastName || "",
          Team: player.Team,
          PlayerID: player.PlayerID,
          Position: player.Position,
        }))
        .concat(defenseData);
 

      updatePlayerOptions();
    }
  } catch (error) {
    console.error("Error fetching players:", error);
    playerOptions.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filterPlayersByFantasyPosition = (position) => {
  console.log(position, "position");
  
  if (!allPlayers.value.length) return []; // Return empty if no players
  
  let filteredPlayers = allPlayers.value;
  
  if (position && position !== "Bench") {
    filteredPlayers = allPlayers.value.filter(player => player.Position === position);
  }
  
  if (position === "DEF") {
    filteredPlayers = allPlayers.value.filter(player => player.Position === "DEF");
  }

  return filteredPlayers
    .sort((a, b) => (a.FirstName || "").localeCompare(b.FirstName || ""))
    .map((player) => ({
      label: `${player.FirstName} ${player.LastName} - ${player.Position} (${player.Team})`,
      value: player.PlayerID,
    }));
};

watch(
  () => props.fantasyPosition,
  (newValue) => {
    if (newValue !== state.value.fantasyPosition) {
      state.value.fantasyPosition = newValue;
      updatePlayerOptions();
    }
  },
  { immediate: true }  
);

watch(
  () => props.playerName,
  (newValue) => {
    if (newValue !== state.value.playerName) {
      state.value.playerName = newValue;
    }
  },
  { immediate: true }  // Watch immediately after the component mounts
);

onMounted(async()=>{
  console.log('Mounting')
  console.log(props, 'props')
  nextTick()
  if(props.fantasyPosition !== ""){
    state.value.fantasyPosition = props.fantasyPosition;
    playerOptions.value = await fetchPlayers(props.fantasyPosition);
  }
if(props.playerName !== ""){
  console.log('setting player name')
    state.value.playerName = props.playerName;
}

})
</script>
