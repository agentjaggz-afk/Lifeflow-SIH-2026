/**
 * LIFEFLOW DONOR CREDIT & REWARDS DASHBOARD
 * Core State Management & Controller
 *
 * Rules:
 * - 1 Unit Blood Donated = +30 Points
 * - 1 Unit Blood Received = -30 Points
 * - Only Blood (No platelets, no SDP, no plasma)
 * - Perks: Free Health Checkup & Pharmacy Discounts
 * - Annual perks unlocked at 100 to 150 points
 * - Transfer points logs relationship (Father, Mother, Relative, Friend, etc.)
 */

const STORAGE_KEY = "lifeflow_donor_data_v5";
const CREDIT_PER_UNIT = 30;
const PERK_UNLOCK_THRESHOLD = 100;

const DEFAULT_STATE = {
    donor: {
        name: "Subrat Kumar Mohanty",
        donorId: "LF-OD-2026-00125",
        bloodGroup: "O+",
        currentCredits: 300,
        previousBalance: 270,
        totalDonated: 11,
        totalReceived: 1,
        tier: "Gold Donor",
        avatarText: "SM"
    },
    rewards: [
        {
            id: "rw-1",
            title: "Free Health & Blood Checkup",
            description: "Full blood count, glucose, and routine health examination with points deduction.",
            cost: 60,
            partner: "Civil Hospital & Partner Diagnostic Lab"
        },
        {
            id: "rw-2",
            title: "Partner Pharmacy 10% Discount Voucher",
            description: "10% discount on all prescription medicines and medical supplies.",
            cost: 30,
            partner: "Apollo Pharmacy & MedPlus"
        },
        {
            id: "rw-3",
            title: "Partner Pharmacy 20% Discount Voucher",
            description: "20% discount on essential prescription medicines and healthcare items.",
            cost: 50,
            partner: "MedPlus & Red Cross Pharmacy Bhubaneswar"
        },
        {
            id: "rw-4",
            title: "Flat Rs 200 Off Prescription Medicines",
            description: "Direct Rs 200 discount coupon valid at partner city pharmacies.",
            cost: 60,
            partner: "City Pharmacy Network"
        },
        {
            id: "rw-5",
            title: "Comprehensive Health Screening & Diagnostic Pass",
            description: "Full body health screening, comprehensive blood & lipid profile with priority hospital consultation.",
            cost: 300,
            partner: "Apollo Multispeciality & AIIMS Diagnostic Network"
        }
    ],
    transactions: [
        {
            id: "TX-9140",
            date: "11 Sep 2026",
            timestamp: 1789123200000,
            activity: "Blood Donation",
            relation: "Self",
            facility: "Capital Hospital, Bhubaneswar",
            type: "donation",
            bloodGroup: "O+",
            units: "1 Unit",
            previousBalance: 270,
            change: 30,
            balanceAfter: 300,
            status: "Verified",
            ref: "LF-2026-9504"
        },
        {
            id: "TX-9082",
            date: "07 Sep 2026",
            timestamp: 1788777600000,
            activity: "Blood Donation",
            relation: "Self",
            facility: "AIIMS Bhubaneswar",
            type: "donation",
            bloodGroup: "O+",
            units: "2 Units",
            previousBalance: 210,
            change: 60,
            balanceAfter: 270,
            status: "Verified",
            ref: "LF-2026-8921"
        },
        {
            id: "TX-8990",
            date: "28 Aug 2026",
            timestamp: 1787913600000,
            activity: "Points Transfer",
            relation: "Father (Ramesh Mohanty)",
            facility: "LifeFlow P2P Network",
            type: "transfer",
            bloodGroup: "O+",
            units: "30 Points",
            previousBalance: 240,
            change: -30,
            balanceAfter: 210,
            status: "Completed",
            ref: "TRF-FATHER-101"
        },
        {
            id: "TX-8850",
            date: "10 Aug 2026",
            timestamp: 1786358400000,
            activity: "Blood Donation",
            relation: "Self",
            facility: "KIMS Hospital, Bhubaneswar",
            type: "donation",
            bloodGroup: "O+",
            units: "1 Unit",
            previousBalance: 210,
            change: 30,
            balanceAfter: 240,
            status: "Verified",
            ref: "LF-2026-8109"
        },
        {
            id: "TX-8745",
            date: "15 Jul 2026",
            timestamp: 1784112000000,
            activity: "Blood Donation",
            relation: "Self",
            facility: "SCB Medical College, Cuttack",
            type: "donation",
            bloodGroup: "O+",
            units: "2 Units",
            previousBalance: 150,
            change: 60,
            balanceAfter: 210,
            status: "Verified",
            ref: "LF-2026-7412"
        },
        {
            id: "TX-8521",
            date: "10 Jun 2026",
            timestamp: 1781088000000,
            activity: "Blood Received",
            relation: "Mother (Family Need)",
            facility: "SUM Hospital, Bhubaneswar",
            type: "received",
            bloodGroup: "O+",
            units: "1 Unit",
            previousBalance: 180,
            change: -30,
            balanceAfter: 150,
            status: "Completed",
            ref: "REC-2026-10"
        },
        {
            id: "TX-8410",
            date: "24 May 2026",
            timestamp: 1779628800000,
            activity: "Points Transfer",
            relation: "Friend (Rahul Sharma)",
            facility: "LifeFlow P2P Network",
            type: "transfer",
            bloodGroup: "O+",
            units: "30 Points",
            previousBalance: 210,
            change: -30,
            balanceAfter: 180,
            status: "Completed",
            ref: "TRF-FRIEND-402"
        },
        {
            id: "TX-8310",
            date: "02 May 2026",
            timestamp: 1777718400000,
            activity: "Blood Donation",
            relation: "Self",
            facility: "Odisha Red Cross Blood Bank, Bhubaneswar",
            type: "donation",
            bloodGroup: "O+",
            units: "2 Units",
            previousBalance: 150,
            change: 60,
            balanceAfter: 210,
            status: "Verified",
            ref: "LF-2026-5201"
        }
    ],
    activities: [
        {
            title: "Blood Donated",
            subtitle: "1 Unit Blood - Capital Hospital, Bhubaneswar",
            date: "11 Sep 2026",
            bloodGroup: "O+",
            changeText: "+30 Points"
        },
        {
            title: "Blood Donated",
            subtitle: "2 Units Blood - AIIMS Bhubaneswar",
            date: "07 Sep 2026",
            bloodGroup: "O+",
            changeText: "+60 Points"
        },
        {
            title: "Points Transferred to Father",
            subtitle: "Recipient: Ramesh Mohanty (Father) - 30 Pts",
            date: "28 Aug 2026",
            bloodGroup: "O+",
            changeText: "-30 Points"
        },
        {
            title: "Blood Donated",
            subtitle: "1 Unit Blood - KIMS Hospital, Bhubaneswar",
            date: "10 Aug 2026",
            bloodGroup: "O+",
            changeText: "+30 Points"
        },
        {
            title: "Blood Donated",
            subtitle: "2 Units Blood - SCB Medical College, Cuttack",
            date: "15 Jul 2026",
            bloodGroup: "O+",
            changeText: "+60 Points"
        },
        {
            title: "Blood Received for Mother",
            subtitle: "1 Unit Blood Transfused - SUM Hospital, Bhubaneswar",
            date: "10 Jun 2026",
            bloodGroup: "O+",
            changeText: "-30 Points"
        }
    ]
};

let appState = {};
let currentTableFilter = "all";

// =============================================================================
// STATE PERSISTENCE
// =============================================================================

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            appState = JSON.parse(saved);
            // Ensure demo points are initialized with at least 300 points
            if (appState && appState.donor && (appState.donor.currentCredits < 300 || !appState.donor.currentCredits)) {
                appState.donor.currentCredits = 300;
                appState.donor.previousBalance = 270;
                appState.donor.totalDonated = 11;
                saveState();
            }
        } else {
            appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
            saveState();
        }

        // Dynamically synchronize donor info with signed-in user from localStorage
        const loggedInName = localStorage.getItem("lifeflow_user_name") || localStorage.getItem("bloodlinkUserName");
        const loggedInRole = localStorage.getItem("lifeflow_user_role") || localStorage.getItem("bloodlinkUserRole");
        const loggedInBg = localStorage.getItem("bloodlinkUserBloodGroup") || localStorage.getItem("lifeflow_blood_group");

        if (appState && appState.donor) {
            if (loggedInName && loggedInName.trim()) {
                appState.donor.name = loggedInName.trim();
                const initials = loggedInName.trim().split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase();
                if (initials) {
                    appState.donor.avatarText = initials;
                }
            }
            if (loggedInBg && loggedInBg.trim()) {
                appState.donor.bloodGroup = loggedInBg.trim();
            }
            if (loggedInRole && loggedInRole.toLowerCase() === "consumer") {
                appState.donor.tier = "Recipient Account";
            }
        }
    } catch (e) {
        console.error("State loading error:", e);
        appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State saving error:", e);
    }
}

function resetDemoData() {
    if (confirm("Reset points and donation history to default demo state?")) {
        appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        const loggedInName = localStorage.getItem("lifeflow_user_name") || localStorage.getItem("bloodlinkUserName");
        if (loggedInName && appState && appState.donor) {
            appState.donor.name = loggedInName.trim();
            const initials = loggedInName.trim().split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase();
            if (initials) appState.donor.avatarText = initials;
        }
        saveState();
        initDashboard();
        showToast("Data Reset", "Default donor data restored successfully.", "success");
    }
}

// =============================================================================
// UI RENDERING
// =============================================================================

function renderDashboard() {
    const { donor } = appState;

    if (document.getElementById("cardDonorName")) document.getElementById("cardDonorName").textContent = donor.name;
    if (document.getElementById("cardDonorId")) document.getElementById("cardDonorId").textContent = donor.donorId;
    if (document.getElementById("cardBloodGroup")) document.getElementById("cardBloodGroup").textContent = donor.bloodGroup;
    if (document.getElementById("currentPoints")) document.getElementById("currentPoints").textContent = donor.currentCredits;

    if (document.getElementById("sidebarDonorName")) document.getElementById("sidebarDonorName").textContent = donor.name;
    if (document.getElementById("sidebarDonorId")) document.getElementById("sidebarDonorId").textContent = `ID: ${donor.donorId}`;
    if (document.getElementById("sidebarBloodGroup")) document.getElementById("sidebarBloodGroup").textContent = donor.bloodGroup;
    if (document.getElementById("topDonorName")) document.getElementById("topDonorName").textContent = donor.name;
    if (document.getElementById("donorAvatar")) document.getElementById("donorAvatar").textContent = donor.avatarText || "MD";
    if (document.getElementById("modalCardDonorName")) document.getElementById("modalCardDonorName").textContent = donor.name;

    // Dropdown user elements
    if (document.getElementById("dropdownUserName")) document.getElementById("dropdownUserName").textContent = donor.name;
    if (document.getElementById("dropdownAvatar")) document.getElementById("dropdownAvatar").textContent = donor.avatarText || "MD";
    const userEmail = localStorage.getItem("lifeflow_user_email") || localStorage.getItem("bloodlinkUserEmail") || `${donor.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
    if (document.getElementById("dropdownUserEmail")) document.getElementById("dropdownUserEmail").textContent = userEmail;

    if (document.getElementById("totalDonated")) document.getElementById("totalDonated").textContent = donor.totalDonated;
    if (document.getElementById("totalDonatedUnitsText")) document.getElementById("totalDonatedUnitsText").textContent = `${donor.totalDonated} Units`;
    if (document.getElementById("totalReceived")) document.getElementById("totalReceived").textContent = donor.totalReceived;
    if (document.getElementById("metricCurrentPoints")) document.getElementById("metricCurrentPoints").textContent = donor.currentCredits;
    if (document.getElementById("previousPoints")) document.getElementById("previousPoints").textContent = donor.previousBalance;

    document.querySelectorAll(".currentBalanceDisplay").forEach(el => {
        el.textContent = donor.currentCredits;
    });

    const isUnlocked = donor.currentCredits >= PERK_UNLOCK_THRESHOLD;
    const tierTitle = isUnlocked ? "Gold Donor" : "Standard Donor";

    if (document.getElementById("tierTitle")) document.getElementById("tierTitle").textContent = tierTitle;
    if (document.getElementById("topTierLabel")) document.getElementById("topTierLabel").textContent = tierTitle;
    if (document.getElementById("cardTierBadge")) document.getElementById("cardTierBadge").innerHTML = `<i class="fa-solid fa-crown"></i> ${tierTitle.toUpperCase()}`;

    renderRewards();
    renderTransactionsTable(getFilteredTransactions());
    renderActivityTimeline();
    initOrUpdateChart();
}

function renderRewards() {
    const grid = document.getElementById("rewardsGrid");
    const select = document.getElementById("redeemSelect");
    if (!grid) return;

    const userCredits = appState.donor.currentCredits;
    const isUnlocked = userCredits >= PERK_UNLOCK_THRESHOLD;

    grid.innerHTML = appState.rewards.map(rw => {
        const canAfford = isUnlocked && userCredits >= rw.cost;

        let buttonText = "Claim Voucher";
        let disabled = false;

        if (!isUnlocked) {
            buttonText = `Requires 100+ Pts`;
            disabled = true;
        } else if (userCredits < rw.cost) {
            buttonText = `Need ${rw.cost - userCredits} More Pts`;
            disabled = true;
        }

        const iconClass = rw.title.includes("Checkup")
            ? "fa-solid fa-user-doctor"
            : "fa-solid fa-prescription-bottle-medical";

        return `
            <div class="reward-card">
                <div>
                    <div class="reward-icon-wrapper">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="reward-info">
                        <h4>${rw.title}</h4>
                        <p>${rw.description}</p>
                    </div>
                </div>
                <div class="reward-bottom">
                    <div class="reward-points">
                        ${rw.cost} <span>POINTS</span>
                    </div>
                    <button
                        class="reward-redeem-btn"
                        onclick="triggerRedeem('${rw.id}')"
                        ${disabled ? 'disabled style="opacity: 0.55; cursor: not-allowed;"' : ''}
                    >
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (select) {
        select.innerHTML = appState.rewards.map(rw => `
            <option value="${rw.id}">${rw.title} (${rw.cost} Points)</option>
        `).join('');
    }
}

function getFilteredTransactions() {
    let list = [...appState.transactions];
    if (currentTableFilter !== "all") {
        list = list.filter(t => t.type === currentTableFilter);
    }
    const searchVal = document.getElementById("tableSearchInput")?.value.trim().toLowerCase();
    if (searchVal) {
        list = list.filter(t =>
            t.activity.toLowerCase().includes(searchVal) ||
            (t.relation && t.relation.toLowerCase().includes(searchVal)) ||
            t.facility.toLowerCase().includes(searchVal) ||
            t.date.toLowerCase().includes(searchVal) ||
            (t.ref && t.ref.toLowerCase().includes(searchVal))
        );
    }
    return list;
}

function renderTransactionsTable(list) {
    const tbody = document.getElementById("transactionTableBody");
    if (!tbody) return;

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    No transactions found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map(tx => {
        let iconClass = "fa-solid fa-droplet";
        let cellTypeClass = "donation";
        let changeFormatted = `+${tx.change}`;
        let changeClass = "positive";

        if (tx.type === "received") {
            iconClass = "fa-solid fa-hand-holding-droplet";
            cellTypeClass = "received";
            changeFormatted = `${tx.change}`;
            changeClass = "negative";
        } else if (tx.type === "redeem") {
            iconClass = "fa-solid fa-prescription-bottle-medical";
            cellTypeClass = "redeem";
            changeFormatted = `${tx.change}`;
            changeClass = "negative";
        } else if (tx.type === "transfer") {
            iconClass = "fa-solid fa-arrow-right-arrow-left";
            cellTypeClass = "transfer";
            changeFormatted = `${tx.change}`;
            changeClass = "negative";
        }

        let statusClass = tx.status === "Verified" ? "verified" : "completed";

        const relation = tx.relation || "Self";
        let relationTagClass = "self";
        let relationIcon = "fa-regular fa-user";

        if (relation.includes("Father") || relation.includes("Mother") || relation.includes("Brother") || relation.includes("Sister") || relation.includes("Spouse") || relation.includes("Son") || relation.includes("Daughter")) {
            relationTagClass = "family";
            relationIcon = "fa-solid fa-people-roof";
        } else if (relation.includes("Relative")) {
            relationTagClass = "relative";
            relationIcon = "fa-solid fa-hands-holding-child";
        } else if (relation.includes("Friend")) {
            relationTagClass = "friend";
            relationIcon = "fa-solid fa-user-group";
        }

        return `
            <tr>
                <td style="white-space: nowrap; font-weight: 600;">${tx.date}</td>
                <td>
                    <div class="activity-cell">
                        <div class="activity-icon ${cellTypeClass}">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="activity-details">
                            <h5>${tx.activity}</h5>
                            <span>${tx.facility}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="relation-badge ${relationTagClass}">
                        <i class="${relationIcon}"></i> ${relation}
                    </span>
                </td>
                <td><strong style="color: var(--primary);">${tx.bloodGroup}</strong></td>
                <td>${tx.units}</td>
                <td style="color: var(--text-muted);">${tx.previousBalance}</td>
                <td><span class="points-change ${changeClass}">${changeFormatted} Pts</span></td>
                <td><strong style="color: var(--text-main);">${tx.balanceAfter}</strong></td>
                <td><span class="status-badge ${statusClass}">${tx.status}</span></td>
                <td>
                    <button class="export-btn" style="padding: 3px 8px; font-size: 0.75rem;" onclick="viewReceipt('${tx.id}')">
                        Receipt
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderActivityTimeline() {
    const listEl = document.getElementById("activityTimeline");
    if (!listEl) return;

    listEl.innerHTML = appState.activities.slice(0, 5).map(act => {
        const isPositive = act.changeText.startsWith("+");
        return `
            <div class="timeline-card">
                <div class="timeline-left">
                    <div class="timeline-icon-box">
                        ${act.bloodGroup}
                    </div>
                    <div class="timeline-info">
                        <h5>${act.title}</h5>
                        <p>${act.subtitle} - ${act.date}</p>
                    </div>
                </div>
                <div class="${isPositive ? 'positive' : 'negative'}" style="font-weight: 800; font-size: 0.92rem;">
                    ${act.changeText}
                </div>
            </div>
        `;
    }).join('');
}

// =============================================================================
// NATIVE OFFLINE BLOOD DONATION & POINTS ACTIVITY GRAPH (100% Standalone)
// =============================================================================

let currentChartPeriod = "6m";
let chartHoverIndex = -1;
let chartListenersAttached = false;

function drawRoundedBar(ctx, x, y, width, height, radius) {
    if (height <= 0 || width <= 0) return;
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

function initOrUpdateChart(period = "6m") {
    currentChartPeriod = period;
    const canvas = document.getElementById("donationChart");
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth || 600 : 600;
    const height = parent ? parent.clientHeight || 240 : 240;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const labels6m = ["Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"];
    const earnedData6m = [30, 60, 30, 60, 30, 90];
    const usedData6m = [0, 0, 30, 0, 30, 0];

    const labels1y = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26"];
    const earnedData1y = [30, 0, 30, 30, 30, 0, 30, 60, 30, 60, 30, 90];
    const usedData1y = [0, 0, 30, 0, 0, 0, 0, 0, 30, 0, 30, 0];

    const labels = period === "1y" ? labels1y : labels6m;
    const earned = period === "1y" ? earnedData1y : earnedData6m;
    const used = period === "1y" ? usedData1y : usedData6m;

    const padLeft = 48;
    const padRight = 18;
    const padTop = 18;
    const padBottom = 34;

    const plotW = Math.max(10, width - padLeft - padRight);
    const plotH = Math.max(10, height - padTop - padBottom);

    const maxY = 120;
    const ySteps = [0, 30, 60, 90, 120];

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw Gridlines & Y-axis labels
    ySteps.forEach(val => {
        const y = padTop + plotH - (val / maxY) * plotH;
        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 10px 'Inter', sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(val + " pts", padLeft - 8, y);
    });

    const N = labels.length;
    const colWidth = plotW / N;
    const barWidth = Math.max(8, Math.min(18, colWidth * 0.32));
    const barGap = 4;

    // Hover column highlight
    if (chartHoverIndex >= 0 && chartHoverIndex < N) {
        const hX = padLeft + chartHoverIndex * colWidth;
        ctx.fillStyle = "rgba(183, 28, 28, 0.04)";
        ctx.fillRect(hX, padTop, colWidth, plotH);
    }

    // Draw Bars & X-axis Labels
    for (let i = 0; i < N; i++) {
        const groupCenterX = padLeft + (i + 0.5) * colWidth;
        const eVal = earned[i];
        const uVal = used[i];

        const eH = (eVal / maxY) * plotH;
        const uH = (uVal / maxY) * plotH;

        // Earned Bar (Blood Donated - Red Gradient)
        if (eH > 0) {
            const b1X = groupCenterX - barWidth - barGap / 2;
            const b1Y = padTop + plotH - eH;
            const grad = ctx.createLinearGradient(0, b1Y, 0, b1Y + eH);
            grad.addColorStop(0, "#dc2626");
            grad.addColorStop(1, "#b71c1c");
            ctx.fillStyle = grad;
            drawRoundedBar(ctx, b1X, b1Y, barWidth, eH, 4);
        }

        // Used Bar (Transfers / Received / Perks - Slate Gray)
        if (uH > 0) {
            const b2X = groupCenterX + barGap / 2;
            const b2Y = padTop + plotH - uH;
            ctx.fillStyle = "#94a3b8";
            drawRoundedBar(ctx, b2X, b2Y, barWidth, uH, 4);
        }

        // X Axis Month Label
        const isHovered = (chartHoverIndex === i);
        ctx.fillStyle = isHovered ? "#b71c1c" : "#64748b";
        ctx.font = isHovered ? "700 11px 'Inter', sans-serif" : "500 10px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(labels[i], groupCenterX, height - padBottom + 8);
    }

    // Bottom horizontal axis line
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH);
    ctx.lineTo(width - padRight, padTop + plotH);
    ctx.stroke();

    // Floating Interactive Tooltip on Hover
    if (chartHoverIndex >= 0 && chartHoverIndex < N) {
        const idx = chartHoverIndex;
        const groupCenterX = padLeft + (idx + 0.5) * colWidth;
        const month = labels[idx];
        const ePoints = earned[idx];
        const uPoints = used[idx];

        const tipW = 158;
        const tipH = 70;
        let tipX = groupCenterX - tipW / 2;
        if (tipX < padLeft) tipX = padLeft;
        if (tipX + tipW > width - padRight) tipX = width - padRight - tipW;
        const tipY = Math.max(padTop + 4, padTop + 14);

        // Tooltip container box with shadow
        ctx.save();
        ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(tipX, tipY, tipW, tipH, 8);
        } else {
            ctx.rect(tipX, tipY, tipW, tipH);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Month Title
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#0f172a";
        ctx.font = "700 11px 'Inter', sans-serif";
        ctx.fillText(month, tipX + 12, tipY + 8);

        // Earned indicator
        ctx.fillStyle = "#b71c1c";
        ctx.fillRect(tipX + 12, tipY + 28, 8, 8);
        ctx.fillStyle = "#334155";
        ctx.font = "600 10px 'Inter', sans-serif";
        ctx.fillText(`Earned: +${ePoints} pts (${Math.round(ePoints / 30)} unit${ePoints === 30 ? '' : 's'})`, tipX + 26, tipY + 26);

        // Used indicator
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(tipX + 12, tipY + 46, 8, 8);
        ctx.fillStyle = "#334155";
        ctx.font = "600 10px 'Inter', sans-serif";
        ctx.fillText(`Used: ${uPoints > 0 ? `-${uPoints} pts` : '0 pts'}`, tipX + 26, tipY + 44);
    }

    // Attach interaction listeners once
    if (!chartListenersAttached) {
        chartListenersAttached = true;

        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (mouseX >= padLeft && mouseX <= width - padRight && mouseY >= padTop && mouseY <= height - padBottom) {
                const hoverCol = Math.floor((mouseX - padLeft) / colWidth);
                if (hoverCol >= 0 && hoverCol < N) {
                    if (chartHoverIndex !== hoverCol) {
                        chartHoverIndex = hoverCol;
                        initOrUpdateChart(currentChartPeriod);
                    }
                    return;
                }
            }
            if (chartHoverIndex !== -1) {
                chartHoverIndex = -1;
                initOrUpdateChart(currentChartPeriod);
            }
        });

        canvas.addEventListener("mouseleave", () => {
            if (chartHoverIndex !== -1) {
                chartHoverIndex = -1;
                initOrUpdateChart(currentChartPeriod);
            }
        });

        window.addEventListener("resize", () => {
            initOrUpdateChart(currentChartPeriod);
        });
    }
}

function updateChartData(val) {
    chartHoverIndex = -1;
    initOrUpdateChart(val);
}

// =============================================================================
// INTERACTION & ACTION HANDLERS
// =============================================================================

function calculatePointsPreview() {
    const units = parseInt(document.getElementById("donationUnits")?.value || "1", 10);
    const totalPoints = units * CREDIT_PER_UNIT;

    const displayEl = document.getElementById("previewPointsDisplay");
    if (displayEl) {
        displayEl.textContent = `+${totalPoints} Points (${units} Unit${units > 1 ? 's' : ''} x 30 Pts)`;
    }
    return totalPoints;
}

function handleDonateSubmit(e) {
    e.preventDefault();
    const units = parseInt(document.getElementById("donationUnits").value, 10);
    const facility = document.getElementById("donationFacility").value.trim();
    const dateInput = document.getElementById("donationDate").value;
    const cert = document.getElementById("donationCertificate").value.trim() || `LF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const pointsToAdd = units * CREDIT_PER_UNIT;
    const prevBalance = appState.donor.currentCredits;
    const newBalance = prevBalance + pointsToAdd;

    appState.donor.previousBalance = prevBalance;
    appState.donor.currentCredits = newBalance;
    appState.donor.totalDonated += units;

    const dateObj = new Date(dateInput || "2026-09-10");
    const dateStr = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    appState.transactions.unshift({
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        date: dateStr,
        timestamp: Date.now(),
        activity: "Blood Donation",
        relation: "Self",
        facility: facility,
        type: "donation",
        bloodGroup: appState.donor.bloodGroup,
        units: `${units} Unit${units > 1 ? 's' : ''}`,
        previousBalance: prevBalance,
        change: pointsToAdd,
        balanceAfter: newBalance,
        status: "Verified",
        ref: cert
    });

    appState.activities.unshift({
        title: "Blood Donated",
        subtitle: `${units} Unit${units > 1 ? 's' : ''} Blood - ${facility}`,
        date: dateStr,
        bloodGroup: appState.donor.bloodGroup,
        changeText: `+${pointsToAdd} Points`
    });

    saveState();
    renderDashboard();
    closeModal('donateModal');
    document.getElementById("donateForm").reset();

    showToast("Donation Recorded!", `+${pointsToAdd} Credit Points added (${units} Unit x 30 Pts).`, "success");
}

function updateRedeemCost(rewardId) {
    const reward = appState.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const costDisplay = document.getElementById("redeemCostDisplay");
    if (costDisplay) {
        costDisplay.textContent = `-${reward.cost} Points`;
    }
    const partnerInput = document.getElementById("redeemPartner");
    if (partnerInput) {
        partnerInput.value = reward.partner;
    }
}

function triggerRedeem(rewardId) {
    if (appState.donor.currentCredits < PERK_UNLOCK_THRESHOLD) {
        showToast("Perks Locked", `Perks unlock only after reaching 100 to 150 credit points. Current balance: ${appState.donor.currentCredits} points.`, "danger");
        return;
    }
    openModal('redeemModal');
    const select = document.getElementById("redeemSelect");
    if (select) {
        select.value = rewardId;
        updateRedeemCost(rewardId);
    }
}

function handleRedeemSubmit(e) {
    e.preventDefault();

    if (appState.donor.currentCredits < PERK_UNLOCK_THRESHOLD) {
        showToast("Threshold Requirement", "You need at least 100 to 150 credit points to claim perks.", "danger");
        closeModal('redeemModal');
        return;
    }

    const rewardId = document.getElementById("redeemSelect").value;
    const reward = appState.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (appState.donor.currentCredits < reward.cost) {
        showToast("Insufficient Points", `You need ${reward.cost} points for this perk. Current balance: ${appState.donor.currentCredits} points.`, "danger");
        return;
    }

    const prevBalance = appState.donor.currentCredits;
    const newBalance = prevBalance - reward.cost;
    const voucherCode = `PERK-VOUCHER-${Math.floor(1000 + Math.random() * 9000)}`;

    appState.donor.previousBalance = prevBalance;
    appState.donor.currentCredits = newBalance;

    const dateStr = new Date("2026-09-10").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    appState.transactions.unshift({
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        date: dateStr,
        timestamp: Date.now(),
        activity: `Perk: ${reward.title}`,
        relation: "Self",
        facility: reward.partner,
        type: "redeem",
        bloodGroup: appState.donor.bloodGroup,
        units: "Voucher",
        previousBalance: prevBalance,
        change: -reward.cost,
        balanceAfter: newBalance,
        status: "Completed",
        ref: voucherCode
    });

    appState.activities.unshift({
        title: `Perk Claimed`,
        subtitle: `${reward.title} - Code: ${voucherCode}`,
        date: dateStr,
        bloodGroup: appState.donor.bloodGroup,
        changeText: `-${reward.cost} Points`
    });

    saveState();
    renderDashboard();
    closeModal('redeemModal');

    showToast("Voucher Generated!", `Voucher successfully generated: ${voucherCode}`, "success");
}

function handleTransferSubmit(e) {
    e.preventDefault();
    const recipientId = document.getElementById("transferRecipientId").value.trim();
    const recipientName = document.getElementById("transferRecipientName").value.trim();
    const relation = document.getElementById("transferRelation").value;
    const amount = parseInt(document.getElementById("transferAmount").value, 10);

    if (amount <= 0 || appState.donor.currentCredits < amount) {
        showToast("Transfer Error", "Invalid points amount or insufficient balance.", "danger");
        return;
    }

    const prevBalance = appState.donor.currentCredits;
    const newBalance = prevBalance - amount;
    const refCode = `TRF-${Math.floor(1000 + Math.random() * 9000)}`;

    appState.donor.previousBalance = prevBalance;
    appState.donor.currentCredits = newBalance;

    const dateStr = new Date("2026-09-10").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    appState.transactions.unshift({
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        date: dateStr,
        timestamp: Date.now(),
        activity: `Points Transfer`,
        relation: `${relation} (${recipientName})`,
        facility: "LifeFlow P2P Network",
        type: "transfer",
        bloodGroup: appState.donor.bloodGroup,
        units: `${amount} Points`,
        previousBalance: prevBalance,
        change: -amount,
        balanceAfter: newBalance,
        status: "Completed",
        ref: refCode
    });

    appState.activities.unshift({
        title: `Points Transferred to ${relation}`,
        subtitle: `${recipientName} (${relation}) - ${amount} Pts`,
        date: dateStr,
        bloodGroup: appState.donor.bloodGroup,
        changeText: `-${amount} Points`
    });

    saveState();
    renderDashboard();
    closeModal('transferModal');
    document.getElementById("transferForm").reset();

    showToast("Transfer Complete", `Transferred ${amount} points to your ${relation} (${recipientName}).`, "success");
}

// =============================================================================
// DEMO POINT TRANSFER SIMULATION WITH LIVE ANIMATION
// =============================================================================

const DEMO_RECIPIENTS = [
    { name: "Priya Mohapatra", relation: "Sister", id: "BL-OD-2026-8812", bloodGroup: "O+", icon: "fa-solid fa-person-dress" },
    { name: "Ramesh Mohanty", relation: "Father", id: "BL-OD-2026-4402", bloodGroup: "B+", icon: "fa-solid fa-user-tie" },
    { name: "Ananya Sen", relation: "Mother", id: "BL-OD-2026-9134", bloodGroup: "O-", icon: "fa-solid fa-person-dress" },
    { name: "Rahul Sharma", relation: "Friend", id: "BL-OD-2026-1029", bloodGroup: "A+", icon: "fa-solid fa-user-graduate" },
    { name: "Dr. Suresh Pradhan", relation: "Other / Emergency Patient", id: "BL-OD-2026-5590", bloodGroup: "AB+", icon: "fa-solid fa-user-doctor" },
    { name: "Pooja Das", relation: "Daughter", id: "BL-OD-2026-7731", bloodGroup: "O+", icon: "fa-solid fa-child" },
    { name: "Amitav Pattnaik", relation: "Brother", id: "BL-OD-2026-3021", bloodGroup: "B-", icon: "fa-solid fa-user" }
];

const DEMO_TRANSFER_AMOUNTS = [30, 40, 50, 60, 90];
let demoTransferTimers = [];

function clearDemoTransferTimers() {
    demoTransferTimers.forEach(t => clearTimeout(t));
    demoTransferTimers = [];
}

function closeDemoTransferModal() {
    clearDemoTransferTimers();
    closeModal('demoTransferModal');
}

function startDemoTransferFlow() {
    // If regular transfer modal is open, close it
    closeModal('transferModal');
    clearDemoTransferTimers();

    // Auto-replenish if points are too low for demo
    if (appState.donor.currentCredits < 30) {
        appState.donor.currentCredits = 300;
        appState.donor.previousBalance = 300;
        saveState();
        renderDashboard();
        showToast("Demo Balance Refilled", "Refilled demo points to 300 so you can test transfers freely.", "info");
    }

    // Pick random recipient
    const recipient = DEMO_RECIPIENTS[Math.floor(Math.random() * DEMO_RECIPIENTS.length)];

    // Pick random amount <= current balance
    const validAmounts = DEMO_TRANSFER_AMOUNTS.filter(a => a <= appState.donor.currentCredits);
    const amount = validAmounts.length > 0
        ? validAmounts[Math.floor(Math.random() * validAmounts.length)]
        : Math.min(30, appState.donor.currentCredits);

    const startBalance = appState.donor.currentCredits;
    const finalBalance = startBalance - amount;

    // Open Modal
    openModal('demoTransferModal');

    // Reset Elements
    const senderNameEl = document.getElementById("demoSenderName");
    const senderBalanceEl = document.getElementById("demoSenderBalance");
    const recipientNameEl = document.getElementById("demoRecipientName");
    const recipientRoleEl = document.getElementById("demoRecipientRole");
    const recipientCreditsEl = document.getElementById("demoRecipientCredits");
    const recipientIconEl = document.getElementById("demoRecipientIcon");
    const pillAmountEl = document.getElementById("demoPillAmount");
    const statusTextEl = document.getElementById("demoStatusText");
    const progressPercentEl = document.getElementById("demoProgressPercent");
    const progressFillEl = document.getElementById("demoProgressFill");
    const successViewEl = document.getElementById("demoSuccessView");
    const statusBoxEl = document.getElementById("demoStatusBox");

    const btnCancel = document.getElementById("btnCancelDemoTransfer");
    const btnTransferAnother = document.getElementById("btnTransferAnother");
    const btnFinish = document.getElementById("btnFinishDemoTransfer");

    if (senderNameEl) senderNameEl.textContent = appState.donor.name;
    if (senderBalanceEl) senderBalanceEl.textContent = startBalance;
    if (recipientNameEl) recipientNameEl.textContent = recipient.name;
    if (recipientRoleEl) recipientRoleEl.innerHTML = `${recipient.relation} &bull; ${recipient.bloodGroup}`;
    if (recipientCreditsEl) recipientCreditsEl.textContent = "0";
    if (recipientIconEl) recipientIconEl.className = recipient.icon;
    if (pillAmountEl) pillAmountEl.textContent = amount;

    if (statusBoxEl) statusBoxEl.style.display = "block";
    if (successViewEl) successViewEl.style.display = "none";
    if (progressFillEl) progressFillEl.style.width = "10%";
    if (progressPercentEl) progressPercentEl.textContent = "10%";
    if (statusTextEl) {
        statusTextEl.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: #7c3aed;"></i> Connecting to LifeFlow P2P network...`;
    }

    if (btnCancel) btnCancel.style.display = "inline-flex";
    if (btnTransferAnother) btnTransferAnother.style.display = "none";
    if (btnFinish) btnFinish.style.display = "none";

    // Trigger Coin Flying animations
    const coins = document.querySelectorAll(".demo-animation-box .transfer-coin");
    coins.forEach(c => {
        c.style.animationPlayState = "running";
    });

    // Stage 1 (0ms - 500ms): Connecting
    demoTransferTimers.push(setTimeout(() => {
        if (progressFillEl) progressFillEl.style.width = "35%";
        if (progressPercentEl) progressPercentEl.textContent = "35%";
        if (statusTextEl) {
            statusTextEl.innerHTML = `<i class="fa-solid fa-key fa-spin" style="color: #7c3aed;"></i> Generating cryptographic one-time authorization token...`;
        }
    }, 500));

    // Stage 2 (1100ms): Flying points & ticking counters
    demoTransferTimers.push(setTimeout(() => {
        if (progressFillEl) progressFillEl.style.width = "70%";
        if (progressPercentEl) progressPercentEl.textContent = "70%";
        if (statusTextEl) {
            statusTextEl.innerHTML = `<i class="fa-solid fa-paper-plane fa-bounce" style="color: #ef4444;"></i> Dispatching ${amount} Points to ${recipient.name}...`;
        }

        // Animated counter down for sender, counter up for recipient
        const steps = 15;
        const stepTime = 50;
        let stepCount = 0;
        const interval = setInterval(() => {
            stepCount++;
            const progress = stepCount / steps;
            const currentSender = Math.round(startBalance - amount * progress);
            const currentRecv = Math.round(amount * progress);

            if (senderBalanceEl) senderBalanceEl.textContent = currentSender;
            if (recipientCreditsEl) recipientCreditsEl.textContent = `+${currentRecv}`;

            if (stepCount >= steps) {
                clearInterval(interval);
                if (senderBalanceEl) senderBalanceEl.textContent = finalBalance;
                if (recipientCreditsEl) recipientCreditsEl.textContent = `+${amount}`;
            }
        }, stepTime);
    }, 1100));

    // Stage 3 (2000ms): Ledger verification
    demoTransferTimers.push(setTimeout(() => {
        if (progressFillEl) progressFillEl.style.width = "90%";
        if (progressPercentEl) progressPercentEl.textContent = "90%";
        if (statusTextEl) {
            statusTextEl.innerHTML = `<i class="fa-solid fa-shield-halved fa-beat" style="color: #16a34a;"></i> Committing transaction to offline ledger...`;
        }
    }, 2000));

    // Stage 4 (2600ms): Transfer Finalized & State Saved!
    demoTransferTimers.push(setTimeout(() => {
        if (progressFillEl) progressFillEl.style.width = "100%";
        if (progressPercentEl) progressPercentEl.textContent = "100%";

        const refCode = `TRF-OD-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateStr = new Date("2026-09-10").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        // Update application state
        appState.donor.previousBalance = startBalance;
        appState.donor.currentCredits = finalBalance;

        appState.transactions.unshift({
            id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
            date: dateStr,
            timestamp: Date.now(),
            activity: `Points Transfer (DEMO)`,
            relation: `${recipient.relation} (${recipient.name})`,
            facility: "LifeFlow P2P Network",
            type: "transfer",
            bloodGroup: appState.donor.bloodGroup,
            units: `${amount} Points`,
            previousBalance: startBalance,
            change: -amount,
            balanceAfter: finalBalance,
            status: "Completed",
            ref: refCode
        });

        appState.activities.unshift({
            title: `Points Transferred to ${recipient.relation}`,
            subtitle: `${recipient.name} (${recipient.relation}) - ${amount} Pts (Demo Transfer)`,
            date: dateStr,
            bloodGroup: appState.donor.bloodGroup,
            changeText: `-${amount} Points`
        });

        saveState();
        renderDashboard();

        // Populate Success Card
        const metaTxRef = document.getElementById("demoMetaTxRef");
        const metaRecipient = document.getElementById("demoMetaRecipient");
        const metaAmount = document.getElementById("demoMetaAmount");
        const metaNewBalance = document.getElementById("demoMetaNewBalance");

        if (metaTxRef) metaTxRef.textContent = refCode;
        if (metaRecipient) metaRecipient.textContent = `${recipient.name} (${recipient.relation})`;
        if (metaAmount) metaAmount.textContent = `-${amount} Points`;
        if (metaNewBalance) metaNewBalance.textContent = `${finalBalance} Points`;

        if (statusBoxEl) statusBoxEl.style.display = "none";
        if (successViewEl) successViewEl.style.display = "block";

        if (btnCancel) btnCancel.style.display = "none";
        if (btnTransferAnother) btnTransferAnother.style.display = "inline-flex";
        if (btnFinish) btnFinish.style.display = "inline-flex";

        showToast("DEMO Transfer Successful! 🎉", `Transferred ${amount} points to ${recipient.name} (${recipient.relation}). Balance is now ${finalBalance} pts.`, "success");
    }, 2600));
}

function openPledgeModal(driveName) {
    const titleEl = document.getElementById("pledgeDriveTitle");
    if (titleEl) titleEl.textContent = driveName;
    openModal("pledgeModal");
}

function confirmPledge() {
    closeModal("pledgeModal");
    showToast("Camp Slot Reserved", "Slot reserved! Donating 1 unit at this camp will add 30 points.", "success");
}

function viewReceipt(txId) {
    const tx = appState.transactions.find(t => t.id === txId);
    if (!tx) return;

    alert(
        `LIFEFLOW RECEIPT\n` +
        `------------------------------------\n` +
        `Receipt ID     : ${tx.id}\n` +
        `Date           : ${tx.date}\n` +
        `Activity       : ${tx.activity}\n` +
        `Recipient/Rel  : ${tx.relation || 'Self'}\n` +
        `Hospital/Pharma: ${tx.facility}\n` +
        `Units / Volume : ${tx.units}\n` +
        `Points Change  : ${tx.change > 0 ? '+' : ''}${tx.change} Points\n` +
        `New Balance    : ${tx.balanceAfter} Points\n` +
        `Reference      : ${tx.ref || 'N/A'}\n` +
        `------------------------------------`
    );
}

function printPass() {
    window.print();
}

function setTableFilter(type, btnElement) {
    currentTableFilter = type;
    document.querySelectorAll(".table-tabs .tab-btn").forEach(btn => btn.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
    renderTransactionsTable(getFilteredTransactions());
}

function exportTransactionsCSV() {
    const transactions = appState.transactions;
    if (!transactions || transactions.length === 0) {
        showToast("No Data", "No transactions available.", "danger");
        return;
    }

    const headers = ["Date", "Activity", "Recipient / Relation", "Facility", "Blood Group", "Units", "Previous Points", "Points Change", "Balance", "Status", "Reference"];
    const rows = transactions.map(t => [
        `"${t.date}"`,
        `"${t.activity}"`,
        `"${t.relation || 'Self'}"`,
        `"${t.facility}"`,
        t.bloodGroup,
        `"${t.units}"`,
        t.previousBalance,
        t.change,
        t.balanceAfter,
        t.status,
        t.ref || ""
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LifeFlow_Credit_Statement_${appState.donor.donorId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Downloaded", "Credit statement downloaded.", "success");
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
}

function openDonateModal() {
    const dateInput = document.getElementById("donationDate");
    if (dateInput) dateInput.value = "2026-09-10";
    calculatePointsPreview();
    openModal('donateModal');
}

function openRedeemModal() {
    if (appState.donor.currentCredits < PERK_UNLOCK_THRESHOLD) {
        showToast("Perks Locked", `Perks unlock only after reaching 100 to 150 credit points. Current balance: ${appState.donor.currentCredits} points.`, "danger");
        return;
    }
    openModal('redeemModal');
}

function openTransferModal() {
    openModal('transferModal');
}

function openPassModal() {
    openModal('passModal');
}

function openContactCampModal(campName, phone, location, organizer) {
    const titleEl = document.getElementById("contactCampTitle");
    const locEl = document.getElementById("contactCampLocation");
    const orgEl = document.getElementById("contactCampOrganizer");
    const phoneEl = document.getElementById("contactCampPhone");
    const phoneLink = document.getElementById("campPhoneLink");
    const waLink = document.getElementById("campWhatsappLink");

    if (titleEl) titleEl.textContent = campName;
    if (locEl) locEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${location}`;
    if (orgEl) orgEl.innerHTML = `<i class="fa-solid fa-users"></i> ${organizer}`;
    if (phoneEl) phoneEl.textContent = phone;
    if (phoneLink) phoneLink.href = `tel:${phone.replace(/[^+\d]/g, '')}`;
    if (waLink) {
        const text = encodeURIComponent(`Hi, I would like to inquire about the ${campName} blood camp.`);
        waLink.href = `https://api.whatsapp.com/send?phone=${phone.replace(/[^+\d]/g, '').replace('+', '')}&text=${text}`;
    }
    const dirLink = document.getElementById("campDirectionsLink");
    if (dirLink) {
        dirLink.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(campName + ', ' + location)}`;
    }

    openModal('contactCampModal');
}

function handleCampInquirySubmit(e) {
    e.preventDefault();
    closeModal('contactCampModal');
    showToast("Inquiry Sent", "The camp coordination team has received your message and will contact you shortly.", "success");
}

function showToast(title, message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "fa-solid fa-circle-check";
    if (type === "danger") icon = "fa-solid fa-circle-exclamation";

    toast.innerHTML = `
        <i class="${icon} toast-icon"></i>
        <div class="toast-content">
            <h5>${title}</h5>
            <p>${message}</p>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function initDashboard() {
    loadState();
    renderDashboard();

    const searchInput = document.getElementById("tableSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderTransactionsTable(getFilteredTransactions());
        });
    }

    const topSearch = document.getElementById("topSearchInput");
    if (topSearch) {
        topSearch.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = topSearch.value.trim();
                if (query) {
                    const tableSearch = document.getElementById("tableSearchInput");
                    if (tableSearch) {
                        tableSearch.value = query;
                        window.location.hash = "#history";
                        renderTransactionsTable(getFilteredTransactions());
                    }
                }
            }
        });
    }

    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const closeBtn = document.getElementById("sidebarCloseBtn");
    const backdrop = document.getElementById("sidebarBackdrop");

    function openSidebar() {
        if (sidebar) sidebar.classList.add("open");
        if (backdrop) backdrop.classList.add("active");
        if (window.innerWidth <= 1024) {
            document.body.style.overflow = "hidden";
        }
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove("open");
        if (backdrop) backdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (toggleBtn) toggleBtn.addEventListener("click", openSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
    if (backdrop) backdrop.addEventListener("click", closeSidebar);

    // Auto-close sidebar on mobile/tablet when navigation items are clicked
    document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            closeSidebar();
        }
    });

    const notifBtn = document.getElementById("btnNotification");
    const notifDropdown = document.getElementById("notificationsDropdown");
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle("active");
        });
        document.addEventListener("click", () => {
            notifDropdown.classList.remove("active");
        });
    }

    const markAllReadBtn = document.getElementById("markAllRead");
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener("click", () => {
            const counter = document.getElementById("unreadNotifs");
            if (counter) counter.style.display = "none";
        });
    }

    document.getElementById("btnOpenDonateModal")?.addEventListener("click", openDonateModal);
    document.getElementById("btnOpenTransferModal")?.addEventListener("click", openTransferModal);
    document.getElementById("navOpenPass")?.addEventListener("click", openPassModal);
    document.getElementById("navResetDemo")?.addEventListener("click", resetDemoData);

    const userProfilePill = document.getElementById("userProfilePill");
    const userProfileDropdown = document.getElementById("userProfileDropdown");
    if (userProfilePill && userProfileDropdown) {
        userProfilePill.addEventListener("click", (e) => {
            e.stopPropagation();
            userProfileDropdown.classList.toggle("active");
            if (notifDropdown) notifDropdown.classList.remove("active");
        });
        document.addEventListener("click", (e) => {
            if (!userProfileDropdown.contains(e.target)) {
                userProfileDropdown.classList.remove("active");
            }
        });
    }

    const btnSignOutCredit = document.getElementById("btnSignOutCredit");
    if (btnSignOutCredit) {
        btnSignOutCredit.addEventListener("click", () => {
            try {
                localStorage.removeItem("lifeflow_authenticated");
                localStorage.removeItem("bloodlinkIsAuthenticated");
            } catch (e) {}
            window.location.replace("/index.html");
        });
    }

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.remove("active");
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay.active").forEach(modal => {
                modal.classList.remove("active");
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", initDashboard);
