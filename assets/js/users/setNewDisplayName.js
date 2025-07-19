export async function setNewDisplayName(display) {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User not logged in.");
        return false;
    }

    try {
        const token = await user.getIdToken();

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auride/setDisplayName`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newDisplay: display
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Response not ok. Server response::", error);
            return false;
        }

        const responseData = await response.json();
        console.log("Server succeeded:", responseData);
        return true;
    } catch (err) {
        console.error("Failed to set user data", err);
        return false;
    }
}

window.setNewDisplayName = setNewDisplayName;