import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

// Initialize Supabase client with the Service Role key from your .env file
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY, // Make sure this is your service role key
  {
    auth: { persistSession: false },
  }
);


// Fetch all users using the admin privileges
const {
  data: { users },
  error,
} = await supabase.auth.admin.listUsers();

if (error) {
  console.error("Error fetching users:", error);
  process.exit(1); // Exit on error
}

const usersId = users.map((user) => user.id);

// Seed data into the correct table
async function seedFantasyLineups() {
  // Delete all existing data from the fantasy_lineup_2 table
  const { error: deleteError } = await supabase
    .from("fantasy_lineup_2") // Correct table name
    .delete()
    .gte("id", 0); // Ensuring deletion of all rows
  
  if (deleteError) {
    console.error("Error deleting existing fantasy_lineup_2 data:", deleteError);
    return;
  }

  let lineups = [];

  for (const user of usersId) {
    // Generate data for fantasy lineups
    const newLineup = {
      type: "Half-Point",
      playerPosition_1: "QB",
      player_1: "Patrick Mahomes",
      playerPosition_2: "RB",
      player_2: "Christian McCaffrey",
      playerPosition_3: "RB",
      player_3: "Derrick Henry",
      playerPosition_4: "WR",
      player_4: "Garrett Wilson",
      playerPosition_5: "WR",
      player_5: "Stephon Diggs",
      playerPosition_6: "TE",
      player_6: "Travis Kelce",
      playerPosition_7: "WR",
      player_7: "DeAndre Hopkins",
      playerPosition_8: "K",
      player_8: "Justin Tucker",
      playerPosition_9: "DEF",
      player_9: "Baltimore Ravens",
      playerPosition_10: "WR",
      player_10: "Davante Adams",
      playerPosition_11: "WR",
      player_11: "Trevor Lawrence",
      playerPosition_12: "RB",
      player_12: "Jonathan Taylor",
      playerPosition_13: "RB",
      player_13: "Austin Ekeler",
      playerPosition_14: "TE",
      player_14: "George Kittle",
      playerPosition_15: "WR",
      player_15: "D'Andre Swift",
      playerPosition_16: "QB",
      player_16: "Josh Allen",
      lineup_id: faker.string.uuid(),
      user_id: user, // Assigning the lineup to a user
      fantasyPosition_1: "QB",
      fantasyPosition_2: "RB",
      fantasyPosition_3: "RB",
      fantasyPosition_4: "WR",
      fantasyPosition_5: "WR",
      fantasyPosition_6: "TE",
      fantasyPosition_7: "WR",
      fantasyPosition_8: "K",
      fantasyPosition_9: "DEF",
      fantasyPosition_10: "WR",
      fantasyPosition_11: "Bench",
      fantasyPosition_12: "Bench",
      fantasyPosition_13: "Bench",
      fantasyPosition_14: "Bench",
      fantasyPosition_15: "Bench",
      fantasyPosition_16: "Bench",
    };

    lineups.push(newLineup);
  }

  // Insert generated lineups into the fantasy_lineup_2 table
  const { error: insertError } = await supabase
    .from("fantasy_lineup_2") // Correct table name
    .upsert(lineups); // Use upsert to insert or update

  if (insertError) {
    console.error("Error inserting data into fantasy_lineup_2:", insertError);
  } else {
    console.log("Fantasy lineup data inserted successfully");
  }
}

// Call the seed function
seedFantasyLineups().catch(console.error);
