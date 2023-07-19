import * as localStorageService from "./localStorageService";
import { drafts } from "../db/drafts";

export const getAllDrafts = () => {
    // If no drafts are found in local storage (which will happen for the first time), populate static posts data
    if(!localStorageService.getAllDraftsFromLocalStorage()) {
        console.log("No data found in local storage. Populating static data: ");
        localStorageService.updateDraftsInLocalStorage(drafts);
    } 
    return localStorageService.getAllDraftsFromLocalStorage();
}

export const updateDraft = (draftId, draftContent) => {
    const allDrafts = getAllDrafts();
    for(const dId in allDrafts) {
      if(dId === draftId) {
        allDrafts[dId].draftContent = draftContent;
      }
    }
   localStorageService.updateDraftsInLocalStorage(allDrafts);
}

export const getDraftById = (draftId) => {
    const draft = localStorageService.getAllDraftsFromLocalStorage()[draftId];
    if(!draft) {
        console.log("Draft not found for draftId: ", draftId);
        return new Error("No draft exists");
    }
    return draft;
}