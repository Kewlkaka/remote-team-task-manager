let formData;
let formData2;

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", async (event) => {
        formData = new FormData(signupForm);
        console.log(formData);
    })

    const signupForm2 = document.getElementById("signup-form2");
    signupForm2.addEventListener("submit", async (event) => {
        formData2 = new FormData(signupForm2);
        console.log(formData2);
    })

    const signupForm3 = document.getElementById("signup-form3");
    signupForm3.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData3 = new FormData(signupForm3);

        formData.forEach((value, key) => {
            formData3.append(key, value);
        });

        formData2.forEach((value, key) => {
            formData3.append(key, value);
        });

        const jsonObject = {};
        formData3.forEach((value, key) => {
            jsonObject[key] = value;
        });

        //d;

        // Display form data in console for debugging
        console.log("Form Data:", jsonObject);


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
            }
        } catch (error) {
            console.error("error:", error);
        }
    });
});


const nextButtons = document.querySelectorAll('.next-button');

nextButtons.forEach((nextButton) => {
    nextButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const currentSection = nextButton.closest('.section');
        const inputs = currentSection.querySelectorAll('input');
        let isValid = true;

        // Validate email and password
        if (currentSection.classList.contains('section-1')) {
            const emailInput = currentSection.querySelector('#email');
            const passwordInput = currentSection.querySelector('#password');

            // Perform email validation
            if (!isValidEmail(emailInput.value)) {
                // Show error message or style changes for invalid email
                isValid = false;
            }

            // Perform password complexity validation
            if (!isValidPassword(passwordInput.value)) {
                // Show error message or style changes for invalid password
                isValid = false;
            }
        }

        // Proceed if all validations passed
        if (isValid && currentSection.checkValidity()) {
            /*inputs.forEach(input => {
                formData[input.name] = input.value;
            });*/

            if (currentSection.nextElementSibling) {
                const nextSection = currentSection.nextElementSibling;
                currentSection.classList.remove('active');
                nextSection.classList.add('active');
            }
        }
    });
});

const errorMessageContainer = document.getElementById("errorMessage");
const errorMessageContainerEmail = document.getElementById("errorMessageEmail");

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isCorrect = emailPattern.test(email);
    if (!isCorrect) {
        errorMessageContainerEmail.innerHTML = `<p style="color: red;">Invalid Email</p>`
    }
    return emailPattern.test(email);
}

function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isCorrect = passwordPattern.test(password);
    if (!isCorrect) {
        errorMessageContainer.innerHTML = `<p style="color: red;">Password must be atleast 8 characters long, with atleast 1 uppercase letter and a digit</p>`
    }
    return passwordPattern.test(password);
}



/*const recaptchaResponse = grecaptcha.getResponse();
if (!recaptchaResponse) {
    // Show an error message or handle the lack of reCAPTCHA response
    const errorMessageContainer = document.getElementById("errorMessage");
    errorMessageContainer.innerHTML = `<p style="color: red;">Please complete the reCAPTCHA challenge</p>`;
    return;
}*/
