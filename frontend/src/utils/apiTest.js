import { API_BASE_URL } from "./constants";

/**
 * Test API connection to backend
 */
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    if (response.ok) {
      console.log("✅ API Connection successful:", data);
      return { success: true, data };
    } else {
      console.error("❌ API Connection failed:", data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error("❌ API Connection error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test authentication endpoints
 */
export const testAuthEndpoints = async () => {
  try {
    // Test register endpoint
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "testpassword123",
      }),
    });

    const registerData = await registerResponse.json();
    console.log("Register endpoint test:", registerData);

    return { success: true, data: registerData };
  } catch (error) {
    console.error("Auth endpoints test error:", error.message);
    return { success: false, error: error.message };
  }
};
