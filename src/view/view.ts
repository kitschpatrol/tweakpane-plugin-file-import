import type { Value, View, ViewProps } from '@tweakpane/core'
import { ClassName } from '@tweakpane/core'

type Config = {
	filetypes?: string[]
	invalidFiletypeMessage: string
	lineCount: number
	value: Value<File | null>
	viewProps: ViewProps
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const containerClassName = ClassName('ctn')
const inputClassName = ClassName('input')
const buttonClassName = ClassName('btn')

export class FilePluginView implements View {
	public clearButton: HTMLButtonElement

	public readonly container: HTMLElement

	public readonly element: HTMLElement
	public fileIcon: HTMLElement
	public input: HTMLInputElement
	public text: HTMLSpanElement
	public warning: HTMLSpanElement

	constructor(doc: Document, config: Config) {
		// Root
		this.element = doc.createElement('div')

		// Container
		this.container = doc.createElement('div')
		this.container.classList.add(containerClassName())
		config.viewProps.bindClassModifiers(this.container)

		// File input field
		this.input = doc.createElement('input')
		this.input.classList.add(inputClassName())
		this.input.setAttribute('type', 'file')
		this.input.setAttribute('accept', config.filetypes ? config.filetypes.join(',') : '*')
		this.input.style.height = `calc(20px * ${config.lineCount})`

		// Icon
		this.fileIcon = doc.createElement('div')
		this.fileIcon.classList.add(containerClassName('icon'))

		// Text
		this.text = doc.createElement('span')
		this.text.classList.add(containerClassName('text'))

		// Warning text
		this.warning = doc.createElement('span')
		this.warning.classList.add(containerClassName('warning'))
		this.warning.textContent = config.invalidFiletypeMessage
		this.warning.style.display = 'none'

		// Delete button
		this.clearButton = doc.createElement('button')
		this.clearButton.classList.add(buttonClassName('b'))
		this.clearButton.textContent = 'Delete'
		this.clearButton.style.display = 'none'

		this.container.append(this.input)
		this.container.append(this.fileIcon)
		this.element.append(this.container)
		this.element.append(this.warning)
		this.element.append(this.clearButton)
	}

	/**
	 * Changes the style of the container based on whether the user is dragging or
	 * not.
	 *
	 * @param state If the user is dragging or not.
	 */
	changeDraggingState(state: boolean) {
		if (state) {
			this.container.classList.add(containerClassName('input_area_dragging'))
		} else {
			this.container.classList.remove(containerClassName('input_area_dragging'))
		}
	}
}
