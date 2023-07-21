import { NODE_TYPES } from "../constants/constants";

import { getBreaklineStartAndEndOffsets } from "../helpers/breakLineHelper";
import { getSpanStartAndEndOffsets } from "../helpers/spanHelper";

export const ifSelectedTextContainsAlreadyHighlightedElements = (range) => {
    if(range && range.startContainer.parentElement == range.endContainer.parentElement && range.cloneContents().childElementCount > 0) {
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
  
export const updateTooltipPosition = (rect) => {
    const position = document.documentElement.scrollTop || document.body.scrollTop;
    const tooltip = document.getElementById('tooltip');
    tooltip.style.left = `${position + rect.left - 200}px`;
    tooltip.style.top = `${position + rect.top - 30}px`;
}
