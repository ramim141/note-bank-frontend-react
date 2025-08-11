import { fetchWrapper } from "../../utils/fetchWrapper";
import { toggleBookmarkNote } from "./userService";

const bookmarkService = {
  async getBookmarkedNotes(params = {}) {
    // params: { category_name }
    let query = "";
    if (params.category_name) {
      query = `?category_name=${encodeURIComponent(params.category_name)}`;
    }
    return fetchWrapper.get(`/api/users/user-activity/bookmarked-notes/${query}`);
  },

  async removeBookmark(noteId) {
    return toggleBookmarkNote(noteId);
  },
};

export default bookmarkService; 