import { fetchWrapper } from "../../utils/fetchWrapper";

const passwordResetService = {
  async requestReset(email) {
    return fetchWrapper.post("/api/users/password-reset/", { email });
  },
  async confirmReset(uidb64, token, new_password1, new_password2) {
    return fetchWrapper.post(
      `/api/users/password-reset-confirm/${uidb64}/${token}/`,
      { new_password1, new_password2 }
    );
  },
};

export default passwordResetService; 