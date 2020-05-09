import React, { FC, FormEvent } from 'react';
import styles from './styles.scss';

const NAMESPACE = 'textField';

interface TextFieldProps {
  defaultValue?: string;
  label?: string;
  className?: string;
  onInput?: (event: FormEvent) => void;
}

const TextField: FC<TextFieldProps> = ({ defaultValue, label, className, onInput }) => (
  <label className={[styles[`${NAMESPACE}`], className].join(' ').trim()}>
    {label ? <span className={styles[`${NAMESPACE}__label`]}>{label}</span> : null}
    <input type="text" onInput={onInput} defaultValue={defaultValue} className={styles[`${NAMESPACE}__input`]} />
  </label>
);

export default TextField;
