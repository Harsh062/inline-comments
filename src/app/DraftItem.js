import { useRouter } from "next/navigation";
import React from "react";
import Button from 'react-bootstrap/Button';

const DraftItem = ({ draftId, draftTitle, draftContent, discardDraft }) => {
  const router = useRouter();

  const loadDraftDetails = (draftId) => {
    router.push(`/drafts/${draftId}`);
 };

  return (
    <div key={draftId}>
      <div>
        <div>{draftTitle}</div>
        <div>{draftContent}</div>
      </div>
      <div>
      <Button onClick={() => loadDraftDetails(draftId)} variant="primary">Edit</Button>
      <Button  onClick={() => discardDraft(id)} variant="danger">Discard</Button>
      </div>
    </div>
  );
};

export default DraftItem;
