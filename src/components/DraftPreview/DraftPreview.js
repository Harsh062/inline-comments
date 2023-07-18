import Button from 'react-bootstrap/Button';
import './DraftPreview.css';
  
const DraftPreview = ({ activeDraft, handleEditDraftClick, handleSelectionChange, handleMouseUpOverDraftContent, previewHtml}) => {
    return (
    <div className="draftPreviewWrapper">
        <div className="headerWrapper">
          <div className="draftTitle">{activeDraft.draftTitle}</div>
          <Button variant="primary" onClick={() => handleEditDraftClick(activeDraft)}>Edit</Button>
        </div>
        <div id="draftContent" className="draftContent" onselectionchange={(event) => handleSelectionChange(event)} onMouseUp={(event) => handleMouseUpOverDraftContent(event)}  dangerouslySetInnerHTML={{__html: previewHtml}}/>
    </div>
    );
};
  
  export default DraftPreview;
  