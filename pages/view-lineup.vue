<template>

  <div class="mb-4">PPR Format: {{ pprFormat }}</div>
  <div v-for="lineup in formattedLineups" :key="lineup.id" class="space-y-4 mb-2">
    <div :class="getColorClass(lineup.fantasyPosition)"><span> {{ lineup.fantasyPosition }}</span> <span>{{ lineup.playerName }} - {{ lineup.playerPosition }}</span></div>
    </div>
 
    <!-- <InputForm :players="lineups" :pprFormat="pprFormat" />{ -->
</template>

<script setup>

const supabase = useSupabaseClient();
const route = useRoute();
const lineupId = route.query.lineupId;

const {fetchLineup, lineups,  pprFormat} = useFetchLineup(lineupId);



const positionOrder = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF', 'Bench'];

const formattedLineups = computed(() => {

  return lineups.value.sort((a, b) => {
    // Get the index of each player's fantasyPosition in the positionOrder array
    const positionAIndex = positionOrder.indexOf(a.fantasyPosition);
    const positionBIndex = positionOrder.indexOf(b.fantasyPosition);

    // Sort by the index in the positionOrder array
    return positionAIndex - positionBIndex;
  });
});
const getColorClass = (fantasyPosition) => {
  switch (fantasyPosition) {
    case 'QB':
      return 'bg-green-200';
    case 'RB':
      return 'bg-blue-200';
    case 'WR':
      return 'bg-yellow-200';
    case 'TE':
      return 'bg-red-200';
    case 'K':
      return 'bg-purple-200';
    case 'DEF':
      return 'bg-indigo-200';
    case 'Bench':
      return 'bg-gray-200';
    default:
      return '';
  }
};

onMounted(async()=>{
await fetchLineup()


})
</script>
