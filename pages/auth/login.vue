<template>
  <UCard v-if="!success && !showForgotPasswordForm">
    <template #header> Login to fantasy wingman </template>
    <form @submit.prevent="signInWithEmail">
      <UFormGroup
        label="email"
        name="email"
        :require="true"
        class="mb-4"
        help="Please sign in"
      >
        <UInput
          v-model="email"
          placeholder="Enter your email"
          required
          type="email"
        />
      </UFormGroup>
      <UFormGroup label="password" name="password" :require="true" class="mb-4">
        <UInput
          v-model="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </UFormGroup>

      <UButton
        type="submit"
        color="black"
        variant="solid"
        label="Sign in"
        :loading="pending"
        :disabled="pending"
        >SIGN IN
      </UButton>
    </form>
    <a
      v-if="signInError === true"
      @click="showForgotPasswordForm = true"
      style="cursor: pointer"
      >Forgot Password?</a
    >
  </UCard>
  <UCard v-if="showForgotPasswordForm">
    <template #header> Reset your password </template>
    <form @submit.prevent="sendPasswordResetEmail">
      <UFormGroup
        label="email"
        name="email"
        required
        class="mb-4"
        help="Enter the email associated with your account"
      >
        <UInput
          v-model="resetEmail"
          placeholder="Enter your email"
          required
          type="email"
        />
      </UFormGroup>
      <UButton
        type="submit"
        color="green"
        variant="solid"
        label="Send Reset Email"
        :loading="pending"
        :disabled="pending"
        >SEND RESET EMAIL</UButton
      >
    </form>
  </UCard>
</template>
<script setup>
const success = ref(false);
const email = ref("");
const password = ref("");
const pending = ref(false);
const supabase = useSupabaseClient();
const showForgotPasswordForm = ref(false);
const signInError = ref(false);
const resetEmail = ref("");

// const redirectURL = () => {
//   return (window.location.href = "/");
// };

useRedirectIfAuthenticated();

const signInWithEmail = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    success.value = true;
  } catch (error) {
    signInError.value = true;
    console.error("Error signing in:", error);
    alert("Error signing in. Please try again");
  } finally {
    pending.value = false;
  }
};

const sendPasswordResetEmail = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      resetEmail.value
    );
   
    if (error) throw error;
    alert("Password reset email sent. Please check your inbox");
    showForgotPasswordForm.value = false;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    alert("Error sending password reset email. Please try again");
  } finally {
    pending.value = false;
  }
};


</script>
