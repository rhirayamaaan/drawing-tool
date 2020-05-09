import React from 'react';
import ReactDOM from 'react-dom';
import 'ress';
import DrawingCanvas from './modules/DrawingCanvas';
import Header from './modules/Header';
import './lib/styles/reset.scss';
import styles from './App.scss';

const NAMESPACE = 'app';

const App = () => (
  <div className={styles[NAMESPACE]}>
    <Header>Drawing Tool For Testing Moving Average</Header>
    <DrawingCanvas />
  </div>
);

ReactDOM.render(<App />, document.getElementById('App'));
