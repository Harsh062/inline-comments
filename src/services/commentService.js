import * as commentsHelper from "../helpers/commentsHelper";
import * as localStorageService from "../services/localStorageService";

export const addCommentToThread = (commentThreadId, commentData) => {
    const commentId = commentsHelper.generateCommentId();
    const currCommentThreadsObj = localStorageService.getCommentThreadsFromLocalStorage();
    const commentIds = currCommentThreadsObj[commentThreadId];
    const currCommentsObj =localStorageService.getCommentsFromLocalStorage();
    if(!commentIds) {
      currCommentThreadsObj[commentThreadId] = [];
    }
    currCommentThreadsObj[commentThreadId].push(commentId);
   
    currCommentsObj[commentId] = {
      ...commentData
    };
   localStorageService.updateCommentsThreadInLocalStorage(currCommentThreadsObj);
   localStorageService.updateCommentsInLocalStorage(currCommentsObj);
}

export const handleCommentDeletion = (commentId, commentThreadId) => {
  // Delete the comment
  const currCommentsObj = localStorageService.getCommentsFromLocalStorage();
  delete currCommentsObj[commentId];
  localStorageService.updateCommentsInLocalStorage(currCommentsObj);
  
  // Delete the commentId from commentThreadId
  const currCommentThreadsObj = localStorageService.getCommentThreadsFromLocalStorage();
  const commentsIdsForThread = currCommentThreadsObj[commentThreadId];
  const newCommentIdsForThread = commentsIdsForThread.filter((cId) => cId !== commentId);
  currCommentThreadsObj[commentThreadId] = newCommentIdsForThread;
  localStorageService.updateCommentsThreadInLocalStorage(currCommentThreadsObj);
  return newCommentIdsForThread;
}

export const removeCommentThreadId = (commentThreadId) => {
  const currCommentThreadsObj = localStorageService.getCommentThreadsFromLocalStorage();
  delete currCommentThreadsObj[commentThreadId];
  localStorageService.updateCommentsThreadInLocalStorage(currCommentThreadsObj);
}

export const getCommentsForThreadId = (commentThreadId) => {
    const currCommentThreadsObj = localStorageService.getCommentThreadsFromLocalStorage();
    const currCommentsObj =localStorageService.getCommentsFromLocalStorage();
    const commentIds = currCommentThreadsObj[commentThreadId];
    const commentsList = [];
    for(const commentId of commentIds) {
        const commentObj = currCommentsObj[commentId];
      commentsList.push({
        ...commentObj,
        commentId
      });
    }
    return commentsList;
}