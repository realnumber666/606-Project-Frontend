function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();


        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        setFormMessage(createAccountForm, "error", "Signup failed");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });

    function performLogin() {
        const username = loginForm.querySelector("input[type='text']").value;
        const password = loginForm.querySelector("input[type='password']").value;
    
        const requestBody = {
            username: username,
            password: password,
        };
    
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                localStorage.setItem("username", username);
                window.location.href = 'home.html';
            } else if (data.status === 202 && data.data.error_msg) {
                setFormMessage(loginForm, "error", data.data.error_msg);
            } else {
                setFormMessage(loginForm, "error", "An error occurred. Please try again later.");
            }
        })
        .catch(error => {
            setFormMessage(loginForm, "error", "An error occurred. Please try again later.");
        });
    }
    
    
    

    function performSignup() {
        const createAccountForm = document.getElementById("createAccount");
        const usernameInput = createAccountForm.querySelector("#signupUsername");
        const fullNameInput = createAccountForm.querySelector('#fullName');
        const passwordInput = createAccountForm.querySelectorAll("input[type='password']")[0];
        const confirmPasswordInput = createAccountForm.querySelectorAll("input[type='password']")[1];
    
        const username = usernameInput.value;
        const fullName = fullNameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
    
        clearInputError(usernameInput);
        clearInputError(fullNameInput);
        clearInputError(passwordInput);
        clearInputError(confirmPasswordInput);
    
        let hasError = false;
    
        if (!/^(?=.*[A-Za-z])[A-Za-z0-9_]+$/.test(username)) {
            setInputError(usernameInput, "Username should contain at least one alphabet and can consist of alphabetic characters, digits, and underscores.");
            hasError = true;
        }
    
        if (!/^[A-Za-z ]+$/.test(fullName)) {
            setInputError(fullNameInput, "Full Name should contain only alphabets and spaces");
            hasError = true;
        }
    
        if (password.length < 6) {
            setInputError(passwordInput, "Password should be at least 6 characters long.");
            hasError = true;
        }
    
        if (confirmPassword !== password) {
            setInputError(confirmPasswordInput, "Passwords do not match.");
            hasError = true;
        }
    
        if (username.trim() === "") {
            setInputError(usernameInput, "Required field");
            hasError = true;
        }
    
        if (fullName.trim() === "") {
            setInputError(fullNameInput, "Required field");
            hasError = true;
        }
    
        if (confirmPassword.trim() === "") {
            setInputError(confirmPasswordInput, "Required field");
            hasError = true;
        }
    
        if (password.trim() === "" || confirmPassword.trim() === "") {
            setInputError(passwordInput, "Required field");
            hasError = true;
        }
    
        if (!hasError) {
            const requestBody = {
                username: username,
                password: password,
                fullName: fullName,
            };
    
            fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    localStorage.setItem("username", username);
                    window.location.href = 'home.html';
                } else if (data.status === 202 && data.data.error_msg) {
                    setFormMessage(createAccountForm, "error", data.data.error_msg);
                } else {
                    setFormMessage(createAccountForm, "error", "Signup failed. Please try again later.");
                }
            })
            .catch(error => {
                setFormMessage(createAccountForm, "error", "An error occurred while processing your request.");
            });
        }
    }
    

    document.querySelector("#loginButton").addEventListener("click", () => {
        performLogin();
    });

    document.querySelector("#signupButton").addEventListener("click", () => {
        performSignup();
    });
});
