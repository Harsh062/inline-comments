import { SPAN_IDENTIFIER_REGEX, HIGHLIGHT_IDENTIFIER_REGEX, COMMENT_THREAD_ID_LENGTH } from "../constants/constants";

export const addSpansToHighlightedText = (text, editable) => {
    const regex = HIGHLIGHT_IDENTIFIER_REGEX;
    let match;
    let newText = text;
    let spanStr;
    while ((match = regex.exec(text))) {
      if(editable === false) {
        spanStr = `<span style="background-color: yellow; cursor: pointer" data-comment-thread-id="${match[2]}">${match[1]}</span>`;
      } else {
        spanStr = `<span data-comment-thread-id="${match[2]}">${match[1]}</span>`;
      }
      newText = newText.replace(match[0],spanStr);
    }
    return newText;
};

export const replaceCommentsSpansWithHighlighterDirective = (text) => {
    const regex = SPAN_IDENTIFIER_REGEX;
    let match;
    let newText = text;
    while ((match = regex.exec(text))) {
      newText = newText.replace(
        match[0],
        `:inline-highlighter[${match[2]}]{comment-thread-id=##${match[1]}##}`
      );
    }
    return newText;
};

export const getSpanStartAndEndOffsets = (selection, activeDraft) => {
    const outerHTML = selection.focusNode.previousSibling.outerHTML;
    const indexOfDataThreadAttr = outerHTML.indexOf('"ct-');
    const startIndex = indexOfDataThreadAttr + 1;
    const endIndex = startIndex + COMMENT_THREAD_ID_LENGTH;
    const commentThreadIdSubstring = outerHTML.substring(startIndex, endIndex);
    const startOffset = selection.baseOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + COMMENT_THREAD_ID_LENGTH + 3; // Adding 3 to incorporate "##}"
    const endOffset = selection.extentOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + COMMENT_THREAD_ID_LENGTH + 3;
    return {
        startOffset, endOffset
    };
}