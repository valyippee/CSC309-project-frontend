import Modal from 'react-bootstrap/Modal';
import './NoticeModal.css';

function NoticeModal(props) {

  return (
    <>
      <Modal show={props.showModal} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body id='modalMessage'>{props.message}</Modal.Body>
        <div className='modalButtons'>
          <button
            id='cancelButton'
            className="btn btn-lg btn-primary"
            onClick={props.onHide}>
            Cancel
          </button>
          <button 
            id='confirmButton'
            className="btn btn-lg btn-primary"
            color='#403E56'
            onClick={props.onConfirm}>
          {props.buttonText}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default NoticeModal;