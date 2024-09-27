import { ISuccess, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected close: HTMLElement;
	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		if (actions?.onClick) {
			this.close.addEventListener('click', actions.onClick);
		}
	}
	set total(value: string) {
		this.setText(this._total, value);
	}
}
