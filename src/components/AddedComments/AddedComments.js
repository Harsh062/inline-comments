import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';

import './AddedComments.css';
  
const AddedComments = ({ handleCloseCommentsListClick, showAddCommentCard, showAddedComments, addedCommentsList, handleSubsequentCommentTextChange, handleSaveSubsequentCommentClick, subsequentCommentText}) => {
    return (
        <div className="addedCommentsWrapper">
        {!showAddCommentCard && showAddedComments && 
        <div>
          <Card>
            <Card.Body className="addedCommentsCardHeader">
              <Card.Title>Comments</Card.Title>
              <CloseButton data-cy="closeCommentsButton" onClick={() => handleCloseCommentsListClick()}/>
            </Card.Body>
          </Card>
        </div>}
      {!showAddCommentCard && showAddedComments && addedCommentsList.map(comment =>{
            return(
              <Card key={comment.commentId}>
                <Card.Body>
                  <Card.Text key={comment.commentId}>{comment.commentText}</Card.Text>
                </Card.Body>
              </Card>
            )
          })
        }
        {!showAddCommentCard && showAddedComments &&
          <div>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Control data-cy="addCommentsToThreadTextBox" as="textarea" rows={3} placeholder="Reply" onChange={(e) => handleSubsequentCommentTextChange(e)} value={subsequentCommentText} />
                </Form.Group>
                <div>
                  <Button data-cy="saveSubsequentCommentsButton" variant="primary" onClick={() => handleSaveSubsequentCommentClick()}>Save</Button>
                </div>
              </Card.Body>
          </Card>
          </div>}
      </div>
    );
};
  
  export default AddedComments;
  