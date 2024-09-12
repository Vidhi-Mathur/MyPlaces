import { createPortal } from 'react-dom';
import './Backdrop.css';

const Backdrop = ({onClick}) => {
  const close = <div className="backdrop" onClick={onClick} />
  return createPortal(close, document.getElementById('backdrop-hook'));
};

export default Backdrop;
