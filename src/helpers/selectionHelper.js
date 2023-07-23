import { NODE_TYPES, HIGHLIGHT_IDENTIFIER_REGEX } from "../constants/constants";

import { getBreaklineStartAndEndOffsets } from "../helpers/breakLineHelper";
import { getSpanStartAndEndOffsets } from "../helpers/spanHelper";

export const ifSelectedTextContainsAlreadyHighlightedElements = (range) => {
    if(range && range.cloneContents() && range.cloneContents().childElementCount > 0) {
      return true;
    } else {
      return false;
    }
}

export const getUniqueIdentifierForSelectedText = (selectedText, commentThreadId) => {
    return `:inline-highlighter[${selectedText}]{comment-thread-ids=[##${commentThreadId}##]}`;
}

export const getStartAndEndOffsetOfSelectedText = (selection, activeDraft) => {
    let offset;
    // 3 cases are possible:
    // a. When there is no previous sibling correponding to the highlighted text
    // b. When the previous sibling correponding to the highlighted text is SPAN i.e in the case of highlighted text
    // c. When the previous sibling correponding to the highlighted text is LINE BREAK i.e in the case of new line

    if(selection.focusNode.previousSibling === null) { // For cases a
      offset = {
        startOffset: selection.baseOffset,
        endOffset: selection.extentOffset
      };
    } else if(selection.focusNode.previousSibling.nodeName === NODE_TYPES.SPAN) { // For case b
      offset = getSpanStartAndEndOffsets(selection, activeDraft);
    } else if(selection.focusNode.previousSibling.nodeName === NODE_TYPES.BR) { // For case c
      offset = getBreaklineStartAndEndOffsets(selection, activeDraft);
    }
    return offset;
}
  
export const updateTooltipPosition = (rect, tooltip) => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.clientWidth / 2)}px`;
    tooltip.style.top = `${scrollTop + rect.top - (tooltip.clientHeight) - 2}px`;
}

export const removeHighlightMarker = (commentThreadId, draftContent) => {
  const regex = new RegExp(HIGHLIGHT_IDENTIFIER_REGEX);
  let match;
  let matchingMarkerText;
  let contentText;
  while ((match = regex.exec(draftContent))) {
   if(match[0].indexOf(commentThreadId) > -1) {
    matchingMarkerText = match[0];
    contentText = match[1];
    break;
   }
  }
  const commentThreadsStrStartIndex =  matchingMarkerText.indexOf("=[") + 2;
  const commentThreadsStrEndIndex =  matchingMarkerText.indexOf("]}");
  const commentThreadIdsSubstring = matchingMarkerText.substring(commentThreadsStrStartIndex, commentThreadsStrEndIndex);
  const commentThreadIdsList = commentThreadIdsSubstring.split(",");
  let mutatedDraftContent = draftContent;
  if(commentThreadIdsList.length===1) {
    // Only one comment was present. Remove the highlight section
    mutatedDraftContent = mutatedDraftContent.replace(matchingMarkerText, contentText);

  }
  return mutatedDraftContent;
}

