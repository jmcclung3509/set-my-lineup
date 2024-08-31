<template> 
<UCard>

    <h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password"
    >Reset Password</a
  >
</p>

</UCard>

</template>

<script setup>
const supabase = useSupabaseClient()

const signupNewUser = async()=>{
    const {data, error} = await SupabaseAuthClient.auth.resetPasswordForEmail(email)
}

await SupabaseAuthClient.auth.updateUser ({password: new_password})
</script>