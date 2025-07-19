export async function fetchProtectedUserData(uid) {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User not logged in.");
        return;
    }

    try {
        const token = await user.getIdToken();

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auride/getUser`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Auride-UID": uid
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("User data from server:", userData);
            return;
        }

        const userData = await response.json();
        console.log("User data from server:", userData);
    } catch (err) {
        console.error("Failed to fetch user data", err);
    }
}

window.fetchProtectedUserData = fetchProtectedUserData;