import {
	Controller,
	PointerHandler,
	PointerHandlerEvent,
	Value,
	ViewProps,
} from '@tweakpane/core';

import {FilePluginView} from '../view/view.js';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number;
	filetypes?: string[];
}

export class FilePluginController implements Controller<FilePluginView> {
	public readonly value: Value<File | null>;
	public readonly view: FilePluginView;
	public readonly viewProps: ViewProps;

	private readonly config: Config;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.view = new FilePluginView(doc, {
			viewProps: this.viewProps,
			value: config.value,
			lineCount: config.lineCount,
			filetypes: config.filetypes,
		});
		this.config = config;

		this.onFile = this.onFile.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDeleteClick = this.onDeleteClick.bind(this);

		this.view.input.addEventListener('change', this.onFile);
		this.view.element.addEventListener('drop', this.onDrop);
		this.view.element.addEventListener('dragover', this.onDragOver);
		this.view.element.addEventListener('dragleave', this.onDragLeave);
		this.view.deleteButton.addEventListener('click', this.onDeleteClick);

		this.viewProps.handleDispose(() => {
			this.view.input.removeEventListener('change', this.onFile);
			this.view.element.removeEventListener('drop', this.onDrop);
			this.view.element.removeEventListener('dragover', this.onDragOver);
			this.view.element.removeEventListener('dragleave', this.onDragLeave);
		});

		this.value.emitter.on('change', () => this.handleValueChange());
	}

	private onFile(event: Event): void {
		const input = this.view.input;
		const filetypes = this.config.filetypes;

		// Check if user has chosen a file
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			if (!this.isFileValid(file)) {
				this.showWarning();
			} else {
				this.value.setRawValue(file);
			}
		}
	}

	private showWarning() {
		this.view.warning.style.display = 'block';
		this.view.warning.innerHTML = 'Unaccepted file type.';
		setTimeout(() => {
			// Resetting warning text
			this.view.warning.innerHTML = '';
			this.view.warning.style.display = 'none';
		}, 5000);
	}

	private isFileValid(file: File): boolean {
		const filetypes = this.config.filetypes;
		const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
		return !(
			filetypes &&
			filetypes.length > 0 &&
			!filetypes.includes(fileExtension) &&
			fileExtension
		);
	}

	private onDeleteClick() {
		const file = this.value.rawValue;

		if (file) {
			// Resetting the value
			this.value.setRawValue(null);

			// Resetting the input
			this.view.input.value = '';

			// Resetting the warning text
			this.view.warning.innerHTML = '';
			this.view.warning.style.display = 'none';
		}
	}

	private onDragOver(event: Event) {
		event.preventDefault();
		this.view.changeDraggingState(true);
	}

	private onDragLeave() {
		this.view.changeDraggingState(false);
	}

	private onDrop(ev: DragEvent) {
		if (ev instanceof DragEvent) {
			// Prevent default behavior (Prevent file from being opened)
			ev.preventDefault();

			if (ev.dataTransfer) {
				if (ev.dataTransfer.files) {
					// We only change the value if the user has dropped a single file
					const filesArray = [ev.dataTransfer.files][0];
					if (filesArray.length == 1) {
						const file = filesArray.item(0);
						if (file) {
							if (!this.isFileValid(file)) {
								this.showWarning();
							} else {
								this.value.setRawValue(file);
							}
						}
					}
				}
			}
		}
		this.view.changeDraggingState(false);
	}

	private handleValueChange() {
		const fileObj = this.value.rawValue;

		let containerEl = this.view.container;
		let textEl = this.view.text;
		let fileIconEl = this.view.fileIcon;
		let deleteButton = this.view.deleteButton;

		if (fileObj) {
			// Setting the text of the file to the element
			textEl.textContent = fileObj.name;

			// Removing icon and adding text
			containerEl.appendChild(textEl);
			if (containerEl.contains(fileIconEl)) {
				containerEl.removeChild(fileIconEl);
			}

			// Resetting warning text
			this.view.warning.innerHTML = '';
			this.view.warning.style.display = 'none';

			// Adding button to delete
			deleteButton.style.display = 'block';
			containerEl.style.border = 'unset';
		} else {
			// Setting the text of the file to the element
			textEl.textContent = '';

			// Removing text and adding icon
			containerEl.appendChild(fileIconEl);
			containerEl.removeChild(textEl);

			// Resetting warning text
			this.view.warning.innerHTML = '';
			this.view.warning.style.display = 'none';

			// Hiding button and resetting border
			deleteButton.style.display = 'none';
			containerEl.style.border = '1px dashed #717070';
		}
	}
}
