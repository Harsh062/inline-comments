import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './DraftEdit.css';
  
const DraftEdit = ({ activeDraft, handleSaveDraftClick, editableHtml, editorRef, handleCancelDraftClick}) => {
    return (
    <div className="editDraftWrapper">
        <div className="headerWrapper">
          <div className="draftTitle">{activeDraft.draftTitle}</div>
          <div>
          <Button style={{"margin-right": "7px"}} data-cy="cancelEditDraftButton" variant="primary" onClick={() => handleCancelDraftClick()}>Cancel</Button>
            <Button style={{"margin-right": "7px"}} data-cy="saveDraftButton" variant="primary" onClick={() => handleSaveDraftClick()}>Save</Button>
          </div>
        </div>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <div  className="editArea" data-cy="editableHtmlDiv"  ref={editorRef} contentEditable="true"  dangerouslySetInnerHTML={{__html: editableHtml}}/>
        </Form.Group>
     </div>
    );
};
  
  export default DraftEdit;
  