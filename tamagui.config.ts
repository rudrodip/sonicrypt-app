import { config as configBase } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'
import Colors from './constants/Colors'

export const config = createTamagui({
  ...configBase,
  themes: Colors,
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
