export async function setNewUsername(username) {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user) return { success: false, error: "Not logged in." };

    try {
        const token = await user.getIdToken();

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auride/setUsername`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                requestedUsername: username
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData?.message || "Failed to set username." };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: "Network or server error. Please try again later." };
    }
}

window.setNewUsername = setNewUsername;