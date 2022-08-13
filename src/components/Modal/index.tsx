import React, { PropsWithChildren } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
  },
};

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const ReactModal: React.FC<PropsWithChildren<IProps>> = ({ open, setOpen, children }) => (
  <Modal
    isOpen={open}
    style={customStyles}
  >
    {children}
  </Modal>
);

export default ReactModal;
