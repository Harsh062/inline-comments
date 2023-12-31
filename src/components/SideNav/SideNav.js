import ListGroup from 'react-bootstrap/ListGroup';
import './SideNav.css';
  
const SideNav = ({ renderDraftContent, isLoading, drafts, activeDraftId}) => {
    return (
        <div className="draftSidebarWrapper">
        {!isLoading && 
          drafts.map((draft) => {
            return (
              <ListGroup.Item
                className="listItem"
                data-cy="draftHeaderListItem"
                key={draft.draftId}
                style={{
                  backgroundColor: activeDraftId === draft.draftId ? 'aqua' : 'transparent',
                }}
                onClick={() => renderDraftContent(draft, false)}>{draft.draftTitle}</ListGroup.Item>
            );
          })}
      </div>
    );
};
  
  export default SideNav;
  