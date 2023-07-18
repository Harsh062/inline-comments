import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';

import './AddComment.css';
  
const AddComment = ({ handleCloseCommentCardClick, handleFirstCommentTextChange, firstCommentText, handleSaveFirstCommentClick}) => {
    return (
    <Card className="addCommentWrapper">
        <Card.Body>
          <div className="headerWrapper">
            <Card.Title>Add a comment</Card.Title>
            <CloseButton data-cy="closeCommentButton" onClick={() => handleCloseCommentCardClick(false)}/>
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control data-cy="addCommentTextBox" as="textarea" onChange={(e) => handleFirstCommentTextChange(e)} rows={3} placeholder="Type your comments here..." value={firstCommentText} />
          </Form.Group>
          <Button variant="primary" data-cy="saveFirstCommentButton" onClick={() => handleSaveFirstCommentClick()}>Save</Button>
        </Card.Body>
     </Card>
    );
};
  
  export default AddComment;
  