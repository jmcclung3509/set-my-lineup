// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
      head: {
        charset: "utf-8",
        meta: [
          { name: "viewport", content: "width=device-width, initial-scale=1" },
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      
       
      },
    },

  css:["@/assets/scss/main.scss"],

  devtools: {
    enabled: true,
  },

  supabase: {
    redirect: false,
  },

  modules: ["@nuxt/devtools", '@nuxt/ui', '@nuxtjs/supabase'],
  compatibilityDate: "2024-08-09",
});