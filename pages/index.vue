<template>
    <section>
        <h1 class="text-4xl"> Let's set your line up</h1>
    </section>

</template>

<script setup>
    const supabase = useSupabaseClient();
    const players = ref([])   

 const fetchTransactions = async ()=>{

    const {data} = await useAsyncData(fantasy_lineup, async () => {
    const { data, error } = await supabase
        .from("fantasy-lineup")
        .select()

        if (error) return []

        return data
    })
    return data.value
    }

   players.value = await fetchTransactions

 </script>