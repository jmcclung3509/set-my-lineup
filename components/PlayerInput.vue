<template>
  <UForm :state="state" :schema="schema" class="p-4">
    <UFormGroup :label="label" name="player" class="mb-4">
      <USelect
        v-model="state.position"
        :options="positions"
        placeholder="Select a position"
        @update:modelValue="updatePosition"
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
        @update:modelValue="updatePlayerName"
      />
    </UFormGroup>
  </UForm>
</template>

<script setup>
import { z } from "zod";

const props = defineProps({
  label: String,
  position: String,
  playerName: [String, Object],
});

const emit = defineEmits(["update:position", "update:playerName"]);

const playerOptions = ref([]);
const isLoading = ref(false);
const filteredPlayers = ref([]);

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
  position: props.position || "",
  playerName: props.playerName || {},
});

const schema = z.object({
  position: z.string(),
  playerName: z.string() || z.object({ label: z.string(), value: z.string() }),
});

const updatePosition = async (value) => {
  state.value.position = value;
  state.value.playerName = "";
  emit("update:position", value);
  playerOptions.value = await fetchPlayers(value);
};

const updatePlayerName = (value) => {
  console.log(value)
  state.value.playerName = value;
  state.value.playerPosition = value 
  emit("update:playerName", value);

};

const fetchPlayers = async (position) => {
  isLoading.value = true;

  try {
    const playerData = await $fetch(
      "https://api.sportsdata.io/v3/nfl/scores/json/Players",
      {
        params: {
          key: "541c6c83330c47569d28936b449f5f80",
        },
      }
    );
    const defenseData = await $fetch(
      "https://api.sportsdata.io/v3/nfl/scores/json/Teams",
      {
        params: {
          key: "541c6c83330c47569d28936b449f5f80",
        },
      }
    );

    isLoading.value = false;

    // let filteredPlayers = data.filter((player) => player.Team !== null);

    const defenses = defenseData.map((team) => ({
      FirstName: team.Name,
      LastName: "Defense",
      Team: team.Key,
      PlayerID: team.TeamID,
      Position: "DEF",
    }));
    const allPlayers = playerData
      .filter((player) => player.Team !== null)
      .slice(0, 500)
      .concat(defenses);

    if (position === "DEF") {
      filteredPlayers.value = defenses;
    }  else if(position === "RB"){
      filteredPlayers.value = allPlayers.filter(
        (player) => player.Position === "RB" || player.Position === "FB"
      );
    } else if (position === "Bench") {
      filteredPlayers.value = allPlayers;
    }else if(position !== "Bench") {
      filteredPlayers.value = allPlayers.filter(
        (player) => player.Position === position
      );
    }
    filteredPlayers.value = filteredPlayers.value.sort((a, b) =>
      a.FirstName.localeCompare(b.FirstName)
    );

    return filteredPlayers.value.map((player) => ({
      label: `${player.FirstName} ${player.LastName} - ${player.Position} (${player.Team})`,
      value: player.PlayerID,
    }));
  } catch (error) {
    console.error("Error fetching players:", error);
    isLoading.value = false;
    return [];
  }
};

watch(
  () => props.position,
  async (newValue) => {
    if (newValue !== state.value.position) {
      state.value.position = newValue;
      playerOptions.value = await fetchPlayers(newValue);
    }
  }
);

watch(
  () => props.playerName,
  (newValue) => {
    if (newValue !== state.value.playerName) {
      state.value.playerName = newValue;
    }
  }
);

onMounted(async () => {
  if (props.position) {
    state.value.position = props.position;
    playerOptions.value = await fetchPlayers(props.position);
  }
  if (props.playerName) {
    state.value.playerName = props.playerName;
  }
});
</script>
