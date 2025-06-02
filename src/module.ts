import { defineNuxtModule, addServerHandler, createResolver, addPrerenderRoutes, addTemplate } from '@nuxt/kit'
import type { ModuleOptions, SourceOptions } from './types'

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt3-module-feed-yml',
    configKey: 'feedYml'
  },
  defaults: {
    sources: []
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const feedOptions: Record<string, SourceOptions> = {}

    for (const feed of options.sources) {
      addServerHandler({
        route: feed.path,
        handler: resolver.resolve('runtime/server/feed-yml'),
        method: 'get'
      })

      // Handle SSG
      if (nuxt.options._generate) {
        addPrerenderRoutes([feed.path])
      }

      feedOptions[feed.path] = {
        path: feed.path,
        cacheTime: feed.cacheTime || 60 * 15 // Default cache time 15 minutes
      }
    }

    nuxt.options.runtimeConfig.public.feedYml = options
    nuxt.options.alias['#feedYml'] = (addTemplate({
      filename: 'nuxt3-feed-yml-options.mjs',
      write: true,
      getContents: () => `export default ${JSON.stringify(feedOptions, null, 2)}`
    }).dst || '')
  }
})
