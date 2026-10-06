/* =====================================================
   TASKFLOW
   Task Management System
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let managers =
    JSON.parse(localStorage.getItem("managers")) || [];

let candidates =
    JSON.parse(localStorage.getItem("candidates")) || [];

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


/* =====================================================
   APP STATE
===================================================== */

let currentRole = "";

let currentUser = null;

let selectedCandidate = null;

let authMode = "login";

let currentFilter = "all";


/* =====================================================
   STORAGE HELPER
===================================================== */

function saveData() {

    localStorage.setItem(
        "managers",
        JSON.stringify(managers)
    );

    localStorage.setItem(
        "candidates",
        JSON.stringify(candidates)
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


/* =====================================================
   ID GENERATOR
===================================================== */

function generateId() {

    return Date.now().toString() +
        Math.random().toString(36).substring(2, 8);
}


/* =====================================================
   ROOM CODE
===================================================== */

function generateRoomCode() {

    let code;

    do {

        const randomPart =
            Math.random()
                .toString(36)
                .substring(2, 7)
                .toUpperCase();

        code = "ROOM-" + randomPart;

    } while (
        managers.some(
            manager => manager.roomCode === code
        )
    );

    return code;
}


/* =====================================================
   ELEMENT HELPERS
===================================================== */

function showElement(id) {

    document.getElementById(id)
        .classList.remove("hidden");
}


function hideElement(id) {

    document.getElementById(id)
        .classList.add("hidden");
}


/* =====================================================
   ROLE SELECTION
===================================================== */

function selectRole(role) {

    currentRole = role;

    hideElement("roleSection");

    showElement("authSection");

    document.getElementById("authRoleLabel")
        .textContent =
        role === "manager"
            ? "Manager"
            : "Candidate";

    switchAuthMode("login");
}


/* =====================================================
   BACK TO ROLE PAGE
===================================================== */

function goBackToRoles() {

    currentRole = "";

    hideElement("authSection");

    showElement("roleSection");

    clearAuthForms();
}


/* =====================================================
   AUTH MODE
===================================================== */

function switchAuthMode(mode) {

    authMode = mode;

    const loginTab =
        document.getElementById("loginTab");

    const registerTab =
        document.getElementById("registerTab");

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");


    if (mode === "login") {

        loginTab.classList.add("active");

        registerTab.classList.remove("active");

        loginForm.classList.remove("hidden");

        registerForm.classList.add("hidden");

    } else {

        loginTab.classList.remove("active");

        registerTab.classList.add("active");

        loginForm.classList.add("hidden");

        registerForm.classList.remove("hidden");

    }


    updateRegistrationFields();
}


/* =====================================================
   REGISTRATION FIELD DISPLAY
===================================================== */

function updateRegistrationFields() {

    const managerRoomPreview =
        document.getElementById(
            "managerRoomPreview"
        );

    const candidateRoomInput =
        document.getElementById(
            "candidateRoomInput"
        );


    if (currentRole === "manager") {

        managerRoomPreview.classList.remove(
            "hidden"
        );

        candidateRoomInput.classList.add(
            "hidden"
        );

    } else {

        managerRoomPreview.classList.add(
            "hidden"
        );

        candidateRoomInput.classList.remove(
            "hidden"
        );

    }
}


/* =====================================================
   REGISTER
===================================================== */

function handleRegister(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "registerName"
        ).value.trim();

    const username =
        document.getElementById(
            "registerUsername"
        ).value.trim();

    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    if (
        !name ||
        !username ||
        !email ||
        !password
    ) {

        alert(
            "Please fill in all required fields."
        );

        return;
    }


    /* =========================
       MANAGER REGISTRATION
    ========================== */

    if (currentRole === "manager") {

        const usernameExists =
            managers.some(
                manager =>
                    manager.username.toLowerCase() ===
                    username.toLowerCase()
            );


        if (usernameExists) {

            alert(
                "This Manager username already exists."
            );

            return;
        }


        const emailExists =
            managers.some(
                manager =>
                    manager.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (emailExists) {

            alert(
                "This Manager email is already registered."
            );

            return;
        }


        const roomCode =
            generateRoomCode();


        const newManager = {

            id: generateId(),

            name: name,

            username: username,

            email: email,

            password: password,

            roomCode: roomCode

        };


        managers.push(newManager);

        saveData();


        alert(
            "Manager account created successfully!\n\n" +
            "Your Room Code is:\n" +
            roomCode +
            "\n\nShare this code with your candidates."
        );


        document.getElementById(
            "loginUsername"
        ).value = username;


        document.getElementById(
            "loginPassword"
        ).value = "";


        switchAuthMode("login");

        return;
    }


    /* =========================
       CANDIDATE REGISTRATION
    ========================== */

    const roomCodeInput =
        document.getElementById(
            "registerRoomCode"
        ).value.trim().toUpperCase();


    if (!roomCodeInput) {

        alert(
            "Please enter the Room Code provided by your Manager."
        );

        return;
    }


    const roomExists =
        managers.some(
            manager =>
                manager.roomCode ===
                roomCodeInput
        );


    if (!roomExists) {

        alert(
            "Invalid Room Code.\n\nPlease check the code with your Manager."
        );

        return;
    }


    const usernameExists =
        candidates.some(
            candidate =>
                candidate.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (usernameExists) {

        alert(
            "This Candidate username already exists."
        );

        return;
    }


    const emailExists =
        candidates.some(
            candidate =>
                candidate.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (emailExists) {

        alert(
            "This Candidate email is already registered."
        );

        return;
    }


    const newCandidate = {

        id: generateId(),

        name: name,

        username: username,

        email: email,

        password: password,

        roomCode: roomCodeInput

    };


    candidates.push(newCandidate);

    saveData();


    alert(
        "Candidate account created successfully!"
    );


    document.getElementById(
        "loginUsername"
    ).value = username;


    document.getElementById(
        "loginPassword"
    ).value = "";


    switchAuthMode("login");
}


/* =====================================================
   LOGIN
===================================================== */

function handleLogin(event) {

    event.preventDefault();


    const username =
        document.getElementById(
            "loginUsername"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    if (currentRole === "manager") {

        const manager =
            managers.find(
                item =>
                    item.username.toLowerCase() ===
                    username.toLowerCase() &&
                    item.password === password
            );


        if (!manager) {

            alert(
                "Invalid Manager username or password."
            );

            return;
        }


        currentUser = manager;

        openManagerDashboard();

    } else {

        const candidate =
            candidates.find(
                item =>
                    item.username.toLowerCase() ===
                    username.toLowerCase() &&
                    item.password === password
            );


        if (!candidate) {

            alert(
                "Invalid Candidate username or password."
            );

            return;
        }


        currentUser = candidate;

        openCandidateDashboard();
    }
}


/* =====================================================
   MANAGER DASHBOARD
===================================================== */

function openManagerDashboard() {

    hideElement("roleSection");

    hideElement("authSection");

    hideElement("candidateDashboard");

    showElement("managerDashboard");


    document.getElementById(
        "managerWelcome"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "managerRoomCode"
    ).textContent =
        currentUser.roomCode;


    selectedCandidate = null;


    updateManagerDashboard();

    populateCandidateDropdown();
}


/* =====================================================
   UPDATE MANAGER DASHBOARD
===================================================== */

function updateManagerDashboard() {

    const myCandidates =
        candidates.filter(
            candidate =>
                candidate.roomCode ===
                currentUser.roomCode
        );


    const roomTasks =
        tasks.filter(
            task =>
                task.roomCode ===
                currentUser.roomCode
        );


    let completedCount = 0;

    let pendingCount = 0;


    roomTasks.forEach(task => {

        if (
            task.assignmentType ===
            "room"
        ) {

            myCandidates.forEach(candidate => {

                if (
                    task.completedBy &&
                    task.completedBy.includes(
                        candidate.id
                    )
                ) {

                    completedCount++;

                } else {

                    pendingCount++;

                }

            });

        } else {

            if (
                task.completedBy &&
                task.completedBy.includes(
                    task.candidateId
                )
            ) {

                completedCount++;

            } else {

                pendingCount++;

            }

        }

    });


    document.getElementById(
        "managerMemberCount"
    ).textContent =
        myCandidates.length;


    document.getElementById(
        "managerTaskCount"
    ).textContent =
        roomTasks.length;


    document.getElementById(
        "managerCompletedCount"
    ).textContent =
        completedCount;


    document.getElementById(
        "managerPendingCount"
    ).textContent =
        pendingCount;


    renderCandidateList(
        myCandidates
    );


    if (selectedCandidate) {

        const stillExists =
            myCandidates.some(
                candidate =>
                    candidate.id ===
                    selectedCandidate.id
            );


        if (stillExists) {

            renderCandidateDetails(
                selectedCandidate
            );

        } else {

            selectedCandidate = null;

            showEmptyCandidateDetails();
        }

    }
}


/* =====================================================
   CANDIDATE LIST
===================================================== */

function renderCandidateList(
    myCandidates
) {

    const container =
        document.getElementById(
            "candidateList"
        );


    container.innerHTML = "";


    if (myCandidates.length === 0) {

        container.innerHTML = `

            <div class="task-empty">

                <div class="task-empty-icon">
                    👥
                </div>

                <h3>
                    No candidates yet
                </h3>

                <p>
                    Share your Room Code with candidates
                    so they can join your workspace.
                </p>

            </div>

        `;

        return;
    }


    myCandidates.forEach(candidate => {

        const button =
            document.createElement("button");


        button.className =
            "candidate-item";


        if (
            selectedCandidate &&
            selectedCandidate.id ===
            candidate.id
        ) {

            button.classList.add("active");
        }


        const initials =
            getInitials(candidate.name);


        button.innerHTML = `

            <div class="candidate-avatar">
                ${initials}
            </div>

            <div class="candidate-item-info">

                <strong>
                    ${escapeHTML(candidate.name)}
                </strong>

                <span>
                    @${escapeHTML(candidate.username)}
                </span>

            </div>

        `;


        button.onclick = function () {

            selectedCandidate = candidate;

            renderCandidateList(
                myCandidates
            );

            renderCandidateDetails(
                candidate
            );

        };


        container.appendChild(button);

    });
}


/* =====================================================
   CANDIDATE DETAILS
===================================================== */

function renderCandidateDetails(
    candidate
) {

    const container =
        document.getElementById(
            "candidateDetails"
        );


    const candidateTasks =
        tasks.filter(
            task =>
                task.roomCode ===
                currentUser.roomCode &&

                (
                    task.assignmentType ===
                    "room" ||

                    task.candidateId ===
                    candidate.id
                )
        );


    let completed = 0;


    candidateTasks.forEach(task => {

        if (
            task.completedBy &&
            task.completedBy.includes(
                candidate.id
            )
        ) {

            completed++;

        }

    });


    const progress =
        candidateTasks.length === 0
            ? 0
            : Math.round(
                (completed /
                    candidateTasks.length) *
                100
            );


    const initials =
        getInitials(candidate.name);


    let taskHTML = "";


    if (candidateTasks.length === 0) {

        taskHTML = `

            <div class="task-empty">

                <div class="task-empty-icon">
                    📋
                </div>

                <h3>
                    No tasks assigned
                </h3>

                <p>
                    This candidate does not have
                    any tasks yet.
                </p>

            </div>

        `;

    } else {

        candidateTasks.forEach(task => {

            const isCompleted =
                task.completedBy &&
                task.completedBy.includes(
                    candidate.id
                );


            taskHTML += `

                <div class="detail-task">

                    <div>

                        <div class="detail-task-title">
                            ${escapeHTML(task.title)}
                        </div>

                        <div class="detail-task-type">
                            ${
                                task.assignmentType ===
                                "room"
                                    ? "Whole Room"
                                    : "Specific Candidate"
                            }
                        </div>

                    </div>

                    <span class="
                        status-badge
                        ${
                            isCompleted
                                ? "status-completed"
                                : "status-pending"
                        }
                    ">

                        ${
                            isCompleted
                                ? "Completed"
                                : "Pending"
                        }

                    </span>

                </div>

            `;

        });

    }


    container.className =
        "candidate-details";


    container.innerHTML = `

        <div class="profile-header">

            <div class="large-avatar">
                ${initials}
            </div>

            <div>

                <h3>
                    ${escapeHTML(candidate.name)}
                </h3>

                <p>
                    ${escapeHTML(candidate.email)}
                </p>

            </div>

        </div>


        <div class="progress-section">

            <div class="progress-top">

                <span>
                    Task Progress
                </span>

                <strong>
                    ${progress}%
                </strong>

            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>

        </div>


        <div class="detail-task-list">

            ${taskHTML}

        </div>

    `;
}


/* =====================================================
   EMPTY CANDIDATE DETAILS
===================================================== */

function showEmptyCandidateDetails() {

    const container =
        document.getElementById(
            "candidateDetails"
        );


    container.className =
        "candidate-details empty-state";


    container.innerHTML = `

        <div class="empty-icon">
            👤
        </div>

        <h3>
            Select a candidate
        </h3>

        <p>
            Choose a team member to view their
            tasks and progress.
        </p>

    `;
}


/* =====================================================
   POPULATE TASK CANDIDATE DROPDOWN
===================================================== */

function populateCandidateDropdown() {

    const select =
        document.getElementById(
            "taskCandidate"
        );


    select.innerHTML = `

        <option value="">
            Select a candidate
        </option>

    `;


    const myCandidates =
        candidates.filter(
            candidate =>
                candidate.roomCode ===
                currentUser.roomCode
        );


    myCandidates.forEach(candidate => {

        const option =
            document.createElement("option");


        option.value =
            candidate.id;


        option.textContent =
            candidate.name;


        select.appendChild(option);

    });
}


/* =====================================================
   ASSIGNMENT TYPE TOGGLE
===================================================== */

function toggleCandidateAssignment() {

    const assignmentType =
        document.getElementById(
            "assignmentType"
        ).value;


    const candidateGroup =
        document.getElementById(
            "candidateAssignmentGroup"
        );


    if (assignmentType === "candidate") {

        candidateGroup.classList.remove(
            "hidden"
        );

    } else {

        candidateGroup.classList.add(
            "hidden"
        );

    }
}


/* =====================================================
   CREATE TASK
===================================================== */

function createTask(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "taskTitle"
        ).value.trim();

    const description =
        document.getElementById(
            "taskDescription"
        ).value.trim();

    const date =
        document.getElementById(
            "taskDate"
        ).value;

    const time =
        document.getElementById(
            "taskTime"
        ).value;

    const priority =
        document.getElementById(
            "taskPriority"
        ).value;

    const assignmentType =
        document.getElementById(
            "assignmentType"
        ).value;

    const candidateId =
        document.getElementById(
            "taskCandidate"
        ).value;


    if (!title) {

        alert(
            "Please enter a task title."
        );

        return;
    }


    if (
        assignmentType ===
        "candidate" &&
        !candidateId
    ) {

        alert(
            "Please select a candidate."
        );

        return;
    }


    const newTask = {

        id: generateId(),

        roomCode:
            currentUser.roomCode,

        title:
            title,

        description:
            description,

        date:
            date,

        time:
            time,

        priority:
            priority,

        assignmentType:
            assignmentType,

        candidateId:
            assignmentType === "candidate"
                ? candidateId
                : null,

        completedBy: [],

        createdBy:
            currentUser.id,

        createdAt:
            new Date().toISOString()

    };


    tasks.push(newTask);

    saveData();


    alert(
        assignmentType === "room"
            ? "Task assigned to the whole room!"
            : "Task assigned successfully!"
    );


    document.getElementById(
        "taskForm"
    ).reset();


    document.getElementById(
        "assignmentType"
    ).value = "room";


    toggleCandidateAssignment();


    updateManagerDashboard();

    populateCandidateDropdown();

    if (selectedCandidate) {

        renderCandidateDetails(
            selectedCandidate
        );

    }
}


/* =====================================================
   CANDIDATE DASHBOARD
===================================================== */

function openCandidateDashboard() {

    hideElement("roleSection");

    hideElement("authSection");

    hideElement("managerDashboard");

    showElement("candidateDashboard");


    document.getElementById(
        "candidateWelcome"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "candidateRoomCode"
    ).textContent =
        currentUser.roomCode;


    currentFilter = "all";


    updateCandidateDashboard();

    renderCandidateTasks();
}


/* =====================================================
   GET CANDIDATE TASKS
===================================================== */

function getMyCandidateTasks() {

    return tasks.filter(
        task =>

            task.roomCode ===
            currentUser.roomCode &&

            (
                task.assignmentType ===
                "room" ||

                task.candidateId ===
                currentUser.id
            )
    );
}


/* =====================================================
   UPDATE CANDIDATE DASHBOARD
===================================================== */

function updateCandidateDashboard() {

    const myTasks =
        getMyCandidateTasks();


    const completedTasks =
        myTasks.filter(
            task =>
                task.completedBy &&
                task.completedBy.includes(
                    currentUser.id
                )
        );


    const pendingTasks =
        myTasks.filter(
            task =>
                !task.completedBy ||
                !task.completedBy.includes(
                    currentUser.id
                )
        );


    const progress =
        myTasks.length === 0
            ? 0
            : Math.round(
                (
                    completedTasks.length /
                    myTasks.length
                ) * 100
            );


    document.getElementById(
        "candidateTaskCount"
    ).textContent =
        myTasks.length;


    document.getElementById(
        "candidatePendingCount"
    ).textContent =
        pendingTasks.length;


    document.getElementById(
        "candidateCompletedCount"
    ).textContent =
        completedTasks.length;


    document.getElementById(
        "candidateProgress"
    ).textContent =
        progress + "%";
}


/* =====================================================
   CANDIDATE TASK FILTER
===================================================== */

function filterCandidateTasks(
    filter,
    button
) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter-button")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    renderCandidateTasks();
}


/* =====================================================
   RENDER CANDIDATE TASKS
===================================================== */

function renderCandidateTasks() {

    const container =
        document.getElementById(
            "candidateTaskList"
        );


    let myTasks =
        getMyCandidateTasks();


    if (currentFilter === "completed") {

        myTasks =
            myTasks.filter(
                task =>
                    task.completedBy &&
                    task.completedBy.includes(
                        currentUser.id
                    )
            );

    }


    if (currentFilter === "pending") {

        myTasks =
            myTasks.filter(
                task =>
                    !task.completedBy ||
                    !task.completedBy.includes(
                        currentUser.id
                    )
            );

    }


    container.innerHTML = "";


    if (myTasks.length === 0) {

        container.innerHTML = `

            <div class="task-empty">

                <div class="task-empty-icon">
                    📋
                </div>

                <h3>
                    No tasks here
                </h3>

                <p>
                    ${
                        currentFilter === "completed"
                            ? "You haven't completed any tasks yet."
                            : currentFilter === "pending"
                                ? "You have no pending tasks."
                                : "No tasks have been assigned to you yet."
                    }
                </p>

            </div>

        `;

        return;
    }


    myTasks.forEach(task => {

        const isCompleted =
            task.completedBy &&
            task.completedBy.includes(
                currentUser.id
            );


        const card =
            document.createElement("div");


        card.className =
            "task-card" +
            (isCompleted
                ? " completed"
                : "");


        let deadline = "No deadline";


        if (task.date) {

            deadline =
                formatDate(task.date);

        }


        if (task.time) {

            deadline +=
                " • " +
                formatTime(task.time);

        }


        const priorityClass =
            task.priority.toLowerCase();


        card.innerHTML = `

            <div class="task-card-top">

                <h3>
                    ${escapeHTML(task.title)}
                </h3>

                <span class="
                    status-badge
                    ${
                        isCompleted
                            ? "status-completed"
                            : "status-pending"
                    }
                ">

                    ${
                        isCompleted
                            ? "Completed"
                            : "Pending"
                    }

                </span>

            </div>


            ${
                task.description
                    ? `
                        <p class="task-description">
                            ${escapeHTML(
                                task.description
                            )}
                        </p>
                      `
                    : ""
            }


            <div class="task-meta">

                <span class="
                    priority
                    priority-${priorityClass}
                ">
                    ${escapeHTML(task.priority)}
                </span>


                <span>
                    📅 ${deadline}
                </span>


                <span class="assignment-badge">

                    ${
                        task.assignmentType ===
                        "room"
                            ? "Whole Room"
                            : "Personal Task"
                    }

                </span>

            </div>


            ${
                isCompleted

                    ? `
                        <button
                            class="completed-button"
                            disabled
                        >
                            ✓ Task Completed
                        </button>
                      `

                    : `
                        <button
                            class="complete-button"
                            onclick="completeTask('${task.id}')"
                        >
                            Mark as Complete
                        </button>
                      `
            }

        `;


        container.appendChild(card);

    });
}


/* =====================================================
   COMPLETE TASK
===================================================== */

function completeTask(taskId) {

    const task =
        tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {

        alert(
            "Task could not be found."
        );

        return;
    }


    if (!task.completedBy) {

        task.completedBy = [];

    }


    if (
        !task.completedBy.includes(
            currentUser.id
        )
    ) {

        task.completedBy.push(
            currentUser.id
        );

    }


    saveData();


    updateCandidateDashboard();

    renderCandidateTasks();
}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    currentUser = null;

    currentRole = "";

    selectedCandidate = null;

    currentFilter = "all";


    hideElement("managerDashboard");

    hideElement("candidateDashboard");

    hideElement("authSection");

    showElement("roleSection");


    clearAuthForms();
}


/* =====================================================
   CLEAR AUTH FORMS
===================================================== */

function clearAuthForms() {

    const forms =
        document.querySelectorAll(
            "#authSection form"
        );


    forms.forEach(form => {

        form.reset();

    });


    switchAuthMode("login");
}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "No date";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =====================================================
   TIME FORMAT
===================================================== */

function formatTime(timeString) {

    if (!timeString) {

        return "";

    }


    const [hours, minutes] =
        timeString.split(":");


    const date =
        new Date();


    date.setHours(
        Number(hours),
        Number(minutes)
    );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* =====================================================
   INITIALS
===================================================== */

function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0).toUpperCase()
        )
        .join("");
}


/* =====================================================
   BASIC HTML ESCAPING
===================================================== */

function escapeHTML(value) {

    if (!value) {
        return "";
    }


    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   INITIAL PAGE SETUP
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        hideElement("authSection");

        hideElement("managerDashboard");

        hideElement("candidateDashboard");

        showElement("roleSection");

        updateRegistrationFields();

    }
);