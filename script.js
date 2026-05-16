/* ============================================================
   RooMatch - Main JavaScript Logic
   Includes: Profile Editing, Search Filtering, Validations, and Navigation
   ============================================================ */

document.addEventListener("DOMContentLoaded", function() {

    // --- Navigation & Logout Logic ---
    // Redirect user to login page after logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            window.location.href = 'login.html';
        });
    }

    // --- Forgot Password Placeholder ---
   const forgotPasswordLink = document.getElementById("forgotPasswordLink");
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener("click", function(event) {
                event.preventDefault();

                const emailInput = document.getElementById("email");

                if (!emailInput || emailInput.value.trim() === "") {
                    alert("Please enter your email address first.");
                    return;
                }

                if (!emailInput.checkValidity()) {
                    alert("Please enter a valid email address.");
                    return;
                }

                alert("Password reset instructions were sent to your email.");
            });
        }

    // --- Profile Page Logic ---
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {

        const editBtn = document.getElementById("editBtn");
        const saveBtn = document.getElementById("saveBtn");

        // Editable profile fields
        const editableFields = [
            "gender", "occupation", "description", "profilePic",
            "location", "budget", "cleanliness", "smoking", "pets", "phone"
        ];

        // Enable editing mode
        if (editBtn && saveBtn) {
            editBtn.addEventListener("click", function() {

                editableFields.forEach(function(fieldId) {
                    const field = document.getElementById(fieldId);
                    if (field) field.removeAttribute("disabled");
                });

                saveBtn.removeAttribute("disabled");

                editBtn.textContent = "Editing Mode...";
                editBtn.disabled = true;
            });
        }
    }

    // --- Search Page Logic ---

    // Toggle contact information visibility
    const contactButtons = document.querySelectorAll('.contact-btn');

    contactButtons.forEach(function(button) {

        button.addEventListener('click', function() {

            const contactInfo = this.nextElementSibling;

            if (contactInfo && contactInfo.classList.contains('hidden')) {

                contactInfo.classList.remove('hidden');

                this.textContent = 'Hide Contact Info';

                this.classList.replace('btn-secondary', 'btn-primary');

            } else if (contactInfo) {

                contactInfo.classList.add('hidden');

                this.textContent = 'Show Contact Info';

                this.classList.replace('btn-primary', 'btn-secondary');
            }
        });
    });

    // Filtering profiles logic
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');

    if (applyFiltersBtn) {

        applyFiltersBtn.addEventListener('click', function() {

            const minAge = parseInt(document.getElementById('filterAgeMin').value) || 0;
            const maxAge = parseInt(document.getElementById('filterAgeMax').value) || 100;

            const gender = document.getElementById('filterGender').value;
            const smoking = document.getElementById('filterSmoking').value;
            const pets = document.getElementById('filterPets').value;

            const cards = document.querySelectorAll('.profile-card');

            let foundAny = false;

            cards.forEach(card => {

                const cardAge = parseInt(card.getAttribute('data-age'));
                const cardGender = card.getAttribute('data-gender');
                const cardSmoking = card.getAttribute('data-smoking');
                const cardPets = card.getAttribute('data-pets');

                // Matching conditions
                const matchAge = cardAge >= minAge && cardAge <= maxAge;
                const matchGender = (gender === 'any' || cardGender === gender);
                const matchSmoking = (smoking === 'any' || cardSmoking === smoking);
                const matchPets = (pets === 'any' || cardPets === pets);

                // Show only matching profiles
                if (matchAge && matchGender && matchSmoking && matchPets) {

                    card.style.display = 'block';

                    foundAny = true;

                } else {

                    card.style.display = 'none';
                }
            });

            // No results message
            const noResults = document.getElementById('noResultsMsg');

            if (noResults) {
                noResults.style.display = foundAny ? 'none' : 'block';
            }
        });
    }

    // --- Form Validations & Redirection ---
    const forms = document.querySelectorAll('form');

    forms.forEach(function(form) {

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            let isValid = true;

            const formId = form.id;

            // Clear previous validation messages
            document.querySelectorAll('.error-msg').forEach(function(span) {

                span.style.display = 'none';

                span.textContent = '';
            });

            form.querySelectorAll('input, select, textarea').forEach(function(field) {
                field.classList.remove('input-error');
            });

            // Show validation error
            function showError(fieldId, message) {
                const errorSpan = document.getElementById(fieldId + "Error");
                const field = document.getElementById(fieldId);

                if (errorSpan) {
                    errorSpan.textContent = message;
                    errorSpan.style.display = 'block';
                }

                if (field) {
                    field.classList.add('input-error');
                }

                isValid = false;
            }

            // Login form redirection
            if (formId === 'loginForm') {

                event.preventDefault();

                window.location.href = 'profile.html';

                return;
            }

            // Signup & profile form validations
            if (formId === 'signupForm' || formId === 'profileForm') {

                // Budget validation
                const budget = document.getElementById('budget');

                if (budget && parseFloat(budget.value) <= 0) {

                    showError('budget', "Please enter a valid monthly budget (greater than 0).");
                }

                // Age validation
                const birthdate = document.getElementById('birthdate') || document.getElementById('dob');

                if (birthdate && birthdate.value) {

                    const birthYear = new Date(birthdate.value).getFullYear();

                    const currentYear = new Date().getFullYear();

                    if (currentYear - birthYear < 18) {

                        showError(birthdate.id, "You must be at least 18 years old.");
                    }
                }

                // Password validation
                if (formId === 'signupForm') {

                    const password = document.getElementById('password');

                    const confirmPassword = document.getElementById('confirmPassword');

                    if (password && confirmPassword) {

                        if (password.value.length < 6) {

                            showError('password', "Password must be at least 6 characters long.");
                        }

                        if (password.value !== confirmPassword.value) {

                            showError('confirmPassword', "Passwords do not match.");
                        }
                       
                    }
                }
            }

            // Phone number validation
            const phone = form.querySelector('#phone');

            if (phone) {
                const phoneVal = phone.value.trim();
                const isNumeric = /^\d+$/.test(phoneVal);

                if (phoneVal === "") {
                    showError('phone', "Please enter your phone number.");

                } else if (!isNumeric) {
                    showError('phone', "מספר הטלפון חייב להכיל ספרות בלבד.");

                } else if (phoneVal.length !== 10) {
                    showError('phone', "מספר הטלפון חייב להכיל בדיוק 10 ספרות.");

                } else if (phoneVal[0] !== '0') {
                    showError('phone', "מספר הטלפון חייב להתחיל בספרה 0.");
                }
            }
            // Final validation result
            if (isValid) {


                // Signup success
                if (formId === "signupForm") {

                    alert("Account created successfully! Redirecting to profile...");

                    window.location.href = 'profile.html';

                }

                // Profile update success
                else if (formId === "profileForm") {

                    alert("Profile updated successfully!");

                    // Disable fields after saving
                    const editableFields = [
                        "gender", "occupation", "description", "profilePic",
                        "location", "budget", "cleanliness", "smoking", "pets"
                    ];

                    editableFields.forEach(function(fieldId) {

                        const field = document.getElementById(fieldId);

                        if (field) field.setAttribute("disabled", "true");
                    });

                    // Reset buttons
                    const editBtn = document.getElementById("editBtn");

                    const saveBtn = document.getElementById("saveBtn");

                    if (editBtn) {

                        editBtn.disabled = false;

                        editBtn.textContent = "Edit Profile";
                    }

                    if (saveBtn) {

                        saveBtn.disabled = true;
                    }
                }

            } else {

                // Prevent form submission if validation fails
                event.preventDefault();
            }
        });
    });
});