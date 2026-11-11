import type { BaseInputParams, BindingTarget, InputBindingPlugin } from '@tweakpane/core'
import { CompositeConstraint, createPlugin, parseRecord } from '@tweakpane/core'
import { FilePluginController } from './controller/controller'

export type PluginInputParams = BaseInputParams & {
	filetypes?: string[]
	invalidFiletypeMessage?: string
	lineCount?: number
	view: 'file-input'
}

function readFile(exValue: unknown): File | null {
	return exValue instanceof File ? exValue : null
}

function writeFile(target: BindingTarget, inValue: File | null): void {
	target.write(inValue)
}

export const TweakpaneFileInputPlugin: InputBindingPlugin<File | null, string, PluginInputParams> =
	createPlugin({
		accept(exValue: unknown, params: Record<string, unknown>) {
			if (typeof exValue !== 'string') {
				// Return null to deny the user input
				return null
			}

			// Parse parameters object
			const result = parseRecord<PluginInputParams>(params, (p) => ({
				filetypes: p.optional.array(p.required.string),
				invalidFiletypeMessage: p.optional.string,
				lineCount: p.optional.number,
				// `view` option may be useful to provide a custom control for primitive values
				view: p.required.constant('file-input'),
			}))
			if (!result) {
				return null
			}

			// Return a typed value and params to accept the user input
			return {
				initialValue: exValue,
				params: result,
			}
		},
		binding: {
			constraint(_args) {
				return new CompositeConstraint([])
			},
			reader(_args) {
				return readFile
			},
			writer(_args) {
				return writeFile
			},
		},
		controller(args) {
			const defaultNumberOfLines = 3
			const defaultFiletypeWarningText = 'Unaccepted file type.'

			// Create a controller for the plugin
			return new FilePluginController(args.document, {
				filetypes: args.params.filetypes,
				invalidFiletypeMessage: args.params.invalidFiletypeMessage ?? defaultFiletypeWarningText,
				lineCount: args.params.lineCount ?? defaultNumberOfLines,
				value: args.value,
				viewProps: args.viewProps,
			})
		},
		id: 'file-input',
		// Type: The plugin type.
		type: 'input',
	})
