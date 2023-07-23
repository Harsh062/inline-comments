import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';

import './AddComment.css';
  
const AddComment = ({ handleCloseCommentCardClick, handleFirstCommentTextChange, firstCommentText, handleSaveFirstCommentClick}) => {
    return (
    <div className="addCommentWrapper">
        <div className="headerWrapper">
          <div className='addCommentHeader'>Add a comment</div>
          <CloseButton data-cy="closeCommentButton" onClick={() => handleCloseCommentCardClick(false)}/>
        </div>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control data-cy="addCommentTextBox" as="textarea" onChange={(e) => handleFirstCommentTextChange(e)} rows={3} placeholder="Type your comments here..." value={firstCommentText} />
        </Form.Group>
        <div className='saveButtonWrapper'>
          <Button className='saveButton' variant="primary" data-cy="saveFirstCommentButton" onClick={() => handleSaveFirstCommentClick()}>Save</Button>
        </div>
     </div>
    );
};
  
  export default AddComment;
  