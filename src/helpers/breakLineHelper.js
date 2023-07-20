import { v4 as uuidv4 } from 'uuid';

import { BREAKLINE_IDENTIFIER_REGEX, NEWLINE_IDENTIFIER_REGEX, BREAK_LINE_ID_LENGTH } from "../constants/constants";

export const addBreakpoints = (text) => {
    const regex = NEWLINE_IDENTIFIER_REGEX
    let match;
    let newText = text;
    let breaklineStr;
    while ((match = regex.exec(text))) {
      breaklineStr = `<br id="${match[1]}" />`;
      newText = newText.replace(match[0],breaklineStr);
    }
    return newText;
};

const generateIdentifierForBreakPoint = () => {
    return `br-${uuidv4()}`;
}

export const replaceLineBreakWithNewLine = (text) => {
    const regex = BREAKLINE_IDENTIFIER_REGEX;
    let match;
    let newText = text;
    while ((match = regex.exec(text))) {
      const brId = generateIdentifierForBreakPoint();
      const newLineIdentifier = `:new-line{id=##${brId}##}`;
      newText = newText.replace(match[0], newLineIdentifier);
    }
    return newText;
};

export const getBreaklineStartAndEndOffsets = (selection, activeDraft) => {
    const outerHTML = selection.focusNode.previousSibling.outerHTML;
    const indexOfBreakLineIdAttr = outerHTML.indexOf('"br-');
    const startIndex = indexOfBreakLineIdAttr + 1;
    const endIndex = startIndex + BREAK_LINE_ID_LENGTH;
    const breakLineIdSubstring = outerHTML.substring(startIndex, endIndex);
    const startOffset = selection.baseOffset + activeDraft.draftContent.lastIndexOf(breakLineIdSubstring) + BREAK_LINE_ID_LENGTH + 3;  // Adding 3 to incorporate "##}"
    const endOffset = selection.extentOffset + activeDraft.draftContent.lastIndexOf(breakLineIdSubstring) + BREAK_LINE_ID_LENGTH + 3;
    return {
        startOffset, endOffset
    };
}