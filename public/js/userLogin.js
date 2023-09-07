document.addEventListener("DOMContentLoaded", () => {
    // Capture the form submission event
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (event) => { //reyans
        event.preventDefault(); // Prevent default form submission behavior


        const formData = new FormData(loginForm);

        const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        }); //reyans


        console.log("Form Data:", Object.fromEntries(formData.entries()));

        try {
            const response = await fetch("/users/sign-in/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonObject),
            }); //reyans
            console.log("Response Status:", response.status);
            console.log("Response Message:", await response.text());

            if (response.ok) {
                console.log('Success');
                window.location.href = '/dashboard';
            } //reyans

            if (!response.ok) {
                const errorMessage = await response.text();
                const errorMessageContainer = document.getElementById("errorMessage");
                errorMessageContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
            }
        } catch (error) {
            console.error("error:", error);
        }
    });
});