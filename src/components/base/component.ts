export abstract class Component<T> {
	constructor(protected container: HTMLElement) {}
	tgClass(element: HTMLElement, className: string, isAdd?: boolean) {
		element.classList.toggle(className, isAdd);
	}
	protected setText(element: HTMLElement, text: string) {
		if (element) {
			element.textContent = text;
		}
	}
	disable(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}
	protected hide(element: HTMLElement) {
		element.style.display = 'none';
	}
	protected show(element: HTMLElement) {
		element.style.removeProperty('display');
	}
	protected IMG(element: HTMLElement, src: string, alt?: string) {
		if (element) {
			element.setAttribute('src', src);
			if (alt) {
				element.setAttribute('alt', alt);
			}
		}
	}
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});

		return this.container;
	}
}
