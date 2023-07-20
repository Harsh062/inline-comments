import sanitizeHtml from "sanitize-html";

import { addBreakpoints, replaceLineBreakWithNewLine } from "../helpers/breakLineHelper";
import { addSpansToHighlightedText, replaceCommentsSpansWithHighlighterDirective } from "../helpers/spanHelper";

export const convertMarkdownToHTML = (markDownText, editable) => {
    const mrakdownWithBreakLine = addBreakpoints(markDownText);
    const markdownWithSpans =
    addSpansToHighlightedText(mrakdownWithBreakLine, editable);
     return markdownWithSpans;
};

export const transformDraftsResp = (draftsObj) => {
  const draftsList = [];
  for(const draftId in draftsObj) {
    const draftDetails = draftsObj[draftId];
    draftsList.push({
      draftId: draftId,
      ...draftDetails
    })
  }
  return draftsList;
}

export const convertEditableHTMLToMarkdown = (editableHtml) => {
  const sanitized = sanitizeHtml(editableHtml, {
    allowedTags: ["br", "span"],
    allowedAttributes: {
      span: ["data-comment-thread-id"],
    },
  });
  const withNewLines = replaceLineBreakWithNewLine(sanitized);
  const markdown = replaceCommentsSpansWithHighlighterDirective(withNewLines);
  return markdown;
};
