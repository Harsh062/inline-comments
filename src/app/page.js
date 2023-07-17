"use client"; // This is a client component 👈🏽
import React, { useEffect, useState, useRef } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';

import styles from './globals.module.css';
import LoadingSpinner from "./LoadingSpinner";
import { convertMarkdownToHTML, convertEditableHTMLToMarkdown } from "../utils/utils";
import { getAllDrafts, updateDraft, generateCommentThreadId, addCommentToThread, getCommentsForThreadId } from "./draftsStore";

export default function Home() {
  const editorRef = useRef();
  const [isLoading, setLoading]  = useState(false);
  const [showAddedComments, setShowAddedComments] = useState(false);
  const [addedCommentsList, setAddedCommentsList] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activeCommentThreadId, setActiveCommentThreadId] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [mutatedDraftContentToBeUpdated, setMutatedDraftContentToBeUpdated] = useState('');
  const [editDraftMode, setEditDraftMode] = useState(false);
  const [showAddCommentCard, setShowAddCommentCard] = useState(false);
  const [showAddCommentButton, setShowAddCommentButton] = useState(false);
  const [firstCommentText, setFirstCommentText] = useState('');
  const [subsequentCommentText, setSubsequentCommentText] = useState('');
  const [previewHtml, setPreviewHtml] = useState(null);
  const [editableHtml, setEditableHtml] = useState(null)
  useEffect(() => {
    document.querySelector("body").classList.add(styles.pageBody);
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
  }, []);

  setTimeout(() => {
    !editDraftMode && addEventListenerForHighlightedText();
  }, 3000);

  const addEventListenerForHighlightedText = () => {
     // Get all elements with the custom attribute
     const draftContentWrapper = document.getElementById("draftContent");
     const elements = draftContentWrapper.querySelectorAll('[data-comment-thread-id]');

     // Add a click event listener to each element
     elements.forEach(element => {
       element.addEventListener('click', handleCustomAttributeClick);
     });

     // Since we want to block the mouseup event attached to the draft content
     elements.forEach(element => {
      element.addEventListener('mouseup', function(event) {
        console.log("Inside span click");
        event.stopPropagation();
      });
    });
 
     // Event handler function for the click event
     function handleCustomAttributeClick(event) {
      const customAttributeValue = event.target.getAttribute('data-comment-thread-id');
      console.log('Clicked element with custom attribute:', customAttributeValue);
      loadCommentsForHighlightedText(customAttributeValue);
     }
  }

  const renderDraftContent = (draft) => {
    setActiveDraftId(draft.draftId);
    setActiveDraft(draft);
    const previewHtml = convertMarkdownToHTML(draft.draftContent, false);
    setPreviewHtml(previewHtml);
  }

  const loadCommentsForHighlightedText = (commentThreadId) => {
    console.log("commentThreadId: ", commentThreadId);
    const addedCommentsList = getCommentsForThreadId(commentThreadId);
    setShowAddedComments(true);
    setAddedCommentsList(addedCommentsList);
  }

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
    renderDraftContent({
      ...activeDraft,
      draftContent: mutatedDraftContentToBeUpdated
    });
    
  }

  const handleSaveSubsequentCommentClick = () => {
    console.log("comment to save: ", subsequentCommentText)
    addCommentToThread(activeCommentThreadId, {commentText: subsequentCommentText});
    setSubsequentCommentText('');
    const addedCommentsList = getCommentsForThreadId(activeCommentThreadId);
    setShowAddedComments(true);
    setAddedCommentsList(addedCommentsList);
  }

  const handleEditDraftClick = (draft) => {
    const editableHtml = convertMarkdownToHTML(draft.draftContent, true);
    setEditableHtml(editableHtml);
    setEditDraftMode(true);
  }

  const handleSaveDraftClick = () => {
    const html = editorRef.current.innerHTML;
    const markdown = convertEditableHTMLToMarkdown(html);
    console.log("Transformed Markdown: ", markdown);
    setMutatedDraftContentToBeUpdated(markdown);
    // First save the mutated draft content, then add comment details to threadId
    updateDraft(activeDraft.draftId, markdown);
    renderDraftContent({
      ...activeDraft,
      draftContent: markdown
    });
    setEditDraftMode(false);
  }

  const handleFirstCommentTextChange = (e) => {
    setFirstCommentText(e.target.value);
    console.log("Comment text changed: ", e.target.value);
  }

  const handleSubsequentCommentTextChange = (e) => {
    setSubsequentCommentText(e.target.value);
    console.log("Comment text changed: ", e.target.value);
  }

  const handleCloseCommentsListClick = () => {
    setShowAddedComments(false);
  }

  const handleSelectionChange = (event) => {
      console.log(document.getSelection());
  }

  const handleMouseUpOverDraftContent = (event) => {
    const selection = document.getSelection();
    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    if (selectedText === '' || (range &&
      range.startContainer.parentElement == range.endContainer.parentElement &&
      range.cloneContents().childElementCount > 0)
    ){
      setShowAddCommentButton(false);
      return;
    }
    const commentThreadId = generateCommentThreadId();
    const contentTobeReplaced = `:inline-highlighter[${selectedText}]{comment-thread-id=##${commentThreadId}##}`;
    setActiveCommentThreadId(commentThreadId);
    let startOffset;
    let endOffset;
    if(selection.focusNode.previousSibling === null) {
      startOffset = selection.baseOffset;
      endOffset = selection.extentOffset;
    } else if(selection.focusNode.previousSibling.nodeName === "SPAN") {
      const outerHTML = selection.focusNode.previousSibling.outerHTML;
      const indexOfDataThreadAttr = outerHTML.indexOf('"ct-');
      const startIndex = indexOfDataThreadAttr + 1;
      const endIndex = startIndex + 39;
      const commentThreadIdSubstring = outerHTML.substring(startIndex, endIndex);
      startOffset = selection.baseOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + 39 + 3;
      endOffset = selection.extentOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + 39 + 3;
    }
    const mutatedDraftContent = activeDraft.draftContent.substring(0, startOffset) + contentTobeReplaced + activeDraft.draftContent.substring(endOffset, activeDraft.draftContent.length-1);
    console.log("active draft content: ", activeDraft.draftContent);
    console.log("First part: ", activeDraft.draftContent.substring(0, startOffset), " contentTobeReplaced: ", contentTobeReplaced, " last part: ", activeDraft.draftContent.substring(endOffset, activeDraft.draftContent.length-1));
    console.log("consolidated string: ", mutatedDraftContent);
    setMutatedDraftContentToBeUpdated(mutatedDraftContent);
    setShowAddCommentButton(true);
  };


  return (
    <Container className={styles.draftContainer}>
      <div className={styles.draftHeader}>Your Drafts</div>
    
      {isLoading && <LoadingSpinner />}
      <div className="d-flex flex-row ">
        <div className={`${styles.draftSidebarWrapper}`}>
          {!isLoading && 
            drafts.map((draft) => {
              return (
                <ListGroup.Item
                  className={styles.listItem}
                  key={draft.draftId}
                  style={{
                    backgroundColor: activeDraftId === draft.draftId ? 'aqua' : 'transparent',
                  }}
                  onClick={() => renderDraftContent(draft)}>{draft.draftTitle}</ListGroup.Item>
              );
            })}
        </div>
        {activeDraft && !editDraftMode &&
          <div className={styles.draftPreviewWrapper}>
            <div className={styles.headerWrapper}>
              <div className={styles.draftTitle}>{activeDraft.draftTitle}</div>
              <Button variant="primary" onClick={() => handleEditDraftClick(activeDraft)}>Edit</Button>
            </div>
            <div>
              <div id="draftContent" className={`${styles.draftContent} ${styles.tooltip}`} onselectionchange={(event) => handleSelectionChange(event)} onMouseUp={(event) => handleMouseUpOverDraftContent(event)}  dangerouslySetInnerHTML={{__html: previewHtml}}/>
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
                <div  ref={editorRef} contentEditable="true"  dangerouslySetInnerHTML={{__html: editableHtml}}/>
              </Form.Group>
           </div>}
      </div>
      {showAddCommentCard && !showAddedComments && !editDraftMode && 
         <Card className={styles.addCommentWrapper} style={{ width: '18rem' }}>
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
      <div className={styles.addedCommentsWrapper}>
        {!showAddCommentCard && showAddedComments && 
        <div>
          <Card>
            <Card.Body className={styles.addedCommentsCardHeader}>
              <Card.Title>Comments</Card.Title>
              <CloseButton onClick={() => handleCloseCommentsListClick()}/>
            </Card.Body>
          </Card>
        </div>}
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
      </div>
    </Container>
  );
}
