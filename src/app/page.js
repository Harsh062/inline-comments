"use client"; // This is a client component 👈🏽
import React, { useEffect, useState, useRef } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';

import styles from './globals.module.css';
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { convertMarkdownToHTML, convertEditableHTMLToMarkdown, transformDraftsResp } from "../utils/utils";

import { generateCommentThreadId } from "../helpers/commentsHelper";
import { ifSelectedTextContainsAlreadyHighlightedElements, getStartAndEndOffsetOfSelectedText,
  updateTooltipPosition, getUniqueIdentifierForSelectedText } from "../helpers/selectionHelper";

import { getAllDrafts, updateDraft } from "../services/draftsService";
import { addCommentToThread, getCommentsForThreadId } from "../services/commentService";
import SideNav from "@/components/SideNav/SideNav";
import DraftPreview from "@/components/DraftPreview/DraftPreview";
import DraftEdit from "@/components/DraftEdit/DraftEdit";
import AddComment from "@/components/AddComment/AddComment";
import AddedComments from "@/components/AddedComments/AddedComments";
import ToastWrapper from "@/components/Toast/ToastWrapper";

export default function Home() {
  const editorRef = useRef();
  const [isLoading, setLoading]  = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [showAddedComments, setShowAddedComments] = useState(false);
  const [addedCommentsList, setAddedCommentsList] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activeCommentThreadId, setActiveCommentThreadId] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [mutatedDraftContentToBeUpdated, setMutatedDraftContentToBeUpdated] = useState('');
  const [editDraftMode, setEditDraftMode] = useState(false);
  const [showAddCommentCard, setShowAddCommentCard] = useState(false);
  const [firstCommentText, setFirstCommentText] = useState('');
  const [subsequentCommentText, setSubsequentCommentText] = useState('');
  const [previewHtml, setPreviewHtml] = useState(null);
  const [editableHtml, setEditableHtml] = useState(null);
  useEffect(() => {
    document.querySelector("body").classList.add(styles.pageBody);
    setLoading(true);
    // We are using localstorage as our storage. Adding a setTimeout to simulate the experience of an Async call
    setTimeout(() => {
      const draftsResp = getAllDrafts();
      const draftsList = transformDraftsResp(draftsResp);
      setDrafts(draftsList);

      // Set first draft as active by default
      renderDraftContent(draftsList[0], false);

      setLoading(false);
    }, 500);
  }, []);

  setTimeout(() => {
    !editDraftMode && addEventListenerForHighlightedText();
  }, 1000);

  const addEventListenerForHighlightedText = () => {
     const draftContentWrapper = document.querySelector("div[data-draftid]");
     const elements = draftContentWrapper?.querySelectorAll('[data-comment-thread-id]') || [];

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

  const renderDraftContent = (draft, showAddedComments) => {
    setActiveDraft(draft);
    const previewHtml = convertMarkdownToHTML(draft.draftContent, false);
    setPreviewHtml(previewHtml);
    handleTooltipVisibility(false);
    if(!showAddedComments) {
      setShowAddedComments(false);
      setSubsequentCommentText('');
    }
  }

  const loadCommentsForHighlightedText = (commentThreadId) => {
    const addedCommentsList = getCommentsForThreadId(commentThreadId);
    setShowAddedComments(true);
    handleTooltipVisibility(false);
    setAddedCommentsList(addedCommentsList);
  }

  const handleAddCommentClick = () => {
    setShowAddCommentCard(true);
    handleTooltipVisibility(false);
  }

  const handleTooltipVisibility = (showTooltip) => {
    const tooltip = document.getElementById('tooltip');
    if(showTooltip) {
      tooltip.style.display = 'block';
      setShowAddedComments(false);
      setSubsequentCommentText('');
    } else {
      tooltip.style.display = 'none';
    }
  }

  const handleCloseCommentCardClick = () => {
    setShowAddCommentCard(false);
    setFirstCommentText('');
  }

  const handleSaveFirstCommentClick = () => {
  
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
    }, true);
    showAndHideToast("Added Comment Successfully");
  }

  const showAndHideToast = (toastText) => {
    setShowToast(true);
    setToastText(toastText);
    setTimeout(() => {
      setShowToast(false);
      setToastText("");
    }, 3000);
  }

  const handleSaveSubsequentCommentClick = () => {
    addCommentToThread(activeCommentThreadId, {commentText: subsequentCommentText});
    setSubsequentCommentText('');
    const addedCommentsList = getCommentsForThreadId(activeCommentThreadId);
    setShowAddedComments(true);
    setAddedCommentsList(addedCommentsList);
    showAndHideToast("Added Comment Successfully");
  }

  const handleEditDraftClick = (draft) => {
    const editableHtml = convertMarkdownToHTML(draft.draftContent, true);
    setEditableHtml(editableHtml);
    setEditDraftMode(true);
    setShowAddedComments(false);
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
    }, false);
    setEditDraftMode(false);
    showAndHideToast("Saved Draft Successfully");
  }

  const handleCancelDraftClick = () => {
    renderDraftContent({
      ...activeDraft
    }, false);
    setEditDraftMode(false);
  }

  const handleFirstCommentTextChange = (e) => {
    setFirstCommentText(e.target.value);
  }

  const handleSubsequentCommentTextChange = (e) => {
    setSubsequentCommentText(e.target.value);
  }

  const handleCloseCommentsListClick = () => {
    setShowAddedComments(false);
    setSubsequentCommentText('');
  }

  const handleMouseUpOverDraftContent = (event) => {
    setShowAddCommentCard(false);
    setFirstCommentText("");
    const selection = document.getSelection();
    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);

    // We are not allowing users to select text that is already highlighted
    if (selectedText === '' || (ifSelectedTextContainsAlreadyHighlightedElements(range))){
      handleTooltipVisibility(false);
      return;
    }
    const commentThreadId = generateCommentThreadId();
    setActiveCommentThreadId(commentThreadId);
    const contentTobeReplaced = getUniqueIdentifierForSelectedText(selectedText, commentThreadId);
    const offsetObj = getStartAndEndOffsetOfSelectedText(selection, activeDraft);
    
    // We will mutate the draft content string by wrapping the selected text with concrete identifiers and adding a unique id to it 
    const mutatedDraftContent = activeDraft.draftContent.substring(0, offsetObj.startOffset) + contentTobeReplaced
     + activeDraft.draftContent.substring(offsetObj.endOffset, activeDraft.draftContent.length-1);
     console.log("startOffset: ", activeDraft.draftContent.substring(0, offsetObj.startOffset), " contentTobeReplaced: ", contentTobeReplaced, " endOffset: ", activeDraft.draftContent.substring(offsetObj.endOffset, activeDraft.draftContent.length-1));
     console.log("mutatedDraftContent: ", mutatedDraftContent);
    setMutatedDraftContentToBeUpdated(mutatedDraftContent);

    const rect = range.getBoundingClientRect();
    updateTooltipPosition(rect);

    handleTooltipVisibility(true);
  };


  return (
    <Container className={styles.draftContainer}>
      <div className={styles.draftHeader}>Your Drafts</div>
      <div data-cy="tooltip" id="tooltip" className={`${styles.tooltipText} ${styles.hidden}`} onClick={() => handleAddCommentClick()}>ADD COMMENT</div>
      <ToastWrapper showToast={showToast} toastText={toastText}/>
      {isLoading && <LoadingSpinner />}
      <div className="d-flex flex-row ">
        <SideNav renderDraftContent={renderDraftContent} 
            isLoading={isLoading} 
            drafts={drafts} 
            activeDraftId={activeDraft?.draftId}/>
        {
        activeDraft && !editDraftMode &&
        <DraftPreview  activeDraft={activeDraft}
            handleEditDraftClick={handleEditDraftClick} 
            handleMouseUpOverDraftContent={handleMouseUpOverDraftContent} 
            previewHtml={previewHtml}/>
          }
          {editDraftMode &&
        <DraftEdit  activeDraft={activeDraft}
          handleSaveDraftClick={handleSaveDraftClick} 
          handleCancelDraftClick={handleCancelDraftClick}
          editableHtml={editableHtml} 
          editorRef={editorRef}/>
          }
      </div>
      {showAddCommentCard && !showAddedComments && !editDraftMode && 
        <AddComment handleCloseCommentCardClick={handleCloseCommentCardClick}
        handleFirstCommentTextChange={handleFirstCommentTextChange}
        firstCommentText={firstCommentText}
        handleSaveFirstCommentClick={handleSaveFirstCommentClick}/>
      }
      <AddedComments handleCloseCommentsListClick={handleCloseCommentsListClick}
        showAddCommentCard={showAddCommentCard}
        showAddedComments={showAddedComments}
        addedCommentsList={addedCommentsList}
        handleSubsequentCommentTextChange={handleSubsequentCommentTextChange}
        handleSaveSubsequentCommentClick={handleSaveSubsequentCommentClick}
        subsequentCommentText={subsequentCommentText} />
    </Container>
  );
}
