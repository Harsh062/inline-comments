import { SPAN_IDENTIFIER_REGEX, HIGHLIGHT_IDENTIFIER_REGEX, COMMENT_THREAD_ID_LENGTH } from "../constants/constants";

export const addSpansToHighlightedText = (text, editable) => {
    const regex = new RegExp(HIGHLIGHT_IDENTIFIER_REGEX);
    let match;
    let newText = text;
    let spanStr;
    while ((match = regex.exec(text))) {
      if(editable === false) {
        spanStr = `<span style="background-color: yellow; cursor: pointer" data-comment-thread-ids="${match[2]}">${match[1]}</span>`;
      } else {
        spanStr = `<span data-comment-thread-ids="${match[2]}">${match[1]}</span>`;
      }
      newText = newText.replace(match[0],spanStr);
    }
    return newText;
};

export const replaceCommentsSpansWithHighlighterDirective = (text) => {
    const regex = new RegExp(SPAN_IDENTIFIER_REGEX);
    let match;
    let newText = text;
    while ((match = regex.exec(text))) {
      newText = newText.replace(
        match[0],
        `:inline-highlighter[${match[2]}]{comment-thread-ids=[##${match[1]}##]}`
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
    const startOffset = selection.baseOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + COMMENT_THREAD_ID_LENGTH + 4; // Adding 4 to incorporate "##}]"
    const endOffset = selection.extentOffset + activeDraft.draftContent.indexOf(commentThreadIdSubstring) + COMMENT_THREAD_ID_LENGTH + 4;
    return {
        startOffset, endOffset
    };
}