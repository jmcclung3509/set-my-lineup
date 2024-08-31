<template>
  <UCard>
    <h2 v-if=" !confirmationError && !isPasswordReset">Thank you for confirming your email!</h2>
    <div v-if="!confirmationError && isPasswordReset"> 
        <h2>Your password reset request has been verified.</h2>
    <UButton @click="goToPasswordReset">Reset Password</UButton></div>
<h2 v-if="confirmationError"> An error occurred: {{ confirmationError }}</h2>
<h2 v-if="isViewPage">View Page</h2>
</UCard
  >
</template>

<script setup>


// useRedirectIfAuthenticated();

const supabase = useSupabaseClient()
const confirmationError = ref(null)
const route = useRoute()
const router = useRouter()
const isPasswordReset = ref(false)
const isViewPage    = ref(false)

const goToPasswordReset = ()=>{
    router.push('/auth/update-password')
}
onMounted(async()=>{
    const tokenHash = route.query.token_hash
    const type = route.query.type

    if(!tokenHash || !type){
        confirmationError.value = "Invalid confirmation link"
        return
    }
    try{
        const {error} = await supabase.auth.verifyOtp({
            type,
            token_hash: tokenHash
        })
        if(error){
            confirmationError.value = "Failed to confirm your email."
        }else{
            if(type==='recovery'){
                isPasswordReset.value = true
            }else{
                router.push('/')
            }
            
        }
    }catch{
        confirmationError.value = "An unexpected error occurred"
    }

})



</script>
