import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './DraftEdit.css';
  
const DraftEdit = ({ activeDraft, handleSaveDraftClick, editableHtml, editorRef}) => {
    return (
    <div className="editDraftWrapper">
        <div className="headerWrapper">
          <div className="draftTitle">{activeDraft.draftTitle}</div>
          <Button variant="primary" onClick={() => handleSaveDraftClick()}>Save</Button>
        </div>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <div  ref={editorRef} contentEditable="true"  dangerouslySetInnerHTML={{__html: editableHtml}}/>
        </Form.Group>
     </div>
    );
};
  
  export default DraftEdit;
  