import { TweakpaneFileInputPlugin } from './plugin'
import pluginCss from './styles/plugin.scss?inline'

// Export your plugin(s) as constant `plugins`
export const id = 'file-input'
export const css: string = pluginCss
export const plugins = [TweakpaneFileInputPlugin]

export type { PluginInputParams } from './plugin'
