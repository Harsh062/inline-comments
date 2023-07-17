import { v4 as uuidv4 } from 'uuid';

export const updateDraft = (draftId, mutatedDraftContent) => {
  const allDrafts = getAllDrafts();
  for(const dId in allDrafts) {
    if(dId === draftId) {
      allDrafts[dId].draftContent = mutatedDraftContent;
    }
  }
  if(typeof window !== "undefined") {
    localStorage.setItem("drafts", JSON.stringify(allDrafts));
  }
}

export const getAllDrafts = () => {
  if(typeof window !== 'undefined') {
    console.log(JSON.parse(localStorage.getItem("drafts")));
    return JSON.parse(localStorage.getItem("drafts"));
  } else {
    
  }
}

export const getDraftById = (draftId) => {
  const draft = getAllDrafts()[draftId];
  if(!draft) {
    return new Error("No draft exists");
  }
  return draft;
}

export const generateCommentThreadId = () => {
  return `ct-${uuidv4()}`;
}

export const generateCommentId = () => {
  return `c-${uuidv4()}`;
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
 
  currCommentsObj[commentId] = {
    ...comment
  };
  if(typeof window !== 'undefined') {
    localStorage.setItem("commentsThreadObj", JSON.stringify(currCommentThreadsObj));
    localStorage.setItem("comments", JSON.stringify(currCommentsObj));
  }
}

const getCommentDetailsById = (commentId) => {
  if(typeof window !== 'undefined') {
    return { 
      ...JSON.parse(localStorage.getItem("comments"))[commentId],
      commentId
    };
  }
  return {};
  
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
  return typeof window !== 'undefined' && JSON.parse(localStorage.getItem("commentsThreadObj")) ? JSON.parse(localStorage.getItem("commentsThreadObj")): {};
}

const getCurrCommentsObj = () => {
  return  typeof window !== 'undefined' && JSON.parse(localStorage.getItem("comments")) ? JSON.parse(localStorage.getItem("comments")): {};
}

const getCommentIdsForCommentThreadId = (commentThreadId) => {
  return  typeof window !== 'undefined' && JSON.parse(localStorage.getItem("commentsThreadObj")) ? JSON.parse(localStorage.getItem("commentsThreadObj"))[commentThreadId] : null;
}

const comments = {};
if(typeof window !== 'undefined' && !localStorage.getItem("drafts")) {
  const drafts = {
    33242342342: {
      draftTitle: "What is Lorem Ipsum?",
      draftContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
    },
    33242342344: {
      draftTitle: "Why do we use it?",
      draftContent: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
    },
    33242342345: {
      draftTitle: "1914 translation by H. Rackham",
      draftContent: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?."
    },
    33242342346: {
      draftTitle: "The standard Lorem Ipsum passage, used since the 1500s",
      draftContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    33242342347: {
      draftTitle: "Section 1.10.32 of de Finibus Bonorum et Malorum, written by Cicero in 45 BC",
      draftContent: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?."
    }
  }
  localStorage.setItem("drafts", JSON.stringify(drafts));
}

