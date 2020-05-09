import React, { ReactNode, MouseEvent, FC } from 'react';
import styles from './styles.scss';

const NAMESPACE = 'button';

interface ButtonProps {
  className?: string;
  onClick?: (event: MouseEvent) => void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ className = '', onClick, children }) => (
  <button className={[styles[NAMESPACE], className].join(' ').trim()} onClick={onClick}>
    {children}
  </button>
);

export default Button;
