import { useRef } from "react";
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import Backdrop from "./Backdrop";
import './Backdrop.css'
import './Modal.css'

const ModalOverlay = ({className, style, headerClass, header, onSubmit, contentClass, footer, footerClass, children}) => {
    const modalRef = useRef();
    const content = (
        <div className={`modal ${className}`} style={style} ref={modalRef}>
            <header className={`modal__header ${headerClass}`}>
                <h2>{header}</h2>
            </header>
            <form onSubmit={onSubmit ? onSubmit: event => event.preventDefault()}>
                <div className={`modal__content ${contentClass}`}>
                    {children}
                </div>
                <footer className={`modal__footer ${footerClass}`}>
                    {footer}
                </footer>
            </form>
        </div>
    )
    return createPortal(content, document.getElementById('modal-hook'));
}

const Modal = ({show, onCancel, ...props})=> {
    return (
        <>
        {show && <Backdrop onClick={onCancel}/>}
        <CSSTransition in={show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
                <ModalOverlay {...props}/>
        </CSSTransition>
        </>
    )
}

export default Modal