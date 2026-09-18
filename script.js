/* ==========================================
   OT SENTINEL
   Industrial Cybersecurity Dashboard
   Pure HTML + CSS + JavaScript
========================================== */


/* ================= DATA ================= */

const assets = [

    {
        name: "PLC-07",
        type: "PLC",
        site: "Plant Alpha",
        zone: "Line A",
        criticality: "Critical",
        risk: 94,
        state: "Online",
        issues: 4
    },

    {
        name: "HMI-12",
        type: "HMI",
        site: "Plant Alpha",
        zone: "Line A",
        criticality: "High",
        risk: 82,
        state: "Online",
        issues: 3
    },

    {
        name: "ENG-03",
        type: "Engineering WS",
        site: "Plant Alpha",
        zone: "Operations",
        criticality: "High",
        risk: 76,
        state: "Online",
        issues: 2
    },

    {
        name: "HIST-01",
        type: "Historian",
        site: "Plant Alpha",
        zone: "Operations",
        criticality: "Critical",
        risk: 88,
        state: "Online",
        issues: 5
    },

    {
        name: "GW-02",
        type: "Gateway",
        site: "Plant Alpha",
        zone: "DMZ",
        criticality: "Medium",
        risk: 61,
        state: "Degraded",
        issues: 1
    },

    {
        name: "RTU-22",
        type: "RTU",
        site: "Plant Beta",
        zone: "Line B",
        criticality: "High",
        risk: 73,
        state: "Offline",
        issues: 2
    }

];


const findings = [

    {
        id: "F-1842",
        title: "Unrestricted engineering access",
        asset: "ENG-03",
        severity: "Critical",
        age: "18m",
        description:
            "Engineering workstation can reach a critical PLC across a trust boundary."
    },

    {
        id: "F-1839",
        title: "Legacy protocol exposure",
        asset: "PLC-07",
        severity: "High",
        age: "42m",
        description:
            "S7 communication is visible across an unexpected network segment."
    },

    {
        id: "F-1835",
        title: "Historian credential weakness",
        asset: "HIST-01",
        severity: "High",
        age: "1h",
        description:
            "A credential weakness increases the potential impact of compromise."
    },

    {
        id: "F-1828",
        title: "Visibility gap on gateway",
        asset: "GW-02",
        severity: "Medium",
        age: "3h",
        description:
            "Collection is delayed and some relationship data is incomplete."
    }

];


const timelineEvents = [

    {
        time: "09:42",
        type: "New finding",
        text: "Unrestricted engineering access",
        ref: "F-1842",
        severity: "critical"
    },

    {
        time: "09:18",
        type: "Risk elevated",
        text: "PLC-07 moved from 81 → 94",
        ref: "PLC-07",
        severity: "high"
    },

    {
        time: "08:57",
        type: "Asset state",
        text: "GW-02 collection degraded",
        ref: "GW-02",
        severity: "medium"
    },

    {
        time: "08:32",
        type: "New asset",
        text: "RTU-22 discovered at Plant Beta",
        ref: "RTU-22",
        severity: "info"
    },

    {
        time: "07:48",
        type: "Communication change",
        text: "ENG-03 → PLC-07 relationship observed",
        ref: "ENG-03",
        severity: "high"
    }

];


/* ================= PAGE NAVIGATION ================= */

const pages = document.querySelectorAll(".page");

const navButtons = document.querySelectorAll(".nav-btn[data-page]");

const pageTitle = document.getElementById("pageTitle");


function openPage(pageName) {

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    navButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === pageName) {

            button.classList.add("active");

        }

    });


    const titles = {

        dashboard: "Environment Overview",

        attack: "Attack Path Investigation",

        assets: "Asset Inventory",

        findings: "Security Findings",

        empty: "No Results"

    };


    pageTitle.textContent = titles[pageName] || "OT Sentinel";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.page);

    });

});


/* Cards and links that open pages */

document.querySelectorAll("[data-page-open]").forEach(element => {

    element.addEventListener("click", () => {

        const page = element.dataset.pageOpen;

        openPage(page);

    });

});


/* ================= TIMELINE ================= */

const timelineContainer =
    document.getElementById("timeline");


function renderTimeline() {

    timelineContainer.innerHTML = "";

    timelineEvents.forEach(event => {

        const item = document.createElement("div");

        item.className = "timeline-item";

        item.innerHTML = `

            <span class="timeline-time">
                ${event.time}
            </span>

            <i class="timeline-dot ${event.severity}"></i>

            <div class="timeline-main">

                <strong>
                    ${event.type}
                </strong>

                <span>
                    ${event.text}
                </span>

            </div>

            <span class="timeline-ref">
                ${event.ref}
            </span>

        `;

        timelineContainer.appendChild(item);

    });

}


renderTimeline();


/* ================= FILTERING ================= */

const siteFilter =
    document.getElementById("siteFilter");

const zoneFilter =
    document.getElementById("zoneFilter");

const severityFilter =
    document.getElementById("severityFilter");

const globalSearch =
    document.getElementById("globalSearch");


function getFilteredAssets() {

    const site = siteFilter.value;

    const zone = zoneFilter.value;

    const severity = severityFilter.value;

    const search =
        globalSearch.value.toLowerCase().trim();


    return assets.filter(asset => {

        const siteMatch =
            site === "all" ||
            asset.site === site;


        const zoneMatch =
            zone === "all" ||
            asset.zone === zone;


        const severityMatch =
            severity === "all" ||
            asset.criticality === severity;


        const searchMatch =
            !search ||
            asset.name.toLowerCase().includes(search) ||
            asset.type.toLowerCase().includes(search) ||
            asset.site.toLowerCase().includes(search) ||
            asset.zone.toLowerCase().includes(search);


        return (
            siteMatch &&
            zoneMatch &&
            severityMatch &&
            searchMatch
        );

    });

}


function applyFilters() {

    const filtered = getFilteredAssets();


    renderAssetTable(filtered);


    const hasFilters =
        siteFilter.value !== "all" ||
        zoneFilter.value !== "all" ||
        severityFilter.value !== "all" ||
        globalSearch.value.trim() !== "";


    if (hasFilters && filtered.length === 0) {

        openPage("empty");

    }

}


siteFilter.addEventListener("change", applyFilters);

zoneFilter.addEventListener("change", applyFilters);

severityFilter.addEventListener("change", applyFilters);

globalSearch.addEventListener("input", applyFilters);


/* ================= CLEAR FILTERS ================= */

document
    .getElementById("clearFilters")
    .addEventListener("click", clearFilters);


document
    .getElementById("emptyClear")
    .addEventListener("click", clearFilters);


function clearFilters() {

    siteFilter.value = "all";

    zoneFilter.value = "all";

    severityFilter.value = "all";

    globalSearch.value = "";

    renderAssetTable(assets);

    openPage("dashboard");

    showToast("Filters cleared");

}


/* ================= ASSET TABLE ================= */

const assetTable =
    document.getElementById("assetTable");


const assetCount =
    document.getElementById("assetCount");


function renderAssetTable(data) {

    assetTable.innerHTML = "";


    assetCount.textContent =
        `${data.length} highlighted assets`;


    data.forEach(asset => {

        const row =
            document.createElement("tr");


        const severityClass =
            asset.criticality.toLowerCase();


        const stateClass =
            asset.state.toLowerCase();


        row.innerHTML = `

            <td>
                <span class="asset-name">
                    ${asset.name}
                </span>
            </td>

            <td>${asset.type}</td>

            <td>
                ${asset.site}
                <br>
                <small>${asset.zone}</small>
            </td>

            <td class="severity-${severityClass}">
                ${asset.criticality}
            </td>

            <td>
                <strong>
                    ${asset.risk}
                </strong>
            </td>

            <td class="state-${stateClass}">
                ${asset.state}
            </td>

            <td>
                ${asset.issues}
            </td>

        `;


        row.addEventListener("click", () => {

            openPage("attack");

            selectGraphNode(asset.name);

        });


        assetTable.appendChild(row);

    });

}


renderAssetTable(assets);


/* ================= FINDINGS ================= */

const findingContainer =
    document.getElementById("findingCards");


function renderFindings() {

    findingContainer.innerHTML = "";


    findings.forEach(finding => {

        const card =
            document.createElement("article");


        card.className = "finding-card";


        card.innerHTML = `

            <div class="finding-top">

                <span class="finding-id">
                    ${finding.id}
                </span>

                <span class="
                    finding-severity
                    ${finding.severity.toLowerCase()}
                ">
                    ${finding.severity}
                </span>

            </div>


            <h3>
                ${finding.title}
            </h3>


            <p>
                ${finding.description}
            </p>


            <div class="finding-meta">

                <span>
                    Asset: <strong>
                        ${finding.asset}
                    </strong>
                </span>

                <span>
                    ${finding.age}
                </span>

            </div>

        `;


        card.addEventListener("click", () => {

            openPage("attack");

            selectGraphNode(finding.asset);

        });


        findingContainer.appendChild(card);

    });

}


renderFindings();


/* ================= ACKNOWLEDGE ================= */

document
    .getElementById("ackAll")
    .addEventListener("click", () => {

        showToast(
            "Visible findings acknowledged"
        );

    });


document
    .getElementById("allEvents")
    .addEventListener("click", () => {

        openPage("findings");

    });


/* ================= ATTACK GRAPH ================= */

const graphNodes =
    document.querySelectorAll(".graph-node");


const investigation =
    document.getElementById("investigationContent");


const closePanel =
    document.getElementById("closePanel");


const nodeDetails = {

    "ENG-03": {

        role: "SOURCE",

        type: "Engineering Workstation",

        zone: "Operations",

        criticality: "High",

        risk: 76,

        confidence: 96,

        state: "Online",

        why:
            "This workstation is the observed starting point for a high-risk movement path.",

        evidence:
            "RDP communication to HMI-12 was observed across the expected trust boundary.",

        vulnerabilities:
            [
                "Unrestricted engineering access",
                "Remote administration exposure"
            ],

        recommendation:
            "Review engineering workstation access controls and restrict unnecessary remote access."

    },


    "GW-02": {

        role: "PIVOT",

        type: "Gateway",

        zone: "DMZ",

        criticality: "Medium",

        risk: 61,

        confidence: 87,

        state: "Degraded",

        why:
            "GW-02 can provide a route between the operations environment and the control zone.",

        evidence:
            "HTTPS relationship observed between ENG-03 and GW-02. Collection is currently degraded.",

        vulnerabilities:
            [
                "Incomplete relationship evidence",
                "Visibility gap"
            ],

        recommendation:
            "Restore collection health before treating all observed relationships as complete."

    },


    "HMI-12": {

        role: "PIVOT",

        type: "Human Machine Interface",

        zone: "Line A",

        criticality: "High",

        risk: 82,

        confidence: 96,

        state: "Online",

        why:
            "HMI-12 is a reachable intermediate asset with access to the critical PLC.",

        evidence:
            "RDP access from ENG-03 followed by S7 communication to PLC-07.",

        vulnerabilities:
            [
                "Remote access exposure",
                "Cross-zone communication"
            ],

        recommendation:
            "Validate whether RDP access is operationally required and restrict unnecessary paths."

    },


    "PLC-07": {

        role: "TARGET",

        type: "Programmable Logic Controller",

        zone: "Line A",

        criticality: "Critical",

        risk: 94,

        confidence: 98,

        state: "Online",

        why:
            "PLC-07 is a critical control asset and the highest-risk target in the selected path.",

        evidence:
            "S7 communication from HMI-12 to PLC-07 was observed with high confidence.",

        vulnerabilities:
            [
                "Legacy protocol exposure",
                "Cross-zone reachability"
            ],

        recommendation:
            "Investigate the path immediately and validate whether the communication is required for operations."

    },


    "HIST-01": {

        role: "TARGET",

        type: "Historian",

        zone: "Operations",

        criticality: "Critical",

        risk: 88,

        confidence: 84,

        state: "Online",

        why:
            "HIST-01 stores operational information and is reachable from PLC-07.",

        evidence:
            "HTTPS relationship observed between PLC-07 and HIST-01.",

        vulnerabilities:
            [
                "Credential weakness",
                "Critical asset exposure"
            ],

        recommendation:
            "Review credentials and validate the required communication path."

    }

};


graphNodes.forEach(node => {

    node.addEventListener("click", () => {

        const asset =
            node.dataset.asset;

        selectGraphNode(asset);

    });

});


function selectGraphNode(assetName) {

    graphNodes.forEach(node => {

        node.classList.remove("selected");

        if (node.dataset.asset === assetName) {

            node.classList.add("selected");

        }

    });


    const detail =
        nodeDetails[assetName];


    if (!detail) return;


    investigation.innerHTML = `

        <div class="detail-kicker">
            ${detail.role}
        </div>

        <h2 class="detail-title">
            ${assetName}
        </h2>

        <div class="detail-sub">
            ${detail.type} · ${detail.zone}
        </div>


        <div class="score-grid">

            <div class="score">

                <small>RISK</small>

                <strong class="red">
                    ${detail.risk}
                </strong>

            </div>


            <div class="score">

                <small>CONFIDENCE</small>

                <strong>
                    ${detail.confidence}%
                </strong>

            </div>

        </div>


        <div class="detail-section">

            <h4>Asset context</h4>

            <p>
                <strong>Criticality:</strong>
                ${detail.criticality}
            </p>

            <p>
                <strong>Operational state:</strong>
                ${detail.state}
            </p>

        </div>


        <div class="detail-section">

            <h4>Why it matters</h4>

            <p>
                ${detail.why}
            </p>

        </div>


        <div class="detail-section">

            <h4>Supporting evidence</h4>

            <div class="evidence">

                <strong>
                    Observed relationship
                </strong>

                <span>
                    ${detail.evidence}
                </span>

            </div>

        </div>


        <div class="detail-section">

            <h4>Relevant weaknesses</h4>

            <ul>

                ${detail.vulnerabilities
                    .map(item => `<li>${item}</li>`)
                    .join("")}

            </ul>

        </div>


        <div class="detail-section">

            <h4>Recommended investigation</h4>

            <div class="recommendation">

                <strong>
                    Suggested next step
                </strong>

                <p>
                    ${detail.recommendation}
                </p>

            </div>

        </div>

    `;

}


/* ================= CLOSE PANEL ================= */

closePanel.addEventListener("click", () => {

    graphNodes.forEach(node => {

        node.classList.remove("selected");

    });


    investigation.innerHTML = `

        <div class="empty-investigation">

            <div class="large-icon">
                ⌁
            </div>

            <h3>Select a node</h3>

            <p>
                Select a source, pivot or target to
                investigate its security context.
            </p>

        </div>

    `;

});


/* ================= GRAPH SEARCH ================= */

const graphSearch =
    document.getElementById("graphSearch");


graphSearch.addEventListener("input", () => {

    const value =
        graphSearch.value.toLowerCase().trim();


    graphNodes.forEach(node => {

        const name =
            node.dataset.asset.toLowerCase();


        if (!value || name.includes(value)) {

            node.style.opacity = "1";

        } else {

            node.style.opacity = ".18";

        }

    });

});


/* ================= GRAPH ZOOM ================= */

const graph =
    document.getElementById("graph");


let zoom = 1;


function updateZoom() {

    graph.style.transform =
        `scale(${zoom})`;

    graph.style.transformOrigin =
        "center center";

}


document
    .getElementById("zoomIn")
    .addEventListener("click", () => {

        zoom += .1;

        if (zoom > 1.5) zoom = 1.5;

        updateZoom();

    });


document
    .getElementById("zoomOut")
    .addEventListener("click", () => {

        zoom -= .1;

        if (zoom < .7) zoom = .7;

        updateZoom();

    });


document
    .getElementById("resetZoom")
    .addEventListener("click", () => {

        zoom = 1;

        updateZoom();

    });


document
    .getElementById("fitView")
    .addEventListener("click", () => {

        zoom = 1;

        updateZoom();

        showToast("Graph fitted to view");

    });


/* ================= BLAST RADIUS ================= */

document
    .getElementById("blastRadius")
    .addEventListener("click", function () {

        const label =
            document.getElementById("blastLabel");


        label.classList.toggle("hidden");


        if (
            !label.classList.contains("hidden")
        ) {

            this.textContent =
                "Hide blast radius";

            showToast(
                "Reachable asset analysis enabled"
            );

        } else {

            this.textContent =
                "Show blast radius";

        }

    });


/* ================= PATH MODE ================= */

document
    .querySelectorAll(".segment")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".segment")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            button.classList.add("active");


            if (
                button.textContent.includes("Multi")
            ) {

                showToast(
                    "Multi-path view enabled"
                );

            } else {

                showToast(
                    "Single-path view enabled"
                );

            }

        });

    });


/* ================= TOAST ================= */

const toast =
    document.getElementById("toast");


let toastTimer;


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}


/* ================= KEYBOARD ================= */

document.addEventListener("keydown", event => {

    /* Press "/" to focus search */

    if (
        event.key === "/" &&
        document.activeElement.tagName !== "INPUT"
    ) {

        event.preventDefault();

        globalSearch.focus();

    }


    /* Escape closes investigation */

    if (event.key === "Escape") {

        closePanel.click();

    }

});


/* ================= INITIAL ================= */

openPage("dashboard");

console.log(
    "OT Sentinel loaded successfully."
);