import { fetchWrapper } from "../../utils/fetchWrapper";

const passwordChangeService = {
  async changePassword({ old_password, new_password, new_password2 }) {
    return fetchWrapper.put("/api/users/change-password/", {
      old_password,
      new_password,
      new_password2,
    });
  },
};

export default passwordChangeService; 