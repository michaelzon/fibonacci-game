import {createContext} from "react";
import "./modal.css";

const ModalContext = createContext({isOpen: false});

export const Modal = ({isOpen, children}) => {

    return (
        <ModalContext.Provider value={{isOpen}}>
            {isOpen && (
                <div className={"modal"}>
                    {children}
                </div>
            )}
        </ModalContext.Provider>
    )
}

const BigEmoji = ({children}) => {
    return <div className={"modal__big-emoji"}>
        <div className={"modal__emoji-content"}>{children}</div>
    </div>
};

const Header = ({children}) => {
    return <div className={"modal__header"}>
        <h4 className={"modal__header-content"}>{children}</h4>
    </div>
};

const Description = ({children}) => {
    return <div className={"modal__description"}>
        <p className={"modal__description-content"}>{children}</p>
    </div>
};

const Body = ({children}) => {
    return <div className={"modal__body"}>
        <p className={"modal__body-content"}>{children}</p>
    </div>
};

const Footer = ({children, handleClose}) => {
    return <div className={"modal__footer"}>
        <div className={"modal__footer-content"}>
            <button className={"modal__button"} onClick={handleClose}>{children}</button>
        </div>
    </div>
};

Modal.BigEmoji = BigEmoji;
Modal.Header = Header;
Modal.Description = Description;
Modal.Body = Body;
Modal.Footer = Footer;