export default defineNuxtConfig({
  compatibilityDate: '2025-06-02',
  modules: ['../src/module'],
  devtools: { enabled: true },
  feedYml: {
    sources: [
      {
        path: '/feed-yml.xml',
        cacheTime: 60 * 15
      },
      {
        path: '/feed.xml'
      }
    ]
  }
})
