import { refreshApi } from "./api";

export const refreshToken = async () => {
  try {
    const res = await refreshApi.get("/user/refresh-token");

    if (res.data?.success && res.data?.accessToken) {
      // ✅ Save new access token
      localStorage.setItem("accessToken", res.data.accessToken);

      return res.data.accessToken;
    }

    // If backend returned success:false(means there is no refress token)
    return null;
  } catch (error) {
    // ❗ DO NOT redirect here
    // Let interceptor decide what to do (logout or ignore on public page)

    return null;
  }
};
