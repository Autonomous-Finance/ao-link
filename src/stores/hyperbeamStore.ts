import { atom } from 'nanostores'

export const $hyperbeamData = atom({
  keys: null as string[] | null,
  values: {} as Record<string, any>,
  lastFetched: 0,
})
