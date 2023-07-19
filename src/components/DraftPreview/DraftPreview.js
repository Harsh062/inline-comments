import Button from 'react-bootstrap/Button';
import './DraftPreview.css';
  
const DraftPreview = ({ activeDraft, handleEditDraftClick, handleMouseUpOverDraftContent, previewHtml}) => {
    return (
    <div className="draftPreviewWrapper">
        <div className="headerWrapper">
          <div className="draftTitle">{activeDraft.draftTitle}</div>
          <Button data-cy="editDraftButton" variant="primary" onClick={() => handleEditDraftClick(activeDraft)}>Edit</Button>
        </div>
        <div data-draftid={activeDraft.draftId} data-cy={activeDraft.draftId} className="draftContent" onMouseUp={(event) => handleMouseUpOverDraftContent(event)}  dangerouslySetInnerHTML={{__html: previewHtml}}/>
    </div>
    );
};
  
  export default DraftPreview;
  