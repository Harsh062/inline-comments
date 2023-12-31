import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';

import './AddedComments.css';
  
const AddedComments = ({ handleCloseCommentsListClick, showAddCommentCard, showAddedComments, addedCommentsList,
   handleSubsequentCommentTextChange, handleSaveSubsequentCommentClick, subsequentCommentText, handleDeleteCommentClick}) => {
    return (
        <div className="addedCommentsWrapper">
        {!showAddCommentCard && showAddedComments && 
          <div className="addedCommentsCardHeader">
            <div className='addedCommentsHeader'>Comments</div>
            <CloseButton className='addedCommentsCloseButton' data-cy="closeCommentsButton" onClick={() => handleCloseCommentsListClick()}/>
          </div>}
      {!showAddCommentCard && showAddedComments && addedCommentsList.map(comment =>{
            return(
              <Card key={comment.commentId} className='commentsCard'>
                <Card.Body>
                  <Card.Text>{comment.commentText}</Card.Text>
                  <Button data-cy="deleteCommentButton" key={comment.commentId} variant="primary" onClick={() => handleDeleteCommentClick(comment.commentId)}>Delete</Button>
                </Card.Body>
              </Card>
            )
          })
        }
        {!showAddCommentCard && showAddedComments &&
          <div>
            <Card className='commentsCard'>
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
  