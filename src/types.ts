export interface SourceOptions {
  path: string
  cacheTime?: number
}

export interface ModuleOptions {
  sources: SourceOptions[]
}

export interface YMLData {
  name: string
  company: string
  url: string
  currencies: Array<{
    id: string
    rate: number | 'CBRF' | 'NBU' | 'NBK' | 'СВ'
  }>
  categories: Array<{
    id: string
    name: string
    parentId?: string
  }>
  offers: Array<{
    id: string
    available: boolean
    url: string
    price: number
    currencyId: string
    categoryId: string
    name: string
    description?: string
    pictures?: string[]
  }>
}

export interface NitroCtx {
  data: YMLData
  options: SourceOptions
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'feed:generate': (ctx: NitroCtx) => Promise<void> | void
  }
}
