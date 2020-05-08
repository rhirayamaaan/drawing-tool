import styles from './styles.scss';

interface TextFieldProps {
  defaultValue?: string;
  label?: string;
  className?: string;
  onInput?: (event: Event) => void;
}

export default class TextField {
  private static NAMESPACE = 'textField';

  private _rootDOM: HTMLLabelElement;
  private _labelDOM: HTMLSpanElement | null;
  private _inputDOM: HTMLInputElement;

  public get Element() {
    return this._rootDOM;
  }

  constructor({ defaultValue = '', label, className = '', onInput }: TextFieldProps) {
    this._rootDOM = document.createElement('label');
    this._rootDOM.classList.add(styles[TextField.NAMESPACE]);
    if (className.length > 0) {
      this._rootDOM.classList.add(className);
    }

    this._labelDOM = typeof label !== 'undefined' ? document.createElement('span') : null;

    if (this._labelDOM !== null) {
      this._labelDOM.classList.add(styles.textField__label);
      this._labelDOM.innerHTML = label || '';
      this._labelDOM.classList.add(styles[`${TextField.NAMESPACE}__label`]);

      this._rootDOM.appendChild(this._labelDOM);
    }

    this._inputDOM = document.createElement('input');
    this._inputDOM.classList.add(styles[`${TextField.NAMESPACE}__input`]);
    this._inputDOM.setAttribute('value', defaultValue);

    if (typeof onInput !== 'undefined') {
      this._inputDOM.addEventListener('input', onInput);
    }

    this._rootDOM.appendChild(this._inputDOM);

    return this;
  }
}
