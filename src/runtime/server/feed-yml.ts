import type { H3Event } from 'h3'
import yml from 'yandex-market-language'
import { defineEventHandler, setHeader, useNitroApp, getRequestURL, createError } from '#imports'
import feedOptions from '#feedYml'
import type { SourceOptions, NitroCtx } from '../../types'

async function createFeed(options: SourceOptions): Promise<string> {
  const nitroApp = useNitroApp()

  const ctx: NitroCtx = {
    data: {} as any,
    options
  }

  await nitroApp.hooks.callHook('feed:generate', ctx)

  if (!ctx.data || Object.keys(ctx.data).length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'No data provided for YML feed'
    })
  }

  try {
    const result = yml(ctx.data)
    return result.end()
  } catch (err: any) {
    console.error('❌ Failed to generate YML:')
    console.error(err?.message || err)

    throw createError({
      statusCode: 500,
      statusMessage: 'YML generation failed'
    })
  }

}

export default defineEventHandler(async (event: H3Event) => {
  const { pathname } = getRequestURL(event)
  const options = (feedOptions as Record<string, SourceOptions>)[pathname]

  if (!options) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Feed not found'
    })
  }

  const xml = await createFeed(options)
  console.log('➡ Returning XML to client, length:', xml.length)

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', `public, max-age=${options.cacheTime || 60 * 15}`)

  return xml
})
