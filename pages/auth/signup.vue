<template>
  <p>Please signup</p>
  <form @submit.prevent="signUpNewUser">
    <UFormGroup label="email" name="email" :required="true" class="mb-4">
      <UInput
        type="email"
        required
        placeholder="Enter your email"
        v-model="email"
      />
    </UFormGroup>
    <UFormGroup
      label="password"
      name="password"
      :required="true"
      class="mb-4"

    >
      <UInput
        type="password"
        required
        placeholder="Enter your password"
        v-model="password"
      />
    </UFormGroup>
    <UButton
      type="submit"
      :disabled="pending"
      color="green"
      variant="solid"
      label="Sign up"
      :loading="pending"
    >
      SIGN UP
    </UButton>
  </form>
</template>

<script setup>
const supabase = useSupabaseClient();

const pending = ref(false);
const email = ref("");
const password = ref("");

const redirectUrl = useRuntimeConfig().public.baseUrl;


const signUpNewUser = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${redirectUrl}/auth/confirm`,
      },
    });
    if (error) throw error;
    else {
      console.log("User signed up");
    }
  } catch (error) {
    console.error("Error during sign up:", error);
  } finally {
    pending.value = false;
  }
};
</script>
