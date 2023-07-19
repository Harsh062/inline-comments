import { COMMENT_THREAD_ID_LENGTH, NODE_TYPES } from "../constants/constants";

export const ifSelectedTextContainsAlreadyHighlightedElements = (range) => {
    if(range && range.startContainer.parentElement == range.endContainer.parentElement && range.cloneContents().childElementCount > 0) {
      return true;
    } else {
      return false;
    }
}

export const getUniqueIdentifierForSelectedText = (selectedText, commentThreadId) => {
    return `:inline-highlighter[${selectedText}]{comment-thread-id=##${commentThreadId}##}`;
}

export const getStartAndEndOffsetOfSelectedText = (selection, activeDraft) => {
    let startOffset;
    let endOffset;
    // 3 cases are possible:
    // a. When there is no highlighted text before or after the selected string
    // b. When there is highlighted text after the selected string
    // c. When is there is highlighted text before the selected string. In this case, the draft content is broken down into several nodes.
    // The total base and extent offset of the selected node will be calculated by considering the index of the sibling nodes

    if(selection.focusNode.previousSibling === null) { // For cases a and b
      startOffset = selection.baseOffset;
      endOffset = selection.extentOffset;
    } else if(selection.focusNode.previousSibling.nodeName === NODE_TYPES.SPAN) { // For case c
      const outerHTML = selection.focusNode.previousSibling.outerHTML;
      const indexOfDataThreadAttr = outerHTML.indexOf('"ct-');
      const startIndex = indexOfDataThreadAttr + 1;
      const endIndex = startIndex + COMMENT_THREAD_ID_LENGTH;
      const commentThreadIdSubstring = outerHTML.substring(startIndex, endIndex);
      startOffset = selection.baseOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + COMMENT_THREAD_ID_LENGTH + 3; // Adding 3 to incorporate "##}"
      endOffset = selection.extentOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + COMMENT_THREAD_ID_LENGTH + 3;
    }
    return {
        startOffset,
        endOffset
    }
}
  
export const updateTooltipPosition = (rect) => {
    const position = document.documentElement.scrollTop || document.body.scrollTop;
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = `${position + rect.left}px`;
    tooltip.style.top = `${position + rect.top}px`;
}
