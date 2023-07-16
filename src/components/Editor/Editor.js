import Form from 'react-bootstrap/Form';
  
const Editor = ({ draftId, draftTitle, draftContent}) => {
    console.log(draftId, draftTitle, draftContent, "Inside Editor Screen");
    const handleUpdateDraftClick = () => {

    }
    return (
        <div>
            <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="email" value={draftTitle} placeholder="name@example.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows={3}  value={draftContent}/>
            </Form.Group>
        </Form>
        <div onClick={handleUpdateDraftClick}>
            Save Draft
        </div>
        </div>
    );
};
  
  export default Editor;
  