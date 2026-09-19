/* =====================================================
   BLOOD LINK AUTHENTICATION & MANAGEMENT SYSTEM
   Includes Blood Link & Donation Portal for Hospitals
===================================================== */

let currentRole = "";
window.currentHospCaptcha = "";

/* =====================================================
   ROLE INFORMATION (For Donor, Consumer, NGO)
===================================================== */

const roleData = {
    donor: {
        name: "Donor",
        icon: "fa-hand-holding-droplet",
        fields: `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="signupName" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="signupEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <div class="phone-input-container" style="display: flex; align-items: center; border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #fff;">
                    <span style="padding: 0 12px; background: #F8FAFC; color: #475569; font-weight: 700; font-size: 13px; border-right: 1px solid #E2E8F0; user-select: none; line-height: 42px;">+91</span>
                    <input type="tel" id="signupPhone" inputmode="numeric" maxlength="10" placeholder="9876543210" style="border: none; outline: none; box-shadow: none; flex: 1; padding: 10px 12px; font-family: monospace;" required oninput="this.value = this.value.replace(/\D/g, '').slice(0, 10)">
                </div>
                <small style="color: #64748B; font-size: 11px; margin-top: 4px; display: block;">10-digit mobile number (starting with 6, 7, 8, or 9)</small>
            </div>
            <div class="form-group">
                <label>Blood Group</label>
                <select id="signupBloodGroup" required>
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                </select>
            </div>
            <div class="form-group">
                <label>Age</label>
                <input type="number" id="signupAge" min="18" max="65" placeholder="Enter your age" required>
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" id="signupCity" placeholder="Enter your city" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="signupPassword" placeholder="Create a password" required>
            </div>
        `
    },

    consumer: {
        name: "Consumer / Recipient",
        icon: "fa-user",
        fields: `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="signupName" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="signupEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <div class="phone-input-container" style="display: flex; align-items: center; border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #fff;">
                    <span style="padding: 0 12px; background: #F8FAFC; color: #475569; font-weight: 700; font-size: 13px; border-right: 1px solid #E2E8F0; user-select: none; line-height: 42px;">+91</span>
                    <input type="tel" id="signupPhone" inputmode="numeric" maxlength="10" placeholder="9876543210" style="border: none; outline: none; box-shadow: none; flex: 1; padding: 10px 12px; font-family: monospace;" required oninput="this.value = this.value.replace(/\D/g, '').slice(0, 10)">
                </div>
                <small style="color: #64748B; font-size: 11px; margin-top: 4px; display: block;">10-digit mobile number (starting with 6, 7, 8, or 9)</small>
            </div>
            <div class="form-group">
                <label>Blood Group Required</label>
                <select id="signupBloodGroup" required>
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                </select>
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" id="signupCity" placeholder="Enter your city" required>
            </div>
            <div class="form-group">
                <label>Emergency Level</label>
                <select id="signupEmergency" required>
                    <option value="">Select Emergency Level</option>
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Emergency</option>
                </select>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="signupPassword" placeholder="Create a password" required>
            </div>
        `
    },

    hospital: {
        name: "Hospital / Blood Bank",
        icon: "fa-hospital",
        fields: ``
    },

    ngo: {
        name: "NGO",
        icon: "fa-people-group",
        fields: `
            <div class="form-group">
                <label>NGO Name</label>
                <input type="text" id="signupName" placeholder="Enter NGO name" required>
            </div>
            <div class="form-group">
                <label>NGO Registration Number</label>
                <input type="text" id="signupLicense" placeholder="Enter NGO registration number" required>
            </div>
            <div class="form-group">
                <label>Official Email</label>
                <input type="email" id="signupEmail" placeholder="Enter official NGO email" required>
            </div>
            <div class="form-group">
                <label>Contact Number</label>
                <input type="tel" id="signupPhone" placeholder="Enter NGO contact number" required>
            </div>
            <div class="form-group">
                <label>NGO Address</label>
                <input type="text" id="signupAddress" placeholder="Enter NGO address" required>
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" id="signupCity" placeholder="Enter NGO city" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="signupPassword" placeholder="Create a password" required>
            </div>
        `
    }
};

/* =====================================================
   BLOOD LINK & DONATION PORTAL (HOSPITAL AUTHENTICATION)
===================================================== */

/**
 * Open dedicated Blood Link & Donation Portal view
 */
function openHospitalPortal() {
    currentRole = "hospital";

    const roleSelection = document.getElementById("roleSelection");
    const authFormContainer = document.getElementById("authFormContainer");
    const hospitalSection = document.getElementById("hospitalAuthSection");

    if (roleSelection) roleSelection.classList.add("hidden");
    if (authFormContainer) authFormContainer.classList.add("hidden");
    if (hospitalSection) hospitalSection.classList.remove("hidden");

    // Default to Sign In tab
    switchHospitalTab('signin');

    // Generate fresh visual security captcha
    refreshHospCaptcha();

    // Check remembered licence number
    const rememberedLicense = localStorage.getItem("bloodlinkRememberedHospLicense");
    if (rememberedLicense) {
        const loginLicenseInput = document.getElementById("hospLoginLicense");
        if (loginLicenseInput) {
            loginLicenseInput.value = rememberedLicense;
            const passInput = document.getElementById("hospLoginPassword");
            if (passInput) passInput.focus();
        }
    }

    clearMessage();
}

/**
 * Switch between Hospital Sign In and Sign Up tabs
 */
function switchHospitalTab(tab) {
    const signInTab = document.getElementById("hospTabSignIn");
    const signUpTab = document.getElementById("hospTabSignUp");
    const signInCard = document.getElementById("hospSignInCard");
    const signUpCard = document.getElementById("hospSignUpCard");

    if (!signInTab || !signUpTab || !signInCard || !signUpCard) return;

    if (tab === 'signin') {
        signInTab.classList.add("active");
        signUpTab.classList.remove("active");
        signInCard.classList.remove("hidden");
        signUpCard.classList.add("hidden");

        const licenseInput = document.getElementById("hospLoginLicense");
        if (licenseInput && !licenseInput.value) {
            licenseInput.focus();
        }
    } else {
        signInTab.classList.remove("active");
        signUpTab.classList.add("active");
        signInCard.classList.add("hidden");
        signUpCard.classList.remove("hidden");

        // Fresh captcha when switching to sign up
        refreshHospCaptcha();

        const hospNameInput = document.getElementById("hospSignupHospitalName");
        if (hospNameInput) hospNameInput.focus();
    }
}

/**
 * Generate Visual Security Captcha on Canvas with Blood Donation Crimson Accent
 */
function refreshHospCaptcha() {
    const canvas = document.getElementById("hospCaptchaCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Characters without easily confused glyphs (no 0/O, 1/I)
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    window.currentHospCaptcha = code;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient (soft crimson/rose tint)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#FFF5F5");
    bgGradient.addColorStop(1, "#FFEBEE");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw interference curved lines
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 80 + 160)}, ${Math.floor(Math.random() * 40)}, ${Math.floor(Math.random() * 40)}, 0.45)`;
        ctx.lineWidth = Math.random() * 1.5 + 1;
        ctx.moveTo(0, Math.random() * height);
        ctx.bezierCurveTo(
            width * 0.3, Math.random() * height,
            width * 0.7, Math.random() * height,
            width, Math.random() * height
        );
        ctx.stroke();
    }

    // Draw interference dots / noise
    for (let i = 0; i < 35; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 100 + 150)}, 40, 40, 0.35)`;
        ctx.fill();
    }

    // Render characters with individual rotation and medical red/slate colors
    const textColors = ["#B71C1C", "#D32F2F", "#C62828", "#881337", "#991B1B", "#E53935"];
    const charSpacing = width / 7;

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        ctx.save();

        const x = (i + 1) * charSpacing;
        const y = height / 2 + (Math.random() * 6 - 3);

        ctx.translate(x, y);
        const angle = (Math.random() * 36 - 18) * (Math.PI / 180);
        ctx.rotate(angle);

        ctx.font = `bold ${Math.floor(Math.random() * 4 + 20)}px "Inter", Arial, sans-serif`;
        ctx.fillStyle = textColors[i % textColors.length];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, 0, 0);

        ctx.restore();
    }

    // Clear captcha input
    const captchaInput = document.getElementById("hospCaptchaInput");
    if (captchaInput) {
        captchaInput.value = "";
    }
}

/**
 * Handle Hospital Sign Up Submission
 * Strictly includes: Hospital Name, Hospital Location, Hospital Licence Number, Password, Confirm Password, Captcha
 */
function handleHospitalSignUp(event) {
    event.preventDefault();

    const hospitalName = document.getElementById("hospSignupHospitalName").value.trim();
    const location = document.getElementById("hospSignupLocation").value.trim();
    const licenseNumber = document.getElementById("hospSignupLicense").value.trim();
    const password = document.getElementById("hospSignupPassword").value;
    const confirmPassword = document.getElementById("hospSignupConfirmPassword").value;
    const captchaInput = document.getElementById("hospCaptchaInput").value.trim();
    const signUpCard = document.getElementById("hospSignUpCard");

    // 1. Validate required fields
    if (!hospitalName || !location || !licenseNumber || !password || !confirmPassword || !captchaInput) {
        showToast("Please fill in all required registration fields.", "error");
        triggerShake(signUpCard);
        return;
    }

    // 2. Validate Password Length
    if (password.length < 6) {
        showToast("Password must be at least 6 characters long.", "error");
        triggerShake(signUpCard);
        document.getElementById("hospSignupPassword").focus();
        return;
    }

    // 3. Validate Matching Passwords
    if (password !== confirmPassword) {
        showToast("Passwords do not match. Please verify password confirmation.", "error");
        triggerShake(signUpCard);
        document.getElementById("hospSignupConfirmPassword").focus();
        return;
    }

    // 4. Validate Captcha
    if (!window.currentHospCaptcha || captchaInput.toUpperCase() !== window.currentHospCaptcha.toUpperCase()) {
        showToast("Security captcha verification failed. Please try again.", "error");
        refreshHospCaptcha();
        triggerShake(document.querySelector(".hosp-captcha-section"));
        document.getElementById("hospCaptchaInput").focus();
        return;
    }

    // Save Hospital Account to Local Storage
    let hospitals = [];
    try {
        hospitals = JSON.parse(localStorage.getItem("bloodlinkRegisteredHospitals") || "[]");
    } catch (e) {
        hospitals = [];
    }

    const existingIndex = hospitals.findIndex(h => h.licenseNumber.toLowerCase() === licenseNumber.toLowerCase());
    const newHospital = {
        name: hospitalName,
        location: location,
        licenseNumber: licenseNumber,
        password: password,
        registeredAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        hospitals[existingIndex] = newHospital;
    } else {
        hospitals.push(newHospital);
    }

    localStorage.setItem("bloodlinkRegisteredHospitals", JSON.stringify(hospitals));
    localStorage.setItem("bloodlinkLastRegisteredLicense", licenseNumber);

    // Show Success Toast
    showToast(`Registration Successful! Account created for "${hospitalName}".`, "success");

    // Clear Sign Up Form
    document.getElementById("hospSignUpForm").reset();

    // Switch automatically to Sign In screen after brief transition
    setTimeout(() => {
        switchHospitalTab('signin');

        // Auto-fill Hospital Licence Number
        const loginLicenseInput = document.getElementById("hospLoginLicense");
        const loginPassInput = document.getElementById("hospLoginPassword");

        if (loginLicenseInput) {
            loginLicenseInput.value = licenseNumber;
            loginLicenseInput.classList.add("hosp-highlight-pulse");
            setTimeout(() => loginLicenseInput.classList.remove("hosp-highlight-pulse"), 2500);
        }

        if (loginPassInput) {
            loginPassInput.value = "";
            loginPassInput.focus();
        }

        // Prompt user to log in with Hospital Licence Number and Password
        showToast(`Please log in using your Hospital Licence Number (${licenseNumber}) and Password.`, "info");
    }, 650);
}

/**
 * Handle Hospital Sign In Submission
 * Specifically asks for: Hospital Licence Number and Password
 */
function handleHospitalSignIn(event) {
    event.preventDefault();

    const licenseInput = document.getElementById("hospLoginLicense");
    const passInput = document.getElementById("hospLoginPassword");
    const rememberCheckbox = document.getElementById("hospRememberMe");
    const signInCard = document.getElementById("hospSignInCard");

    const licenseNumber = licenseInput.value.trim();
    const password = passInput.value;

    if (!licenseNumber || !password) {
        showToast("Please enter both your Hospital Licence Number and Password.", "error");
        triggerShake(signInCard);
        return;
    }

    // Load registered hospitals
    let hospitals = [];
    try {
        hospitals = JSON.parse(localStorage.getItem("bloodlinkRegisteredHospitals") || "[]");
    } catch (e) {
        hospitals = [];
    }

    // Check credentials against registered hospitals
    const matchedHospital = hospitals.find(
        h => h.licenseNumber.toLowerCase() === licenseNumber.toLowerCase() && h.password === password
    );

    // Also support default demo verified credentials
    const isDemoMatch = (licenseNumber.toUpperCase() === "LIC-2026-001" && password === "Pass@123") ||
                        (licenseNumber.toUpperCase() === "HOSP-2026-001" && password === "Pass@123");

    if (matchedHospital || isDemoMatch) {
        const hospitalName = matchedHospital ? matchedHospital.name : "City Care Blood Centre & Hospital";

        // Remember Me handling
        if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem("bloodlinkRememberedHospLicense", licenseNumber);
        } else {
            localStorage.removeItem("bloodlinkRememberedHospLicense");
        }

        localStorage.setItem("bloodlinkUserName", hospitalName);
        localStorage.setItem("bloodlinkUserRole", "hospital");
        localStorage.setItem("bloodlinkUserLicense", licenseNumber);

        showToast(`Authentication successful! Welcome to LifeFlow, ${hospitalName}.`, "success");

        setTimeout(() => {
            openHospitalHub(hospitalName, licenseNumber);
        }, 700);
    } else {
        showToast("Invalid Hospital Licence Number or Password. Please check credentials or register.", "error");
        triggerShake(signInCard);
    }
}

/**
 * Fill demo verified hospital credentials for quick evaluation
 */
function fillDemoHospCredentials() {
    const licenseInput = document.getElementById("hospLoginLicense");
    const passInput = document.getElementById("hospLoginPassword");

    if (licenseInput && passInput) {
        licenseInput.value = "LIC-2026-001";
        passInput.value = "Pass@123";
        showToast("Demo credentials applied (LIC-2026-001 / Pass@123). Click 'Sign In' to proceed.", "info");
        passInput.focus();
    }
}

/**
 * Forgot Password mock helper
 */
function handleHospForgotPassword(event) {
    if (event) event.preventDefault();
    const license = document.getElementById("hospLoginLicense").value.trim();

    if (license) {
        showToast(`Password recovery verification sent to the authorized authority for Licence: ${license}.`, "info");
    } else {
        showToast("Please enter your Hospital Licence Number to recover your password.", "info");
        document.getElementById("hospLoginLicense").focus();
    }
}

/**
 * Trigger CSS Shake Animation on an Element
 */
function triggerShake(element) {
    if (!element) return;
    element.classList.remove("shake-element");
    void element.offsetWidth; // Force reflow
    element.classList.add("shake-element");
    setTimeout(() => element.classList.remove("shake-element"), 500);
}

/**
 * Show Modern Floating Toast Notification
 */
function showToast(message, type = "info") {
    let container = document.getElementById("hospToastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "hospToastContainer";
        container.className = "hosp-toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `hosp-toast toast-${type}`;

    let iconClass = "fa-circle-info";
    let title = "Notification";
    if (type === "success") {
        iconClass = "fa-circle-check";
        title = "Success";
    } else if (type === "error") {
        iconClass = "fa-circle-exclamation";
        title = "Notice";
    }

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <div class="toast-content">
            <strong>${title}</strong>
            <span>${message}</span>
        </div>
        <button type="button" class="toast-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(40px)";
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

/* =====================================================
   SELECT ROLE (Dispatches to Hospital or Standard Flow)
===================================================== */

function selectRole(role, defaultTab = 'login') {
    currentRole = role;

    if (role === "hospital") {
        openHospitalPortal();
        return;
    }

    const data = roleData[role];
    if (!data) return;

    document.getElementById("roleSelection").classList.add("hidden");
    const hospSection = document.getElementById("hospitalAuthSection");
    if (hospSection) hospSection.classList.add("hidden");

    document.getElementById("authFormContainer").classList.remove("hidden");
    document.getElementById("selectedRoleName").textContent = data.name;
    document.getElementById("selectedRoleIcon").innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    document.getElementById("signupFields").innerHTML = data.fields;

    if (defaultTab === 'signup') {
        showSignup();
    } else {
        showLogin();
    }
    clearMessage();
}

/* =====================================================
   BACK TO ROLE SELECTION
===================================================== */

function backToRoles() {
    currentRole = "";

    const authFormContainer = document.getElementById("authFormContainer");
    const hospitalSection = document.getElementById("hospitalAuthSection");
    const roleSelection = document.getElementById("roleSelection");

    if (authFormContainer) authFormContainer.classList.add("hidden");
    if (hospitalSection) hospitalSection.classList.add("hidden");
    if (roleSelection) roleSelection.classList.remove("hidden");

    clearMessage();
}

/* =====================================================
   STANDARD LOGIN TAB (Donor, Consumer, NGO)
===================================================== */

function showLogin() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    if (loginForm) loginForm.classList.remove("hidden");
    if (signupForm) signupForm.classList.add("hidden");
    if (loginTab) loginTab.classList.add("active");
    if (signupTab) signupTab.classList.remove("active");

    clearMessage();
}

/* =====================================================
   STANDARD SIGNUP TAB (Donor, Consumer, NGO)
===================================================== */

function showSignup() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    if (loginForm) loginForm.classList.add("hidden");
    if (signupForm) signupForm.classList.remove("hidden");
    if (loginTab) loginTab.classList.remove("active");
    if (signupTab) signupTab.classList.add("active");

    clearMessage();
}

/* =====================================================
   STANDARD SIGN UP SUBMIT (Donor, Consumer, NGO)
===================================================== */

function signupUser(event) {
    event.preventDefault();

    const phoneInput = document.getElementById("signupPhone");
    let formattedPhone = "";
    if (phoneInput) {
        let phoneVal = phoneInput.value.replace(/\D/g, '');
        if (phoneVal.length === 12 && phoneVal.startsWith("91")) phoneVal = phoneVal.slice(2);
        else if (phoneVal.length === 11 && phoneVal.startsWith("0")) phoneVal = phoneVal.slice(1);
        phoneVal = phoneVal.slice(0, 10);

        if (!phoneVal) {
            showMessage("Phone number is required.", "error");
            phoneInput.focus();
            return;
        }
        if (phoneVal.length !== 10) {
            showMessage("Phone number must be exactly 10 digits.", "error");
            phoneInput.focus();
            return;
        }
        if (!/^[6-9]/.test(phoneVal)) {
            showMessage("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.", "error");
            phoneInput.focus();
            return;
        }
        formattedPhone = "+91 " + phoneVal.slice(0, 5) + " " + phoneVal.slice(5);
    }

    const nameInput = document.getElementById("signupName");
    const name = nameInput ? nameInput.value : "User";

    if (formattedPhone) {
        localStorage.setItem("bloodlinkUserPhone", formattedPhone);
        localStorage.setItem("lifeflow_user_phone", formattedPhone);
    }

    localStorage.setItem("bloodlinkUserName", name);
    localStorage.setItem("bloodlinkUserRole", currentRole);

    showMessage("Account created successfully! Welcome to LifeFlow.", "success");

    setTimeout(function () {
        openDashboard(name);
    }, 1000);
}

/* =====================================================
   STANDARD LOGIN SUBMIT (Donor, Consumer, NGO)
===================================================== */

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email.trim() === "" || password.trim() === "") {
        showMessage("Please enter your email/phone and password.", "error");
        return;
    }

    let savedName = localStorage.getItem("bloodlinkUserName") || "LifeFlow User";

    localStorage.setItem("bloodlinkUserRole", currentRole || "donor");

    showMessage("Login successful! Opening your dashboard...", "success");

    setTimeout(function () {
        openDashboard(savedName);
    }, 800);
}

/* =====================================================
   OPEN DASHBOARD
===================================================== */

function openDashboard(name) {
    const role = localStorage.getItem("bloodlinkUserRole") || currentRole || "donor";
    if (role === "hospital") {
        const license = localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";
        openHospitalHub(name, license);
        return;
    }

    const authPage = document.getElementById("authPage");
    const dashboard = document.getElementById("dashboard");

    if (authPage) authPage.classList.add("hidden");
    if (dashboard) dashboard.classList.remove("hidden");

    const roleName = roleData[role] ? roleData[role].name : "User";

    const dashName = document.getElementById("dashboardUserName");
    const dashRole = document.getElementById("dashboardUserRole");
    const profName = document.getElementById("profileName");
    const profRole = document.getElementById("profileRole");

    if (dashName) dashName.textContent = name;
    if (dashRole) dashRole.textContent = roleName;
    if (profName) profName.textContent = name;
    if (profRole) profRole.textContent = roleName;

    window.scrollTo(0, 0);
}

/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {
    const dashboard = document.getElementById("dashboard");
    const authPage = document.getElementById("authPage");

    if (dashboard) dashboard.classList.add("hidden");
    if (authPage) authPage.classList.remove("hidden");

    backToRoles();
}

/* =====================================================
   PASSWORD VISIBILITY TOGGLE
===================================================== */

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

/* =====================================================
   STANDARD FORGOT PASSWORD
===================================================== */

function forgotPassword(event) {
    if (event) event.preventDefault();
    showMessage("Password recovery link sent to your registered email.", "success");
}

/* =====================================================
   STANDARD AUTH MESSAGE
===================================================== */

function showMessage(message, type) {
    const messageBox = document.getElementById("authMessage");
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.style.color = type === "success" ? "#059669" : "#D32F2F";
}

function clearMessage() {
    const messageBox = document.getElementById("authMessage");
    if (messageBox) {
        messageBox.textContent = "";
    }
}

/* =====================================================
   DARK MODE
===================================================== */

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

/* =====================================================
   HOSPITAL POST-LOGIN WORKFLOW LOGIC
===================================================== */

// Inventory State with standard and rare types
let hospitalInventory = {
    "A+": { units: 18, safeMin: 10, component: "Whole Blood & PRBC", status: "Safe Stock" },
    "A-": { units: 12, safeMin: 8,  component: "Packed RBC (PRBC)", status: "Safe Stock" },
    "B+": { units: 24, safeMin: 10, component: "Whole Blood & FFP", status: "Safe Stock" },
    "B-": { units: 9,  safeMin: 8,  component: "Packed RBC (PRBC)", status: "Moderate" },
    "AB+": { units: 15, safeMin: 10, component: "Universal Plasma & FFP", status: "Safe Stock" },
    "AB-": { units: 6,  safeMin: 8,  component: "Packed RBC (PRBC)", status: "Critical Alert" },
    "O+": { units: 32, safeMin: 15, component: "Whole Blood & Platelets", status: "Safe Stock" },
    "O-": { units: 8,  safeMin: 10, component: "Universal PRBC Emergency", status: "Critical Alert" },
    "Bombay Oh": { units: 3, safeMin: 2, component: "Cryopreserved Rare RBC", status: "Safe Stock", isRare: true },
    "Rh-null": { units: 2, safeMin: 1, component: "Ultra-Rare Phenotype RBC", status: "Safe Stock", isRare: true }
};

// Initial Inbound Audit Log
let inboundRestockLog = [
    {
        bagId: "BB-2026-8812",
        bloodGroup: "A+",
        donorDate: "08 Sep 2026",
        expiryDate: "20 Oct 2026",
        volume: "450 mL",
        serology: "HIV / HepB / HepC NEG",
        action: "Restocked (+1)"
    },
    {
        bagId: "BB-2026-9904",
        bloodGroup: "O-",
        donorDate: "06 Sep 2026",
        expiryDate: "18 Oct 2026",
        volume: "450 mL",
        serology: "Universal Cleared",
        action: "Restocked (+1)"
    },
    {
        bagId: "BB-2026-3310",
        bloodGroup: "Bombay Oh",
        donorDate: "01 Sep 2026",
        expiryDate: "13 Oct 2026",
        volume: "350 mL",
        serology: "Rare Cryo Verified",
        action: "Restocked (+1)"
    },
    {
        bagId: "BB-2026-5541",
        bloodGroup: "B+",
        donorDate: "07 Sep 2026",
        expiryDate: "19 Oct 2026",
        volume: "450 mL",
        serology: "Serology Cleared",
        action: "Restocked (+1)"
    }
];

// QR Presets for mock scanner
const QR_SAMPLE_PRESETS = {
    "A_POS": {
        bagId: "BB-2026-8812",
        bloodGroup: "A+",
        donorDate: "08 Sep 2026",
        expiryDate: "20 Oct 2026 (42 Days)",
        volume: "450 mL (CPDA-1)",
        component: "Packed Red Blood Cells (PRBC)",
        serology: "Negative (HIV, Hep-B, Hep-C, Syphilis, Malaria) - PASS",
        coldChain: "Compliant (3.8°C Monitored)"
    },
    "O_NEG": {
        bagId: "BB-2026-9904",
        bloodGroup: "O-",
        donorDate: "06 Sep 2026",
        expiryDate: "18 Oct 2026 (42 Days)",
        volume: "450 mL (CPDA-1)",
        component: "Universal Emergency PRBC",
        serology: "Negative - Cleared for Universal Cross-match",
        coldChain: "Compliant (4.0°C Monitored)"
    },
    "BOMBAY": {
        bagId: "BB-2026-3310",
        bloodGroup: "Bombay Oh",
        donorDate: "01 Sep 2026",
        expiryDate: "13 Oct 2026 (42 Days)",
        volume: "350 mL (Glycerol Frozen)",
        component: "Rare Phenotype Cryo RBC (Bombay Oh)",
        serology: "Negative - National Rare Registry Certified",
        coldChain: "Compliant (-80°C Cryo Monitored)"
    },
    "B_POS": {
        bagId: "BB-2026-5541",
        bloodGroup: "B+",
        donorDate: "07 Sep 2026",
        expiryDate: "19 Oct 2026 (42 Days)",
        volume: "450 mL (CPDA-1)",
        component: "Whole Blood & Component",
        serology: "Negative - Cleared for Transfusion",
        coldChain: "Compliant (3.5°C Monitored)"
    },
    "AB_POS": {
        bagId: "BB-2026-7719",
        bloodGroup: "AB+",
        donorDate: "05 Sep 2026",
        expiryDate: "10 Sep 2026 (5 Days Viability)",
        volume: "250 mL Apheresis",
        component: "Apheresis Single-Donor Platelets",
        serology: "Negative - Active Agitator Certified",
        coldChain: "Compliant (22°C Agitator Monitored)"
    }
};

let currentScannedBag = QR_SAMPLE_PRESETS["A_POS"];

/**
 * 1. Open Hospital Selection Hub
 */
function openHospitalHub(hospitalName, licenseNumber) {
    const authPage = document.getElementById("authPage");
    const dashboard = document.getElementById("dashboard");
    const hospAuthSection = document.getElementById("hospitalAuthSection");
    const hospHubSection = document.getElementById("hospitalHubSection");
    const hospInvSection = document.getElementById("hospitalInventorySection");
    const hospTransferSection = document.getElementById("hospitalTransferSection");

    if (authPage) authPage.classList.add("hidden");
    if (dashboard) dashboard.classList.add("hidden");
    if (hospAuthSection) hospAuthSection.classList.add("hidden");
    if (hospInvSection) hospInvSection.classList.add("hidden");
    if (hospTransferSection) hospTransferSection.classList.add("hidden");

    if (hospHubSection) {
        hospHubSection.classList.remove("hidden");
    }

    const nameToUse = hospitalName || localStorage.getItem("bloodlinkUserName") || "City Care Blood Centre & Hospital";
    const licToUse = licenseNumber || localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";

    const hubName = document.getElementById("hubHospitalName");
    const hubTitle = document.getElementById("hubWelcomeHospitalTitle");
    const hubLic = document.getElementById("hubHospitalLicense");
    const invBadge = document.getElementById("invHospitalBadge");

    if (hubName) hubName.textContent = nameToUse;
    if (hubTitle) hubTitle.textContent = nameToUse;
    if (hubLic) hubLic.textContent = licToUse;
    if (invBadge) invBadge.textContent = `${nameToUse} • Licence: ${licToUse}`;

    updateInventoryCounters();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Sign out from Hospital Portal
 */
function logoutHospital() {
    const hospHubSection = document.getElementById("hospitalHubSection");
    const hospInvSection = document.getElementById("hospitalInventorySection");
    const hospTransferSection = document.getElementById("hospitalTransferSection");
    const authPage = document.getElementById("authPage");
    const hospAuthSection = document.getElementById("hospitalAuthSection");

    if (hospHubSection) hospHubSection.classList.add("hidden");
    if (hospInvSection) hospInvSection.classList.add("hidden");
    if (hospTransferSection) hospTransferSection.classList.add("hidden");

    if (authPage) {
        authPage.classList.remove("hidden");
        openHospitalPortal();
    } else if (hospAuthSection) {
        hospAuthSection.classList.remove("hidden");
        switchHospitalTab("signin");
    }

    showToast("Signed out from Hospital Portal successfully.", "info");
}

/**
 * 2. Security Check for "Manage Your Blood Bank"
 */
function openSecurityGate() {
    const modal = document.getElementById("hospSecurityGateModal");
    if (modal) {
        modal.classList.remove("hidden");
        const staffIdInput = document.getElementById("hospAdminStaffId");
        if (staffIdInput) staffIdInput.focus();
    }
}

function closeSecurityGate() {
    const modal = document.getElementById("hospSecurityGateModal");
    if (modal) modal.classList.add("hidden");
}

function fillDemoAdminCredentials() {
    const idInput = document.getElementById("hospAdminStaffId");
    const keyInput = document.getElementById("hospAdminSecurityKey");
    if (idInput && keyInput) {
        idInput.value = "ADMIN-001";
        keyInput.value = "admin@123";
        showToast("Demo admin credentials filled (ADMIN-001 / admin@123).", "info");
        keyInput.focus();
    }
}

function verifyAdminCredentials(event) {
    if (event) event.preventDefault();

    const staffId = (document.getElementById("hospAdminStaffId")?.value || "").trim();
    const securityKey = document.getElementById("hospAdminSecurityKey")?.value || "";
    const formCard = document.querySelector(".hosp-security-card");

    // Client-side verification logic
    const isDemoStaff = staffId.toUpperCase() === "ADMIN-001" && securityKey === "admin@123";
    const isValidFormat = (
        (staffId.toUpperCase().startsWith("ADMIN-") || staffId.toUpperCase().startsWith("STAFF-") || staffId.toUpperCase().startsWith("DOC-") || staffId.length >= 4) &&
        (securityKey === "admin@123" || securityKey === "Pass@123" || securityKey.length >= 6)
    );

    if (isDemoStaff || isValidFormat) {
        showToast("Admin credentials verified! Loading Blood Bank Inventory Dashboard...", "success");
        closeSecurityGate();

        // Transition from Selection Hub to Inventory Dashboard
        const hubSection = document.getElementById("hospitalHubSection");
        const invSection = document.getElementById("hospitalInventorySection");

        if (hubSection) hubSection.classList.add("hidden");
        if (invSection) {
            invSection.classList.remove("hidden");
            renderBloodBankInventory();
            renderInboundLogTable();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    } else {
        showToast("Access Denied: Invalid Admin / Staff ID or Security Key. Try demo: ADMIN-001 / admin@123", "error");
        if (formCard) triggerShake(formCard);
    }
}

/**
 * Back to Services button navigation
 */
function backToHub() {
    const hubSection = document.getElementById("hospitalHubSection");
    const invSection = document.getElementById("hospitalInventorySection");

    if (invSection) invSection.classList.add("hidden");
    if (hubSection) {
        hubSection.classList.remove("hidden");
        updateInventoryCounters();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

/**
 * 3. Render Blood Bank Inventory Dashboard
 * Available units for each blood group prominently formatted in bright green badges/cards
 */
function renderBloodBankInventory() {
    const stdGrid = document.getElementById("standardBloodGrid");
    const rareGrid = document.getElementById("rareBloodGrid");

    const standardGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const rareGroups = ["Bombay Oh", "Rh-null"];

    if (stdGrid) {
        stdGrid.innerHTML = standardGroups.map(grp => {
            const data = hospitalInventory[grp];
            const isSafe = data.units >= data.safeMin;
            const statusClass = isSafe ? "safe" : (data.units >= 8 ? "moderate" : "critical");
            const statusLabel = isSafe ? "Safe Stock" : (data.units >= 8 ? "Moderate" : "Critical Alert");
            const dotClass = isSafe ? "pulse-dot-green" : "pulse-dot-red";

            return `
                <div class="blood-card" id="bloodCard_${grp.replace("+", "pos").replace("-", "neg")}">
                    <div class="blood-card-header">
                        <span class="blood-type-symbol">${grp}</span>
                        <span class="stock-status-indicator ${statusClass}">
                            <span class="${dotClass}"></span>
                            ${statusLabel}
                        </span>
                    </div>

                    <!-- PROMINENT BRIGHT GREEN BADGE AS REQUIRED -->
                    <div class="stock-pill-green" id="stockBadge_${grp.replace("+", "pos").replace("-", "neg")}">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${data.units} Units Available</span>
                    </div>

                    <div class="blood-card-meta">
                        <span class="component-text">${data.component}</span>
                        <div class="stock-quick-actions">
                            <button type="button" class="btn-micro" onclick="adjustStock('${grp}', -1)" title="Issue / Deduct 1 Unit">-</button>
                            <button type="button" class="btn-micro" onclick="adjustStock('${grp}', 1)" title="Add / Restock 1 Unit">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    if (rareGrid) {
        rareGrid.innerHTML = rareGroups.map(grp => {
            const data = hospitalInventory[grp];
            const subtitle = grp === "Bombay Oh"
                ? "hh antigen deficiency • 1 in 10,000 donors in South Asia"
                : "Complete absence of Rh antigens • Fewer than 50 known global cases";

            return `
                <div class="rare-blood-card" id="bloodCard_${grp.replace(" ", "_")}">
                    <div class="rare-card-header">
                        <span class="rare-card-title">
                            <i class="fa-solid fa-gem"></i> ${grp}
                        </span>
                        <span class="stock-status-indicator safe">
                            <span class="pulse-dot-green"></span> Ultra-Rare Reserve
                        </span>
                    </div>
                    <p class="rare-card-desc">${subtitle}</p>

                    <!-- PROMINENT BRIGHT GREEN BADGE -->
                    <div class="stock-pill-green">
                        <i class="fa-solid fa-shield-check"></i>
                        <span>${data.units} Units Available (Cryo)</span>
                    </div>

                    <div class="blood-card-meta">
                        <span class="component-text">${data.component}</span>
                        <div class="stock-quick-actions">
                            <button type="button" class="btn-micro" onclick="adjustStock('${grp}', -1)" title="Issue 1 Unit">-</button>
                            <button type="button" class="btn-micro" onclick="adjustStock('${grp}', 1)" title="Restock 1 Unit">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    updateInventoryCounters();
}

/**
 * Adjust stock count manually (+/-)
 */
function adjustStock(bloodGroup, delta) {
    if (!hospitalInventory[bloodGroup]) return;

    const newUnits = Math.max(0, hospitalInventory[bloodGroup].units + delta);
    hospitalInventory[bloodGroup].units = newUnits;

    renderBloodBankInventory();

    const cleanId = bloodGroup.replace("+", "pos").replace("-", "neg").replace(" ", "_");
    const card = document.getElementById(`bloodCard_${cleanId}`);
    if (card) {
        card.classList.add("card-highlighted");
        setTimeout(() => card.classList.remove("card-highlighted"), 1500);
    }

    if (delta > 0) {
        showToast(`Stock updated: +1 Unit added to ${bloodGroup}. Total: ${newUnits} units.`, "success");
    } else {
        showToast(`Stock updated: 1 Unit issued from ${bloodGroup}. Remaining: ${newUnits} units.`, "info");
    }
}

/**
 * Update inventory summary counters
 */
function updateInventoryCounters() {
    let total = 0;
    let safeCount = 0;
    let criticalCount = 0;
    let rareCount = 0;

    for (const [grp, data] of Object.entries(hospitalInventory)) {
        total += data.units;
        if (data.isRare) {
            rareCount += data.units;
        } else {
            if (data.units >= data.safeMin) {
                safeCount++;
            } else {
                criticalCount++;
            }
        }
    }

    const hubMetric = document.getElementById("hubTotalStockMetric");
    const invTotal = document.getElementById("invTotalUnitsDisplay");
    const invSafe = document.getElementById("invSafeGroupsDisplay");
    const invCrit = document.getElementById("invCriticalGroupsDisplay");
    const invRare = document.getElementById("invRareUnitsDisplay");

    if (hubMetric) hubMetric.textContent = total;
    if (invTotal) invTotal.textContent = total;
    if (invSafe) invSafe.textContent = safeCount;
    if (invCrit) invCrit.textContent = criticalCount;
    if (invRare) invRare.textContent = rareCount;
}

/**
 * 4. QR Code Blood Tracking & Add Feature
 */
function openQrScannerModal() {
    const modal = document.getElementById("qrScannerModal");
    if (modal) {
        modal.classList.remove("hidden");
        selectQrSample("A_POS");
    }
}

function closeQrScannerModal() {
    const modal = document.getElementById("qrScannerModal");
    if (modal) modal.classList.add("hidden");
}

function selectQrSample(key) {
    if (!QR_SAMPLE_PRESETS[key]) return;
    currentScannedBag = QR_SAMPLE_PRESETS[key];

    // Highlight active preset button
    const presetBtns = document.querySelectorAll(".preset-btn");
    presetBtns.forEach(btn => btn.classList.remove("active"));
    const activeBtn = Array.from(presetBtns).find(b => b.textContent.includes(currentScannedBag.bloodGroup));
    if (activeBtn) activeBtn.classList.add("active");

    // Populate decoded card details
    displayDecodedBag(currentScannedBag);
}

function decodeManualQr() {
    const input = document.getElementById("manualQrInput");
    const rawVal = (input?.value || "").trim();

    if (!rawVal) {
        showToast("Please enter a valid QR code or DataMatrix string to decode.", "info");
        return;
    }

    // Try parsing if delimited (e.g. BB-2026-8812|A+|2026-09-08|2026-10-20|450ml)
    const parts = rawVal.split("|");
    let detectedGroup = "A+";
    let detectedId = `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    if (parts.length >= 2) {
        detectedId = parts[0];
        detectedGroup = parts[1].trim();
    } else if (rawVal.includes("O-")) {
        detectedGroup = "O-";
    } else if (rawVal.includes("B+")) {
        detectedGroup = "B+";
    } else if (rawVal.includes("AB+")) {
        detectedGroup = "AB+";
    } else if (rawVal.includes("Bombay")) {
        detectedGroup = "Bombay Oh";
    }

    currentScannedBag = {
        bagId: detectedId,
        bloodGroup: detectedGroup,
        donorDate: "08 Sep 2026",
        expiryDate: "20 Oct 2026 (42 Days Viability)",
        volume: "450 mL (CPDA-1)",
        component: "Packed Red Blood Cells (PRBC)",
        serology: "Negative (Verified Clean) - PASS",
        coldChain: "Compliant (4.1°C Monitored)"
    };

    displayDecodedBag(currentScannedBag);
    showToast(`QR Code decoded successfully: Bag ${detectedId} (${detectedGroup}). Ready to restock.`, "success");
}

function displayDecodedBag(bag) {
    const bloodBadge = document.getElementById("decBloodGroup");
    const bagId = document.getElementById("decBagId");
    const comp = document.getElementById("decComponent");
    const donor = document.getElementById("decDonorDate");
    const expiry = document.getElementById("decExpiryDate");
    const volume = document.getElementById("decVolume");
    const cold = document.getElementById("decColdChain");

    if (bloodBadge) bloodBadge.textContent = bag.bloodGroup;
    if (bagId) bagId.textContent = bag.bagId;
    if (comp) comp.textContent = bag.component;
    if (donor) donor.textContent = bag.donorDate;
    if (expiry) expiry.textContent = bag.expiryDate;
    if (volume) volume.textContent = bag.volume;
    if (cold) cold.textContent = bag.coldChain;
}

/**
 * On confirmation ("Add to Stock"), dynamically increments unit count
 */
function confirmAddQrToStock() {
    if (!currentScannedBag) return;

    const grp = currentScannedBag.bloodGroup;

    if (!hospitalInventory[grp]) {
        // Fallback create group if novel
        hospitalInventory[grp] = { units: 1, safeMin: 10, component: currentScannedBag.component, status: "Safe Stock" };
    } else {
        hospitalInventory[grp].units += 1;
    }

    // Add to Recent Inbound Audit Log
    inboundRestockLog.unshift({
        bagId: currentScannedBag.bagId,
        bloodGroup: grp,
        donorDate: currentScannedBag.donorDate,
        expiryDate: currentScannedBag.expiryDate.split(" ")[0] || "20 Oct 2026",
        volume: currentScannedBag.volume.split(" ")[0] + " mL",
        serology: "Passed Serology (Clean)",
        action: "Restocked (+1)"
    });

    // Re-render inventory and log
    renderBloodBankInventory();
    renderInboundLogTable();

    // Close scanner modal
    closeQrScannerModal();

    // Visual highlight on updated blood group card
    const cleanId = grp.replace("+", "pos").replace("-", "neg").replace(" ", "_");
    const card = document.getElementById(`bloodCard_${cleanId}`);
    if (card) {
        card.classList.add("card-highlighted");
        setTimeout(() => card.classList.remove("card-highlighted"), 1800);
        card.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showToast(`Blood Bag ${currentScannedBag.bagId} (${grp}) successfully added to stock! (+1 Unit)`, "success");
}

/**
 * Render Inbound Restock Audit Table
 */
function renderInboundLogTable() {
    const tbody = document.getElementById("inboundLogTableBody");
    if (!tbody) return;

    tbody.innerHTML = inboundRestockLog.map(item => `
        <tr>
            <td><strong>${item.bagId}</strong></td>
            <td><span class="table-badge-group">${item.bloodGroup}</span></td>
            <td>${item.donorDate}</td>
            <td>${item.expiryDate}</td>
            <td>${item.volume}</td>
            <td><span class="table-badge-cleared"><i class="fa-solid fa-circle-check"></i> ${item.serology}</span></td>
            <td><span class="table-badge-action"><i class="fa-solid fa-arrow-down-long"></i> ${item.action}</span></td>
        </tr>
    `).join("");
}

/**
 * 5. Blood Request / Take Blood Requisition (Card B)
 */
function openBloodRequestModal() {
    const modal = document.getElementById("hospBloodRequestModal");
    if (modal) {
        modal.classList.remove("hidden");
        const patientInput = document.getElementById("reqPatientName");
        if (patientInput) patientInput.focus();
    }
}

function closeBloodRequestModal() {
    const modal = document.getElementById("hospBloodRequestModal");
    if (modal) modal.classList.add("hidden");
}

function handleBloodRequestSubmit(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("reqPatientName")?.value || "";
    const ipd = document.getElementById("reqPatientId")?.value || "";
    const ward = document.getElementById("reqWard")?.value || "";
    const grp = document.getElementById("reqBloodGroup")?.value || "A+";
    const units = parseInt(document.getElementById("reqUnits")?.value || "1", 10);
    const priority = document.getElementById("reqPriority")?.value || "STAT";

    if (!hospitalInventory[grp]) {
        showToast(`Requested blood group (${grp}) is not currently available in hospital stock.`, "error");
        return;
    }

    if (hospitalInventory[grp].units < units) {
        showToast(`Insufficient stock! Only ${hospitalInventory[grp].units} units of ${grp} are available. Emergency donor broadcast triggered.`, "error");
        return;
    }

    // Deduct allocated units from stock
    hospitalInventory[grp].units -= units;
    renderBloodBankInventory();

    const reqId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    closeBloodRequestModal();
    showToast(`Blood Requisition ${reqId} Approved! ${units} unit(s) of ${grp} dispatched to ${ward} for patient ${name} (${ipd}). Priority: ${priority}.`, "success");
}

/* =====================================================
   6. HOSPITAL-TO-HOSPITAL BLOOD TRANSFER & REQUEST
   (Card B: "Blood Request / Take Blood" Workflow)
===================================================== */

// Registered Partner Hospitals in the Network with live inventories & dispatch details
let partnerHospitalsData = [
    {
        id: "hosp-apollo",
        name: "Apollo Indraprastha Blood Centre",
        license: "LIC-DEL-4821",
        location: "South Delhi",
        address: "Sarita Vihar, Mathura Road, South Delhi, Delhi 110076",
        phone: "+91 11 2692 5858",
        distance: "3.8 km away",
        eta: "12-15 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 24, "A-": 8, "B+": 36, "B-": 11,
            "AB+": 14, "AB-": 6, "O+": 42, "O-": 15
        }
    },
    {
        id: "hosp-max",
        name: "Max Super Speciality Blood Bank",
        license: "LIC-DEL-1984",
        location: "South Delhi",
        address: "1, 2 Press Enclave Marg, Saket, South Delhi, Delhi 110017",
        phone: "+91 11 2651 5050",
        distance: "7.5 km away",
        eta: "18-20 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 30, "A-": 12, "B+": 40, "B-": 14,
            "AB+": 18, "AB-": 8, "O+": 55, "O-": 20
        }
    },
    {
        id: "hosp-fortis",
        name: "Fortis Memorial Research Blood Bank",
        license: "LIC-GGN-3012",
        location: "Gurugram",
        address: "Sector 44, Opposite HUDA City Centre, Gurugram, Haryana 122002",
        phone: "+91 124 4962 200",
        distance: "14.2 km away",
        eta: "25-30 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 18, "A-": 5, "B+": 29, "B-": 7,
            "AB+": 9, "AB-": 4, "O+": 31, "O-": 8
        }
    },
    {
        id: "hosp-aiims",
        name: "AIIMS Blood Transfusion Centre",
        license: "LIC-DEL-0001",
        location: "Central Delhi",
        address: "Sri Aurobindo Marg, Ansari Nagar, Central Delhi, Delhi 110029",
        phone: "+91 11 2658 8500",
        distance: "9.1 km away",
        eta: "20-22 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 65, "A-": 22, "B+": 80, "B-": 28,
            "AB+": 34, "AB-": 16, "O+": 92, "O-": 38
        }
    }
];

let selectedPartnerHospital = null;
let currentPartnerTag = "all";
let lastGeneratedTransferSlip = null;

/**
 * 1. Verification Gate for Blood Request
 * Triggered from Card B ("Blood Request / Take Blood")
 */
function openBloodRequestAuth() {
    const modal = document.getElementById("hospBloodReqAuthModal");
    if (modal) {
        modal.classList.remove("hidden");
        const licInput = document.getElementById("hospReqAuthLicense");
        const passInput = document.getElementById("hospReqAuthPassword");
        // Pre-fill with currently logged-in hospital license if available
        const currentLic = localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";
        if (licInput && !licInput.value) {
            licInput.value = currentLic;
        }
        if (passInput) passInput.value = "";
        setTimeout(() => {
            if (passInput) passInput.focus();
        }, 150);
    }
}

function closeBloodRequestAuth() {
    const modal = document.getElementById("hospBloodReqAuthModal");
    if (modal) modal.classList.add("hidden");
}

function fillDemoBloodReqAuth() {
    const licInput = document.getElementById("hospReqAuthLicense");
    const passInput = document.getElementById("hospReqAuthPassword");
    if (licInput) licInput.value = "LIC-2026-001";
    if (passInput) passInput.value = "Pass@123";
    showToast("Demo transfer credentials auto-filled (LIC-2026-001 / Pass@123).", "info");
}

function verifyBloodRequestAuth(event) {
    if (event) event.preventDefault();

    const licInput = document.getElementById("hospReqAuthLicense");
    const passInput = document.getElementById("hospReqAuthPassword");
    const license = licInput ? licInput.value.trim() : "";
    const password = passInput ? passInput.value : "";

    if (!license || !password) {
        showToast("Please enter your Hospital ID / Licence and authorization password.", "error");
        return;
    }

    // Check against registered hospitals in localStorage or demo credentials
    let hospitals = [];
    try {
        hospitals = JSON.parse(localStorage.getItem("bloodlinkRegisteredHospitals") || "[]");
    } catch (e) {
        hospitals = [];
    }

    const matched = hospitals.find(
        h => h.licenseNumber.toLowerCase() === license.toLowerCase() && h.password === password
    );
    const isDemoMatch = (license.toUpperCase() === "LIC-2026-001" && password === "Pass@123") ||
                        (license.toUpperCase() === "HOSP-2026-001" && password === "Pass@123") ||
                        (password === "Pass@123" && license.length >= 3) ||
                        (password.length >= 4);

    if (matched || isDemoMatch) {
        const hospitalName = matched ? matched.name : (localStorage.getItem("bloodlinkUserName") || "City Care Blood Centre & Hospital");

        closeBloodRequestAuth();
        showToast(`Hospital Authorized: Welcome ${hospitalName} to Inter-Hospital Blood Network.`, "success");

        // Transition to Search & Select Donor Hospital Screen
        openHospitalTransferScreen(hospitalName, license);
    } else {
        showToast("Invalid Hospital Licence or Password. Access to Inter-Hospital Network Denied.", "error");
        const card = document.querySelector("#hospBloodReqAuthModal .hosp-security-card");
        if (card) triggerShake(card);
    }
}

/**
 * Transition to Search & Select Donor Hospital Screen
 */
function openHospitalTransferScreen(hospitalName, license) {
    const hubSection = document.getElementById("hospitalHubSection");
    const invSection = document.getElementById("hospitalInventorySection");
    const transferSection = document.getElementById("hospitalTransferSection");
    const badge = document.getElementById("transferCurrentHospitalBadge");

    if (hubSection) hubSection.classList.add("hidden");
    if (invSection) invSection.classList.add("hidden");
    if (transferSection) transferSection.classList.remove("hidden");

    const nameToUse = hospitalName || localStorage.getItem("bloodlinkUserName") || "City Care Blood Centre & Hospital";
    const licToUse = license || localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";

    if (badge) {
        badge.textContent = `Requesting as: ${nameToUse} • Licence: ${licToUse}`;
    }

    renderPartnerHospitals();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToHubFromTransfer() {
    const transferSection = document.getElementById("hospitalTransferSection");
    const hubSection = document.getElementById("hospitalHubSection");

    if (transferSection) transferSection.classList.add("hidden");
    if (hubSection) hubSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * 2. Search & Select Donor Hospital Screen
 * Rendering & Filtering
 */
function renderPartnerHospitals(list) {
    const grid = document.getElementById("partnerHospitalsGrid");
    const countChip = document.getElementById("partnerHospCountChip");
    if (!grid) return;

    const hospitalsToRender = list || getFilteredPartnerHospitals();

    if (countChip) {
        countChip.textContent = `${hospitalsToRender.length} Partner ${hospitalsToRender.length === 1 ? 'Hospital' : 'Hospitals'} Available`;
    }

    if (hospitalsToRender.length === 0) {
        grid.innerHTML = `
            <div class="no-partners-empty">
                <i class="fa-solid fa-hospital-user"></i>
                <h3>No Partner Hospitals Found</h3>
                <p>No registered blood banks match your location or search filter. Try clearing filters to see all partner centres.</p>
                <button type="button" class="btn-reset-filter" onclick="resetPartnerFilters()" style="margin-top: 14px;">
                    <i class="fa-solid fa-rotate-left"></i> Reset Search Filters
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = hospitalsToRender.map(hosp => {
        // Calculate total stock units across all 8 groups
        const totalUnits = Object.values(hosp.inventory).reduce((acc, curr) => acc + curr, 0);
        const oNegUnits = hosp.inventory["O-"] || 0;

        return `
            <div class="partner-hospital-card" id="card-${hosp.id}">
                <div class="partner-card-header">
                    <div class="partner-icon-box">
                        <i class="fa-solid fa-hospital"></i>
                    </div>
                    <div class="partner-header-info">
                        <div class="partner-name-row">
                            <h3>${hosp.name}</h3>
                            <span class="partner-verified-badge" title="State Blood Transfusion Council Verified">
                                <i class="fa-solid fa-circle-check"></i> SBTC Verified
                            </span>
                        </div>
                        <div class="partner-meta-row">
                            <span class="partner-lic-pill"><i class="fa-solid fa-id-card"></i> ${hosp.license}</span>
                            <span class="partner-location-pill"><i class="fa-solid fa-location-dot"></i> ${hosp.location}</span>
                            <span class="partner-dist-pill"><i class="fa-solid fa-route"></i> ${hosp.distance}</span>
                        </div>
                    </div>
                </div>

                <div class="partner-address-row">
                    <i class="fa-solid fa-map-pin"></i>
                    <span>${hosp.address}</span>
                </div>

                <!-- Emergency Contact Number Box with Click-to-Call -->
                <div class="partner-contact-box">
                    <div class="contact-box-left">
                        <span class="contact-label"><i class="fa-solid fa-truck-medical"></i> Direct Emergency Contact:</span>
                        <a href="tel:${hosp.phone.replace(/\\s+/g, '')}" class="contact-phone-link" title="Click to call ${hosp.name}">
                            <i class="fa-solid fa-phone-volume"></i>
                            <strong>${hosp.phone}</strong>
                        </a>
                    </div>
                    <a href="tel:${hosp.phone.replace(/\\s+/g, '')}" class="btn-quick-call" title="Place Direct Emergency Call">
                        <i class="fa-solid fa-phone"></i>
                        <span>Call</span>
                    </a>
                </div>

                <!-- Key Inventory Summary Preview -->
                <div class="partner-inventory-summary">
                    <div class="inv-summary-item">
                        <span class="sum-label">Total Reserve</span>
                        <span class="sum-value ${totalUnits > 80 ? 'highlight-safe' : ''}">
                            <i class="fa-solid fa-boxes-stacked"></i> ${totalUnits} Units
                        </span>
                    </div>
                    <div class="inv-summary-item">
                        <span class="sum-label">Universal O- Stock</span>
                        <span class="sum-value ${oNegUnits > 0 ? 'highlight-safe' : 'highlight-warn'}">
                            <i class="fa-solid fa-droplet"></i> ${oNegUnits} Units
                        </span>
                    </div>
                    <div class="inv-summary-item">
                        <span class="sum-label">Ambulance ETA</span>
                        <span class="sum-value eta-stat">
                            <i class="fa-solid fa-stopwatch"></i> ${hosp.eta}
                        </span>
                    </div>
                </div>

                <div class="partner-card-footer">
                    <button type="button" class="btn-view-live-bank btn-red" onclick="viewHospitalLiveBank('${hosp.license}')">
                        <i class="fa-solid fa-satellite-dish"></i>
                        <span>View Live Blood Bank</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function getFilteredPartnerHospitals() {
    const locationVal = document.getElementById("transferLocationFilter") ? document.getElementById("transferLocationFilter").value.trim().toLowerCase() : "";
    const searchVal = document.getElementById("transferSearchInput") ? document.getElementById("transferSearchInput").value.trim().toLowerCase() : "";

    return partnerHospitalsData.filter(hosp => {
        // Location filter
        if (locationVal && !hosp.location.toLowerCase().includes(locationVal)) {
            return false;
        }

        // Search text filter (by name or license number or address)
        if (searchVal) {
            const matchesName = hosp.name.toLowerCase().includes(searchVal);
            const matchesLic = hosp.license.toLowerCase().includes(searchVal);
            const matchesAddr = hosp.address.toLowerCase().includes(searchVal);
            if (!matchesName && !matchesLic && !matchesAddr) {
                return false;
            }
        }

        // Quick Tag Filter
        if (currentPartnerTag === "high_stock") {
            const total = Object.values(hosp.inventory).reduce((acc, curr) => acc + curr, 0);
            if (total < 100) return false;
        } else if (currentPartnerTag === "emergency_ready") {
            if (!hosp.emergencyReady || hosp.eta.includes("30")) return false;
        } else if (currentPartnerTag === "universal") {
            if ((hosp.inventory["O-"] || 0) <= 0) return false;
        }

        return true;
    });
}

function filterPartnerHospitals() {
    renderPartnerHospitals();
}

function applyQuickTagFilter(tag, btn) {
    currentPartnerTag = tag;
    const allBtns = document.querySelectorAll(".quick-tags-row .filter-tag-btn");
    allBtns.forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    renderPartnerHospitals();
}

function resetPartnerFilters() {
    const locInput = document.getElementById("transferLocationFilter");
    const searchInput = document.getElementById("transferSearchInput");

    if (locInput) locInput.value = "";
    if (searchInput) searchInput.value = "";

    currentPartnerTag = "all";
    const allBtns = document.querySelectorAll(".quick-tags-row .filter-tag-btn");
    allBtns.forEach((b, idx) => {
        if (idx === 0) b.classList.add("active");
        else b.classList.remove("active");
    });

    renderPartnerHospitals();
    showToast("Partner hospital search filters reset.", "info");
}

/**
 * 3. Selected Hospital's Live Inventory View
 */
function viewHospitalLiveBank(license) {
    const hospital = partnerHospitalsData.find(h => h.license.toLowerCase() === license.toLowerCase());
    if (!hospital) {
        showToast("Hospital details not found in network registry.", "error");
        return;
    }

    selectedPartnerHospital = hospital;

    // Header updates
    const title = document.getElementById("partnerBankTitle");
    const locBadge = document.getElementById("partnerBankLocationBadge");
    const phoneDisplay = document.getElementById("partnerDispatchNumberDisplay");
    const phoneLink = document.getElementById("partnerDispatchCallLink");

    if (title) title.textContent = hospital.name;
    if (locBadge) locBadge.textContent = `${hospital.address} • Licence: ${hospital.license}`;
    if (phoneDisplay) phoneDisplay.textContent = hospital.phone;
    if (phoneLink) phoneLink.href = `tel:${hospital.phone.replace(/\\s+/g, '')}`;

    // Render 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) with vibrant green badges
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const grid = document.getElementById("partnerLiveBloodGrid");

    if (grid) {
        grid.innerHTML = bloodTypes.map(grp => {
            const units = hospital.inventory[grp] !== undefined ? hospital.inventory[grp] : 0;
            return `
                <div class="selected-blood-card" onclick="selectTransferBloodGroup('${grp}')" title="Click to requisition ${grp}">
                    <div class="blood-type-label">${grp}</div>
                    <div class="blood-units-count">
                        <span class="stock-pill-green">
                            <i class="fa-solid fa-circle-check"></i> ${units} Units Available
                        </span>
                    </div>
                    <div class="blood-subtext">PRBC / Cold Stored</div>
                </div>
            `;
        }).join("");
    }

    // Set initial dropdown value & validate
    const select = document.getElementById("transferBloodGroup");
    if (select) {
        select.value = "A+";
        onTransferBloodGroupChange();
    }

    // Reset optional notes & reference
    const refInput = document.getElementById("transferPatientRef");
    const notesInput = document.getElementById("transferDeptNotes");
    if (refInput) refInput.value = "";
    if (notesInput) notesInput.value = "";

    // Show modal
    const modal = document.getElementById("partnerHospitalBankModal");
    if (modal) modal.classList.remove("hidden");
}

function selectTransferBloodGroup(grp) {
    const select = document.getElementById("transferBloodGroup");
    if (select) {
        select.value = grp;
        onTransferBloodGroupChange();
        const unitsInput = document.getElementById("transferUnits");
        if (unitsInput) {
            unitsInput.focus();
            unitsInput.select();
        }
    }
}

function closePartnerHospitalBankModal() {
    const modal = document.getElementById("partnerHospitalBankModal");
    if (modal) modal.classList.add("hidden");
}

/**
 * 4. Unit Selection & Real-Time Validation
 */
function onTransferBloodGroupChange() {
    if (!selectedPartnerHospital) return;

    const grp = document.getElementById("transferBloodGroup")?.value || "A+";
    const available = selectedPartnerHospital.inventory[grp] || 0;

    const hint = document.getElementById("transferAvailableHint");
    const unitsInput = document.getElementById("transferUnits");

    if (hint) {
        hint.innerHTML = `<i class="fa-solid fa-circle-info"></i> Available in stock: <strong>${available} Units</strong>`;
        if (available <= 0) {
            hint.style.color = "#D32F2F";
        } else {
            hint.style.color = "#2E7D32";
        }
    }

    if (unitsInput) {
        unitsInput.max = available;
        if (parseInt(unitsInput.value, 10) > available && available > 0) {
            unitsInput.value = available;
        } else if (available === 0) {
            unitsInput.value = 0;
        }
    }

    validateTransferUnits();
}

function validateTransferUnits() {
    if (!selectedPartnerHospital) return true;

    const grp = document.getElementById("transferBloodGroup")?.value || "A+";
    const available = selectedPartnerHospital.inventory[grp] || 0;
    const unitsInput = document.getElementById("transferUnits");
    const alertBox = document.getElementById("stockValidationAlert");
    const alertMsg = document.getElementById("stockValidationMsg");
    const submitBtn = document.getElementById("btnSendBloodRequest");

    const requested = parseInt(unitsInput?.value || "0", 10);

    if (requested <= 0) {
        if (alertBox && alertMsg) {
            alertMsg.textContent = "Please enter at least 1 unit to request.";
            alertBox.classList.add("visible");
        }
        if (submitBtn) submitBtn.disabled = true;
        return false;
    }

    if (requested > available) {
        if (alertBox && alertMsg) {
            alertMsg.textContent = `Requested units (${requested}) exceed available inventory (${available} Units)! Please adjust your requisition quantity.`;
            alertBox.classList.add("visible");
        }
        if (submitBtn) submitBtn.disabled = true;
        return false;
    }

    // Valid
    if (alertBox) alertBox.classList.remove("visible");
    if (submitBtn) submitBtn.disabled = false;
    return true;
}

/**
 * 5. Send Blood Request & Confirmation Slip
 */
function handleSendBloodRequest(event) {
    if (event) event.preventDefault();

    if (!validateTransferUnits()) {
        const form = document.getElementById("partnerBloodRequestForm");
        if (form) triggerShake(form);
        return;
    }

    if (!selectedPartnerHospital) {
        showToast("Please select a supplying partner hospital.", "error");
        return;
    }

    const grp = document.getElementById("transferBloodGroup")?.value || "A+";
    const units = parseInt(document.getElementById("transferUnits")?.value || "1", 10);
    const urgency = document.getElementById("transferUrgency")?.value || "Emergency STAT (< 15 Mins - Ambulance Dispatch)";
    const ref = document.getElementById("transferPatientRef")?.value.trim() || `CR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const notes = document.getElementById("transferDeptNotes")?.value.trim() || "Cold-chain ambulance transfer requested";

    // Deduct stock from the partner hospital's live inventory
    selectedPartnerHospital.inventory[grp] = Math.max(0, (selectedPartnerHospital.inventory[grp] || 0) - units);

    // Re-render partner hospitals in background to reflect live deduction
    renderPartnerHospitals();

    // Prepare Confirmation Requisition Data
    const reqId = `TRX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    const requestingHospName = localStorage.getItem("bloodlinkUserName") || "City Care Blood Centre & Hospital";
    const requestingHospLic = localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";

    lastGeneratedTransferSlip = {
        reqId: reqId,
        date: formattedDate,
        supplyingHospital: selectedPartnerHospital.name,
        supplyingLicense: selectedPartnerHospital.license,
        supplyingPhone: selectedPartnerHospital.phone,
        requestingHospital: `${requestingHospName} (Licence: ${requestingHospLic})`,
        bloodGroup: grp,
        units: units,
        urgency: urgency,
        patientRef: ref,
        notes: notes
    };

    // Populate Success Modal Fields
    const slipIdEl = document.getElementById("slipRequestId");
    const slipDateEl = document.getElementById("slipDate");
    const slipSupplyingHospEl = document.getElementById("slipSupplyingHospital");
    const slipSupplyingPhoneEl = document.getElementById("slipSupplyingPhone");
    const slipRequestingHospEl = document.getElementById("slipRequestingHospital");
    const slipBloodUnitsEl = document.getElementById("slipBloodGroupUnits");
    const slipUrgencyEl = document.getElementById("slipUrgency");
    const slipPatientRefEl = document.getElementById("slipPatientRef");

    if (slipIdEl) slipIdEl.textContent = `REQUEST ID: ${reqId}`;
    if (slipDateEl) slipDateEl.textContent = formattedDate;
    if (slipSupplyingHospEl) slipSupplyingHospEl.textContent = `${selectedPartnerHospital.name} (${selectedPartnerHospital.license})`;
    if (slipSupplyingPhoneEl) slipSupplyingPhoneEl.textContent = selectedPartnerHospital.phone;
    if (slipRequestingHospEl) slipRequestingHospEl.textContent = `${requestingHospName} (${requestingHospLic})`;
    if (slipBloodUnitsEl) slipBloodUnitsEl.textContent = `${grp} • ${units} Unit${units > 1 ? 's' : ''} (Packed RBC)`;
    if (slipUrgencyEl) slipUrgencyEl.textContent = urgency;
    if (slipPatientRefEl) slipPatientRefEl.textContent = ref;

    // Close Bank Requisition Modal and Open Success Modal
    closePartnerHospitalBankModal();
    const successModal = document.getElementById("hospTransferSuccessModal");
    if (successModal) successModal.classList.remove("hidden");

    showToast(`Transfer Requisition ${reqId} successfully dispatched to ${selectedPartnerHospital.name}!`, "success");
}

function closeTransferSuccessModal() {
    const modal = document.getElementById("hospTransferSuccessModal");
    if (modal) modal.classList.add("hidden");
}

function downloadRequestSlip() {
    if (!lastGeneratedTransferSlip) {
        showToast("No active requisition slip available.", "error");
        return;
    }

    // Trigger Print Dialog (Uses @media print CSS)
    window.print();
    showToast(`Printing requisition slip for ${lastGeneratedTransferSlip.reqId}...`, "info");
}

/* =====================================================
   INITIALIZATION
===================================================== */

window.addEventListener("load", function () {
    console.log("LifeFlow Platform loaded successfully.");
});
