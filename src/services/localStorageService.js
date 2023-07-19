export const getAllDraftsFromLocalStorage = () => {
    return typeof window !== "undefined" && typeof localStorage.getItem("drafts") === "string" ?
            JSON.parse(localStorage.getItem("drafts")) : null;
}

export const updateDraftsInLocalStorage = (drafts) => {
    if(typeof window !== "undefined") {
        localStorage.setItem("drafts", JSON.stringify(drafts));
    }
}

export const getCommentThreadsFromLocalStorage = () => {
    return typeof window !== "undefined" && typeof localStorage.getItem("commentsThreadObj") === "string" ?
        JSON.parse(localStorage.getItem("commentsThreadObj")): {};
}
  
export const getCommentsFromLocalStorage = () => {
    return  typeof window !== 'undefined' && typeof localStorage.getItem("comments") === "string" ?
        JSON.parse(localStorage.getItem("comments")): {};
}

export const updateCommentsThreadInLocalStorage = (commentsThreadObj) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem("commentsThreadObj", JSON.stringify(commentsThreadObj));
    }
}

export const updateCommentsInLocalStorage = (commentsObj) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem("comments", JSON.stringify(commentsObj));
    }
}