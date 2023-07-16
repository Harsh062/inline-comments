import { v4 as uuidv4 } from 'uuid';

export const updateDraft = (draftId, mutatedDraftContent) => {
  const allDrafts = getAllDrafts();
  for(const dId in allDrafts) {
    if(dId === draftId) {
      allDrafts[dId].draftContent = mutatedDraftContent;
    }
  }
  localStorage.setItem("drafts", JSON.stringify(allDrafts));
}

export const getAllDrafts = () => {
  console.log(JSON.parse(localStorage.getItem("drafts")));
  return JSON.parse(localStorage.getItem("drafts"));
}

export const getDraftById = (draftId) => {
  const draft = getAllDrafts()[draftId];
  if(!draft) {
    return new Error("No draft exists");
  }
  return draft;
}

export const generateCommentThreadId = () => {
  return `comment-thread-${uuidv4()}`;
}

export const generateCommentId = () => {
  return `comment-${uuidv4()}`;
}

export const addCommentToThread = (commentThreadId, comment) => {
  const commentId = generateCommentId();
  const currCommentThreadsObj = getCurrCommentsThreadObj();
  const commentIds = getCommentIdsForCommentThreadId(commentThreadId);
  const currCommentsObj = getCurrCommentsObj();
  if(!commentIds) {
    console.log("No comments exists. Adding first comment...");
    currCommentThreadsObj[commentThreadId] = [];
  }
  currCommentThreadsObj[commentThreadId].push(commentId);
  localStorage.setItem("commentsThreadObj", JSON.stringify(currCommentThreadsObj));
  currCommentsObj[commentId] = {
    ...comment
  };
  localStorage.setItem("comments", JSON.stringify(currCommentsObj));
}

const getCommentDetailsById = (commentId) => {
  return { 
    ...JSON.parse(localStorage.getItem("comments"))[commentId],
    commentId
  };
}

export const getCommentsForThreadId = (commentThreadId) => {
  const commentIds = getCommentIdsForCommentThreadId(commentThreadId);
  const commentsList = [];
  for(const commentId of commentIds) {
    commentsList.push(getCommentDetailsById(commentId));
  }
  return commentsList;
}

const getCurrCommentsThreadObj = () => {
  return JSON.parse(localStorage.getItem("commentsThreadObj")) ? JSON.parse(localStorage.getItem("commentsThreadObj")): {};
}

const getCurrCommentsObj = () => {
  return JSON.parse(localStorage.getItem("comments")) ? JSON.parse(localStorage.getItem("comments")): {};
}

const getCommentIdsForCommentThreadId = (commentThreadId) => {
  return JSON.parse(localStorage.getItem("commentsThreadObj")) ? JSON.parse(localStorage.getItem("commentsThreadObj"))[commentThreadId] : null;
}

const comments = {};
if(!localStorage.getItem("drafts")) {
  const drafts = {
    33242342342: {
      draftTitle: "First Post",
      draftContent: "Before deciding to use a custom server, please keep in mind that it should only be used when the integrated router of Next.js can't meet your app requirements. A custom server will remove important performance optimizations, like serverless functions and Automatic Static Optimization."
    },
    33242342344: {
      draftTitle: "Second Post",
      draftContent: "By default, Next will serve each file in the pages folder under a pathname matching the filename. If your project uses a custom server, this behavior may result in the same content being served from multiple paths, which can present problems with SEO and UX. To disable this behavior and prevent routing based on files in pages, open next.config.js and disable the useFileSystemPublicRoutes config:"
    },
    33242342345: {
      draftTitle: "Third Post",
      draftContent: "By default, Next.js includes its own server with next start. If you have an existing backend, you can still use it with Next.js (this is not a custom server). A custom Next.js server allows you to start a server 100% programmatically in order to use custom server patterns. Most of the time, you will not need this - but it's available for complete customization."
    }
  }
  localStorage.setItem("drafts", JSON.stringify(drafts));
}

