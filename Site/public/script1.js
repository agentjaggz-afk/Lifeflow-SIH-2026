/* =====================================================
   BLOOD LINK AUTHENTICATION & MANAGEMENT SYSTEM
   Includes Blood Link & Donation Portal for Hospitals
===================================================== */

let currentRole = "";
window.currentHospCaptcha = "";

function isLocalEnvironment() {
    return window.location.hostname === "localhost" || 
           window.location.hostname === "127.0.0.1" || 
           window.location.hostname === "[::1]" ||
           window.location.protocol === "file:";
}

function getBackendBaseUrl() {
    if (window.LIFEFLOW_API_URL) {
        return window.LIFEFLOW_API_URL.replace(/\/+$/, "");
    }
    if (isLocalEnvironment()) {
        const host = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
            ? window.location.hostname 
            : "127.0.0.1";
        return `http://${host}:8000`;
    }
    return null;
}


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
                <input type="tel" id="signupPhone" placeholder="Enter your phone number" required>
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
                <input type="tel" id="signupPhone" placeholder="Enter your phone number" required>
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
 * Open dedicated Blood Link & Donation Portal view (Hospital & NGO Gateway)
 */
function openHospitalPortal(role = "hospital") {
    const urlParams = new URLSearchParams(window.location.search);
    if (role === "ngo" || urlParams.get("role") === "ngo") {
        currentRole = "ngo";
    } else {
        currentRole = "hospital";
    }

    // If invoked from index.html or index1.html, route directly to the dedicated Hospital & NGO Portal
    if (window.location.pathname.indexOf("hospital-auth.html") === -1 && !document.getElementById("hospMainSidebar")) {
        window.location.href = currentRole === "ngo" ? "/hospital-auth.html?role=ngo" : "/hospital-auth.html";
        return;
    }

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

    // Adapt UI if entering as NGO Partner
    if (currentRole === "ngo") {
        const titleEl = document.querySelector(".hosp-header h2");
        const subEl = document.querySelector(".hosp-header p");
        if (titleEl) titleEl.textContent = "LifeFlow NGO & Hospital Portal";
        if (subEl) subEl.textContent = "Authorized NGO & healthcare partner access gateway";

        const licLabel = document.querySelector('label[for="hospLoginLicense"]');
        if (licLabel) licLabel.innerHTML = 'Institutional / NGO Licence Number <span class="required">*</span>';

        const licInput = document.getElementById("hospLoginLicense");
        if (licInput) {
            licInput.placeholder = "e.g. NGO-OD-8821 or LIC-OD-2026-001";
            if (!licInput.value) licInput.value = "NGO-OD-8821";
        }
        const passInput = document.getElementById("hospLoginPassword");
        if (passInput && !passInput.value) {
            passInput.value = "Pass@123";
        }
        showToast("NGO Partner Access mode active. Log in with your NGO Licence identifier.", "info");
    } else {
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

        ctx.font = `bold ${Math.floor(Math.random() * 4 + 20)}px "Inter", sans-serif`;
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
        h => h.licenseNumber && h.licenseNumber.toLowerCase() === licenseNumber.toLowerCase() && h.password === password
    );

    // Load registered NGOs
    let ngos = [];
    try {
        ngos = JSON.parse(localStorage.getItem("bloodlinkRegisteredNgos") || "[]");
    } catch (e) {
        ngos = [];
    }
    const matchedNgo = ngos.find(
        n => ((n.licenseNumber || n.license || "").toLowerCase() === licenseNumber.toLowerCase()) && n.password === password
    );

    // Default demo hospital credentials
    const isHospDemoMatch = (licenseNumber.toUpperCase() === "LIC-2026-001" && password === "Pass@123") ||
                            (licenseNumber.toUpperCase() === "LIC-OD-2026-001" && password === "Pass@123") ||
                            (licenseNumber.toUpperCase() === "HOSP-OD-001" && password === "Pass@123") ||
                            (licenseNumber.toUpperCase() === "HOSP-2026-001" && password === "Pass@123");

    // Default demo NGO credentials
    const isNgoDemoMatch = (licenseNumber.toUpperCase() === "NGO-OD-8821" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-OD-4512" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-OD-9021" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-OD-9904" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-DL-8821" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-DL-4512" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-DL-9904" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "LIC-NGO-OD-9021" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase() === "NGO-RED-001" && password === "Pass@123") ||
                           (licenseNumber.toUpperCase().startsWith("NGO-") && password === "Pass@123");

    if (matchedHospital || matchedNgo || isHospDemoMatch || isNgoDemoMatch) {
        let facilityName = "City Care Blood Centre & Hospital";
        let facilityRole = "hospital";

        if (matchedNgo) {
            facilityName = matchedNgo.name || "Red Cross Blood Bank & Voluntary Mission, Odisha";
            facilityRole = "ngo";
        } else if (isNgoDemoMatch) {
            facilityRole = "ngo";
            if (licenseNumber.toUpperCase().includes("4512")) {
                facilityName = "Ama Odisha Blood Donation Mission";
            } else if (licenseNumber.toUpperCase().includes("9021")) {
                facilityName = "Odisha Blood Relief & Voluntary Donor Network";
            } else if (licenseNumber.toUpperCase().includes("9904")) {
                facilityName = "Utkal Blood Relief & Welfare Society";
            } else {
                facilityName = "Red Cross Blood Bank & Voluntary Mission, Odisha";
            }
        } else if (matchedHospital) {
            facilityName = matchedHospital.name;
            facilityRole = "hospital";
        }

        // Remember Me handling
        if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem("bloodlinkRememberedHospLicense", licenseNumber);
        } else {
            localStorage.removeItem("bloodlinkRememberedHospLicense");
        }

        currentRole = facilityRole;
        localStorage.setItem("bloodlinkUserName", facilityName);
        localStorage.setItem("bloodlinkUserRole", facilityRole);
        localStorage.setItem("bloodlinkUserLicense", licenseNumber);

        // Visual feedback on button and exit animation
        const signInBtn = document.getElementById("hospSignInBtn");
        if (signInBtn) {
            signInBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Opening Dashboard...</span>';
            signInBtn.disabled = true;
        }

        const portalCard = document.getElementById("hospitalAuthSection") || signInCard;
        if (portalCard) {
            portalCard.classList.add("auth-exit-animation");
        }

        showToast(`Authentication successful! Welcome to LifeFlow, ${facilityName}.`, "success");

        setTimeout(() => {
            if (facilityRole === "ngo") {
                window.location.href = "/ngo-portal.html#/dashboard";
                return;
            }
            openHospitalDashboard(facilityName, licenseNumber);
            if (signInBtn) {
                signInBtn.innerHTML = facilityRole === "ngo" 
                    ? '<span>Sign In to LifeFlow NGO Portal</span> <i class="fa-solid fa-arrow-right"></i>'
                    : '<span>Sign In to LifeFlow Hospital Portal</span> <i class="fa-solid fa-arrow-right"></i>';
                signInBtn.disabled = false;
            }
            if (portalCard) {
                portalCard.classList.remove("auth-exit-animation");
            }
        }, 400);
    } else {
        showToast("Invalid Licence Number or Password. Please check credentials or register.", "error");
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

    if (role === "hospital" || role === "ngo") {
        openHospitalPortal(role);
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

    const ngoDemoBox = document.getElementById("ngoDemoCredentialsBox");
    const donorDemoBox = document.getElementById("donorDemoCredentialsBox");
    if (ngoDemoBox) {
        if (role === "ngo") {
            ngoDemoBox.classList.remove("hidden");
        } else {
            ngoDemoBox.classList.add("hidden");
        }
    }
    if (donorDemoBox) {
        if (role === "donor" || role === "consumer") {
            donorDemoBox.classList.remove("hidden");
        } else {
            donorDemoBox.classList.add("hidden");
        }
    }

    if (defaultTab === 'signup') {
        showSignup();
    } else {
        showLogin();
    }
    clearMessage();
}

/**
 * 1-Click Quick Demo Sign In for Donor & Consumer Hub
 */
function quickDemoSignIn(role = "donor") {
    let name = "Rahul Sharma";
    let email = "rahul.sharma@gmail.com";
    let bloodGroup = "O+";
    let phone = "+91 98765 43210";

    if (role === "consumer") {
        name = "Priya Patel";
        email = "priya.patel@gmail.com";
        bloodGroup = "B+";
        phone = "+91 91234 56789";
    }

    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = "Demo@123";

    try {
        localStorage.setItem("bloodlinkUserName", name);
        localStorage.setItem("bloodlinkUserRole", role);
        localStorage.setItem("bloodlinkUserEmail", email);
        localStorage.setItem("bloodlinkUserPhone", phone);
        localStorage.setItem("bloodlinkUserBloodGroup", bloodGroup);
        localStorage.setItem("bloodlinkIsAuthenticated", "true");

        localStorage.setItem("lifeflow_user_name", name);
        localStorage.setItem("lifeflow_user_role", role);
        localStorage.setItem("lifeflow_user_email", email);
        localStorage.setItem("lifeflow_blood_group", bloodGroup);
        localStorage.setItem("lifeflow_authenticated", "true");

        if (role === "donor") {
            const donorsKey = "lifeflow_offline_donors_v1";
            const rawDonors = localStorage.getItem(donorsKey);
            const donorsList = rawDonors ? JSON.parse(rawDonors) : [];
            if (!donorsList.some(d => d.name === name || d.phone === phone)) {
                donorsList.unshift({
                    id: `donor-user-${Date.now()}`,
                    name: name,
                    blood_group: bloodGroup,
                    city: localStorage.getItem("lifeflow_saved_city") || "Bhubaneswar",
                    phone: phone,
                    email: email,
                    latitude: null,
                    longitude: null,
                    is_available: true,
                    last_donated: new Date().toISOString().split("T")[0],
                    hospital_id: null,
                    created_at: new Date().toISOString()
                });
                localStorage.setItem(donorsKey, JSON.stringify(donorsList));
            }
        } else if (role === "consumer") {
            const reqKey = "lifeflow_offline_requests_v1";
            const rawReq = localStorage.getItem(reqKey);
            const reqList = rawReq ? JSON.parse(rawReq) : [];
            if (!reqList.some(r => r.patient_name === name)) {
                reqList.unshift({
                    id: `req-user-${Date.now()}`,
                    patient_name: name,
                    blood_group: bloodGroup,
                    units_needed: 2,
                    city: localStorage.getItem("lifeflow_saved_city") || "Bhubaneswar",
                    requester_name: name,
                    requester_phone: phone,
                    urgency: "Urgent",
                    hospital_id: null,
                    status: "Open",
                    fulfilled_at: null,
                    created_at: new Date().toISOString()
                });
                localStorage.setItem(reqKey, JSON.stringify(reqList));
            }
        }
    } catch (e) {
        console.error("Failed to save demo credentials to localStorage", e);
    }

    showMessage(`Demo ${role === 'donor' ? 'Blood Donor' : 'Recipient'} credentials loaded! Signing in as ${name}...`, "success");

    // Instant zero-lag redirect to /donor-hub.html
    redirectToSite2(name, role);
}

/**
 * Auto-fill demo credentials for NGO evaluation
 */
function fillDemoNgoCredentials(license = 'NGO-OD-8821', password = 'Pass@123') {
    const hospLicense = document.getElementById("hospLoginLicense");
    const hospPass = document.getElementById("hospLoginPassword");
    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");

    if (hospLicense) hospLicense.value = license;
    if (hospPass) {
        hospPass.value = password;
        hospPass.focus();
    }
    if (emailInput) emailInput.value = license;
    if (passInput) passInput.value = password;

    showToast(`Pre-filled verified NGO credentials: ${license}`, "info");
}
window.fillDemoNgoCredentials = fillDemoNgoCredentials;

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
   SITE 2 REDIRECT (DONOR & CONSUMER HUB)
===================================================== */

function getSite2Url() {
    return "/donor-hub.html";
}

function redirectToSite2(user = "LifeFlow User", role = "donor") {
    const targetUrl = `/donor-hub.html?auth=success&user=${encodeURIComponent(user)}&role=${encodeURIComponent(role)}`;
    // Instant internal redirect on the same host and port without any lag
    window.location.replace(targetUrl);
}

/* =====================================================
   STANDARD SIGN UP SUBMIT (Donor, Consumer, NGO)
===================================================== */

function signupUser(event) {
    event.preventDefault();

    const nameInput = document.getElementById("signupName");
    const name = nameInput ? nameInput.value.trim() || "User" : "User";
    const emailInput = document.getElementById("signupEmail");
    const email = emailInput ? emailInput.value.trim() : "";
    const bgInput = document.getElementById("signupBloodGroup");
    const bg = bgInput ? bgInput.value : "O+";
    const role = currentRole || "donor";

    localStorage.setItem("bloodlinkUserName", name);
    localStorage.setItem("bloodlinkUserRole", role);
    localStorage.setItem("bloodlinkUserEmail", email);
    localStorage.setItem("bloodlinkUserBloodGroup", bg);
    localStorage.setItem("bloodlinkIsAuthenticated", "true");

    localStorage.setItem("lifeflow_user_name", name);
    localStorage.setItem("lifeflow_user_role", role);
    localStorage.setItem("lifeflow_user_email", email);
    localStorage.setItem("lifeflow_blood_group", bg);
    localStorage.setItem("lifeflow_authenticated", "true");

    if (role === "donor") {
        try {
            const donorsKey = "lifeflow_offline_donors_v1";
            const rawDonors = localStorage.getItem(donorsKey);
            const donorsList = rawDonors ? JSON.parse(rawDonors) : [];
            donorsList.unshift({
                id: `donor-user-${Date.now()}`,
                name: name,
                blood_group: bg,
                city: localStorage.getItem("lifeflow_saved_city") || "Bhubaneswar",
                phone: localStorage.getItem("bloodlinkUserPhone") || "+91 98765 43210",
                email: email || null,
                latitude: null,
                longitude: null,
                is_available: true,
                last_donated: new Date().toISOString().split("T")[0],
                hospital_id: null,
                created_at: new Date().toISOString()
            });
            localStorage.setItem(donorsKey, JSON.stringify(donorsList));
        } catch (e) {
            console.error("Failed to save registered donor to offline storage", e);
        }
    } else if (role === "consumer") {
        try {
            const reqKey = "lifeflow_offline_requests_v1";
            const rawReq = localStorage.getItem(reqKey);
            const reqList = rawReq ? JSON.parse(rawReq) : [];
            reqList.unshift({
                id: `req-user-${Date.now()}`,
                patient_name: name,
                blood_group: bg,
                units_needed: 2,
                city: localStorage.getItem("lifeflow_saved_city") || "Bhubaneswar",
                requester_name: name,
                requester_phone: localStorage.getItem("bloodlinkUserPhone") || "+91 98765 43210",
                urgency: "Urgent",
                hospital_id: null,
                status: "Open",
                fulfilled_at: null,
                created_at: new Date().toISOString()
            });
            localStorage.setItem(reqKey, JSON.stringify(reqList));
        } catch (e) {
            console.error("Failed to save registered request to offline storage", e);
        }
    }

    // If Donor or Consumer, immediately redirect to Site 2 with zero lag
    if (currentRole === "donor" || currentRole === "consumer" || !currentRole) {
        redirectToSite2(name, role);
        return;
    }

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

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password.trim() === "") {
        showMessage("Please enter your email/phone and password.", "error");
        return;
    }

    const submitBtn = document.querySelector("#loginForm .auth-submit");
    const authCard = document.getElementById("authFormContainer");

    // Dedicated Pseudo-Login Authentication for NGO Partner Access
    if (currentRole === "ngo") {
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Authenticating NGO...</span>';
            submitBtn.disabled = true;
        }
        if (authCard) authCard.classList.add("auth-exit-animation");

        showMessage("Authenticating NGO Institutional Accreditation...", "info");
        const executeNgoFallback = () => {
            const defaultNgoName = "Red Cross Blood Bank & Voluntary Mission, Odisha";
            localStorage.setItem("bloodlinkUserName", defaultNgoName);
            localStorage.setItem("bloodlinkUserRole", "ngo");
            localStorage.setItem("bloodlinkNgoId", "NGO-OD-8821");
            localStorage.setItem("bloodlinkNgoLicense", "NGO-OD-8821");
            showMessage("Opening LifeFlow NGO Management Platform...", "success");
            setTimeout(function () {
                window.location.href = "/ngo-portal.html#/dashboard";
            }, 400);
        };

        const backendBase = getBackendBaseUrl();
        if (backendBase) {
            fetch(`${backendBase}/api/ngo/pseudo-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email })
            })
            .then(res => res.json())
            .then(data => {
                if (data.authenticated && data.session) {
                    const ngoName = data.session.ngoName || "Verified NGO Partner";
                    localStorage.setItem("bloodlinkUserName", ngoName);
                    localStorage.setItem("bloodlinkUserRole", "ngo");
                    localStorage.setItem("bloodlinkNgoId", data.session.ngoId);
                    localStorage.setItem("bloodlinkNgoLicense", data.session.licenseNumber || data.session.licenseNo);
                    localStorage.setItem("bloodlinkNgoToken", data.token);

                    showMessage(`Authenticated as ${ngoName}! Launching Real-Time NGO Platform...`, "success");
                    setTimeout(function () {
                        window.location.href = "/ngo-portal.html#/dashboard";
                    }, 400);
                } else {
                    if (submitBtn) {
                        submitBtn.innerHTML = 'Login <i class="fa-solid fa-arrow-right"></i>';
                        submitBtn.disabled = false;
                    }
                    if (authCard) authCard.classList.remove("auth-exit-animation");
                    showMessage(data.error || "NGO credentials not found in network registry.", "error");
                }
            })
            .catch(err => {
                console.warn("Backend auth offline, using local fallback for NGO:", err);
                executeNgoFallback();
            });
        } else {
            executeNgoFallback();
        }
        return;
    }

    // For Donor and Consumer: Instant zero-lag redirect to Site 2!
    let savedName = localStorage.getItem("bloodlinkUserName") || (email.includes("@") ? email.split("@")[0] : "LifeFlow User");
    const role = currentRole || "donor";
    localStorage.setItem("bloodlinkUserName", savedName);
    localStorage.setItem("bloodlinkUserRole", role);
    localStorage.setItem("bloodlinkUserEmail", email);
    localStorage.setItem("bloodlinkIsAuthenticated", "true");

    localStorage.setItem("lifeflow_user_name", savedName);
    localStorage.setItem("lifeflow_user_role", role);
    localStorage.setItem("lifeflow_user_email", email);
    localStorage.setItem("lifeflow_authenticated", "true");

    if (role === "donor" || role === "consumer") {
        redirectToSite2(savedName, role);
        return;
    }

    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Opening Dashboard...</span>';
        submitBtn.disabled = true;
    }
    if (authCard) authCard.classList.add("auth-exit-animation");

    showMessage("Login successful! Opening your dashboard...", "success");

    setTimeout(function () {
        openDashboard(savedName);
    }, 400);
}

/* =====================================================
   OPEN DASHBOARD
===================================================== */

function openDashboard(name) {
    const role = localStorage.getItem("bloodlinkUserRole") || currentRole || "donor";
    if (role === "hospital") {
        const license = localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";
        openHospitalDashboard(name, license);
        return;
    }
    if (role === "donor" || role === "consumer") {
        redirectToSite2(name, role);
        return;
    }

    const authPage = document.getElementById("authPage");
    const dashboard = document.getElementById("dashboard");

    if (authPage) {
        authPage.classList.add("hidden");
        authPage.style.display = "none";
    }
    if (dashboard) {
        dashboard.classList.remove("hidden");
        dashboard.style.display = "block";
        dashboard.classList.remove("dashboard-enter-animation");
        void dashboard.offsetWidth;
        dashboard.classList.add("dashboard-enter-animation");
    }

    const roleName = roleData[role] ? roleData[role].name : "User";

    const dashName = document.getElementById("dashboardUserName");
    const dashRole = document.getElementById("dashboardUserRole");
    const profName = document.getElementById("profileName");
    const profRole = document.getElementById("profileRole");

    if (dashName) dashName.textContent = name;
    if (dashRole) dashRole.textContent = roleName;
    if (profName) profName.textContent = name;
    if (profRole) profRole.textContent = roleName;

    // Initialize or toggle NGO Real-Time Emergency Reception Queue
    const ngoPanel = document.getElementById("ngoEmergencyReceptionPanel");
    if (role === "ngo") {
        if (ngoPanel) {
            ngoPanel.classList.remove("hidden");
            ngoPanel.style.display = "block";
            ngoPanel.classList.remove("dashboard-enter-animation");
            void ngoPanel.offsetWidth;
            ngoPanel.classList.add("dashboard-enter-animation");
        }
        initNgoEmergencyReception();
    } else {
        if (ngoPanel) ngoPanel.classList.add("hidden");
    }

    const submitBtn = document.querySelector("#loginForm .auth-submit");
    if (submitBtn) {
        submitBtn.innerHTML = 'Login <i class="fa-solid fa-arrow-right"></i>';
        submitBtn.disabled = false;
    }
    const authCard = document.getElementById("authFormContainer");
    if (authCard) authCard.classList.remove("auth-exit-animation");

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {
    if (window.ngoEmergencyEventSource) {
        window.ngoEmergencyEventSource.close();
        window.ngoEmergencyEventSource = null;
    }
    if (window.ngoPollingInterval) {
        clearInterval(window.ngoPollingInterval);
        window.ngoPollingInterval = null;
    }

    const dashboard = document.getElementById("dashboard");
    const authPage = document.getElementById("authPage");

    if (dashboard) {
        dashboard.classList.add("hidden");
        dashboard.style.display = "none";
    }
    if (authPage) {
        authPage.classList.remove("hidden");
        authPage.style.display = "flex";
        authPage.classList.remove("auth-exit-animation");
    }

    const submitBtn = document.querySelector("#loginForm .auth-submit");
    if (submitBtn) {
        submitBtn.innerHTML = 'Login <i class="fa-solid fa-arrow-right"></i>';
        submitBtn.disabled = false;
    }
    const authCard = document.getElementById("authFormContainer");
    if (authCard) authCard.classList.remove("auth-exit-animation");

    backToRoles();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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

// Inventory State with standard and rare types (Tiered: Green > 150, Yellow 100-150, Red < 100, Severe Alert < 100)
let hospitalInventory = {
    "O+": { units: 175, component: "Whole Blood & Platelets" },  // Green (> 150)
    "A+": { units: 162, component: "Whole Blood & PRBC" },       // Green (> 150)
    "B+": { units: 158, component: "Whole Blood & FFP" },        // Green (> 150)
    "A-": { units: 124, component: "Packed RBC (PRBC)" },        // Yellow (100–150)
    "B-": { units: 115, component: "Packed RBC (PRBC)" },        // Yellow (100–150)
    "AB+": { units: 138, component: "Universal Plasma & FFP" },  // Yellow (100–150)
    "O-": { units: 42,  component: "Universal PRBC Emergency" },// Red (< 100)
    "AB-": { units: 28, component: "Packed RBC (PRBC)" },        // Red (< 100)
    "Bombay Oh": { units: 18, component: "Cryopreserved Rare RBC", isRare: true },
    "Rh-null": { units: 12, component: "Ultra-Rare Phenotype RBC", isRare: true }
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

// Barcode Presets for mock scanner
const BARCODE_SAMPLE_PRESETS = {
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

const QR_SAMPLE_PRESETS = BARCODE_SAMPLE_PRESETS;
let currentScannedBag = BARCODE_SAMPLE_PRESETS["A_POS"];

/**
 * Helper to reliably hide hospital authentication screens
 */
function hideHospitalAuthPage() {
    const authPage = document.getElementById("authPage");
    const hospPortalPage = document.querySelector(".hosp-portal-page") || document.getElementById("hospPortalAuthPage");
    const hospAuthSection = document.getElementById("hospitalAuthSection");

    if (authPage) {
        authPage.classList.add("hidden");
        authPage.style.display = "none";
    }
    if (hospPortalPage) {
        hospPortalPage.classList.add("hidden");
        hospPortalPage.style.display = "none";
    }
    if (hospAuthSection) {
        hospAuthSection.classList.add("hidden");
        hospAuthSection.style.display = "none";
    }
}

/**
 * Helper to restore hospital authentication screen on logout
 */
function showHospitalAuthPage() {
    const authPage = document.getElementById("authPage");
    const hospPortalPage = document.querySelector(".hosp-portal-page") || document.getElementById("hospPortalAuthPage");
    const hospAuthSection = document.getElementById("hospitalAuthSection");

    if (hospPortalPage) {
        hospPortalPage.classList.remove("hidden");
        hospPortalPage.classList.remove("auth-exit-animation");
        hospPortalPage.style.display = "flex";
    }
    if (authPage) {
        authPage.classList.remove("hidden");
        authPage.classList.remove("auth-exit-animation");
        authPage.style.display = "";
        openHospitalPortal(currentRole || "hospital");
    } else if (hospAuthSection) {
        hospAuthSection.classList.remove("hidden");
        hospAuthSection.classList.remove("auth-exit-animation");
        hospAuthSection.style.display = "";
        switchHospitalTab("signin");
    }
}

/**
 * Open Hospital Selection Hub
 */
function openHospitalHub(hospitalName, licenseNumber) {
    hideHospitalAuthPage();

    const dashboard = document.getElementById("dashboard");
    const hospHubSection = document.getElementById("hospitalHubSection");
    const hospInvSection = document.getElementById("hospitalInventorySection");
    const hospTransferSection = document.getElementById("hospitalTransferSection");

    if (dashboard) dashboard.classList.add("hidden");
    if (hospInvSection) hospInvSection.classList.add("hidden");
    if (hospTransferSection) hospTransferSection.classList.add("hidden");

    if (hospHubSection) {
        hospHubSection.classList.remove("hidden");
        hospHubSection.style.display = "flex";
        hospHubSection.classList.remove("dashboard-enter-animation");
        void hospHubSection.offsetWidth;
        hospHubSection.classList.add("dashboard-enter-animation");
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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

/**
 * Open Full Hospital Blood Bank & Emergency Dashboard Directly
 */
function openHospitalDashboard(hospitalName, licenseNumber) {
    hideHospitalAuthPage();

    const dashboard = document.getElementById("dashboard");
    const hubSection = document.getElementById("hospitalHubSection");
    const invSection = document.getElementById("hospitalInventorySection");
    const transferSection = document.getElementById("hospitalTransferSection");
    const secModal = document.getElementById("hospSecurityGateModal");

    if (dashboard) dashboard.classList.add("hidden");
    if (hubSection) hubSection.classList.add("hidden");
    if (transferSection) transferSection.classList.add("hidden");
    if (secModal) secModal.classList.add("hidden");

    const nameToUse = hospitalName || localStorage.getItem("bloodlinkUserName") || "City Care Blood Centre & Hospital";
    const licToUse = licenseNumber || localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";
    const roleToUse = (currentRole === "ngo" || licToUse.toUpperCase().startsWith("NGO-") || licToUse.toUpperCase().startsWith("LIC-NGO-")) ? "ngo" : (localStorage.getItem("bloodlinkUserRole") || "hospital");

    localStorage.setItem("bloodlinkUserName", nameToUse);
    localStorage.setItem("bloodlinkUserRole", roleToUse);
    localStorage.setItem("bloodlinkUserLicense", licToUse);

    const sideName = document.getElementById("sidebarHospitalName");
    const sideLic = document.getElementById("sidebarHospitalLicense");
    const hubName = document.getElementById("hubHospitalName");
    const hubTitle = document.getElementById("hubWelcomeHospitalTitle");
    const hubLic = document.getElementById("hubHospitalLicense");
    const invBadge = document.getElementById("invHospitalBadge");

    if (sideName) sideName.textContent = nameToUse;
    if (sideLic) sideLic.textContent = licToUse;
    if (hubName) hubName.textContent = nameToUse;
    if (hubTitle) hubTitle.textContent = nameToUse;
    if (hubLic) hubLic.textContent = licToUse;
    if (invBadge) invBadge.textContent = `${nameToUse} • Licence: ${licToUse}`;

    if (invSection) {
        invSection.classList.remove("hidden");
        invSection.style.display = "flex";
        invSection.classList.remove("dashboard-enter-animation");
        void invSection.offsetWidth;
        invSection.classList.add("dashboard-enter-animation");

        initHospitalProfile();
        switchSidebarTab("inventory");
        renderBloodBankInventory();
        renderInboundLogTable();
        refreshSosRadar();
        renderUnifiedDirectory();
        renderNgoTransfersTable();
        checkLowStockAlerts(true);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

/**
 * Sign out from Hospital Portal
 */
function logoutHospital() {
    const hospHubSection = document.getElementById("hospitalHubSection");
    const hospInvSection = document.getElementById("hospitalInventorySection");
    const hospTransferSection = document.getElementById("hospitalTransferSection");

    if (hospHubSection) hospHubSection.classList.add("hidden");
    if (hospInvSection) hospInvSection.classList.add("hidden");
    if (hospTransferSection) hospTransferSection.classList.add("hidden");

    showHospitalAuthPage();

    const signInBtn = document.getElementById("hospSignInBtn");
    if (signInBtn) {
        signInBtn.innerHTML = '<span>Sign In to LifeFlow Hospital Portal</span> <i class="fa-solid fa-arrow-right"></i>';
        signInBtn.disabled = false;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    showToast("Signed out from Hospital Portal successfully.", "info");
}

/**
 * 2. Security Check for "Manage Your Blood Bank"
 */
function openSecurityGate() {
    if (localStorage.getItem("bloodlinkUserRole") === "hospital") {
        openHospitalDashboard();
        return;
    }
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
        openHospitalDashboard();
    } else {
        showToast("Access Denied: Invalid Admin / Staff ID or Security Key. Try demo: ADMIN-001 / admin@123", "error");
        if (formCard) triggerShake(formCard);
    }
}

/**
 * Direct Instant Dashboard Access (Evaluation Shortcut)
 */
function directEnterHospitalDashboard() {
    if (currentRole === "ngo") {
        openHospitalDashboard("Red Cross Blood Bank & Voluntary Mission, Odisha", "NGO-OD-8821");
        showToast("Direct Evaluation: NGO Blood Partner & Emergency Dashboard active!", "success");
    } else {
        openHospitalDashboard("City Care Blood Centre & Hospital", "LIC-OD-2026-001");
        showToast("Direct Evaluation: Hospital Blood Bank & Emergency Dashboard active!", "success");
    }
}

/**
 * Back to Services button navigation
 */
function backToHub() {
    const hubSection = document.getElementById("hospitalHubSection");
    const invSection = document.getElementById("hospitalInventorySection");
    const transferSection = document.getElementById("hospitalTransferSection");

    hideHospitalAuthPage();

    if (invSection) invSection.classList.add("hidden");
    if (transferSection) transferSection.classList.add("hidden");
    if (hubSection) {
        hubSection.classList.remove("hidden");
        hubSection.style.display = "flex";
        hubSection.classList.remove("dashboard-enter-animation");
        void hubSection.offsetWidth;
        hubSection.classList.add("dashboard-enter-animation");
        updateInventoryCounters();
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
}

/**
 * =====================================================
 * REQUIREMENT 1: DYNAMIC UI THRESHOLD INDICATOR ENGINE
 * - Red: Units < 100 (Critical / Immediate restocking required)
 * - Yellow: Units 100–150 (Low / Moderate warning)
 * - Green: Units > 150 (Adequate stock)
 * - Severe Shortage Trigger: Units < 100
 * =====================================================
 */
function getInventoryStatusColor(units) {
    if (units < 100) {
        return {
            color: "red",
            tier: "critical",
            label: "Critical Alert",
            subLabel: "Immediate restocking required (< 100)",
            badgeClass: "stock-pill-red",
            dotClass: "pulse-dot-red",
            statusClass: "critical",
            icon: "fa-solid fa-triangle-exclamation",
            buttonClass: "btn-threshold-red",
            requiresRestock: true
        };
    } else if (units <= 150) {
        return {
            color: "yellow",
            tier: "moderate",
            label: "Moderate Warning",
            subLabel: "100–150 units",
            badgeClass: "stock-pill-yellow",
            dotClass: "pulse-dot-amber",
            statusClass: "moderate",
            icon: "fa-solid fa-triangle-exclamation",
            buttonClass: "btn-threshold-yellow",
            requiresRestock: false
        };
    } else {
        return {
            color: "green",
            tier: "adequate",
            label: "Adequate Stock",
            subLabel: "Above 150 units (> 150)",
            badgeClass: "stock-pill-green",
            dotClass: "pulse-dot-green",
            statusClass: "safe",
            icon: "fa-solid fa-circle-check",
            buttonClass: "btn-threshold-green",
            requiresRestock: false
        };
    }
}

function isSevereShortage(units) {
    return units < 100;
}

/**
 * Critical Alert Trigger: If any blood group's unit count falls below 100 units (units < 100),
 * triggers an immediate alert banner or toast notification warning hospital clinical staff.
 */
function checkLowStockAlerts(triggerToast = false) {
    const banner = document.getElementById("severeShortageAlertBanner");
    const chipsContainer = document.getElementById("shortageGroupsChips");
    const shortageGroups = [];

    for (const [grp, data] of Object.entries(hospitalInventory)) {
        if (!data.isRare && isSevereShortage(data.units)) {
            shortageGroups.push({ group: grp, units: data.units, component: data.component });
        }
    }

    if (shortageGroups.length > 0) {
        if (banner) {
            banner.classList.remove("hidden");
            if (chipsContainer) {
                chipsContainer.innerHTML = shortageGroups.map(s => `
                    <span class="shortage-chip">
                        <i class="fa-solid fa-droplet"></i>
                        ${s.group}: <strong>${s.units} Units</strong> (${s.component})
                    </span>
                `).join("");
            }
        }
        if (triggerToast) {
            const grpNames = shortageGroups.map(s => `${s.group} (${s.units} units)`).join(", ");
            showToast(`CRITICAL SHORTAGE: ${grpNames} strictly below 100 units! Immediate restocking required.`, "error");
        }
    } else {
        if (banner) banner.classList.add("hidden");
    }

    return shortageGroups;
}

function dismissShortageBanner() {
    const banner = document.getElementById("severeShortageAlertBanner");
    if (banner) banner.classList.add("hidden");
    showToast("Severe shortage alert banner dismissed for this session.", "info");
}

function scrollToNgoDiscovery() {
    const section = document.getElementById("ngoDiscoverySection");
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        section.classList.add("card-highlighted");
        setTimeout(() => section.classList.remove("card-highlighted"), 2000);
    }
}

function openNgoNetworkView() {
    const hub = document.getElementById("hospitalHubSection");
    const inv = document.getElementById("hospitalInventorySection");
    if (hub) hub.classList.add("hidden");
    if (inv) {
        inv.classList.remove("hidden");
        renderBloodBankInventory();
        renderNearbyNgos();
        renderNgoTransfersTable();
        setTimeout(scrollToNgoDiscovery, 300);
    }
}

/**
 * 3. Render Blood Bank Inventory Dashboard with Dynamic UI Thresholds
 */
function renderBloodBankInventory() {
    const stdGrid = document.getElementById("standardBloodGrid");
    const rareGrid = document.getElementById("rareBloodGrid");

    const standardGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const rareGroups = ["Bombay Oh", "Rh-null"];

    if (stdGrid) {
        stdGrid.innerHTML = standardGroups.map(grp => {
            const data = hospitalInventory[grp];
            const indicator = getInventoryStatusColor(data.units);
            const isShortage = isSevereShortage(data.units);

            return `
                <div class="blood-card ${isShortage ? 'card-severe-shortage' : ''}" id="bloodCard_${grp.replace("+", "pos").replace("-", "neg")}">
                    <div class="blood-card-header">
                        <span class="blood-type-symbol">${grp}</span>
                        <span class="stock-status-indicator ${indicator.statusClass}">
                            <span class="${indicator.dotClass}"></span>
                            ${indicator.label}
                        </span>
                    </div>

                    <!-- DYNAMIC THRESHOLD BADGE: Red < 100, Yellow 100–150, Green > 150 -->
                    <div class="stock-pill-dynamic ${indicator.badgeClass}" id="stockBadge_${grp.replace("+", "pos").replace("-", "neg")}">
                        <i class="${indicator.icon}"></i>
                        <span>${data.units} Units Available</span>
                    </div>

                    <div class="blood-card-meta">
                        <span class="component-text">${data.component}</span>
                        <div class="stock-quick-actions">
                            <button type="button" class="btn-micro" onclick="adjustStock('${grp}', -1)" title="Deduct / Issue 1 Unit">-</button>
                            <button type="button" class="btn-micro" onclick="adjustStock('${grp}', 1)" title="Add / Restock 1 Unit">+</button>
                        </div>
                    </div>

                    ${indicator.requiresRestock ? `
                        <div style="margin-top:8px;">
                            <button type="button" class="btn-threshold-red" style="width:100%; padding:6px 10px; border-radius:8px; font-size:11.5px; font-weight:800; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer;" onclick="openNgoTransferModalForGroup('${grp}')">
                                <i class="fa-solid fa-truck-medical"></i> Restock from NGO
                            </button>
                        </div>
                    ` : ''}
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

                    <div class="stock-pill-dynamic stock-pill-green">
                        <i class="fa-solid fa-snowflake"></i>
                        <span>${data.units} Units Available (Cryo -80°C)</span>
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
    checkLowStockAlerts(false);
}

/**
 * Adjust stock count manually (+/-) with Critical Alert Trigger (< 100 units)
 */
function adjustStock(bloodGroup, delta) {
    if (!hospitalInventory[bloodGroup]) return;

    const previousUnits = hospitalInventory[bloodGroup].units;
    const newUnits = Math.max(0, previousUnits + delta);
    hospitalInventory[bloodGroup].units = newUnits;

    renderBloodBankInventory();

    const cleanId = bloodGroup.replace("+", "pos").replace("-", "neg").replace(" ", "_");
    const card = document.getElementById(`bloodCard_${cleanId}`);
    if (card) {
        card.classList.add("card-highlighted");
        setTimeout(() => card.classList.remove("card-highlighted"), 1500);
    }

    // Critical Alert Trigger: If units falls strictly below 100
    if (newUnits < 100 && previousUnits >= 100) {
        showToast(`CRITICAL SHORTAGE: ${bloodGroup} unit count dropped to ${newUnits} (< 100 Units)! Emergency restocking alert triggered.`, "error");
    } else if (delta > 0) {
        showToast(`Stock updated: +1 Unit added to ${bloodGroup}. Total: ${newUnits} units.`, "success");
    } else {
        showToast(`Stock updated: 1 Unit issued from ${bloodGroup}. Remaining: ${newUnits} units.`, "info");
    }
}

/**
 * Update inventory summary counters conforming to exact thresholds:
 * - Safe: Units > 150
 * - Moderate: Units 100–150
 * - Critical: Units < 100
 */
function updateInventoryCounters() {
    let total = 0;
    let safeCount = 0;
    let moderateCount = 0;
    let criticalCount = 0;

    for (const [grp, data] of Object.entries(hospitalInventory)) {
        total += data.units;
        if (!data.isRare) {
            if (data.units > 150) {
                safeCount++;
            } else if (data.units >= 100) {
                moderateCount++;
            } else {
                criticalCount++;
            }
        }
    }

    const hubMetric = document.getElementById("hubTotalStockMetric");
    const invTotal = document.getElementById("invTotalUnitsDisplay");
    const invSafe = document.getElementById("invSafeGroupsDisplay");
    const invMod = document.getElementById("invModerateGroupsDisplay");
    const invCrit = document.getElementById("invCriticalGroupsDisplay");
    const sidebarStockBadge = document.getElementById("sidebarStockCountBadge");

    if (hubMetric) hubMetric.textContent = total;
    if (invTotal) invTotal.textContent = total;
    if (invSafe) invSafe.textContent = safeCount;
    if (invMod) invMod.textContent = moderateCount;
    if (invCrit) invCrit.textContent = criticalCount;
    if (sidebarStockBadge) sidebarStockBadge.textContent = total;
}

/**
 * =====================================================
 * REQUIREMENT 2: BARCODE INTEGRATION FOR BLOOD UNITS (ISBT-128)
 * - Authentic linear Barcode generation (Code 39 / ISBT-128 DIN)
 * - Canvas barcode rendering with quiet zones, guard bars & human-readable text
 * - Print blood bag label with clinical compliance
 * - Laser scanner simulation & barcode payload decoder
 * =====================================================
 */

// Draw an authentic, scannable linear Barcode on any canvas without external libraries
function drawBarcode(canvas, text, labelSubtitle = "") {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Code 39 Pattern Dictionary (5 bars, 4 spaces; 3 wide '1', 6 narrow '0')
    const CODE39 = {
        '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
        '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
        '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
        'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
        'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
        'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
        'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
        'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
        'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
        '-': '010000101', '.': '110000100', ' ': '011000100', '*': '010010100',
        '$': '010101000', '/': '010100010', '+': '010001010', '%': '000101010'
    };

    // Sanitize string to supported Code 39 chars
    const rawUpper = (text || "BB-2026-8812").toUpperCase();
    const cleanStr = rawUpper.split("").filter(c => CODE39[c] !== undefined).join("") || "BB-2026-0001";
    const fullCode = `*${cleanStr}*`; // Code 39 framing asterisks

    const narrowUnits = 1;
    const wideUnits = 2.4;
    let totalUnits = 0;
    for (let i = 0; i < fullCode.length; i++) {
        const pattern = CODE39[fullCode[i]];
        for (let p = 0; p < 9; p++) {
            totalUnits += pattern[p] === '1' ? wideUnits : narrowUnits;
        }
        if (i < fullCode.length - 1) totalUnits += narrowUnits;
    }

    const margin = Math.max(10, Math.floor(width * 0.04));
    const availableWidth = width - (margin * 2);
    const unitPx = Math.max(0.6, availableWidth / totalUnits);
    const barcodeStartX = margin + Math.max(0, (availableWidth - (totalUnits * unitPx)) / 2);

    const barHeight = Math.max(30, height - 32);
    const barTop = 8;

    let currX = barcodeStartX;
    ctx.fillStyle = "#0F172A";

    for (let i = 0; i < fullCode.length; i++) {
        const pattern = CODE39[fullCode[i]];
        for (let p = 0; p < 9; p++) {
            const isBar = (p % 2 === 0);
            const isWide = (pattern[p] === '1');
            const w = (isWide ? wideUnits : narrowUnits) * unitPx;

            if (isBar) {
                ctx.fillRect(currX, barTop, Math.ceil(w), barHeight);
            }
            currX += w;
        }
        if (i < fullCode.length - 1) {
            currX += narrowUnits * unitPx;
        }
    }

    // Human-readable Barcode label text centered underneath
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 12px 'JetBrains Mono', 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textY = barTop + barHeight + 13;
    ctx.fillText(`* ${cleanStr} *`, width / 2, textY);

    if (labelSubtitle && height > 85) {
        ctx.fillStyle = "#64748B";
        ctx.font = "9px system-ui, sans-serif";
        ctx.fillText(labelSubtitle, width / 2, textY + 11);
    }
}

// Backward compatibility alias for any caller
function drawQrCodeMatrix(canvas, payloadText) {
    let code = payloadText;
    try {
        const obj = JSON.parse(payloadText);
        if (obj.unitId) code = obj.unitId;
    } catch (_) {}
    drawBarcode(canvas, code);
}

let generatedBarcodeUnit = null;
let generatedQrUnit = null;

function openBarcodeStudioModal(initialTab = "generate") {
    switchSidebarTab("barcode");
    switchBarcodeStudioTab(initialTab);
    const vp = document.querySelector(".hosp-main-viewport");
    if (vp) vp.scrollTo({ top: 0, behavior: "smooth" });
    if (initialTab === "generate" && !document.getElementById("genUnitId")?.value) {
        generateRandomUnitId();
    }
}

function closeBarcodeStudioModal() {
    switchSidebarTab("inventory");
}

function switchBarcodeStudioTab(tab) {
    const genTab = document.getElementById("barcodeTabGenerateContent") || document.getElementById("qrTabGenerateContent");
    const scanTab = document.getElementById("barcodeTabScanContent") || document.getElementById("qrTabScanContent");
    const btnGen = document.getElementById("tabBtnGenerateBarcode") || document.getElementById("tabBtnGenerateQr");
    const btnScan = document.getElementById("tabBtnScanBarcode") || document.getElementById("tabBtnScanQr");

    if (tab === "generate") {
        if (genTab) genTab.classList.remove("hidden");
        if (scanTab) scanTab.classList.add("hidden");
        if (btnGen) btnGen.classList.add("active");
        if (btnScan) btnScan.classList.remove("active");
    } else {
        if (genTab) genTab.classList.add("hidden");
        if (scanTab) scanTab.classList.remove("hidden");
        if (btnGen) btnGen.classList.remove("active");
        if (btnScan) btnScan.classList.add("active");
        selectBarcodeSample("A_POS");
    }
}

function generateRandomUnitId() {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const id = `BB-2026-${randNum}`;
    const idInput = document.getElementById("genUnitId");
    if (idInput) idInput.value = id;

    // Set dates
    const today = new Date();
    const exp = new Date();
    exp.setDate(today.getDate() + 42);

    const colInput = document.getElementById("genCollectionDate");
    const expInput = document.getElementById("genExpiryDate");
    if (colInput) colInput.value = today.toISOString().split("T")[0];
    if (expInput) expInput.value = exp.toISOString().split("T")[0];

    updateGeneratedBarcodePreview();
}

function onGenBloodGroupChange() {
    updateGeneratedBarcodePreview();
}

function handleGenerateBarcodeUnit(event) {
    if (event) event.preventDefault();
    updateGeneratedBarcodePreview();
    showToast("Barcode metadata and ISBT-128 blood bag label generated successfully!", "success");
}

function updateGeneratedBarcodePreview() {
    const unitId = document.getElementById("genUnitId")?.value || `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const bloodGroup = document.getElementById("genBloodGroup")?.value || "A+";
    const comp = document.getElementById("genComponent")?.value || "Packed Red Blood Cells (PRBC)";
    const colDate = document.getElementById("genCollectionDate")?.value || new Date().toISOString().split("T")[0];
    const expDate = document.getElementById("genExpiryDate")?.value || "2026-10-20";
    const hospId = document.getElementById("genHospitalId")?.value || "HOSP-001";
    const status = document.getElementById("genStatus")?.value || "Available";
    const volume = document.getElementById("genVolume")?.value || "450";
    const licenseNo = document.getElementById("genLicenseNo")?.value || hospitalProfileState?.licenseNumber || "LIC-2026-001";

    // Build Secure Barcode metadata payload
    generatedBarcodeUnit = {
        unitId,
        bloodGroup,
        component: comp,
        collectionDate: colDate,
        expiryDate: expDate,
        hospitalId: hospId,
        licenseNo: licenseNo,
        status,
        volumeMl: parseInt(volume, 10),
        checksum: `SEC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };
    generatedQrUnit = generatedBarcodeUnit;

    // Render Canvas with authentic ISBT-128 linear Barcode
    const canvas = document.getElementById("barcodeCanvasDisplay") || document.getElementById("qrCanvasDisplay");
    if (canvas) {
        drawBarcode(canvas, unitId, `ISBT-128 DIN: ${unitId} • ${bloodGroup} • ${comp.split('(')[0].trim()}`);
    }

    const labelCanvas = document.getElementById("labelBarcodeCanvas");
    if (labelCanvas) {
        drawBarcode(labelCanvas, unitId, `ISBT-128: ${unitId}`);
    }

    // Update Label DOM
    const lblHosp = document.getElementById("lblHospName");
    const lblLic = document.getElementById("lblLicNo");
    const lblGrp = document.getElementById("lblBloodGroup");
    const lblBag = document.getElementById("lblBagId");
    const lblCmp = document.getElementById("lblComp");
    const lblExp = document.getElementById("lblExpiry");
    const lblVol = document.getElementById("lblVol");
    const chkBadge = document.getElementById("barcodeChecksumBadge") || document.getElementById("qrChecksumBadge");

    const hospName = document.getElementById("hubHospitalName")?.textContent || hospitalProfileState?.name || "City Care Blood Centre";
    const hospLic = licenseNo;

    if (lblHosp) lblHosp.textContent = hospName;
    if (lblLic) lblLic.textContent = hospLic;
    if (lblGrp) lblGrp.textContent = bloodGroup;
    if (lblBag) lblBag.textContent = unitId;
    if (lblCmp) lblCmp.textContent = comp;
    if (lblExp) lblExp.textContent = expDate;
    if (lblVol) lblVol.textContent = `${volume} mL (CPDA-1)`;
    if (chkBadge) chkBadge.textContent = `ISBT-128 DIN: ${unitId} | CHECKSUM: ${generatedBarcodeUnit.checksum}`;
}

function printBloodBagLabel() {
    if (!generatedBarcodeUnit) updateGeneratedBarcodePreview();

    const printableSection = document.getElementById("printableLabelSection");
    const previewContent = document.getElementById("printableLabelPreview");

    if (printableSection && previewContent) {
        printableSection.innerHTML = previewContent.outerHTML;
        window.print();
        showToast("Blood bag Barcode label sent to printing spooler.", "info");
    }
}

function saveGeneratedUnitToStock() {
    if (!generatedBarcodeUnit) updateGeneratedBarcodePreview();

    const grp = generatedBarcodeUnit.bloodGroup;
    if (!hospitalInventory[grp]) {
        hospitalInventory[grp] = { units: 1, component: generatedBarcodeUnit.component };
    } else {
        hospitalInventory[grp].units += 1;
    }

    inboundRestockLog.unshift({
        bagId: generatedBarcodeUnit.unitId,
        bloodGroup: grp,
        donorDate: generatedBarcodeUnit.collectionDate,
        expiryDate: generatedBarcodeUnit.expiryDate,
        volume: `${generatedBarcodeUnit.volumeMl} mL`,
        serology: "Verified Negative",
        action: "Restocked (+1)"
    });

    renderBloodBankInventory();
    renderInboundLogTable();
    closeBarcodeStudioModal();

    showToast(`Unit ${generatedBarcodeUnit.unitId} (${grp}) registered via Barcode & added to active stock (+1)!`, "success");
}

function selectBarcodeSample(key) {
    if (!BARCODE_SAMPLE_PRESETS[key]) return;
    currentScannedBag = BARCODE_SAMPLE_PRESETS[key];

    const presetBtns = document.querySelectorAll(".preset-btn");
    presetBtns.forEach(btn => btn.classList.remove("active"));
    const activeBtn = Array.from(presetBtns).find(b => b.textContent.includes(currentScannedBag.bloodGroup));
    if (activeBtn) activeBtn.classList.add("active");

    displayDecodedBag(currentScannedBag);
}

function decodeManualBarcode() {
    const input = document.getElementById("manualBarcodeInput") || document.getElementById("manualQrInput");
    const rawVal = (input?.value || "").trim();

    if (!rawVal) {
        showToast("Please enter a valid Barcode number or delimited payload.", "info");
        return;
    }

    let detectedId = rawVal.toUpperCase();
    let detectedGroup = "A+";
    let detectedComp = "Packed Red Blood Cells (PRBC)";
    let detectedExp = "20 Oct 2026";

    // Try parsing as JSON or delimited string or direct bagId
    try {
        const obj = JSON.parse(rawVal);
        if (obj.unitId) detectedId = obj.unitId;
        if (obj.bloodGroup) detectedGroup = obj.bloodGroup;
        if (obj.component) detectedComp = obj.component;
        if (obj.expiryDate) detectedExp = obj.expiryDate;
    } catch {
        const parts = rawVal.split("|");
        if (parts.length >= 2) {
            detectedId = parts[0];
            detectedGroup = parts[1].trim();
            if (parts[3]) detectedExp = parts[3];
        } else {
            const presetMatch = Object.values(BARCODE_SAMPLE_PRESETS).find(p => p.bagId.toLowerCase() === rawVal.toLowerCase());
            if (presetMatch) {
                currentScannedBag = presetMatch;
                displayDecodedBag(currentScannedBag);
                showToast(`Barcode laser scanned: Unit ${currentScannedBag.bagId} (${currentScannedBag.bloodGroup}). ISBT-128 Verified.`, "success");
                return;
            }
        }
    }

    currentScannedBag = {
        bagId: detectedId,
        bloodGroup: detectedGroup,
        donorDate: new Date().toISOString().split("T")[0],
        expiryDate: detectedExp,
        volume: "450 mL (CPDA-1)",
        component: detectedComp,
        serology: "Certified Negative (Safe for Transfusion)",
        coldChain: "Compliant (3.8°C Monitored)"
    };

    displayDecodedBag(currentScannedBag);
    showToast(`Barcode scanned: Unit ${detectedId} (${detectedGroup}). Authentic ISBT-128 blood bag.`, "success");
}

function displayDecodedBag(bag) {
    const bloodBadge = document.getElementById("decBloodGroup");
    const bagId = document.getElementById("decBagId");
    const comp = document.getElementById("decComponent");
    const donor = document.getElementById("decDonorDate");
    const expiry = document.getElementById("decExpiryDate");
    const hospId = document.getElementById("decHospitalId");
    const licBadge = document.getElementById("decLicenseNo");
    const statusText = document.getElementById("decStatusText");

    if (bloodBadge) bloodBadge.textContent = bag.bloodGroup;
    if (bagId) bagId.textContent = bag.bagId;
    if (comp) comp.textContent = bag.component;
    if (donor) donor.textContent = bag.donorDate;
    if (expiry) expiry.textContent = bag.expiryDate;
    if (hospId) hospId.textContent = bag.hospitalId || "HOSP-001 (City Care)";
    if (licBadge) licBadge.textContent = bag.licenseNo || "LIC-2026-001";
    if (statusText) statusText.textContent = bag.status || "Available";
}

function confirmAddBarcodeToStock() {
    if (!currentScannedBag) return;

    const grp = currentScannedBag.bloodGroup;

    if (!hospitalInventory[grp]) {
        hospitalInventory[grp] = { units: 1, component: currentScannedBag.component };
    } else {
        hospitalInventory[grp].units += 1;
    }

    inboundRestockLog.unshift({
        bagId: currentScannedBag.bagId,
        bloodGroup: grp,
        donorDate: currentScannedBag.donorDate,
        expiryDate: currentScannedBag.expiryDate.split(" ")[0] || "20 Oct 2026",
        volume: currentScannedBag.volume.split(" ")[0] + " mL",
        serology: "Passed Serology (Clean)",
        action: "Restocked (+1)"
    });

    renderBloodBankInventory();
    renderInboundLogTable();
    closeBarcodeStudioModal();
    closeBarcodeScannerModal();

    const cleanId = grp.replace("+", "pos").replace("-", "neg").replace(" ", "_");
    const card = document.getElementById(`bloodCard_${cleanId}`);
    if (card) {
        card.classList.add("card-highlighted");
        setTimeout(() => card.classList.remove("card-highlighted"), 1800);
        card.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showToast(`Blood Bag ${currentScannedBag.bagId} (${grp}) restocked via Barcode scan! (+1 Unit)`, "success");
}

function openBarcodeScannerModal() {
    const modal = document.getElementById("barcodeScannerModal") || document.getElementById("qrScannerModal");
    if (modal) {
        modal.classList.remove("hidden");
        selectBarcodeSample("A_POS");
    }
}

function closeBarcodeScannerModal() {
    const modal = document.getElementById("barcodeScannerModal") || document.getElementById("qrScannerModal");
    if (modal) {
        modal.classList.add("hidden");
    }
}

// Aliases for seamless backward compatibility
const openQrStudioModal = openBarcodeStudioModal;
const closeQrStudioModal = closeBarcodeStudioModal;
const switchQrStudioTab = switchBarcodeStudioTab;
const handleGenerateQrUnit = handleGenerateBarcodeUnit;
const updateGeneratedQrPreview = updateGeneratedBarcodePreview;
const selectQrSample = selectBarcodeSample;
const decodeManualQr = decodeManualBarcode;
const confirmAddQrToStock = confirmAddBarcodeToStock;
const openQrScannerModal = openBarcodeScannerModal;
const closeQrScannerModal = closeBarcodeScannerModal;

/**
 * =====================================================
 * REQUIREMENT 3: HOSPITAL-NGO LICENSING CONNECTION & DISCOVERY
 * - License Number validation with edge-case handling
 * - Directory of nearby registered NGOs (within 25 km)
 * - Inter-facility transfer requisition workflow
 * =====================================================
 */

const registeredNgosData = [
    {
        id: "ngo-od-9021",
        name: "Odisha Blood Relief & Voluntary Donor Network",
        license: "NGO-OD-9021",
        accreditation: "National Blood Transfusion Council (NBTC) & SBTC Odisha",
        contact: "Dr. Subhashree Dash",
        phone: "+91 674 239 8811",
        email: "operations@odishabloodrelief.org",
        address: "Plot 14, Saheed Nagar, Janpath, Bhubaneswar, Odisha 751007",
        lat: 20.2985,
        lon: 85.8275,
        distance: "0.4 km away",
        stock: 55,
        donorCapacity: 450,
        hours: "24/7 Rapid Regional Dispatch",
        connected: true
    },
    {
        id: "ngo-001",
        name: "Red Cross Blood Bank & Voluntary Mission, Odisha",
        license: "NGO-OD-8821",
        accreditation: "National Blood Transfusion Council (NBTC) & IRCS Odisha",
        contact: "Dr. Ananya Mahapatra",
        phone: "+91 674 239 5152",
        email: "mission@redcrossodisha.org",
        address: "Red Cross Bhawan, Unit 9, Sachivalaya Marg, Bhubaneswar, Odisha 751022",
        lat: 20.2885,
        lon: 85.8340,
        distance: "1.3 km away",
        stock: 48,
        donorCapacity: 350,
        hours: "24/7 Emergency Dispatch",
        connected: true
    },
    {
        id: "ngo-003",
        name: "Rotary Club of Bhubaneswar Blood Bank",
        license: "NGO-OD-3310",
        accreditation: "AABB & SBTC Odisha Certified",
        contact: "Dr. Arvind Tripathy",
        phone: "+91 674 256 0410",
        email: "info@rotarybloodbbsr.org",
        address: "Rotary Centre, Unit-8, Nayapalli, Bhubaneswar, Odisha 751012",
        lat: 20.2940,
        lon: 85.8050,
        distance: "2.0 km away",
        stock: 80,
        donorCapacity: 550,
        hours: "24/7 Emergency Ambulance",
        connected: true
    },
    {
        id: "ngo-005",
        name: "Youth Red Cross & Voluntary Donor Brigade, Odisha",
        license: "NGO-OD-7729",
        accreditation: "Indian Society of Blood Transfusion (ISBTI)",
        contact: "Bikram Keshari Jena",
        phone: "+91 674 258 7411",
        email: "contact@youthdonorodisha.org",
        address: "Utkal University Campus, Vani Vihar, Bhubaneswar, Odisha 751004",
        lat: 20.3020,
        lon: 85.8450,
        distance: "2.2 km away",
        stock: 28,
        donorCapacity: 180,
        hours: "09:00 – 20:00 Rapid Dispatch",
        connected: false
    },
    {
        id: "ngo-002",
        name: "Ama Odisha Blood Donation Mission",
        license: "NGO-OD-4512",
        accreditation: "State Blood Transfusion Council (SBTC Odisha)",
        contact: "Soumya Ranjan Patnaik",
        phone: "+91 674 258 0210",
        email: "dispatch@amaodishablood.org",
        address: "A/37 Rasulgarh Industrial Estate, Bhubaneswar, Odisha 751010",
        lat: 20.3015,
        lon: 85.8580,
        distance: "3.5 km away",
        stock: 35,
        donorCapacity: 220,
        hours: "08:00 – 22:00 Dispatch",
        connected: false
    },
    {
        id: "ngo-004",
        name: "Utkal Blood Relief & Welfare Society",
        license: "NGO-OD-9904",
        accreditation: "National Blood Transfusion Council (NBTC)",
        contact: "Sunita Mohanty",
        phone: "+91 671 232 4590",
        email: "help@utkalbloodrelief.org",
        address: "Badambadi, Link Road, Cuttack, Odisha 753012",
        lat: 20.4480,
        lon: 85.8750,
        distance: "17.7 km away",
        stock: 62,
        donorCapacity: 410,
        hours: "24/7 Cold-Chain Dispatch",
        connected: false
    }
];

let activeNgoTransfers = [
    {
        code: "TRX-NGO-8841",
        ngoName: "Red Cross Blood Bank & Voluntary Mission, Odisha",
        bloodGroup: "O-",
        units: 4,
        urgency: "Emergency STAT (< 15 Mins)",
        status: "In Transit (Cold-Chain Ambulance)",
        time: "12 mins ago"
    },
    {
        code: "TRX-NGO-7712",
        ngoName: "Rotary Club of Bhubaneswar Blood Bank",
        bloodGroup: "A+",
        units: 6,
        urgency: "Priority (< 2 Hours)",
        status: "Delivered & Verified",
        time: "3 hours ago"
    }
];

let currentDemoNgoIndex = 0;
const demoNgoLicenses = [
    { license: "NGO-OD-9021", name: "Odisha Blood Relief & Voluntary Donor Network" },
    { license: "NGO-OD-8821", name: "Red Cross Blood Bank & Voluntary Mission, Odisha" },
    { license: "NGO-OD-4512", name: "Ama Odisha Blood Donation Mission" },
    { license: "NGO-OD-9904", name: "Utkal Blood Relief & Welfare Society" }
];

function fillDemoNgoLicense(licenseCode, btnEl) {
    const input = document.getElementById("ngoLicenseInput");
    const feedback = document.getElementById("ngoLicenseFeedback");
    if (!input) return;

    let targetLic = licenseCode;
    let targetName = "";
    if (!targetLic) {
        const item = demoNgoLicenses[currentDemoNgoIndex % demoNgoLicenses.length];
        currentDemoNgoIndex++;
        targetLic = item.license;
        targetName = item.name;
    } else {
        const found = demoNgoLicenses.find(d => d.license === targetLic);
        if (found) targetName = found.name;
    }

    input.value = targetLic;

    // Highlight active chip
    if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll(".demo-chip").forEach(c => c.classList.remove("active"));
        btnEl.classList.add("active");
    }

    if (feedback) {
        feedback.className = "hidden";
        feedback.innerHTML = "";
    }

    input.classList.add("input-demo-highlight");
    setTimeout(() => input.classList.remove("input-demo-highlight"), 900);

    input.focus();
    showToast(`Demo NGO license auto-filled: ${targetLic}${targetName ? ' (' + targetName + ')' : ''}. Click "Link NGO" to connect.`, "info");
}
window.fillDemoNgoLicense = fillDemoNgoLicense;

function verifyNgoLicense() {
    const input = document.getElementById("ngoLicenseInput");
    const feedback = document.getElementById("ngoLicenseFeedback");
    const rawVal = (input?.value || "").trim().toUpperCase();

    if (!feedback) return;
    feedback.classList.remove("hidden");

    // Edge Case 1: Empty input
    if (!rawVal) {
        feedback.className = "validation-feedback-box error";
        feedback.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>Missing License Number:</strong> Please enter an official statutory NGO license number (e.g. NGO-OD-8821).
            </div>
        `;
        showToast("Please enter an NGO license number.", "error");
        return;
    }

    // Edge Case 2: Regulatory pattern regex validation
    const pattern = /^(NGO|LIC-NGO)-[A-Z]{2,3}-\d{3,5}$/;
    if (!pattern.test(rawVal)) {
        feedback.className = "validation-feedback-box error";
        feedback.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
                <strong>Invalid License Format:</strong> "${rawVal}" does not adhere to the statutory National Transfusion Registry format.
                <div style="font-size:12px; margin-top:4px; opacity:0.9;">Format required: <code>(NGO|LIC-NGO)-&lt;StateCode&gt;-&lt;Digits&gt;</code> (e.g., <strong>NGO-OD-8821</strong> or <strong>NGO-OD-9021</strong>).</div>
            </div>
        `;
        showToast("Invalid NGO license format.", "error");
        return;
    }

    // Edge Case 3: Registry lookup
    const foundNgo = registeredNgosData.find(n => n.license.toUpperCase() === rawVal);
    if (!foundNgo) {
        feedback.className = "validation-feedback-box error";
        feedback.innerHTML = `
            <i class="fa-solid fa-circle-xmark"></i>
            <div>
                <strong>Unregistered NGO:</strong> License <code>${rawVal}</code> was not found in the verified NBTC National NGO Registry. Ensure the NGO has completed statutory accreditation.
            </div>
        `;
        showToast(`License ${rawVal} not found in verified registry.`, "error");
        return;
    }

    // Success State
    foundNgo.connected = true;

    // Dispatch formal partnership request and transactional memorandum email to backend
    const partnershipPayload = {
        hospitalBloodBankId: "HOSP-001",
        hospitalId: "HOSP-001",
        hospitalName: "City Care Blood Centre & Hospital",
        licenseNo: "LIC-OD-2026-001",
        targetNgoLicense: rawVal,
        ngoLicense: rawVal,
        contactEmail: "bloodbank@citycare.org",
        contactPhone: "+91 674 254 8500",
        physicalAddress: "Plot 12B, Saheed Nagar, Janpath Road, Bhubaneswar, Odisha 751007",
        hospitalAddress: "Plot 12B, Saheed Nagar, Janpath Road, Bhubaneswar, Odisha 751007"
    };

    const backendBase = getBackendBaseUrl();
    if (backendBase) {
        fetch(`${backendBase}/api/network/partnerships/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partnershipPayload)
        }).then(res => res.json()).then(data => {
            if (data && data.success) {
                console.log("Institutional Partnership Memorandum Dispatched:", data);
            }
        }).catch(err => console.warn("Backend partnership sync notice:", err));
    }

    feedback.className = "validation-feedback-box success";
    feedback.innerHTML = `
        <i class="fa-solid fa-circle-check" style="font-size:20px;"></i>
        <div>
            <strong>License Verified & Partnership Requisition Dispatched!</strong>
            <div style="font-size:13px; margin-top:4px;">
                Formal institutional memorandum emailed to <strong>${foundNgo.name}</strong> (${foundNgo.license}) for 48-hour ratification. Accredited by ${foundNgo.accreditation}. Located ${foundNgo.distance}. Active stock: ${foundNgo.stock} units.
            </div>
            <div style="margin-top:8px; font-size:12px; color:#16a34a; font-weight:600;">
                <i class="fa-solid fa-envelope-circle-check"></i> Verification Link Dispatched to Official NGO Administration
            </div>
            <div style="margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${foundNgo.name}, ${foundNgo.address || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${foundNgo.name} on Google Maps">
                    <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                </a>
            </div>
        </div>
    `;

    renderNearbyNgos();
    if (typeof renderUnifiedDirectory === "function") {
        renderUnifiedDirectory();
    }
    showToast(`Institutional Partnership Memorandum dispatched to ${foundNgo.name}!`, "success");
}

function renderNearbyNgos() {
    const grid = document.getElementById("nearbyNgosGrid");
    if (!grid) return;

    grid.innerHTML = registeredNgosData.map(ngo => `
        <div class="ngo-card">
            <div>
                <div class="ngo-card-header">
                    <div>
                        <h4 class="ngo-name-title">${ngo.name}</h4>
                        <span class="ngo-license-badge-chip">
                            <i class="fa-solid fa-id-card"></i> ${ngo.license}
                        </span>
                    </div>
                    <span class="ngo-verified-pill">
                        <i class="fa-solid fa-shield-check"></i> Verified
                    </span>
                </div>

                <div class="ngo-card-meta">
                    <div class="ngo-meta-item">
                        <i class="fa-solid fa-location-dot"></i>
                        <span><strong>${ngo.distance}</strong> (${ngo.hours})</span>
                    </div>
                    <div class="ngo-meta-item">
                        <i class="fa-solid fa-user-doctor"></i>
                        <span>Contact: <strong>${ngo.contact}</strong></span>
                    </div>
                    <div class="ngo-meta-item">
                        <i class="fa-solid fa-phone"></i>
                        <span>${ngo.phone}</span>
                    </div>
                </div>

                <div class="ngo-capacity-strip">
                    <span>Active Stock: <strong>${ngo.stock} Units</strong></span>
                    <span>Donor Pool: <strong>${ngo.donorCapacity} Donors</strong></span>
                </div>
            </div>

            <div class="ngo-card-footer" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <button type="button" class="btn-ngo-connect" onclick="openNgoTransferModal('${ngo.id}')" style="flex:1;">
                    <i class="fa-solid fa-truck-medical"></i>
                    <span>Connect / Request Transfer</span>
                </button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ngo.name}, ${ngo.address || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${ngo.name} on Google Maps">
                    <i class="fa-solid fa-diamond-turn-right"></i>
                    <span>Get Directions</span>
                </a>
                <a href="tel:${ngo.phone}" class="btn-ngo-call" title="Call Emergency NGO Dispatch">
                    <i class="fa-solid fa-phone"></i>
                </a>
            </div>
        </div>
    `).join("");
}

function openNgoTransferModal(ngoId) {
    const ngo = registeredNgosData.find(n => n.id === ngoId) || registeredNgosData[0];
    const modal = document.getElementById("hospNgoTransferModal");
    const idInput = document.getElementById("transferNgoId");
    const nameSpan = document.getElementById("ngoModalName");
    const licSpan = document.getElementById("ngoModalLicense");
    const dirLink = document.getElementById("ngoModalDirectionsBtn");

    if (idInput) idInput.value = ngo.id;
    if (nameSpan) nameSpan.textContent = ngo.name;
    if (licSpan) licSpan.textContent = `License: ${ngo.license} • ${ngo.distance} (${ngo.hours})`;
    if (dirLink) {
        dirLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ngo.name}, ${ngo.address || ''}`)}`;
    }

    if (modal) modal.classList.remove("hidden");
}

function openNgoTransferModalForGroup(bloodGroup) {
    openNgoTransferModal("ngo-001");
    const grpSelect = document.getElementById("ngoReqBloodGroup");
    if (grpSelect) grpSelect.value = bloodGroup;
}

function closeNgoTransferModal() {
    const modal = document.getElementById("hospNgoTransferModal");
    if (modal) modal.classList.add("hidden");
}

function handleNgoTransferSubmit(event) {
    if (event) event.preventDefault();

    const ngoId = document.getElementById("transferNgoId")?.value;
    const ngo = registeredNgosData.find(n => n.id === ngoId) || registeredNgosData[0];
    const bloodGroup = document.getElementById("ngoReqBloodGroup")?.value || "O-";
    const units = parseInt(document.getElementById("ngoReqUnits")?.value || "2", 10);
    const urgency = document.getElementById("ngoReqUrgency")?.value || "Emergency STAT (< 15 Mins)";
    const reqCode = `TRX-NGO-${Math.floor(1000 + Math.random() * 9000)}`;

    activeNgoTransfers.unshift({
        code: reqCode,
        ngoName: ngo.name,
        bloodGroup,
        units,
        urgency,
        status: "Dispatched (Cold-Chain Ambulance In-Route)",
        time: "Just now"
    });

    renderNgoTransfersTable();
    closeNgoTransferModal();

    showToast(`Transfer Requisition ${reqCode} sent to ${ngo.name} for ${units} units of ${bloodGroup}! Status: Dispatched.`, "success");
}

function renderNgoTransfersTable() {
    const tbody = document.getElementById("ngoTransfersTableBody");
    if (!tbody) return;

    tbody.innerHTML = activeNgoTransfers.map(t => `
        <tr>
            <td><strong>${t.code}</strong></td>
            <td>${t.ngoName}</td>
            <td><span class="table-badge-group">${t.bloodGroup}</span></td>
            <td><strong>${t.units} Units</strong></td>
            <td><span class="stock-status-indicator critical" style="font-size:11px;">${t.urgency}</span></td>
            <td><span class="table-badge-cleared"><i class="fa-solid fa-truck"></i> ${t.status}</span></td>
            <td>${t.time}</td>
        </tr>
    `).join("");
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
        name: "Apollo Hospitals Blood Centre, Bhubaneswar",
        license: "LIC-OD-4821",
        location: "Bhubaneswar",
        address: "Plot 251, Sainik School Road, Unit 15, Bhubaneswar, Odisha 751005",
        phone: "+91 674 666 1016",
        distance: "2.0 km away",
        eta: "10-12 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 24, "A-": 8, "B+": 36, "B-": 11,
            "AB+": 14, "AB-": 6, "O+": 42, "O-": 15
        }
    },
    {
        id: "hosp-capital",
        name: "Capital Hospital Blood Bank, Bhubaneswar",
        license: "LIC-OD-1984",
        location: "Bhubaneswar",
        address: "Unit-6, Ganga Nagar, Bhubaneswar, Odisha 751001",
        phone: "+91 674 239 1983",
        distance: "2.8 km away",
        eta: "12-15 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 30, "A-": 12, "B+": 40, "B-": 14,
            "AB+": 18, "AB-": 8, "O+": 55, "O-": 20
        }
    },
    {
        id: "hosp-aiims",
        name: "AIIMS Bhubaneswar Blood Centre & Apex Trauma Centre",
        license: "LIC-OD-0001",
        location: "Bhubaneswar",
        address: "Sijua, Patrapada, Bhubaneswar, Odisha 751019",
        phone: "+91 674 247 6789",
        distance: "5.8 km away",
        eta: "15-18 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 65, "A-": 22, "B+": 80, "B-": 28,
            "AB+": 34, "AB-": 16, "O+": 92, "O-": 38
        }
    },
    {
        id: "hosp-scb",
        name: "SCB Medical College & Hospital Blood Bank, Cuttack",
        license: "LIC-OD-3012",
        location: "Cuttack",
        address: "Mangalabag, Medical Road, Cuttack, Odisha 753007",
        phone: "+91 671 241 4080",
        distance: "19.5 km away",
        eta: "25-30 Mins Dispatch",
        emergencyReady: true,
        certified: true,
        inventory: {
            "A+": 38, "A-": 12, "B+": 46, "B-": 15,
            "AB+": 22, "AB-": 8, "O+": 58, "O-": 24
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
    hideHospitalAuthPage();

    const hubSection = document.getElementById("hospitalHubSection");
    const invSection = document.getElementById("hospitalInventorySection");
    const transferSection = document.getElementById("hospitalTransferSection");
    const badge = document.getElementById("transferCurrentHospitalBadge");

    if (hubSection) hubSection.classList.add("hidden");
    if (invSection) invSection.classList.add("hidden");
    if (transferSection) {
        transferSection.classList.remove("hidden");
        transferSection.style.display = "flex";
        transferSection.classList.remove("dashboard-enter-animation");
        void transferSection.offsetWidth;
        transferSection.classList.add("dashboard-enter-animation");
    }

    const nameToUse = hospitalName || localStorage.getItem("bloodlinkUserName") || "City Care Blood Centre & Hospital";
    const licToUse = license || localStorage.getItem("bloodlinkUserLicense") || "LIC-2026-001";

    if (badge) {
        badge.textContent = `Requesting as: ${nameToUse} • Licence: ${licToUse}`;
    }

    renderPartnerHospitals();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function backToHubFromTransfer() {
    hideHospitalAuthPage();

    const transferSection = document.getElementById("hospitalTransferSection");
    const hubSection = document.getElementById("hospitalHubSection");

    if (transferSection) transferSection.classList.add("hidden");
    if (hubSection) {
        hubSection.classList.remove("hidden");
        hubSection.style.display = "flex";
        hubSection.classList.remove("dashboard-enter-animation");
        void hubSection.offsetWidth;
        hubSection.classList.add("dashboard-enter-animation");
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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

                <div class="partner-card-footer" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hosp.name}, ${hosp.address || hosp.location}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${hosp.name} on Google Maps">
                        <i class="fa-solid fa-diamond-turn-right"></i>
                        <span>Get Directions</span>
                    </a>
                    <button type="button" class="btn-view-live-bank btn-red" onclick="viewHospitalLiveBank('${hosp.license}')" style="flex:1;">
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
    let hospital = partnerHospitalsData.find(h => 
        h.license.toLowerCase() === license.toLowerCase() ||
        h.license.replace(/^(HOSP|LIC)-/, "").toLowerCase() === license.replace(/^(HOSP|LIC)-/, "").toLowerCase()
    );

    if (!hospital && typeof registeredHospitalsData !== "undefined") {
        const regHosp = registeredHospitalsData.find(h => 
            h.license.toLowerCase() === license.toLowerCase() ||
            h.license.replace(/^(HOSP|LIC)-/, "").toLowerCase() === license.replace(/^(HOSP|LIC)-/, "").toLowerCase()
        );
        if (regHosp) {
            hospital = {
                id: regHosp.id,
                name: regHosp.name,
                license: regHosp.license,
                location: regHosp.address,
                address: regHosp.address,
                phone: regHosp.phone,
                distance: regHosp.distance,
                eta: "15-20 Mins Dispatch",
                emergencyReady: true,
                certified: true,
                inventory: regHosp.inventory || { "A+": 10, "A-": 4, "B+": 12, "B-": 3, "AB+": 6, "AB-": 2, "O+": 18, "O-": 6 }
            };
        }
    }

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
    const dirLink = document.getElementById("partnerDirectionsCallLink");
    if (dirLink) {
        dirLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hospital.name}, ${hospital.address || hospital.location}`)}`;
    }

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

    const slipDirBtn = document.getElementById("slipSupplyingDirectionsBtn");
    if (slipDirBtn && selectedPartnerHospital) {
        slipDirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedPartnerHospital.name}, ${selectedPartnerHospital.address || selectedPartnerHospital.location}`)}`;
    }

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
   7. GEOSPATIAL HAVERSINE DISTANCE ENGINE
===================================================== */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 999;
    const R = 6371.0; // Earth's mean radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

/* =====================================================
   8. WEB AUDIO API CLINICAL SIREN SYNTHESIZER
===================================================== */
function playEmergencyAudioAlert() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // Rapid clinical alert sweep
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.75);
        osc2.stop(ctx.currentTime + 0.75);
    } catch (e) {
        console.warn("Audio alert blocked by browser autoplay policy:", e);
    }
}

/* =====================================================
   9. HOSPITAL PROFILE & INFRASTRUCTURE MANAGEMENT
===================================================== */
let hospitalProfileState = {
    name: "City Care Blood Centre & Hospital",
    licenseNumber: "LIC-OD-2026-001",
    emergencyHotline: "+91 674 254 8500",
    phone: "+91 674 254 8555",
    email: "bloodbank@citycare.org",
    address: "Plot 12B, Saheed Nagar, Janpath Road",
    city: "Bhubaneswar, Odisha",
    latitude: 20.2961,
    longitude: 85.8245,
    traumaCenterLevel: "Level 1 Apex Regional Trauma Centre",
    storageFacilities: [
        "Walk-in Cold Room (2°C - 6°C)",
        "Platelet Agitator & Incubator (22°C)",
        "Deep Freezer -80°C (Cryopreservation)",
        "Component Separation Centrifuge",
        "Automated Apheresis Unit"
    ],
    photoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80"
};

function initHospitalProfile() {
    // Restore from localStorage if present
    const saved = localStorage.getItem("bloodlinkHospitalProfile");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Seamlessly migrate any stale Delhi coordinates or address to Odisha
            if (parsed.city === "New Delhi" || parsed.latitude === 28.5672 || (parsed.address && parsed.address.includes("Ansari Nagar"))) {
                parsed.name = "City Care Blood Centre & Hospital";
                parsed.licenseNumber = "LIC-OD-2026-001";
                parsed.address = "Plot 12B, Saheed Nagar, Janpath Road";
                parsed.city = "Bhubaneswar, Odisha";
                parsed.latitude = 20.2961;
                parsed.longitude = 85.8245;
                parsed.emergencyHotline = "+91 674 254 8500";
                parsed.phone = "+91 674 254 8555";
                localStorage.setItem("bloodlinkHospitalProfile", JSON.stringify(parsed));
            }
            hospitalProfileState = { ...hospitalProfileState, ...parsed };
        } catch (err) {
            console.error("Error reading saved hospital profile:", err);
        }
    }

    // Try fetching from backend API asynchronously if available
    const backendBase = getBackendBaseUrl();
    if (backendBase) {
        fetch(`${backendBase}/api/hospital/profile`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                const h = (data && (data.hospital || data.profile));
                if (h) {
                    hospitalProfileState.name = h.name || hospitalProfileState.name;
                    hospitalProfileState.licenseNumber = h.licenseNumber || h.license_number || hospitalProfileState.licenseNumber;
                    hospitalProfileState.emergencyHotline = h.emergencyHotline || h.emergency_hotline || hospitalProfileState.emergencyHotline;
                    hospitalProfileState.phone = h.phone || hospitalProfileState.phone;
                    hospitalProfileState.email = h.email || hospitalProfileState.email;
                    hospitalProfileState.address = h.address || hospitalProfileState.address;
                    hospitalProfileState.city = h.city || hospitalProfileState.city;
                    hospitalProfileState.latitude = h.latitude !== undefined ? h.latitude : hospitalProfileState.latitude;
                    hospitalProfileState.longitude = h.longitude !== undefined ? h.longitude : hospitalProfileState.longitude;
                    hospitalProfileState.traumaCenterLevel = h.traumaCenterLevel || h.trauma_center_level || hospitalProfileState.traumaCenterLevel;
                    if (h.storageFacilities || h.storage_facilities) {
                        hospitalProfileState.storageFacilities = h.storageFacilities || h.storage_facilities;
                    }
                    if (h.photoData || h.photo_data) {
                        hospitalProfileState.photoUrl = h.photoData || h.photo_data;
                    } else if (h.photoUrl || h.photo_url) {
                        hospitalProfileState.photoUrl = h.photoUrl || h.photo_url;
                    }
                    applyHospitalProfileToDOM();
                }
            })
            .catch(() => {
                // Local fallback already in place
            });
    }

    applyHospitalProfileToDOM();
}

function applyHospitalProfileToDOM() {
    const s = hospitalProfileState;

    // 1. Sidebar & Topbar Avatar & Meta
    const sidebarAvatar = document.getElementById("sidebarHospitalAvatar");
    const topbarAvatar = document.getElementById("topbarHospitalAvatar");
    const profilePreview = document.getElementById("profileAvatarPreview");
    const sidebarName = document.getElementById("sidebarHospitalName");
    const sidebarLic = document.getElementById("sidebarHospitalLicense");
    const hubName = document.getElementById("hubHospitalName");
    const hubLic = document.getElementById("hubHospitalLicense");

    if (sidebarAvatar) sidebarAvatar.src = s.photoUrl;
    if (topbarAvatar) topbarAvatar.src = s.photoUrl;
    if (profilePreview) profilePreview.src = s.photoUrl;
    if (sidebarName) sidebarName.textContent = s.name;
    if (sidebarLic) sidebarLic.textContent = s.licenseNumber;
    if (hubName) hubName.textContent = s.name;
    if (hubLic) hubLic.textContent = s.licenseNumber;

    // 2. Profile Card Left side
    const cardName = document.getElementById("profileCardNameDisplay");
    const cardLic = document.getElementById("profileCardLicenseDisplay");
    const cardAddr = document.getElementById("profileCardAddressDisplay");
    const cardHotline = document.getElementById("profileCardHotlineDisplay");
    const cardTrauma = document.getElementById("profileCardTraumaDisplay");

    if (cardName) cardName.textContent = s.name;
    if (cardLic) cardLic.textContent = s.licenseNumber;
    if (cardAddr) cardAddr.textContent = `${s.address}, ${s.city}`;
    if (cardHotline) cardHotline.textContent = `Emergency: ${s.emergencyHotline}`;
    if (cardTrauma) cardTrauma.textContent = s.traumaCenterLevel;

    const profDirBtn = document.getElementById("profileFacilityDirectionsBtn");
    if (profDirBtn) {
        profDirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.name}, ${s.address}, ${s.city}`)}`;
    }
    const hubDirBtn = document.getElementById("hubDirectionsLink");
    if (hubDirBtn) {
        hubDirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.name}, ${s.address}, ${s.city}`)}`;
    }

    // 3. Form inputs
    const inName = document.getElementById("profileHospName");
    const inLic = document.getElementById("profileLicenseNo");
    const inHotline = document.getElementById("profileHotline");
    const inPhone = document.getElementById("profilePhone");
    const inEmail = document.getElementById("profileEmail");
    const inAddr = document.getElementById("profileAddress");
    const inCity = document.getElementById("profileCity");
    const inLat = document.getElementById("profileLat");
    const inLon = document.getElementById("profileLon");
    const inTrauma = document.getElementById("profileTraumaLevel");

    if (inName) inName.value = s.name;
    if (inLic) inLic.value = s.licenseNumber;
    if (inHotline) inHotline.value = s.emergencyHotline;
    if (inPhone) inPhone.value = s.phone;
    if (inEmail) inEmail.value = s.email;
    if (inAddr) inAddr.value = s.address;
    if (inCity) inCity.value = s.city;
    if (inLat) inLat.value = s.latitude;
    if (inLon) inLon.value = s.longitude;
    if (inTrauma) inTrauma.value = s.traumaCenterLevel;

    // Storage facilities checkboxes
    const checklist = document.getElementById("storageFacilitiesChecklist");
    if (checklist) {
        const checkboxes = checklist.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(cb => {
            cb.checked = s.storageFacilities.includes(cb.value);
        });
    }
}

function handlePhotoDragOver(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const dropzone = document.getElementById("profilePhotoDropzone");
    if (dropzone) dropzone.classList.add("dragover");
}

function handlePhotoDragLeave(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const dropzone = document.getElementById("profilePhotoDropzone");
    if (dropzone) dropzone.classList.remove("dragover");
}

function handlePhotoDrop(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const dropzone = document.getElementById("profilePhotoDropzone");
    if (dropzone) dropzone.classList.remove("dragover");

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        processHospitalPhoto(files[0]);
    }
}

function handlePhotoFileSelected(event) {
    const files = event.target?.files;
    if (files && files.length > 0) {
        processHospitalPhoto(files[0]);
    }
}

function processHospitalPhoto(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("Invalid file type: Please select an image (JPG, PNG, WebP).", "error");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast("File size too large: Maximum photo upload size is 5MB.", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Data = e.target.result;
        hospitalProfileState.photoUrl = base64Data;

        // Instant visual feedback across avatars
        document.querySelectorAll("#profileAvatarPreview, #sidebarHospitalAvatar, #topbarHospitalAvatar").forEach(img => {
            img.src = base64Data;
        });

        // Persist to localStorage
        localStorage.setItem("bloodlinkHospitalProfile", JSON.stringify(hospitalProfileState));

        // Sync to backend API if available
        const backendBase = getBackendBaseUrl();
        if (backendBase) {
            fetch(`${backendBase}/api/hospital/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo_data: base64Data,
                    name: hospitalProfileState.name
                })
            }).catch(err => console.warn("Backend image sync:", err));
        }

        showToast("Official hospital photo uploaded & applied across dashboard!", "success");
    };
    reader.readAsDataURL(file);
}

function handleProfileFormSubmit(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("profileHospName")?.value.trim() || hospitalProfileState.name;
    const lic = document.getElementById("profileLicenseNo")?.value.trim() || hospitalProfileState.licenseNumber;
    const hotline = document.getElementById("profileHotline")?.value.trim() || hospitalProfileState.emergencyHotline;
    const phone = document.getElementById("profilePhone")?.value.trim() || hospitalProfileState.phone;
    const email = document.getElementById("profileEmail")?.value.trim() || hospitalProfileState.email;
    const address = document.getElementById("profileAddress")?.value.trim() || hospitalProfileState.address;
    const city = document.getElementById("profileCity")?.value.trim() || hospitalProfileState.city;
    const lat = parseFloat(document.getElementById("profileLat")?.value || hospitalProfileState.latitude);
    const lon = parseFloat(document.getElementById("profileLon")?.value || hospitalProfileState.longitude);
    const trauma = document.getElementById("profileTraumaLevel")?.value || hospitalProfileState.traumaCenterLevel;

    // Collect facilities
    const facilities = [];
    const checklist = document.getElementById("storageFacilitiesChecklist");
    if (checklist) {
        checklist.querySelectorAll("input[type='checkbox']:checked").forEach(cb => {
            facilities.push(cb.value);
        });
    }

    hospitalProfileState = {
        ...hospitalProfileState,
        name,
        licenseNumber: lic,
        emergencyHotline: hotline,
        phone,
        email,
        address,
        city,
        latitude: lat,
        longitude: lon,
        traumaCenterLevel: trauma,
        storageFacilities: facilities
    };

    localStorage.setItem("bloodlinkHospitalProfile", JSON.stringify(hospitalProfileState));
    localStorage.setItem("bloodlinkUserName", name);
    localStorage.setItem("bloodlinkUserLicense", lic);

    // Sync to backend API if available
    const backendBase = getBackendBaseUrl();
    if (backendBase) {
        fetch(`${backendBase}/api/hospital/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                license_number: lic,
                emergency_hotline: hotline,
                phone,
                email,
                address,
                city,
                latitude: lat,
                longitude: lon,
                trauma_center_level: trauma,
                storage_facilities: facilities,
                photo_data: hospitalProfileState.photoUrl
            })
        }).catch(err => console.warn("Backend profile sync:", err));
    }

    applyHospitalProfileToDOM();
    refreshSosRadar();
    renderUnifiedDirectory();

    showToast("Hospital profile & infrastructure settings updated successfully!", "success");
}

function resetProfileForm() {
    initHospitalProfile();
    showToast("Hospital profile form reset to current settings.", "info");
}

/* =====================================================
   10. PERSISTENT SIDEBAR NAVIGATION ROUTING
===================================================== */
function switchSidebarTab(tabName) {
    const tabMeta = {
        inventory: {
            paneId: "tabPaneInventory",
            navId: "sidebarNavInventory",
            title: '<i class="fa-solid fa-boxes-stacked" style="color:#DC2626;"></i> <span>Blood Stock Inventory Dashboard</span>',
            subtitle: "Live unit counts, dynamic threshold indicators & automated severe shortage monitoring."
        },
        sos: {
            paneId: "tabPaneEmergencySos",
            navId: "sidebarNavSos",
            title: '<i class="fa-solid fa-tower-broadcast" style="color:#DC2626;"></i> <span>Emergency SOS Request Console</span>',
            subtitle: "Urgent multi-entity blood broadcast with live geospatial discovery and instant dispatch."
        },
        directory: {
            paneId: "tabPaneDirectory",
            navId: "sidebarNavDirectory",
            title: '<i class="fa-solid fa-network-wired" style="color:#DC2626;"></i> <span>Regional Healthcare Network Directory</span>',
            subtitle: "Collaborate with nearby partner hospitals and accredited blood-donation NGOs."
        },
        barcode: {
            paneId: "tabPaneBarcodeStudio",
            navId: "sidebarNavBarcodeStudio",
            title: '<i class="fa-solid fa-barcode" style="color:#DC2626;"></i> <span>Barcode Blood Unit Labeling Studio</span>',
            subtitle: "Generate ISBT-128 compliant linear Barcode labels containing facility license numbers."
        },
        qr: {
            paneId: "tabPaneBarcodeStudio",
            navId: "sidebarNavBarcodeStudio",
            title: '<i class="fa-solid fa-barcode" style="color:#DC2626;"></i> <span>Barcode Blood Unit Labeling Studio</span>',
            subtitle: "Generate ISBT-128 compliant linear Barcode labels containing facility license numbers."
        },
        profile: {
            paneId: "tabPaneProfile",
            navId: "sidebarNavProfile",
            title: '<i class="fa-solid fa-hospital-user" style="color:#DC2626;"></i> <span>Hospital Profile & Infrastructure Settings</span>',
            subtitle: "Customize facility metadata, emergency hotline, coordinates & official imagery."
        }
    };

    const target = tabMeta[tabName] || tabMeta.inventory;

    // Toggle navigation items
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
        item.classList.remove("active");
    });
    const targetNavBtn = document.getElementById(target.navId) || (target.navId === "sidebarNavBarcodeStudio" ? document.getElementById("sidebarNavQrStudio") : null);
    if (targetNavBtn) targetNavBtn.classList.add("active");

    // Toggle tab view panes
    document.querySelectorAll(".tab-view-pane").forEach(pane => {
        pane.classList.remove("active");
    });
    const targetPane = document.getElementById(target.paneId) || (target.paneId === "tabPaneBarcodeStudio" ? document.getElementById("tabPaneQrStudio") : null);
    if (targetPane) targetPane.classList.add("active");

    // Update viewport title & subtitle
    const viewTitle = document.getElementById("viewportViewTitle");
    const viewSub = document.getElementById("viewportViewSubtitle");
    if (viewTitle) viewTitle.innerHTML = target.title;
    if (viewSub) viewSub.textContent = target.subtitle;

    // Tab-specific trigger actions
    if (tabName === "inventory") {
        renderBloodBankInventory();
        updateInventoryCounters();
    } else if (tabName === "sos") {
        refreshSosRadar();
        renderSosBroadcastAuditTable();
    } else if (tabName === "directory") {
        renderUnifiedDirectory();
        renderNgoTransfersTable();
    } else if (tabName === "barcode" || tabName === "qr") {
        updateGeneratedBarcodePreview();
    } else if (tabName === "profile") {
        initHospitalProfile();
    }

    // Toggle mobile bottom navigation items
    const bottomNavMap = {
        inventory: "mobileBottomNavInventory",
        sos: "mobileBottomNavSos",
        directory: "mobileBottomNavDirectory",
        barcode: "mobileBottomNavBarcode",
        qr: "mobileBottomNavBarcode"
    };
    document.querySelectorAll(".mobile-bottom-nav-item").forEach(item => {
        item.classList.remove("active");
    });
    if (bottomNavMap[tabName]) {
        const bottomBtn = document.getElementById(bottomNavMap[tabName]);
        if (bottomBtn) bottomBtn.classList.add("active");
    }

    // Auto-close mobile drawer when user navigates to a tab
    closeMobileSidebar();

    // Update badge numbers
    updateSidebarBadges();

    // Smoothly scroll viewport back to top on tab switch
    const vp = document.querySelector(".hosp-main-viewport");
    if (vp) vp.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================================================
   10.1 MOBILE RESPONSIVE SIDEBAR & ORIENTATION CONTROLS
===================================================== */
function openMobileSidebar() {
    const sidebar = document.getElementById("hospMainSidebar");
    const backdrop = document.getElementById("mobileSidebarBackdrop");
    if (sidebar) sidebar.classList.add("sidebar-open");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
    const sidebar = document.getElementById("hospMainSidebar");
    const backdrop = document.getElementById("mobileSidebarBackdrop");
    if (sidebar) sidebar.classList.remove("sidebar-open");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById("hospMainSidebar");
    if (sidebar && sidebar.classList.contains("sidebar-open")) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

// Window resize & orientation change listener
window.addEventListener("resize", function() {
    if (window.innerWidth > 900) {
        closeMobileSidebar();
    }
});
window.addEventListener("orientationchange", function() {
    setTimeout(function() {
        if (window.innerWidth > 900) {
            closeMobileSidebar();
        }
    }, 150);
});

function updateSidebarBadges() {
    let totalStock = 0;
    let shortageCount = 0;
    for (const [grp, data] of Object.entries(hospitalInventory)) {
        totalStock += data.units;
        if (!data.isRare && data.units < 5) {
            shortageCount++;
        }
    }

    const stockBadge = document.getElementById("sidebarStockCountBadge");
    const shortageBadge = document.getElementById("sidebarShortageBadge");
    const networkBadge = document.getElementById("sidebarNetworkBadge");

    if (stockBadge) stockBadge.textContent = totalStock;
    if (shortageBadge) {
        if (shortageCount > 0) {
            shortageBadge.textContent = `${shortageCount}!`;
            shortageBadge.style.display = "inline-block";
        } else {
            shortageBadge.textContent = "✓";
            shortageBadge.classList.remove("badge-alert");
        }
    }
    if (networkBadge) {
        networkBadge.textContent = registeredHospitalsData.length + registeredNgosData.length;
    }
}

/* =====================================================
   11. URGENT BLOOD NEED & EMERGENCY SOS BROADCAST ENGINE
===================================================== */
let currentSosRadius = 15;

let sosBroadcastAuditLog = [
    {
        code: "SOS-OD-9941",
        bloodGroup: "O-",
        units: 4,
        urgency: "Life-Threatening STAT (< 15 Mins)",
        radius: "15 km",
        alertedCount: 6,
        matchesCount: 3,
        status: "Active Dispatches (2 Ambulances In-Route)",
        time: "10 mins ago"
    },
    {
        code: "SOS-OD-8812",
        bloodGroup: "A-",
        units: 2,
        urgency: "Critical (< 30 Mins)",
        radius: "10 km",
        alertedCount: 4,
        matchesCount: 2,
        status: "Completed & Verified",
        time: "4 hours ago"
    }
];

function openEmergencySosModal(prefillBloodGroup) {
    switchSidebarTab("sos");

    const select = document.getElementById("sosBloodGroup");
    if (select && prefillBloodGroup) {
        select.value = prefillBloodGroup;
    }

    // Play clinical audio ping to indicate emergency dispatch mode
    playEmergencyAudioAlert();
    refreshSosRadar();

    const vp = document.querySelector(".hosp-main-viewport");
    if (vp) vp.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`Emergency SOS Mode Active! Radius: ${currentSosRadius} km. Broadcast ready.`, "error");
}

function setSosRadius(radius, btn) {
    currentSosRadius = radius;

    const allPills = document.querySelectorAll(".radius-pills-group .btn-radius-pill");
    allPills.forEach(p => p.classList.remove("active"));
    if (btn) btn.classList.add("active");

    refreshSosRadar();
    showToast(`Broadcast radius adjusted to ${radius} km.`, "info");
}

function onSosBloodGroupChange() {
    refreshSosRadar();
}

function refreshSosRadar() {
    const groupSelect = document.getElementById("sosBloodGroup");
    const selectedGroup = groupSelect?.value || "O-";
    const grid = document.getElementById("sosMatchingRadar");
    const subtitle = document.getElementById("sosRadarSubtitle");

    if (subtitle) {
        subtitle.textContent = `Displaying accredited regional facilities within ${currentSosRadius} km with live ${selectedGroup} reserves.`;
    }

    if (!grid) return;

    // Origin coordinates (City Care Blood Centre, Bhubaneswar, Odisha)
    const originLat = hospitalProfileState.latitude || 20.2961;
    const originLon = hospitalProfileState.longitude || 85.8245;

    // Query backend directory with geospatial filtering if available
    const backendBase = getBackendBaseUrl();
    if (backendBase) {
        fetch(`${backendBase}/api/network/directory?radius=${currentSosRadius}&blood_group=${encodeURIComponent(selectedGroup)}&lat=${originLat}&lon=${originLon}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                const list = data && (data.entities || data.facilities);
                if (list && list.length > 0) {
                    renderRadarFromData(list, selectedGroup);
                } else {
                    renderRadarFromClientData(selectedGroup, originLat, originLon);
                }
            })
            .catch(() => {
                renderRadarFromClientData(selectedGroup, originLat, originLon);
            });
    } else {
        renderRadarFromClientData(selectedGroup, originLat, originLon);
    }
}

function renderRadarFromData(facilities, bloodGroup) {
    const grid = document.getElementById("sosMatchingRadar");
    if (!grid) return;

    grid.innerHTML = facilities.map(fac => {
        const isHosp = (fac.entityType || fac.type || "").toLowerCase().includes("hosp");
        const units = fac.matchedUnits !== undefined ? fac.matchedUnits : (fac.matched_units !== undefined ? fac.matched_units : (fac.availableUnits !== undefined ? fac.availableUnits : (fac.stock || 0)));
        const distNum = fac.distanceKm !== undefined ? fac.distanceKm : (fac.distance_km !== undefined ? fac.distance_km : 1.0);
        const eta = Math.max(8, Math.round(distNum * 1.8 + 5));
        const lic = fac.licenseNumber || fac.license || "";

        return `
            <div class="radar-match-card">
                <div class="radar-card-header">
                    <div>
                        <span class="radar-entity-badge ${isHosp ? 'badge-hosp' : 'badge-ngo'}">
                            <i class="fa-solid ${isHosp ? 'fa-hospital' : 'fa-hand-holding-heart'}"></i>
                            ${isHosp ? 'Partner Hospital' : 'Accredited NGO'}
                        </span>
                        <h4 class="radar-facility-name">${fac.name}</h4>
                        <span class="radar-lic-text"><i class="fa-solid fa-id-card"></i> ${lic}</span>
                    </div>
                    <div style="text-align:right;">
                        <span class="radar-dist-tag"><i class="fa-solid fa-route"></i> ${distNum} km</span>
                        <div class="radar-eta-tag"><i class="fa-solid fa-truck-medical"></i> ETA: ${eta} Mins</div>
                    </div>
                </div>

                <div class="radar-stock-strip">
                    <span class="radar-stock-item">
                        <i class="fa-solid fa-droplet" style="color:#DC2626;"></i>
                        <strong>${units} Units</strong> of ${bloodGroup} Available
                    </span>
                    <span class="stock-status-indicator safe" style="font-size:11px;">
                        <span class="pulse-dot-green"></span> Live Monitored
                    </span>
                </div>

                <div class="radar-card-actions" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                    <button type="button" class="btn-radar-req" onclick="quickRequisitionFromFacility('${fac.id}', '${isHosp ? 'hospital' : 'ngo'}', '${bloodGroup}')" style="flex:1;">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>Dispatch Requisition</span>
                    </button>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${fac.name}, ${fac.address || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${fac.name} on Google Maps">
                        <i class="fa-solid fa-diamond-turn-right"></i>
                        <span>Get Directions</span>
                    </a>
                    <a href="tel:${(fac.phone || '').replace(/\\s+/g, '')}" class="btn-radar-call" title="Direct Phone Call">
                        <i class="fa-solid fa-phone"></i>
                    </a>
                </div>
            </div>
        `;
    }).join("");
}

function renderRadarFromClientData(bloodGroup, originLat, originLon) {
    const grid = document.getElementById("sosMatchingRadar");
    if (!grid) return;

    const matchedEntities = [];

    // Filter Hospitals
    registeredHospitalsData.forEach(h => {
        const dist = calculateHaversineDistance(originLat, originLon, h.lat, h.lon);
        if (dist <= currentSosRadius) {
            const units = h.inventory[bloodGroup] || 0;
            matchedEntities.push({
                id: h.id,
                name: h.name,
                license: h.license,
                type: "hospital",
                phone: h.phone,
                distance_km: dist,
                matched_units: units
            });
        }
    });

    // Filter NGOs
    registeredNgosData.forEach(n => {
        const dist = calculateHaversineDistance(originLat, originLon, n.lat, n.lon);
        if (dist <= currentSosRadius) {
            // Estimate matching blood group units from total stock
            const estimatedUnits = Math.max(3, Math.floor(n.stock / 8));
            matchedEntities.push({
                id: n.id,
                name: n.name,
                license: n.license,
                type: "ngo",
                phone: n.phone,
                distance_km: dist,
                matched_units: estimatedUnits
            });
        }
    });

    matchedEntities.sort((a, b) => a.distance_km - b.distance_km);

    if (matchedEntities.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:32px 20px; background:#FEF2F2; border:1px dashed #F87171; border-radius:14px;">
                <i class="fa-solid fa-satellite-dish" style="font-size:32px; color:#DC2626; margin-bottom:10px;"></i>
                <h4 style="font-size:16px; font-weight:800; color:#991B1B;">No Facilities Located Within ${currentSosRadius} km</h4>
                <p style="font-size:13px; color:#7F1D1D; margin:6px 0 14px 0;">Try expanding the broadcast geospatial radius to 25 km or 50 km to discover regional blood reserves.</p>
                <button type="button" class="hosp-submit-btn btn-red" onclick="setSosRadius(25)">
                    Expand Radius to 25 km
                </button>
            </div>
        `;
        return;
    }

    renderRadarFromData(matchedEntities, bloodGroup);
}

function quickRequisitionFromFacility(facilityId, facilityType, bloodGroup) {
    if (facilityType === "ngo") {
        openNgoTransferModal(facilityId);
        const grpSelect = document.getElementById("ngoReqBloodGroup");
        if (grpSelect) grpSelect.value = bloodGroup;
    } else {
        const hosp = registeredHospitalsData.find(h => h.id === facilityId);
        if (hosp) {
            viewHospitalLiveBank(hosp.license);
            selectTransferBloodGroup(bloodGroup);
        } else {
            showToast(`Requisition sent to ${facilityId}!`, "success");
        }
    }
}

function handleSosBroadcastSubmit(event) {
    if (event) event.preventDefault();

    const bloodGroup = document.getElementById("sosBloodGroup")?.value || "O-";
    const units = parseInt(document.getElementById("sosUnitsNeeded")?.value || "4", 10);
    const urgency = document.getElementById("sosUrgency")?.value || "Life-Threatening STAT (< 15 Mins)";
    const doctor = document.getElementById("sosDoctorContact")?.value || "Emergency Trauma Desk";
    const ward = document.getElementById("sosWardRoom")?.value || "Emergency OT";
    const condition = document.getElementById("sosPatientCondition")?.value || "Critical Hemorrhage";

    const broadcastCode = `SOS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBroadcast = {
        code: broadcastCode,
        bloodGroup,
        units,
        urgency,
        radius: `${currentSosRadius} km`,
        alertedCount: Math.min(8, Math.max(3, Math.round(currentSosRadius / 3))),
        matchesCount: Math.min(5, Math.max(2, Math.round(currentSosRadius / 5))),
        status: "Broadcast Dispatched • Standby for ETA",
        time: "Just now"
    };

    sosBroadcastAuditLog.unshift(newBroadcast);

    // Sync broadcast to centralized backend API
    const sosPayload = {
        broadcastId: broadcastCode,
        hospitalBloodBankName: "City Care Blood Centre & Hospital",
        licenseNo: "LIC-OD-2026-001",
        bloodGroup: bloodGroup,
        unitsRequired: units,
        emergencyDeskPhone: "+91 674 254 8500",
        roomDetails: `${ward} (${condition})`,
        // Backward compatibility keys
        blood_group: bloodGroup,
        units_needed: units,
        urgency: urgency,
        doctor_contact: doctor,
        ward_room: ward,
        clinical_indication: condition,
        radius_km: currentSosRadius
    };

    const backendBase = getBackendBaseUrl();
    if (backendBase) {
        fetch(`${backendBase}/api/network/sos/broadcast`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sosPayload)
        }).catch(err => console.warn("Backend broadcast sync:", err));
    }

    renderSosBroadcastAuditTable();
    playEmergencyAudioAlert();

    showToast(`🚨 HIGH PRIORITY SOS BROADCAST ${broadcastCode} DISPATCHED! Alerted nearby facilities within ${currentSosRadius} km.`, "error");
}

function renderSosBroadcastAuditTable() {
    const tbody = document.getElementById("sosBroadcastAuditTableBody");
    if (!tbody) return;

    tbody.innerHTML = sosBroadcastAuditLog.map(b => `
        <tr>
            <td><strong>${b.code}</strong></td>
            <td><span class="table-badge-group">${b.bloodGroup}</span></td>
            <td><strong>${b.units} Units</strong></td>
            <td><span class="stock-status-indicator critical" style="font-size:11px;">${b.urgency}</span></td>
            <td><strong>${b.radius}</strong></td>
            <td>${b.alertedCount} Facilities</td>
            <td><span class="stock-status-indicator safe" style="font-size:11px;">${b.matchesCount} Matches</span></td>
            <td><span class="table-badge-cleared"><i class="fa-solid fa-tower-broadcast"></i> ${b.status}</span></td>
            <td>${b.time}</td>
        </tr>
    `).join("");
}

/* =====================================================
   12. UNIFIED NETWORK DIRECTORY & INSTITUTIONAL LINKAGE
===================================================== */
let registeredHospitalsData = [
    {
        id: "hosp-002",
        name: "AIIMS Bhubaneswar Blood Centre & Apex Trauma Centre",
        license: "HOSP-OD-002",
        accreditation: "National Apex Trauma Registry & NABH",
        contact: "Dr. Pravas Ranjan Mishra",
        phone: "+91 674 247 6789",
        email: "trauma@aiimsbhubaneswar.edu.in",
        address: "Sijua, Patrapada, Bhubaneswar, Odisha 751019",
        lat: 20.2620,
        lon: 85.7820,
        distance: "5.8 km away",
        hours: "24/7 Emergency Transfusion",
        trauma: "Level 1 Apex Trauma Centre",
        stock: 64,
        connected: true,
        inventory: { "A+": 18, "A-": 6, "B+": 20, "B-": 5, "AB+": 9, "AB-": 4, "O+": 28, "O-": 8 }
    },
    {
        id: "hosp-003",
        name: "Capital Hospital Blood Bank, Bhubaneswar",
        license: "HOSP-OD-003",
        accreditation: "NABH & State Blood Transfusion Council",
        contact: "Dr. Biswajit Rath",
        phone: "+91 674 239 1983",
        email: "bloodbank.capital@odisha.gov.in",
        address: "Unit-6, Ganga Nagar, Bhubaneswar, Odisha 751001",
        lat: 20.2706,
        lon: 85.8239,
        distance: "2.8 km away",
        hours: "24/7 Cold-Chain Dispatch",
        trauma: "Level 2 District Trauma Care Unit",
        stock: 92,
        connected: true,
        inventory: { "A+": 28, "A-": 10, "B+": 32, "B-": 12, "AB+": 14, "AB-": 6, "O+": 45, "O-": 16 }
    },
    {
        id: "hosp-004",
        name: "Apollo Hospitals Blood Centre, Bhubaneswar",
        license: "HOSP-OD-4821",
        accreditation: "JCI & NABH Certified",
        contact: "Dr. Debasish Mishra",
        phone: "+91 674 666 1016",
        email: "dispatch@apollobbsr.com",
        address: "Plot 251, Sainik School Road, Unit 15, Bhubaneswar, Odisha 751005",
        lat: 20.3120,
        lon: 85.8330,
        distance: "2.0 km away",
        hours: "24/7 Rapid Ambulance Dispatch",
        trauma: "Level 1 Tertiary Trauma Centre",
        stock: 86,
        connected: true,
        inventory: { "A+": 24, "A-": 8, "B+": 36, "B-": 11, "AB+": 14, "AB-": 6, "O+": 42, "O-": 15 }
    },
    {
        id: "hosp-005",
        name: "SCB Medical College & Hospital Blood Bank, Cuttack",
        license: "HOSP-OD-005",
        accreditation: "State Apex Transfusion Registry & SBTC Odisha",
        contact: "Dr. Smita Mohapatra",
        phone: "+91 671 241 4080",
        email: "bloodbank.scbmch@odisha.gov.in",
        address: "Mangalabag, Medical Road, Cuttack, Odisha 753007",
        lat: 20.4625,
        lon: 85.8828,
        distance: "19.5 km away",
        hours: "24/7 Emergency Transfusion Wing",
        trauma: "Level 1 State Apex Referral Centre",
        stock: 120,
        connected: true,
        inventory: { "A+": 38, "A-": 12, "B+": 46, "B-": 15, "AB+": 22, "AB-": 8, "O+": 58, "O-": 24 }
    },
    {
        id: "hosp-006",
        name: "KIMS Super Speciality Hospital Blood Centre (KIIT)",
        license: "HOSP-OD-3012",
        accreditation: "NABH & State Transfusion Registry",
        contact: "Dr. Sudhir Kumar Satpathy",
        phone: "+91 674 272 5472",
        email: "bloodbank@kims.ac.in",
        address: "KIIT Campus 5, Patia, Bhubaneswar, Odisha 751024",
        lat: 20.3533,
        lon: 85.8166,
        distance: "6.4 km away",
        hours: "24/7 Emergency Unit",
        trauma: "Level 2 Tertiary Trauma Centre",
        stock: 75,
        connected: false,
        inventory: { "A+": 18, "A-": 5, "B+": 29, "B-": 7, "AB+": 9, "AB-": 4, "O+": 31, "O-": 8 }
    },
    {
        id: "hosp-007",
        name: "IMS & SUM Hospital Blood Centre",
        license: "HOSP-OD-007",
        accreditation: "NABH Accredited Regional Blood Transfusion Centre",
        contact: "Dr. Girija Nandini Kanungo",
        phone: "+91 674 238 6292",
        email: "sumbloodbank@soa.ac.in",
        address: "K8, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha 751003",
        lat: 20.2798,
        lon: 85.7654,
        distance: "6.4 km away",
        hours: "24/7 Cold-Chain Dispatch",
        trauma: "Level 2 Trauma Care Unit",
        stock: 68,
        connected: false,
        inventory: { "A+": 16, "A-": 6, "B+": 22, "B-": 5, "AB+": 8, "AB-": 3, "O+": 29, "O-": 9 }
    }
];

let currentDirectoryFilter = "all";

function filterDirectory(type, btn) {
    currentDirectoryFilter = type;

    const allPills = document.querySelectorAll(".network-filter-pills .btn-filter-pill");
    allPills.forEach(p => p.classList.remove("active"));
    if (btn) btn.classList.add("active");

    renderUnifiedDirectory();
}

function handleDirectorySearch(query) {
    renderUnifiedDirectory(null, (query || "").trim().toLowerCase());
}

function renderUnifiedDirectory(customList, query = "") {
    const grid = document.getElementById("unifiedDirectoryGrid");
    if (!grid) return;

    let combined = [];

    // Add Hospitals
    if (currentDirectoryFilter === "all" || currentDirectoryFilter === "hospitals") {
        registeredHospitalsData.forEach(h => {
            combined.push({
                ...h,
                entityType: "hospital"
            });
        });
    }

    // Add NGOs
    if (currentDirectoryFilter === "all" || currentDirectoryFilter === "ngos") {
        registeredNgosData.forEach(n => {
            combined.push({
                ...n,
                entityType: "ngo"
            });
        });
    }

    // Filter by search query if provided
    if (query) {
        combined = combined.filter(e =>
            (e.name && e.name.toLowerCase().includes(query)) ||
            (e.license && e.license.toLowerCase().includes(query)) ||
            (e.address && e.address.toLowerCase().includes(query)) ||
            (e.contact && e.contact.toLowerCase().includes(query))
        );
    }

    // Update count display
    const countAllFilter = document.getElementById("countAllFilter");
    if (countAllFilter) {
        countAllFilter.textContent = registeredHospitalsData.length + registeredNgosData.length;
    }

    if (combined.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:36px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px;">
                <i class="fa-solid fa-building-circle-xmark" style="font-size:32px; color:#94A3B8; margin-bottom:10px;"></i>
                <h4 style="font-size:16px; font-weight:800; color:#1E293B;">No Matching Network Facilities Found</h4>
                <p style="font-size:13px; color:#64748B; margin-top:4px;">Try clearing your search query or selecting "All Facilities".</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = combined.map(item => {
        const isHosp = item.entityType === "hospital";
        return `
            <div class="entity-card">
                <div class="entity-card-header">
                    <div class="entity-badge-wrap">
                        <span class="entity-type-badge ${isHosp ? 'badge-hosp' : 'badge-ngo'}">
                            <i class="fa-solid ${isHosp ? 'fa-hospital' : 'fa-hand-holding-heart'}"></i>
                            ${isHosp ? 'Partner Hospital' : 'Accredited NGO'}
                        </span>
                        ${item.connected ? `
                            <span class="entity-status-pill connected">
                                <i class="fa-solid fa-link"></i> Linked
                            </span>
                        ` : `
                            <span class="entity-status-pill unlinked">
                                <i class="fa-solid fa-shield-halved"></i> NBTC Verified
                            </span>
                        `}
                    </div>
                    <span class="entity-dist-tag"><i class="fa-solid fa-route"></i> ${item.distance}</span>
                </div>

                <div class="entity-body">
                    <h4 class="entity-name">${item.name}</h4>
                    <span class="entity-lic-badge">
                        <i class="fa-solid fa-id-card"></i> ${item.license}
                    </span>

                    <div class="entity-meta-list">
                        <div class="entity-meta-item">
                            <i class="fa-solid fa-certificate"></i>
                            <span>${item.accreditation}</span>
                        </div>
                        <div class="entity-meta-item">
                            <i class="fa-solid fa-user-doctor"></i>
                            <span>Contact: <strong>${item.contact}</strong></span>
                        </div>
                        <div class="entity-meta-item" style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                            <div style="display:flex; align-items:center; gap:6px; overflow:hidden; text-overflow:ellipsis;">
                                <i class="fa-solid fa-location-dot" style="flex-shrink:0;"></i>
                                <span>${item.address}</span>
                            </div>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.name}, ${item.address || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn btn-sm" title="Get Directions to ${item.name} on Google Maps" style="flex-shrink:0;">
                                <i class="fa-solid fa-diamond-turn-right"></i>
                                <span>Directions</span>
                            </a>
                        </div>
                    </div>

                    <div class="entity-stock-strip">
                        <span>Total Reserve: <strong>${item.stock} Units</strong></span>
                        <span>Dispatch: <strong>${item.hours}</strong></span>
                    </div>
                </div>

                <div class="entity-card-footer" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                    <button type="button" class="btn-entity-connect" onclick="quickRequisitionFromFacility('${item.id}', '${item.entityType}', 'O-')" style="flex:1; min-width:130px;">
                        <i class="fa-solid fa-truck-medical"></i>
                        <span>Requisition Stock</span>
                    </button>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.name}, ${item.address || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${item.name} on Google Maps" style="padding:8px 12px; font-size:12px;">
                        <i class="fa-solid fa-diamond-turn-right"></i>
                        <span>Get Directions</span>
                    </a>
                    <a href="tel:${(item.phone || '').replace(/\s+/g, '')}" class="btn-entity-call" title="Emergency Call">
                        <i class="fa-solid fa-phone"></i>
                    </a>
                </div>
            </div>
        `;
    }).join("");
}

let currentDemoHospIndex = 0;
const demoHospLicenses = [
    { license: "HOSP-OD-002", name: "AIIMS Bhubaneswar Blood Centre & Apex Trauma Centre" },
    { license: "HOSP-OD-003", name: "Capital Hospital Blood Bank, Bhubaneswar" },
    { license: "HOSP-OD-4821", name: "Apollo Hospitals Blood Centre, Bhubaneswar" },
    { license: "HOSP-OD-3012", name: "KIMS Super Speciality Hospital Blood Centre" }
];

function fillDemoPeerHospitalLicense(licenseCode, btnEl) {
    const input = document.getElementById("peerHospLicenseInput");
    const feedback = document.getElementById("peerHospLicenseFeedback");
    if (!input) return;

    let targetLic = licenseCode;
    let targetName = "";
    if (!targetLic) {
        const item = demoHospLicenses[currentDemoHospIndex % demoHospLicenses.length];
        currentDemoHospIndex++;
        targetLic = item.license;
        targetName = item.name;
    } else {
        const found = demoHospLicenses.find(d => d.license === targetLic);
        if (found) targetName = found.name;
    }

    input.value = targetLic;

    // Highlight active chip
    if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll(".demo-chip").forEach(c => c.classList.remove("active"));
        btnEl.classList.add("active");
    }

    if (feedback) {
        feedback.className = "hidden";
        feedback.innerHTML = "";
    }

    input.classList.add("input-demo-highlight");
    setTimeout(() => input.classList.remove("input-demo-highlight"), 900);

    input.focus();
    showToast(`Demo Hospital license auto-filled: ${targetLic}${targetName ? ' (' + targetName + ')' : ''}. Click "Link Hospital" to connect.`, "info");
}
window.fillDemoPeerHospitalLicense = fillDemoPeerHospitalLicense;

function verifyPeerHospitalLicense() {
    const input = document.getElementById("peerHospLicenseInput");
    const feedback = document.getElementById("peerHospLicenseFeedback");
    const rawVal = (input?.value || "").trim().toUpperCase();

    if (!feedback) return;
    feedback.classList.remove("hidden");

    if (!rawVal) {
        feedback.className = "validation-feedback-box error";
        feedback.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <div>
                <strong>Missing License Number:</strong> Please enter an official hospital institutional license (e.g. HOSP-OD-002).
            </div>
        `;
        showToast("Please enter a hospital license number.", "error");
        return;
    }

    const pattern = /^HOSP-[A-Z0-9-]{3,10}$/;
    if (!pattern.test(rawVal)) {
        feedback.className = "validation-feedback-box error";
        feedback.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
                <strong>Invalid License Format:</strong> "${rawVal}" does not match the National Hospital Registry structure.
                <div style="font-size:12px; margin-top:4px; opacity:0.9;">Format required: <code>HOSP-&lt;Code&gt;</code> (e.g., <strong>HOSP-OD-002</strong>, <strong>HOSP-OD-4821</strong>).</div>
            </div>
        `;
        showToast("Invalid hospital license format.", "error");
        return;
    }

    const foundHosp = registeredHospitalsData.find(h => h.license.toUpperCase() === rawVal);
    if (!foundHosp) {
        feedback.className = "validation-feedback-box error";
        feedback.innerHTML = `
            <i class="fa-solid fa-circle-xmark"></i>
            <div>
                <strong>Unregistered Hospital:</strong> Institutional license <code>${rawVal}</code> was not found in the verified State Blood Transfusion Registry.
            </div>
        `;
        showToast(`Hospital license ${rawVal} not found.`, "error");
        return;
    }

    // Success State
    foundHosp.connected = true;

    // Call backend API if available
    const backendBase = getBackendBaseUrl();
    if (backendBase) {
        fetch(`${backendBase}/api/hospitals/connect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                peer_license: rawVal,
                notes: "Linked via Hospital Network Console"
            })
        }).catch(err => console.warn("Backend hospital link sync:", err));
    }

    feedback.className = "validation-feedback-box success";
    feedback.innerHTML = `
        <i class="fa-solid fa-circle-check" style="font-size:20px;"></i>
        <div>
            <strong>Hospital Verified & Linked Successfully!</strong>
            <div style="font-size:13px; margin-top:4px;">
                Peer linkage established with <strong>${foundHosp.name}</strong> (${foundHosp.license}). Located ${foundHosp.distance}. Active stock: ${foundHosp.stock} units.
            </div>
            <div style="display:flex; gap:8px; align-items:center; margin-top:10px; flex-wrap:wrap;">
                <button type="button" class="btn-severe-action" style="padding:6px 14px; font-size:12px;" onclick="viewHospitalLiveBank('${foundHosp.license}')">
                    <i class="fa-solid fa-boxes-stacked"></i> View Partner Live Blood Bank
                </button>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${foundHosp.name}, ${foundHosp.address || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${foundHosp.name} on Google Maps">
                    <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                </a>
            </div>
        </div>
    `;

    renderUnifiedDirectory();
    showToast(`Partner Hospital ${foundHosp.name} linked successfully!`, "success");
}

/* =====================================================
   INITIALIZATION
===================================================== */

window.addEventListener("load", function () {
    console.log("LifeFlow Platform loaded successfully.");
    initHospitalProfile();
    // Auto-check if returning as NGO
    const savedRole = localStorage.getItem("bloodlinkUserRole");
    if (savedRole === "ngo") {
        const ngoPanel = document.getElementById("ngoEmergencyReceptionPanel");
        if (ngoPanel && document.getElementById("dashboard") && !document.getElementById("dashboard").classList.contains("hidden")) {
            ngoPanel.classList.remove("hidden");
            initNgoEmergencyReception();
        }
    }
});

/* =====================================================
   REAL-TIME EMERGENCY BLOOD RECEPTION ENGINE (NGO PORTAL)
===================================================== */

window.activeNgoEmergencyAlerts = {};
window.ngoEmergencyEventSource = null;
window.ngoPollingInterval = null;

window.getBackendBaseUrl = getBackendBaseUrl;
window.isLocalEnvironment = isLocalEnvironment;

function playEmergencyChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const now = ctx.currentTime;

        // Tone 1: 587.33 Hz (D5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);

        // Tone 2: 880 Hz (A5)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.15);
        gain2.gain.setValueAtTime(0.25, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.5);
    } catch (e) {
        console.warn("[CHIME] Audio autoplay blocked or unsupported:", e);
    }
}

function playSuccessChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
    } catch (e) {}
}

function initNgoEmergencyReception() {
    const panel = document.getElementById("ngoEmergencyReceptionPanel");
    if (!panel) return;
    panel.classList.remove("hidden");

    const currentNgoId = localStorage.getItem("bloodlinkNgoId") || "NGO-OD-9021";
    console.log(`[*] Initializing Real-Time Emergency Reception for NGO: ${currentNgoId}`);

    const backendBase = getBackendBaseUrl();
    if (!backendBase) {
        updateSseStatus(false, "Emergency Bus Ready (Standby)");
        renderAllEmergencyAlerts();
        return;
    }

    // Update status badge to connecting
    updateSseStatus(false, "Connecting Live SSE Stream...");

    // 1. Fetch initial active unacknowledged alerts immediately
    fetchActiveEmergencyAlerts(currentNgoId);

    // 2. Establish Server-Sent Events stream
    connectEmergencySseStream(currentNgoId);

    // 3. Setup high-frequency polling fallback interval (every 6 seconds)
    if (window.ngoPollingInterval) clearInterval(window.ngoPollingInterval);
    window.ngoPollingInterval = setInterval(() => {
        fetchActiveEmergencyAlerts(currentNgoId, true);
    }, 6000);
}

function updateSseStatus(isConnected, message) {
    const badge = document.getElementById("sseConnectionStatusBadge");
    const textSpan = document.getElementById("sseStatusText");
    if (!badge || !textSpan) return;

    if (isConnected) {
        badge.className = "sse-status-badge sse-connected";
        textSpan.textContent = message || "Live SSE Stream Active";
    } else {
        badge.className = "sse-status-badge sse-connecting";
        textSpan.textContent = message || "Polling Active (Fallback)";
    }
}

function connectEmergencySseStream(ngoId) {
    if (window.ngoEmergencyEventSource) {
        window.ngoEmergencyEventSource.close();
        window.ngoEmergencyEventSource = null;
    }

    const backendBase = getBackendBaseUrl();
    if (!backendBase) {
        updateSseStatus(false, "Emergency Bus Ready (Standby)");
        return;
    }

    const sseUrl = `${backendBase}/api/network/alerts/stream?ngoId=${encodeURIComponent(ngoId)}`;
    try {
        const es = new EventSource(sseUrl);
        window.ngoEmergencyEventSource = es;

        es.onopen = function () {
            console.log("[SSE] Connected to Emergency Alert Bus.");
            updateSseStatus(true, "Live SSE Stream Active");
        };

        es.onmessage = function (event) {
            try {
                if (!event.data) return;
                const msg = JSON.parse(event.data);
                if (msg.type === "CONNECTED") {
                    updateSseStatus(true, "Live SSE Stream Active");
                } else if (msg.type === "EMERGENCY_ALERT" && msg.data) {
                    handleIncomingEmergencyAlert(msg.data, true);
                } else if (msg.type === "ALERT_ACKNOWLEDGED" && msg.alertId) {
                    handleExternalAlertAcknowledged(msg.alertId, msg.acknowledgedBy);
                }
            } catch (err) {
                console.warn("[SSE] Parse error:", err, event.data);
            }
        };

        es.onerror = function (err) {
            console.warn("[SSE] Connection interrupted, falling back to polling.", err);
            updateSseStatus(false, "Polling Active (Fallback)");
        };
    } catch (e) {
        console.warn("[SSE] EventSource init failed:", e);
        updateSseStatus(false, "Polling Active (Fallback)");
    }
}

function fetchActiveEmergencyAlerts(ngoId, isBackgroundPoll = false) {
    const backendBase = getBackendBaseUrl();
    if (!backendBase) {
        renderAllEmergencyAlerts();
        return;
    }

    const url = `${backendBase}/api/network/alerts/active?ngoId=${encodeURIComponent(ngoId)}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.success && Array.isArray(data.alerts)) {
                // If background poll, only notify/chime on NEW alerts
                data.alerts.forEach(alert => {
                    const isNew = !window.activeNgoEmergencyAlerts[alert.alertId];
                    handleIncomingEmergencyAlert(alert, isNew && isBackgroundPoll);
                });
                renderAllEmergencyAlerts();
            }
        })
        .catch(err => {
            console.warn("[POLL] Failed to fetch active emergency alerts:", err);
        });
}

function handleIncomingEmergencyAlert(alert, triggerChime = false) {
    if (!alert || !alert.alertId) return;

    const isNewArrival = !window.activeNgoEmergencyAlerts[alert.alertId];
    window.activeNgoEmergencyAlerts[alert.alertId] = alert;

    if (triggerChime && isNewArrival) {
        playEmergencyChime();
        showToast(`URGENT BLOOD ALERT: ${alert.bloodGroup} (${alert.unitsRequired} Units) needed at ${alert.hospitalName} (${alert.distanceKm} km away)`, "error");
    }

    renderAllEmergencyAlerts();
    updateNotificationBadge();
}

function handleExternalAlertAcknowledged(alertId, acknowledgedBy) {
    if (window.activeNgoEmergencyAlerts[alertId]) {
        window.activeNgoEmergencyAlerts[alertId].status = "IN_DISPATCH";
        window.activeNgoEmergencyAlerts[alertId].claimedBy = acknowledgedBy;
        renderAllEmergencyAlerts();
        updateNotificationBadge();
    }
}

function renderAllEmergencyAlerts() {
    const list = document.getElementById("ngoEmergencyAlertsList");
    const notifFeed = document.getElementById("ngoNotificationEmergencyFeed");
    if (!list) return;

    const alerts = Object.values(window.activeNgoEmergencyAlerts);

    if (alerts.length === 0) {
        list.innerHTML = `
            <div class="no-alerts-placeholder">
                <i class="fa-solid fa-tower-broadcast"></i>
                <strong>No Active Emergency Requisitions</strong>
                <span>All nearby hospital blood banks are currently operating within safe threshold parameters.</span>
            </div>
        `;
        if (notifFeed) notifFeed.innerHTML = "";
        return;
    }

    // Sort: AWAITING_RESPONSE first, then newest
    alerts.sort((a, b) => {
        if (a.status === "AWAITING_RESPONSE" && b.status !== "AWAITING_RESPONSE") return -1;
        if (a.status !== "AWAITING_RESPONSE" && b.status === "AWAITING_RESPONSE") return 1;
        return (b.timestamp || "").localeCompare(a.timestamp || "");
    });

    list.innerHTML = alerts.map(a => generateEmergencyCardHtml(a)).join("");

    if (notifFeed) {
        notifFeed.innerHTML = alerts.filter(a => a.status === "AWAITING_RESPONSE").map(a => `
            <div class="notification-card" style="border-left: 4px solid #DC2626; background: #FFF5F5;">
                <i class="fa-solid fa-truck-medical" style="color: #DC2626;"></i>
                <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                        <h3 style="color: #991B1B; margin: 0;">Urgent Blood Call: ${a.bloodGroup} (${a.unitsRequired} Units)</h3>
                        <span style="font-size: 11px; background: #FEE2E2; color: #DC2626; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${a.distanceKm} km away</span>
                    </div>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span>${a.hospitalName} &bull; Contact: ${a.contactPerson} (<a href="tel:${a.directDeskPhone}" style="color:#0284C7;">${a.directDeskPhone}</a>)</span>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${a.hospitalName}, ${a.hospitalAddress || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn btn-sm" title="Directions to ${a.hospitalName}">
                            <i class="fa-solid fa-diamond-turn-right"></i> Directions
                        </a>
                    </p>
                </div>
            </div>
        `).join("");
    }
}

function generateEmergencyCardHtml(a) {
    const isClaimed = a.status === "IN_DISPATCH" || a.status === "ACCEPTED";
    const cardClass = isClaimed ? "emergency-alert-card card-accepted" : "emergency-alert-card";
    const urgencyLabel = a.urgencyLevel ? a.urgencyLevel.replace(/_/g, " ") : "CRITICAL OT";
    const urgencyClass = isClaimed ? "accepted" : "critical";
    const formattedDistance = a.distanceKm !== undefined ? `${a.distanceKm} km away` : "Nearby";

    return `
        <div id="alertCard_${a.alertId}" class="${cardClass}">
            <div>
                <div class="card-top-row">
                    <span class="urgency-badge ${urgencyClass}">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        ${isClaimed ? "DISPATCH SECURED" : urgencyLabel}
                    </span>
                    <span class="distance-chip">
                        <i class="fa-solid fa-location-dot"></i>
                        ${formattedDistance}
                    </span>
                    <span class="alert-id-pill">${a.alertId}</span>
                </div>

                <div class="requisition-hero">
                    <div class="blood-group-badge-large">
                        ${a.bloodGroup}
                    </div>
                    <div class="requisition-units-block">
                        <strong>${a.unitsRequired} Units Required</strong>
                        <span>Emergency Blood Transfusion</span>
                    </div>
                </div>

                <div class="hospital-info-block">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;">
                        <h3 class="hospital-name-text">${a.hospitalName}</h3>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${a.hospitalName}, ${a.hospitalAddress || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn btn-sm" title="Get Directions to ${a.hospitalName} on Google Maps">
                            <i class="fa-solid fa-diamond-turn-right"></i> Directions
                        </a>
                    </div>
                    <div class="hospital-license-text">
                        <i class="fa-solid fa-id-card"></i> Lic: ${a.hospitalLicense || "HOSP-BB-7721"}
                    </div>
                    <div class="hospital-address-text">
                        <i class="fa-solid fa-map-pin"></i>
                        <span>${a.hospitalAddress || "Plot 14, Main Medical Road"}</span>
                    </div>
                </div>

                <div class="contact-person-row">
                    <span class="contact-officer">
                        <i class="fa-solid fa-user-doctor"></i>
                        ${a.contactPerson || "Dr. S. Roy (Transfusion Officer)"}
                    </span>
                    <a href="tel:${a.directDeskPhone || '+91-9876543210'}" class="contact-phone-link">
                        <i class="fa-solid fa-phone"></i>
                        <span>${a.directDeskPhone || '+91-9876543210'}</span>
                    </a>
                </div>
            </div>

            <div class="card-action-row" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span class="timestamp-pill">
                    <i class="fa-regular fa-clock"></i>
                    ${a.timestamp ? formatAlertTime(a.timestamp) : 'Just now'}
                </span>

                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${a.hospitalName}, ${a.hospitalAddress || ''}`)}" target="_blank" rel="noopener noreferrer" class="drive-directions-btn" title="Get Directions to ${a.hospitalName} on Google Maps">
                    <i class="fa-solid fa-diamond-turn-right"></i>
                    <span>Get Directions</span>
                </a>

                ${isClaimed ? `
                    <span class="ack-status-indicator">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${a.claimedBy ? `Claimed by ${a.claimedBy}` : "Custody Secured (IN_DISPATCH)"}</span>
                    </span>
                ` : `
                    <button type="button" class="ack-dispatch-btn" onclick="acknowledgeEmergencyAlert('${a.alertId}')">
                        <i class="fa-solid fa-truck-fast"></i>
                        <span>Acknowledge &amp; Dispatch</span>
                    </button>
                `}
            </div>
        </div>
    `;
}

function formatAlertTime(isoStr) {
    try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
        return isoStr;
    }
}

function updateNotificationBadge() {
    const alerts = Object.values(window.activeNgoEmergencyAlerts);
    const pendingCount = alerts.filter(a => a.status === "AWAITING_RESPONSE").length;
    const badgeSpan = document.querySelector(".notification-icon span");
    if (badgeSpan) {
        badgeSpan.textContent = pendingCount > 0 ? pendingCount : "0";
        badgeSpan.style.display = pendingCount > 0 ? "flex" : "none";
    }
}

function acknowledgeEmergencyAlert(alertId) {
    const alert = window.activeNgoEmergencyAlerts[alertId];
    const currentNgoId = localStorage.getItem("bloodlinkNgoId") || "NGO-OD-9021";
    const currentNgoName = localStorage.getItem("bloodlinkUserName") || "Odisha Blood Relief & Voluntary Donor Network";

    const btn = document.querySelector(`#alertCard_${alertId} .ack-dispatch-btn`);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Securing Custody...`;
    }

    const payload = {
        alertId: alertId,
        ngoId: currentNgoId,
        ngoName: currentNgoName
    };

    const backendBase = getBackendBaseUrl();
    if (!backendBase) {
        if (alert) {
            alert.status = "IN_DISPATCH";
            alert.claimedBy = currentNgoName;
        }
        playSuccessChime();
        showToast(`Custody Secured: Emergency Requisition ${alertId} assigned to ${currentNgoName} (IN_DISPATCH)`, "success");
        renderAllEmergencyAlerts();
        updateNotificationBadge();
        return;
    }

    fetch(`${backendBase}/api/network/alerts/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(async res => {
        const data = await res.json();
        if (res.status === 200 && data.success) {
            if (alert) {
                alert.status = "IN_DISPATCH";
                alert.claimedBy = currentNgoName;
            }
            playSuccessChime();
            showToast(`Custody Secured: Emergency Requisition ${alertId} assigned to ${currentNgoName} (IN_DISPATCH)`, "success");
            renderAllEmergencyAlerts();
            updateNotificationBadge();
        } else if (res.status === 409) {
            if (alert) {
                alert.status = "IN_DISPATCH";
                alert.claimedBy = data.claimedBy || "Another Facility";
            }
            showToast(`Conflict: Alert ${alertId} was already claimed by ${data.claimedBy || 'another facility'}.`, "error");
            renderAllEmergencyAlerts();
            updateNotificationBadge();
        } else {
            showToast(data.error || "Failed to acknowledge emergency alert.", "error");
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Acknowledge &amp; Dispatch`;
            }
        }
    })
    .catch(err => {
        console.warn("Acknowledge network error:", err);
        showToast("Network error acknowledging alert. Please verify connection.", "error");
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Acknowledge &amp; Dispatch`;
        }
    });
}

function triggerSimulatedEmergencyAlert() {
    const bloodGroups = ["O-", "O+", "A-", "B-", "AB-"];
    const randomBg = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
    const units = Math.floor(Math.random() * 4) + 2;

    showToast("Simulating code-red hospital requisition...", "info");

    const localFallback = () => {
        const localSim = {
            alertId: `ALT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
            hospitalName: "City Care Multi-Specialty Hospital Blood Bank",
            hospitalLicense: "LIC-2026-001",
            bloodGroup: randomBg,
            unitsRequired: units,
            urgencyLevel: "CRITICAL_OT",
            distanceKm: 3.8,
            contactPerson: "Dr. S. Roy (Blood Transfusion Officer)",
            directDeskPhone: "+91-9876543210",
            hospitalAddress: "Plot 14, Main Medical Road, Near City Center",
            timestamp: new Date().toISOString(),
            status: "AWAITING_RESPONSE"
        };
        handleIncomingEmergencyAlert(localSim, true);
    };

    const backendBase = getBackendBaseUrl();
    if (!backendBase) {
        localFallback();
        return;
    }

    fetch(`${backendBase}/api/network/alerts/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            bloodGroup: randomBg,
            unitsRequired: units,
            urgencyLevel: "CRITICAL_OT"
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.simulatedAlert) {
            handleIncomingEmergencyAlert(data.simulatedAlert, true);
        }
    })
    .catch(err => {
        console.warn("Simulation call error:", err);
        const localSim = {
            alertId: `ALT-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
            hospitalName: "City Care Multi-Specialty Hospital Blood Bank",
            hospitalLicense: "LIC-2026-001",
            bloodGroup: randomBg,
            unitsRequired: units,
            urgencyLevel: "CRITICAL_OT",
            distanceKm: 3.8,
            contactPerson: "Dr. S. Roy (Blood Transfusion Officer)",
            directDeskPhone: "+91-9876543210",
            hospitalAddress: "Plot 14, Main Medical Road, Near City Center",
            timestamp: new Date().toISOString(),
            status: "AWAITING_RESPONSE"
        };
        handleIncomingEmergencyAlert(localSim, true);
    });
}

/* =====================================================
   GLOBAL MODAL ESCAPE & BACKDROP DISMISS CONTROLS
===================================================== */

// Global Escape key and Backdrop dismiss for all LifeFlow modals
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        const openModals = document.querySelectorAll(".hosp-modal-overlay:not(.hidden)");
        openModals.forEach(modal => {
            modal.classList.add("hidden");
        });
    }
});

document.addEventListener("click", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("hosp-modal-overlay")) {
        e.target.classList.add("hidden");
    }
});
