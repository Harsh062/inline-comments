"use client"; // This is a client component 👈🏽
import React, { useEffect, useState, useRef } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';

import styles from './globals.module.css';
import LoadingSpinner from "./LoadingSpinner";
import { getAllDrafts, updateDraft, generateCommentThreadId, addCommentToThread, getCommentsForThreadId } from "./draftsStore";

export default function Home() {
  const [isLoading, setLoading]  = useState(false);
  const [showAddedComments, setShowAddedComments] = useState(false);
  const [addedCommentsList, setAddedCommentsList] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCommentThreadId, setActiveCommentThreadId] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [mutatedDraftContentToBeUpdated, setMutatedDraftContentToBeUpdated] = useState('');
  const [editDraftMode, setEditDraftMode] = useState(false);
  const [showAddCommentCard, setShowAddCommentCard] = useState(false);
  const [showAddCommentButton, setShowAddCommentButton] = useState(false);
  const [firstCommentText, setFirstCommentText] = useState('');
  const [subsequentCommentText, setSubsequentCommentText] = useState('');
  const [editedHtml, setEditedHtml] = useState(null)
  useEffect(() => {
    setLoading(true);
    // Fetch posts from backend asynchronously
    setTimeout(() => {
      const draftsResp = getAllDrafts();
      const draftsList = [];
      for(const draftId in draftsResp) {
        const draftDetails = draftsResp[draftId];
        draftsList.push({
          draftId: draftId,
          ...draftDetails
        })
      }
      setDrafts(draftsList);
      renderDraftContent(draftsList[0]);
      setLoading(false);
    }, 1000);

    document.addEventListener("selectionchange", selectionChangeHandler);
    
    return () => {
      document.removeEventListener("onselectionchange", selectionChangeHandler);
    };
  }, []);

  setTimeout(() => {
    addEventListenerForHighlightedText();
    setActiveCommentThreadId("comment-thread-72d99ebb-85e5-4c97-9e7e-e675f160732e");
    loadCommentsForHighlightedText("comment-thread-72d99ebb-85e5-4c97-9e7e-e675f160732e");
  }, 3000);

  const addEventListenerForHighlightedText = () => {
     // Get all elements with the custom attribute
     const elements = document.querySelectorAll('[data-comment-thread-id]');

     // Add a click event listener to each element
     elements.forEach(element => {
       element.addEventListener('click', handleCustomAttributeClick);
     });
 
     // Event handler function for the click event
     function handleCustomAttributeClick(event) {
       const customAttributeValue = event.target.getAttribute('data-comment-thread-id');
       console.log('Clicked element with custom attribute:', customAttributeValue);
     }
  }

  const renderDraftContent = (draft) => {
    setActiveDraft(draft);
    convertMarkdownToEditableHTML(draft.draftContent);

  }

  const convertTextToHtml = (text) => {
    const html = text.replace(/\n/g, "<br />");
    return html;
  };

  const loadCommentsForHighlightedText = (commentThreadId) => {
    console.log("commentThreadId: ", commentThreadId);
    const addedCommentsList = getCommentsForThreadId(commentThreadId);
    setShowAddedComments(true);
    setAddedCommentsList(addedCommentsList);
  }
  
  const addSpansToHighlightedText = (text) => {
    const regex =
      /:inline-highlighter\[(.*?)\]comment-thread-id=##(.*?)##/g;
    let match;
    let newText = text;
    while ((match = regex.exec(text))) {
      newText = newText.replace(
        match[0],
        `<span style="background-color: yellow" data-comment-thread-id="${match[2]}">${match[1]}</span>`
      );
    }
    return newText;
  };
  
  const convertMarkdownToEditableHTML = (markDownText) => {
    const markdownAsHtmlWithCommentSpans =
    addSpansToHighlightedText(markDownText);
      console.log("markdownAsHtmlWithCommentSpans: ", markdownAsHtmlWithCommentSpans);
    const editedHtml = convertTextToHtml(markdownAsHtmlWithCommentSpans);
    console.log("editedHtml: ", editedHtml);
     setEditedHtml(editedHtml);
  };

  const updateSelection = async ({text, selection, range}) => {
    console.log("Selected text: ", text, selection, range);
    setSelected(selection);
    // if no current selection render nothing
    if (
      !selection ||
      !selection.text ||
      !selection.text.length ||
      selection.text.length < 1
    ) {
      return null
    }
    //dispatch({ type: "UPDATE_SELECTION", payload: { selection } });
  };

  const clearSelection = () => {
    //dispatch({ type: "UPDATE_SELECTION", payload: { selection: null } });
  };

  const selectionChangeHandler = (e) => {
    const selection = document.getSelection();
    const text = selection.toString();
    if (!selection || selection.isCollapsed || selection.rangeCount <= 0) {
      clearSelection();
    }
    const range = selection.getRangeAt(0);

    if (
      range &&
      range.startContainer.parentElement == range.endContainer.parentElement &&
      range.cloneContents().childElementCount === 0
    ) {
      updateSelection({text, selection, range});
    } else {
      updateSelection(null);
    }
  };

  const handleAddCommentClick = () => {
    console.log("Add comment button clicked");
    setShowAddCommentCard(true);
    setShowAddCommentButton(false);
  }

  const handleCloseCommentCardClick = () => {
    setShowAddCommentCard(false);
    setFirstCommentText('');
  }

  const handleSaveFirstCommentClick = () => {
    console.log("comment to save: ", firstCommentText, " draftContent to save: ", mutatedDraftContentToBeUpdated)
  
    // First save the mutated draft content, then add comment details to threadId
    updateDraft(activeDraft.draftId, mutatedDraftContentToBeUpdated);
    addCommentToThread(activeCommentThreadId, {commentText: firstCommentText});
    setShowAddCommentCard(false);
    setFirstCommentText('');
    const addedCommentsList = getCommentsForThreadId(activeCommentThreadId);
    setShowAddedComments(true);
    setAddedCommentsList(addedCommentsList);
  }

  const handleSaveSubsequentCommentClick = () => {
    console.log("comment to save: ", subsequentCommentText)
    addCommentToThread(activeCommentThreadId, {commentText: subsequentCommentText});
    setSubsequentCommentText('');
    const addedCommentsList = getCommentsForThreadId(activeCommentThreadId);
    setShowAddedComments(true);
    setAddedCommentsList(addedCommentsList);
  }

  const handleEditDraftClick = () => {
    setEditDraftMode(true);
  }

  const handleSaveDraftClick = () => {
    setEditDraftMode(false);
  }
  
  const handleDraftContentChange = () => {

  }

  const handleFirstCommentTextChange = (e) => {
    setFirstCommentText(e.target.value);
    console.log("Comment text changed: ", e.target.value);
  }

  const handleSubsequentCommentTextChange = (e) => {
    setSubsequentCommentText(e.target.value);
    console.log("Comment text changed: ", e.target.value);
  }

  const handleSelection = () => {
    const selection = document.getSelection();
    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    console.log("rangestartoffset: ", range.startOffset, " rangeendoffset: ", range.endOffset, " activeDraftContent: ", activeDraft.draftContent);
    const commentThreadId = generateCommentThreadId();
    const contentTobeReplaced = `:inline-highlighter[${selectedText}]comment-thread-id=##${commentThreadId}##`;
    setActiveCommentThreadId(commentThreadId);
    const mutatedDraftContent = activeDraft.draftContent.substring(0, range.startOffset) + contentTobeReplaced + activeDraft.draftContent.substring(range.endOffset, activeDraft.draftContent.length-1);
    console.log("First part: ", activeDraft.draftContent.substring(0, range.startOffset), " contentTobeReplaced: ", contentTobeReplaced, " last part: ", activeDraft.draftContent.substring(range.endOffset, activeDraft.draftContent.length-1));
    console.log("consolidated string: ", mutatedDraftContent);
    setMutatedDraftContentToBeUpdated(mutatedDraftContent);
    if (selectedText !== '') {
      setShowAddCommentButton(true);
    } else {
      setShowAddCommentButton(false);
    }
  };


  return (
    <Container>
       <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand href="#home">Your Drafts</Navbar.Brand>
      </Navbar>
      {isLoading && <LoadingSpinner />}
      <div className="d-flex flex-row ">
        <div className={`${styles.draftSidebarWrapper}`}>
          {!isLoading && 
            drafts.map((draft) => {
              return (
                <ListGroup.Item className={styles.listItem} key={draft.draftId} onClick={() => renderDraftContent(draft)}>{draft.draftTitle}</ListGroup.Item>
              );
            })}
        </div>
        {activeDraft && !editDraftMode &&
          <div className={styles.draftPreviewWrapper}>
            <div className={styles.headerWrapper}>
              <div className={styles.draftTitle}>{activeDraft.draftTitle}</div>
              <Button variant="primary" onClick={() => handleEditDraftClick()}>Edit</Button>
            </div>
            <div>
              <div className={`draftContent ${styles.tooltip}`} onMouseUp={handleSelection}  dangerouslySetInnerHTML={{__html: editedHtml}}/>
              {showAddCommentButton && <div className={styles.tooltipText} onClick={() => handleAddCommentClick()}>ADD COMMENT</div>}
            </div>
          </div>}
          {editDraftMode &&
             <div className={styles.editDraftWrapper}>
              <div className={styles.headerWrapper}>
                <div className={styles.draftTitle}>{activeDraft.draftTitle}</div>
                <Button variant="primary" onClick={() => handleSaveDraftClick()}>Save</Button>
              </div>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" value={activeDraft.draftContent} onChange={() => handleDraftContentChange()} rows={3} placeholder="Type your comments here..." />
              </Form.Group>
           </div>}
      </div>
      {showAddCommentCard && !showAddedComments && !editDraftMode && 
         <Card style={{ width: '18rem' }}>
          <Card.Body>
            <div className={styles.headerWrapper}>
              <Card.Title>Add a comment</Card.Title>
              <CloseButton onClick={() => handleCloseCommentCardClick(false)}/>
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control as="textarea" onChange={(e) => handleFirstCommentTextChange(e)} rows={3} placeholder="Type your comments here..." value={firstCommentText} />
            </Form.Group>
            <Button variant="primary" onClick={() => handleSaveFirstCommentClick()}>Save</Button>
          </Card.Body>
       </Card>
      }
      {!showAddCommentCard && showAddedComments && addedCommentsList.map(comment =>{
            return(
            <>
              <Card key={comment.commentId}>
                <Card.Body>
                  <Card.Text>{comment.commentText}</Card.Text>
                </Card.Body>
              </Card>
            </>
            )
          })
        }
        {!showAddCommentCard && showAddedComments &&
          <div>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Control as="textarea" rows={3} placeholder="Reply" onChange={(e) => handleSubsequentCommentTextChange(e)} value={subsequentCommentText} />
                </Form.Group>
                <div>
                  <Button variant="primary" onClick={() => handleSaveSubsequentCommentClick()}>Save</Button>
                </div>
              </Card.Body>
          </Card>
          </div>}
    </Container>
  );
}
