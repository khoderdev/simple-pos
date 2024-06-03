import { ModalProps } from "../types/AllTypes";

const ModalDynamic = ({ onClose, children }: ModalProps) => {
    return (
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  };
  
  export default ModalDynamic;
