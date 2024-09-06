export const useFetchLineup = (lineupId) => {
  console.log(lineupId, 'lineupId')
  const lineups = ref(Array(16).fill({ position: "", playerName: "" }));
  const isPending = ref(false);
  const supabase = useSupabaseClient();
  const error = ref(null);
  const pprFormat = ref("Standard");

  const fetchLineup = async () => {
    isPending.value = true;

    try {
      const { data: {user}, error: userError } = await supabase.auth.getUser();


      if (userError) {
        throw new Error(userError.message);
      }

      if (!user || !user.id) {
        throw new Error("User not found");
      }
      let query = supabase.from("fantasy_lineup_2").select("*").eq("user_id", user.id);
      if (lineupId) {
        query = query.eq("lineup_id", lineupId).single();
        console.log(query, 'query')
      } else {
        query = query.order("created_at", { ascending: false }).limit(1).single();
      }


      const { data, error: fetchError } = await query;
      console.log(data, 'data')

      if (fetchError) {
        error.value = fetchError;
        console.error("Error fetching lineup:", fetchError.message);
        return [];
      }
      lineups.value = Array.from({ length: 16 }, (_, index) => ({
        playerPosition: data[`playerPosition_${index + 1}`] || "",
        fantasyPosition: data[`fantasyPosition_${index + 1}`] || "",
        playerName: data[`player_${index + 1}`] || "",
      }));

      pprFormat.value = data.type || "Standard";
      lineupId.value = data.lineup_id || null;
    } catch (err) {
      error.value = err;
      console.error("Unexpected error:", err);
    } finally {
      isPending.value = false;
    }
  };
  fetchLineup();
  return { lineups, isPending, error, fetchLineup };
};
