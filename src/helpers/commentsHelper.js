import { v4 as uuidv4 } from 'uuid';

export const generateCommentThreadId = () => {
    return `ct-${uuidv4()}`;
}
  
export const generateCommentId = () => {
    return `c-${uuidv4()}`;
}