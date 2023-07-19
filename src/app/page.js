"use client"; // This is a client component 👈🏽
import React, { useEffect, useState, useRef } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';

import styles from './globals.module.css';
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { convertMarkdownToHTML, convertEditableHTMLToMarkdown, transformDraftsResp } from "../utils/utils";
import { generateCommentThreadId } from "../helpers/commentsHelper";
import { getAllDrafts, updateDraft } from "../services/draftsService";
import { addCommentToThread, getCommentsForThreadId } from "../services/commentService";
import SideNav from "@/components/SideNav/SideNav";
import DraftPreview from "@/components/DraftPreview/DraftPreview";
import DraftEdit from "@/components/DraftEdit/DraftEdit";
import AddComment from "@/components/AddComment/AddComment";
import AddedComments from "@/components/AddedComments/AddedComments";
import { draftsJson } from "../db/drafts";
import * as localStorageService from "../services/localStorageService";

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
  const [firstCommentText, setFirstCommentText] = useState('');
  const [subsequentCommentText, setSubsequentCommentText] = useState('');
  const [previewHtml, setPreviewHtml] = useState(null);
  const [editableHtml, setEditableHtml] = useState(null);
  useEffect(() => {
    document.querySelector("body").classList.add(styles.pageBody);
    setLoading(true);
    // Fetch posts from backend asynchronously
    setTimeout(() => {
      const draftsResp = getAllDrafts();
      const draftsList = transformDraftsResp(draftsResp);
      setDrafts(draftsList);
      renderDraftContent(draftsList[0]);
      setLoading(false);
    }, 500);
  }, []);

  setTimeout(() => {
    !editDraftMode && addEventListenerForHighlightedText();
  }, 3000);

  const addEventListenerForHighlightedText = () => {
     // Get all elements with the custom attribute
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

  const renderDraftContent = (draft) => {
    setActiveDraftId(draft.draftId);
    setActiveDraft(draft);
    const previewHtml = convertMarkdownToHTML(draft.draftContent, false);
    setPreviewHtml(previewHtml);
    handleTooltipVisibility(false);
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
    handleTooltipVisibility(false);
  }

  const handleTooltipVisibility = (showTooltip) => {
    const tooltip = document.getElementById('tooltip');
    if(showTooltip) {
      tooltip.style.display = 'block';
    } else {
      tooltip.style.display = 'none';
    }
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
    const rect = range.getBoundingClientRect();
    if (selectedText === '' || (range &&
      range.startContainer.parentElement == range.endContainer.parentElement &&
      range.cloneContents().childElementCount > 0)
    ){
      handleTooltipVisibility(false);
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
    console.log("range: ", range);
    const position = document.documentElement.scrollTop || document.body.scrollTop;
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = `${position + rect.left}px`;
    tooltip.style.top = `${position + rect.top}px`;
    handleTooltipVisibility(true);
  };


  return (
    <Container className={styles.draftContainer}>
      <div className={styles.draftHeader}>Your Drafts</div>
      <div data-cy="tooltip" id="tooltip" className={`${styles.tooltipText} ${styles.hidden}`} onClick={() => handleAddCommentClick()}>ADD COMMENT</div>
      {isLoading && <LoadingSpinner />}
      <div className="d-flex flex-row ">
        <SideNav renderDraftContent={renderDraftContent} isLoading={isLoading} drafts={drafts} activeDraftId={activeDraftId}/>
        {
        activeDraft && !editDraftMode &&
        <DraftPreview  activeDraft={activeDraft}
            handleEditDraftClick={handleEditDraftClick} 
            handleSelectionChange={handleSelectionChange} 
            handleMouseUpOverDraftContent={handleMouseUpOverDraftContent} 
            previewHtml={previewHtml}/>
          }
          {editDraftMode &&
        <DraftEdit  activeDraft={activeDraft}
          handleSaveDraftClick={handleSaveDraftClick} 
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
