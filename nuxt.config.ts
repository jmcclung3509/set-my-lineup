
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

  css: ["@/assets/scss/main.scss"],

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
    private:{
      EMAIL_PSWRD: 'suyy gdag hxht uaur',
      EMAIL_USER: process.env.EMAIL_USER,
    }

  },
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/confirm",
      exclude: ["/", "/auth/signup"],
    },
  },

  modules: [
    "@nuxt/devtools",
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "nuxt-nodemailer",
  ],

  compatibilityDate: "2024-08-09",
});
