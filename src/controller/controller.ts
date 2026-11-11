import type { Controller, Value, ViewProps } from '@tweakpane/core'
import { FilePluginView } from '../view/view'

type Config = {
	filetypes?: string[]
	invalidFiletypeMessage: string
	lineCount: number
	value: Value<File | null>
	viewProps: ViewProps
}

export class FilePluginController implements Controller<FilePluginView> {
	public readonly value: Value<File | null>

	public readonly view: FilePluginView
	public readonly viewProps: ViewProps

	private readonly config: Config

	constructor(doc: Document, config: Config) {
		this.value = config.value
		this.viewProps = config.viewProps
		this.view = new FilePluginView(doc, {
			filetypes: config.filetypes,
			invalidFiletypeMessage: config.invalidFiletypeMessage,
			lineCount: config.lineCount,
			value: config.value,
			viewProps: this.viewProps,
		})
		this.config = config

		// Bind event handlers
		this.onFile = this.onFile.bind(this)
		this.onDrop = this.onDrop.bind(this)
		this.onDragOver = this.onDragOver.bind(this)
		this.onDragLeave = this.onDragLeave.bind(this)
		this.onDeleteClick = this.onDeleteClick.bind(this)

		this.view.input.addEventListener('change', this.onFile)
		this.view.element.addEventListener('drop', this.onDrop)
		this.view.element.addEventListener('dragover', this.onDragOver)
		this.view.element.addEventListener('dragleave', this.onDragLeave)
		this.view.clearButton.addEventListener('click', this.onDeleteClick)

		this.value.emitter.on('change', () => {
			this.handleValueChange()
		})

		// Dispose event handlers
		this.viewProps.handleDispose(() => {
			this.view.input.removeEventListener('change', this.onFile)
			this.view.element.removeEventListener('drop', this.onDrop)
			this.view.element.removeEventListener('dragover', this.onDragOver)
			this.view.element.removeEventListener('dragleave', this.onDragLeave)
			this.view.clearButton.removeEventListener('click', this.onDeleteClick)
		})
	}

	/**
	 * Called when the value (bound to the controller) changes (e.g. when the file
	 * is selected).
	 */
	private handleValueChange() {
		const fileObject = this.value.rawValue

		const containerElement = this.view.container
		const textElement = this.view.text
		const fileIconElement = this.view.fileIcon
		const { clearButton } = this.view

		if (fileObject) {
			// Setting the text of the file to the element
			textElement.textContent = fileObject.name

			// Removing icon and adding text
			containerElement.append(textElement)
			if (containerElement.contains(fileIconElement)) {
				fileIconElement.remove()
			}

			// Resetting warning text
			this.view.warning.style.display = 'none'

			// Adding button to delete
			clearButton.style.display = 'block'
			containerElement.style.border = 'unset'
		} else {
			// Setting the text of the file to the element
			textElement.textContent = ''

			// Removing text and adding icon
			containerElement.append(fileIconElement)
			textElement.remove()

			// Resetting warning text
			this.view.warning.style.display = 'none'

			// Hiding button and resetting border
			clearButton.style.display = 'none'
			containerElement.style.border = '1px dashed #717070'
		}
	}

	/**
	 * Checks if the file is valid with the given filetypes.
	 *
	 * @param file File object
	 *
	 * @returns True if the file is valid.
	 */
	private isFileValid(file: File): boolean {
		const { filetypes } = this.config
		const fileExtension = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
		return !filetypes || filetypes.length === 0 || filetypes.includes(fileExtension)
	}

	/**
	 * Event handler when the delete HTML button is clicked. It resets the
	 * `rawValue` of the controller.
	 */
	private onDeleteClick() {
		const file = this.value.rawValue

		if (!file) {
			return
		}

		// Resetting the value
		this.value.setRawValue(null)

		// Resetting the input
		this.view.input.value = ''

		// Resetting the warning text
		this.view.warning.style.display = 'none'
	}

	/**
	 * Called when the user leaves the container while dragging. Updates the style
	 * of the container.
	 */
	private onDragLeave() {
		this.view.changeDraggingState(false)
	}

	/**
	 * Called when the user drags over a file. Updates the style of the container.
	 *
	 * @param event Drag event.
	 */
	private onDragOver(event: Event) {
		event.preventDefault()
		this.view.changeDraggingState(true)
	}

	/**
	 * Called when the user drops a file in the container. Either shows a warning
	 * if it's invalid or updates the value if it's valid.
	 *
	 * @param event Drag event.
	 */
	private onDrop(event: DragEvent) {
		try {
			if (!(event instanceof DragEvent)) {
				return
			}

			event.preventDefault()
			const files = event.dataTransfer?.files
			if (files?.length !== 1) {
				return
			}

			const file = files.item(0)
			if (!file) {
				return
			}

			if (this.isFileValid(file)) {
				this.value.setRawValue(file)
			} else {
				this.showWarning()
			}
		} finally {
			this.view.changeDraggingState(false)
		}
	}

	/**
	 * Called when the value of the input changes.
	 *
	 * @param _event Change event.
	 */
	private onFile(_event: Event): void {
		const file = this.view.input.files?.item(0)
		if (!file) {
			return
		}

		if (this.isFileValid(file)) {
			this.value.setRawValue(file)
		} else {
			this.showWarning()
		}
	}

	/**
	 * Shows warning text for 5 seconds.
	 */
	private showWarning() {
		this.view.warning.style.display = 'block'
		setTimeout(() => {
			// Resetting warning text
			this.view.warning.style.display = 'none'
		}, 5000)
	}
}
