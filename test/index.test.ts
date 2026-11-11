import { Pane } from 'tweakpane'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as plugin from '../src/index'
import { TweakpaneFileInputPlugin } from '../src/plugin'

const draggingClass = 'tp-ctnv_input_area_dragging'

function createFileList(files: File[]): FileList {
	return Object.assign(new FileList(), files)
}

function createDropEvent(files?: File[]): Event {
	const event = new DragEvent('drop', { bubbles: true, cancelable: true })
	if (files) {
		Object.defineProperty(event, 'dataTransfer', { value: { files: createFileList(files) } })
	}

	return event
}

function displayedFileName(container: HTMLElement): string | undefined {
	return container.querySelector('.tp-ctnv_text')?.textContent
}

function createPng(name = 'a.png'): File {
	return new File(['png'], name, { type: 'image/png' })
}

describe('file input plugin', () => {
	let pane: Pane | undefined

	afterEach(() => {
		pane?.dispose()
		vi.useRealTimers()
	})

	function setup(options: Record<string, unknown> = {}) {
		pane = new Pane()
		pane.registerPlugin(plugin)
		const params: { file: unknown } = { file: '' }
		const binding = pane.addBinding(params, 'file', { view: 'file-input', ...options })
		const container = binding.element.querySelector<HTMLElement>('.tp-ctnv')
		const input = binding.element.querySelector('input')
		const button = binding.element.querySelector('button')
		const warning = binding.element.querySelector<HTMLElement>('.tp-ctnv_warning')
		if (!container || !input || !button || !warning) {
			throw new Error('The file input view was not created')
		}

		const changes: Array<{ last: boolean; value: unknown }> = []
		binding.on('change', (event) => {
			changes.push({ last: event.last, value: event.value })
		})

		const selectFiles = (files: File[]) => {
			input.files = createFileList(files)
			input.dispatchEvent(new Event('change', { bubbles: true }))
		}

		return {
			binding,
			button,
			changes,
			container,
			input,
			pane,
			params,
			selectFiles,
			warning,
		}
	}

	it('accepts only strings with the requested view and valid options', () => {
		expect(TweakpaneFileInputPlugin.accept('', { view: 'file-input' })?.initialValue).toBe('')
		expect(
			TweakpaneFileInputPlugin.accept('', {
				filetypes: ['.png', '.jpg'],
				invalidFiletypeMessage: 'Nope',
				lineCount: 5,
				view: 'file-input',
			})?.params,
		).toMatchObject({ filetypes: ['.png', '.jpg'], invalidFiletypeMessage: 'Nope', lineCount: 5 })
		expect(TweakpaneFileInputPlugin.accept(42, { view: 'file-input' })).toBeNull()
		expect(TweakpaneFileInputPlugin.accept(createPng(), { view: 'file-input' })).toBeNull()
		expect(TweakpaneFileInputPlugin.accept('', {})).toBeNull()
		expect(TweakpaneFileInputPlugin.accept('', { view: 'text' })).toBeNull()
		expect(
			TweakpaneFileInputPlugin.accept('', { filetypes: '.png', view: 'file-input' }),
		).toBeNull()
		expect(TweakpaneFileInputPlugin.accept('', { filetypes: [1], view: 'file-input' })).toBeNull()
		expect(TweakpaneFileInputPlugin.accept('', { lineCount: '3', view: 'file-input' })).toBeNull()
		expect(
			TweakpaneFileInputPlugin.accept('', { invalidFiletypeMessage: 1, view: 'file-input' }),
		).toBeNull()
	})

	it('registers the bundle and installs its compiled styles', () => {
		setup()
		expect(plugin.css).toContain('.tp-ctnv')
		expect(plugin.css).not.toContain('@use')
		expect(document.head.textContent).toContain('.tp-ctnv')
	})

	it('renders an empty drop area configured by its params', () => {
		const { button, container, input, warning } = setup({
			filetypes: ['.png', '.jpg'],
			invalidFiletypeMessage: 'Images only',
			lineCount: 4,
		})
		expect(input.type).toBe('file')
		expect(input.accept).toBe('.png,.jpg')
		expect(input.style.height).toBe('calc(20px * 4)')
		expect(container.querySelector('.tp-ctnv_icon')).not.toBeNull()
		expect(displayedFileName(container)).toBeUndefined()
		expect(button.style.display).toBe('none')
		expect(warning.textContent).toBe('Images only')
		expect(warning.style.display).toBe('none')
	})

	it('uses default params when none are given', () => {
		const { input, warning } = setup()
		expect(input.accept).toBe('*')
		expect(input.style.height).toBe('calc(20px * 3)')
		expect(warning.textContent).toBe('Unaccepted file type.')
	})

	it('writes a file chosen with the file input and emits a final change', () => {
		const { button, changes, container, params, selectFiles } = setup()
		const file = createPng()
		selectFiles([file])
		expect(params.file).toBe(file)
		expect(changes).toEqual([{ last: true, value: file }])
		expect(displayedFileName(container)).toBe('a.png')
		expect(container.querySelector('.tp-ctnv_icon')).toBeNull()
		expect(button.style.display).toBe('block')
	})

	it('ignores a file input change without files', () => {
		const { changes, params, selectFiles } = setup()
		selectFiles([])
		expect(params.file).toBe('')
		expect(changes).toEqual([])
	})

	it('shows the warning for five seconds when the file input gets an unaccepted type', () => {
		vi.useFakeTimers()
		const { changes, params, selectFiles, warning } = setup({ filetypes: ['.jpg'] })
		selectFiles([createPng()])
		expect(params.file).toBe('')
		expect(changes).toEqual([])
		expect(warning.style.display).toBe('block')
		vi.advanceTimersByTime(4999)
		expect(warning.style.display).toBe('block')
		vi.advanceTimersByTime(1)
		expect(warning.style.display).toBe('none')
	})

	it('matches filetypes by case-insensitive extension', () => {
		const { params, selectFiles, warning } = setup({ filetypes: ['.png'] })
		const upperCase = createPng('PHOTO.PNG')
		selectFiles([upperCase])
		expect(params.file).toBe(upperCase)

		selectFiles([new File(['text'], 'readme', { type: 'text/plain' })])
		expect(params.file).toBe(upperCase)
		expect(warning.style.display).toBe('block')
	})

	it('accepts any file when filetypes is empty', () => {
		const { params, selectFiles } = setup({ filetypes: [] })
		const file = new File(['text'], 'notes.txt', { type: 'text/plain' })
		selectFiles([file])
		expect(params.file).toBe(file)
	})

	it('toggles the dragging state while a file is dragged over the drop area', () => {
		const { container } = setup()
		const dragOver = new DragEvent('dragover', { bubbles: true, cancelable: true })
		container.dispatchEvent(dragOver)
		expect(dragOver.defaultPrevented).toBe(true)
		expect(container.classList.contains(draggingClass)).toBe(true)
		container.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
		expect(container.classList.contains(draggingClass)).toBe(false)
	})

	it('writes a dropped file and clears the dragging state', () => {
		const { changes, container, params } = setup({ filetypes: ['.png'] })
		container.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true }))
		const file = createPng()
		const drop = createDropEvent([file])
		container.dispatchEvent(drop)
		expect(drop.defaultPrevented).toBe(true)
		expect(params.file).toBe(file)
		expect(changes).toEqual([{ last: true, value: file }])
		expect(displayedFileName(container)).toBe('a.png')
		expect(container.classList.contains(draggingClass)).toBe(false)
	})

	it('shows the warning for a dropped file with an unaccepted type', () => {
		const { changes, container, params, warning } = setup({ filetypes: ['.jpg'] })
		container.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true }))
		container.dispatchEvent(createDropEvent([createPng()]))
		expect(params.file).toBe('')
		expect(changes).toEqual([])
		expect(warning.style.display).toBe('block')
		expect(container.classList.contains(draggingClass)).toBe(false)
	})

	it('ignores drops with several files or no files', () => {
		const { changes, container, params, warning } = setup()
		for (const drop of [
			createDropEvent([createPng('a.png'), createPng('b.png')]),
			createDropEvent([]),
			createDropEvent(),
		]) {
			container.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true }))
			container.dispatchEvent(drop)
			expect(container.classList.contains(draggingClass)).toBe(false)
		}

		expect(params.file).toBe('')
		expect(changes).toEqual([])
		expect(warning.style.display).toBe('none')
	})

	it('clears the value when the delete button is clicked', () => {
		const { button, changes, container, input, params, selectFiles } = setup()
		const file = createPng()
		selectFiles([file])
		button.click()
		expect(params.file).toBeNull()
		expect(input.value).toBe('')
		expect(changes).toEqual([
			{ last: true, value: file },
			{ last: true, value: null },
		])
		expect(displayedFileName(container)).toBeUndefined()
		expect(container.querySelector('.tp-ctnv_icon')).not.toBeNull()
		expect(button.style.display).toBe('none')
	})

	it('ignores the delete button when no file is set', () => {
		const { button, changes, params } = setup()
		button.click()
		expect(params.file).toBe('')
		expect(changes).toEqual([])
	})

	it('refreshes when the bound value changes externally', () => {
		const { binding, button, container, params } = setup()
		const file = createPng('external.png')
		params.file = file
		binding.refresh()
		expect(displayedFileName(container)).toBe('external.png')
		expect(button.style.display).toBe('block')

		params.file = ''
		binding.refresh()
		expect(displayedFileName(container)).toBeUndefined()
		expect(button.style.display).toBe('none')
	})

	it('inherits the pane disabled state', () => {
		const { container, pane: currentPane } = setup()
		currentPane.disabled = true
		expect(container.classList.contains('tp-v-disabled')).toBe(true)
		currentPane.disabled = false
		expect(container.classList.contains('tp-v-disabled')).toBe(false)
	})

	it('removes listeners when the binding is disposed', () => {
		const { binding, button, container, params, selectFiles } = setup()
		const file = createPng()
		selectFiles([file])
		binding.dispose()
		selectFiles([createPng('b.png')])
		container.dispatchEvent(createDropEvent([createPng('c.png')]))
		container.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true }))
		button.click()
		expect(params.file).toBe(file)
		expect(container.classList.contains(draggingClass)).toBe(false)
		expect(binding.element.isConnected).toBe(false)
	})
})
