// just calls /api/auride/setUserFirstRecord
// see /server/api/auride/setUserFirstRecord.js for functionality code
export async function createFirstUserRecord() {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user) {
        console.error("User not logged in.");
        return;
    }

    try {
        const token = await user.getIdToken();

        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auride/setUserFirstRecord`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.log("Response not ok. Response from server:", error);
            return;
        }

        const uMessage = await response.json();
        console.log("Good response:", uMessage);
    } catch (err) {
        console.error("Failed to set user data:", err);
    }
}

window.createFirstUserRecord = createFirstUserRecord;