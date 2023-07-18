import Button from 'react-bootstrap/Button';
import './DraftPreview.css';
  
const DraftPreview = ({ activeDraft, handleEditDraftClick, handleSelectionChange, handleMouseUpOverDraftContent, previewHtml}) => {
    return (
    <div className="draftPreviewWrapper">
        <div className="headerWrapper">
          <div className="draftTitle">{activeDraft.draftTitle}</div>
          <Button data-cy="editDraftButton" variant="primary" onClick={() => handleEditDraftClick(activeDraft)}>Edit</Button>
        </div>
        <div data-cy="previewHtmlDiv" id="draftContent" className="draftContent" onselectionchange={(event) => handleSelectionChange(event)} onMouseUp={(event) => handleMouseUpOverDraftContent(event)}  dangerouslySetInnerHTML={{__html: previewHtml}}/>
    </div>
    );
};
  
  export default DraftPreview;
  