import sanitizeHtml from "sanitize-html";
const convertTextToHtml = (text) => {
    const html = text.replace(/\n/g, "<br />");
    return html;
};

export const convertMarkdownToHTML = (markDownText, editable) => {
    const markdownAsHtmlWithCommentSpans =
    addSpansToHighlightedText(markDownText, editable);
      console.log("markdownAsHtmlWithCommentSpans: ", markdownAsHtmlWithCommentSpans);
    const transformedHtml = convertTextToHtml(markdownAsHtmlWithCommentSpans);
    console.log("transformedHtml: ", transformedHtml);
     return transformedHtml;
};

const addSpansToHighlightedText = (text, editable) => {
    const regex =
      /:inline-highlighter\[(.*?)\]{comment-thread-id=##(.*?)##}/g;
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

const replaceLineBreakWithNewLine = (text) => {
    const regex = /<br\s?\/?>/g;
    let match;
    let newText = text;
    while ((match = regex.exec(text))) {
      newText = newText.replace(match[0], "\n");
    }
    return newText;
};

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

  const replaceCommentsSpansWithHighlighterDirective = (text) => {
    const regex = /<span data-comment-thread-id="(.*?)">(.*?)<\/span>/g;
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