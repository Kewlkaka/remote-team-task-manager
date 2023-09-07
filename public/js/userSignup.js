console.log("Active");

const companyAccButton = document.getElementById('companyAcc');
const employeeAccButton = document.getElementById('employeeAcc');
console.log(employeeAccButton);
let itemsAppended = false;
let role;

document.addEventListener("DOMContentLoaded", () => {
    // Capture the form submission event
    //reyanscode
    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Collect form data
        const formData = new FormData(signupForm);
        formData.delete("radio-group");

        const jsonObject = {}; //reyans
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });

        // Display form data in console for debugging
        console.log("Form Data:", Object.fromEntries(formData.entries()));


        // Send form data to the server using an HTTP POST request
        try {
            const response = await fetch("/users/create-account/signup/orgAccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonObject),
            });

            // Display response status and message in console
            console.log("Response Status:", response.status);
            console.log("Response Message:", await response.text());

            if (response.ok) {
                console.log('Success');
                window.location.href = '/dashboard';
            }

            if (!response.ok) {
                // Handle errors or display appropriate messages
                const errorMessage = await response.text();
                const errorMessageContainer = document.getElementById("errorMessage");
                errorMessageContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
            } //reyans
        } catch (error) {
            console.error("error:", error);
        }
    });
});


companyAccButton.addEventListener("click", (event) => {
    if (!itemsAppended) {
        console.log(event.target);
        let divPrompt = document.getElementsByClassName('addedPrompt');
        let orgNamePrompt = document.createElement("p"); //reyans
        orgNamePrompt.textContent = "What is your organizations name";

        divPrompt[0].append(orgNamePrompt);

        const divInputContainer = document.getElementsByClassName('added-input-container'); //reyans

        for (let i = 0; i < divInputContainer.length; i++) {
            let inputOrgName = document.createElement("input");
            inputOrgName.setAttribute("type", "text"); // Set the type attribute
            inputOrgName.setAttribute("id", "orgName"); // Set the id attribute
            inputOrgName.setAttribute("name", "name"); // Set the name attribute
            inputOrgName.setAttribute("required", ""); // Set the required attribute

            let labelOrgName = document.createElement("label");
            labelOrgName.setAttribute("for", "orgName");
            labelOrgName.setAttribute("id", "companyAcc");
            labelOrgName.textContent = "Organization Name";

            let insertSpanBar = document.createElement("span");
            insertSpanBar.setAttribute("class", "bar"); //reyans

            divInputContainer[i].appendChild(inputOrgName);
            divInputContainer[i].appendChild(labelOrgName);
            divInputContainer[i].appendChild(insertSpanBar);
            itemsAppended = true;
            role = 'Business Owner';
        }
    }
});

employeeAccButton.addEventListener("click", (event) => { //reyans
    console.log("Fired");
    const appendedContainer = document.querySelector('.added-input-container');
    const promptContainer = document.querySelector('.addedPrompt');
    const appendedContainer2 = document.querySelector('.added-input-container2');
    const promptContainer2 = document.querySelector('.addedPrompt2'); //reyans

    while (appendedContainer.firstChild) {
        appendedContainer.removeChild(appendedContainer.firstChild);
    }
    while (promptContainer.firstChild) {
        promptContainer.removeChild(promptContainer.firstChild);
    } //reyans

    while (appendedContainer2.firstChild) {
        appendedContainer2.removeChild(appendedContainer2.firstChild);
    }
    while (promptContainer2.firstChild) {
        promptContainer2.removeChild(promptContainer2.firstChild);
    } //reyans

    role = 'Employee';
    itemsAppended = false; // Reset the flag

})