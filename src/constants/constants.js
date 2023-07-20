export const COMMENT_THREAD_ID_LENGTH = 39; // 36 (Length of uuid.v4()) + 3("ct-")
export const BREAK_LINE_ID_LENGTH = 39; // 36 (Length of uuid.v4()) + 3("br-")
export const NODE_TYPES = {
    SPAN: "SPAN",
    BR: "BR"
}
export const NEWLINE_IDENTIFIER_REGEX = /:new-line{id=##(.*?)##}/g;
export const BREAKLINE_IDENTIFIER_REGEX = /<br\s?\/?>/g;

export const SPAN_IDENTIFIER_REGEX = /<span data-comment-thread-id="(.*?)">(.*?)<\/span>/g;
export const HIGHLIGHT_IDENTIFIER_REGEX =  /:inline-highlighter\[(.*?)\]{comment-thread-id=##(.*?)##}/g;