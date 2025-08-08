import { fetchWrapper } from "../../utils/fetchWrapper";

const passwordResetService = {
  async requestReset(email) {
    return fetchWrapper.post("/api/users/password-reset/", { email });
  },
  async confirmReset(uidb64, token, new_password1, new_password2) {
    // Properly encode the URL parameters to handle special characters
    const encodedUidb64 = encodeURIComponent(uidb64);
    const encodedToken = encodeURIComponent(token);
    
    return fetchWrapper.post(
      `/api/users/password-reset-confirm/${encodedUidb64}/${encodedToken}/`,
      { new_password1, new_password2 }
    );
  },
};

export default passwordResetService; 