export const useFetchLineup = ()=>{
    const lineup = ref([]);
    const isPending = ref(false);
    const supabase = useSupabaseClient();
    const error = ref(null);

    const fetchLineup = async()=>{
        isPending.value = true;
        error.value = null;
        try{
          const {data, error: fetchError} = await supabase.from('lineup').select();
          if (fetchError){
            error.value = fetchError
            console.error('Error fetching data', fetchError)
            return 
          }
   lineup.value =data

        }catch(err){
            error.value = err.message;
            console.error('Error fetching data', err)
    }finally{
        isPending.value = false;
    }
}
fetchLineup();
return { lineup, isPending, error, fetchLineup }
}
