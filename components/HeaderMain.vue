<template>
    <header class="flex justify-between items-center">
      <nuxt-link to="/" class="text-2xl font-bold">Fantasy Wingman</nuxt-link>
      <div class="flex justify-end gap-4 items-center">
        <UToggle
          class="bg-gray-200 dark:bg-gray-500"
          v-model="selected"
          @click="handleToggle"
        />
        <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }"  > 
            <UAvatar
    src="https://avatars.githubusercontent.com/u/739984?v=4"
    alt="Avatar"
  />
      <template #account="{ item}">
        <div class="text-left">
          <p>
            Signed in as
          </p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{item.label }}
          </p>
        </div>
      </template>
  
      <template #item="{ item }"  >
  <div class="flex items-center gap-2 justify-between w-full" @click="item.onClick">
  
        <span  class="truncate">{{ item.label }}</span>
  
        <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-muted-text ms-auto" />
        </div>
      </template>
    </UDropdown>
  
      </div>
    </header>
  </template>
  
  <script setup>
  const selected = ref(true);
  
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
//   const {url} = useAvatarUrl();
  
  
  
  
  const items = [
    [{
      label: user.value?.email,
      slot: 'account',
      disabled: true
    }], [{
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      onClick: ()=> navigateTo('/settings')
    }, {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      onClick: async ()=>{
        await supabase.auth.signOut();
        return navigateTo('/auth/login');
      }
    }]
  ]
  
  const handleToggle = () => {
   selected.value = !selected.value;
    selected.value ? (colorMode.preference = "dark") : (colorMode.preference = "light");
  };
  
  const colorMode = useColorMode();
  onMounted(()=>{
    selected.value = colorMode.preference === 'dark';
  })
  
  </script>
  