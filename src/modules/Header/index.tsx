import React, { ReactNode, FC } from 'react';
import styles from './styles.scss';

const NAMESPACE = 'header';

interface HeaderProps {
  className?: string;
  children: ReactNode;
}

const Header: FC<HeaderProps> = ({ className, children }) => (
  <h1 className={[styles[`${NAMESPACE}`], className].join(' ').trim()}>{children}</h1>
);

export default Header;
