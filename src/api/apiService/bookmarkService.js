import { fetchWrapper } from "../../utils/fetchWrapper";

const bookmarkService = {
  async getBookmarkedNotes(params = {}) {
    // params: { category_name }
    let query = "";
    if (params.category_name) {
      query = `?category_name=${encodeURIComponent(params.category_name)}`;
    }
    return fetchWrapper.get(`/api/users/user-activity/bookmarked-notes/${query}`);
  },
};

export default bookmarkService; 