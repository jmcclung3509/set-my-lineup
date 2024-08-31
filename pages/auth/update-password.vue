<template>
    <UCard>
      <template #header>Update Your Password</template>
      <form @submit.prevent="handleUpdatePassword">
        <UFormGroup
          label="New Password"
          name="newPassword"
          required
          class="mb-4"
        >
          <UInput
            v-model="newPassword"
            placeholder="Enter your new password"
            required
            type="password"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="green"
          variant="solid"
          label="Update Password"
          :loading="pending"
          :disabled="pending"
        >
          UPDATE PASSWORD
        </UButton>
      </form>
    </UCard>
  </template>
  <script setup>
  useRedirectIfAuthenticated();

const newPassword = ref("");
const pending = ref(false);
const supabase = useSupabaseClient();

const handleUpdatePassword = async ()=>{
    pending.value = true;
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword.value,
        });
        if (error) throw error;
        else {
            pending.value = false;
            newPassword.value = "";
            alert("Password updated successfully");
        }
    } catch (error) {
        alert(error.error_description || error.message);
    } finally {
        pending.value = false;
    }
}
  </script>
