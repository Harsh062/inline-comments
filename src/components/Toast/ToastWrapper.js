import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import "./ToastWrapper.css";
  
const ToastWrapper = ({ showToast, toastText}) => {
    return (
    <ToastContainer
        className="p-3"
        position="top-end"
        style={{ zIndex: 10000 }}
        data-cy="toastContainer"
      >
        <Toast bg="success" show={showToast} delay={3000} autohide>
          <Toast.Body>{toastText}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
};
  
  export default ToastWrapper;
  