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

  css: ["@/assets/scss/main.scss"],

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
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
  nodemailer: {
    from: '"Fantasy Wingman" <jturner3509@gmail.com>',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PSWRD,
    },
  },
  compatibilityDate: "2024-08-09",
});
