/* =====================================================
   STUDYHQ
   COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   DATA
===================================================== */

let modules =
    JSON.parse(localStorage.getItem("studyHQModules")) || [];

let tasks =
    JSON.parse(localStorage.getItem("studyHQTasks")) || [];

let studySessions =
    JSON.parse(localStorage.getItem("studyHQStudySessions")) || [];


/* =====================================================
   SETTINGS
===================================================== */

let studyHQSettings =
    JSON.parse(localStorage.getItem("studyHQSettings")) || {
        name: "Tsakelani",
        theme: "dark",
        studyMode: true,
        notifications: true,
        defaultDuration: "60"
    };


/* =====================================================
   ELEMENTS
===================================================== */

const moduleCodeInput =
    document.getElementById("moduleCodeInput");

const moduleNameInput =
    document.getElementById("moduleNameInput");

const addModuleButton =
    document.getElementById("addModuleButton");

const moduleList =
    document.getElementById("moduleList");


const taskInput =
    document.getElementById("taskInput");

const taskModuleSelect =
    document.getElementById("taskModuleSelect");

const taskDateInput =
    document.getElementById("taskDateInput");

const addTaskButton =
    document.getElementById("addTaskButton");

const taskList =
    document.getElementById("taskList");


const studyTopicInput =
    document.getElementById("studyTopicInput");

const studyModuleSelect =
    document.getElementById("studyModuleSelect");

const studyDateInput =
    document.getElementById("studyDateInput");

const studyTimeInput =
    document.getElementById("studyTimeInput");

const studyDurationSelect =
    document.getElementById("studyDurationSelect");

const addStudyButton =
    document.getElementById("addStudyButton");

const studySessionList =
    document.getElementById("studySessionList");


/* =====================================================
   SETTINGS ELEMENTS
===================================================== */

const settingsNameInput =
    document.getElementById("settingsNameInput");

const darkThemeButton =
    document.getElementById("darkThemeButton");

const lightThemeButton =
    document.getElementById("lightThemeButton");

const studyModeToggle =
    document.getElementById("studyModeToggle");

const notificationToggle =
    document.getElementById("notificationToggle");

const defaultDurationSelect =
    document.getElementById("defaultDurationSelect");

const clearTasksButton =
    document.getElementById("clearTasksButton");

const clearSessionsButton =
    document.getElementById("clearSessionsButton");

const resetStudyHQButton =
    document.getElementById("resetStudyHQButton");

const settingsSavedMessage =
    document.getElementById("settingsSavedMessage");


/* =====================================================
   CALENDAR ELEMENTS
===================================================== */

const calendarTodayDate =
    document.getElementById("calendarTodayDate");

const calendarTodayMessage =
    document.getElementById("calendarTodayMessage");

const todayScheduleList =
    document.getElementById("todayScheduleList");

const calendarTaskCount =
    document.getElementById("calendarTaskCount");

const calendarDeadlineCount =
    document.getElementById("calendarDeadlineCount");

const calendarStudyCount =
    document.getElementById("calendarStudyCount");

const calendarCompletedCount =
    document.getElementById("calendarCompletedCount");

const previousDayButton =
    document.getElementById("previousDayButton");

const todayButton =
    document.getElementById("todayButton");

const nextDayButton =
    document.getElementById("nextDayButton");


let calendarSelectedDate =
    new Date();


/* =====================================================
   SAVE DATA
===================================================== */

function saveModules() {

    localStorage.setItem(
        "studyHQModules",
        JSON.stringify(modules)
    );

}


function saveTasks() {

    localStorage.setItem(
        "studyHQTasks",
        JSON.stringify(tasks)
    );

}


function saveStudySessions() {

    localStorage.setItem(
        "studyHQStudySessions",
        JSON.stringify(studySessions)
    );

}


function saveSettings() {

    localStorage.setItem(
        "studyHQSettings",
        JSON.stringify(studyHQSettings)
    );

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   DATE HELPERS
===================================================== */

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getToday() {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;

}


function formatDate(dateString) {

    if (!dateString) {

        return "No deadline";

    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-ZA",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatCalendarDate(date) {

    return date.toLocaleDateString(
        "en-ZA",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


function isToday(date) {

    return (
        getDateKey(date) ===
        getDateKey(new Date())
    );

}


/* =====================================================
   DEADLINE STATUS
===================================================== */

function getDeadlineStatus(dateString) {

    if (!dateString) {

        return {
            text: "NO DATE",
            className: "status-upcoming"
        };

    }

    const today =
        getToday();

    const deadline =
        new Date(
            dateString + "T00:00:00"
        );

    const difference =
        Math.round(
            (
                deadline - today
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (difference < 0) {

        return {
            text: "OVERDUE",
            className: "status-overdue"
        };

    }


    if (difference === 0) {

        return {
            text: "DUE TODAY",
            className: "status-urgent"
        };

    }


    if (difference <= 2) {

        return {
            text: "URGENT",
            className: "status-urgent"
        };

    }


    if (difference <= 7) {

        return {
            text: "SOON",
            className: "status-soon"
        };

    }


    return {
        text: "UPCOMING",
        className: "status-upcoming"
    };

}


/* =====================================================
   MODULES
===================================================== */

function displayModules() {

    if (!moduleList) {
        return;
    }

    moduleList.innerHTML = "";


    if (modules.length === 0) {

        moduleList.innerHTML = `
            <div class="empty-modules">
                No modules added yet.
            </div>
        `;

        updateModuleSelects();

        return;

    }


    modules.forEach(function(module) {

        const moduleTasks =
            tasks.filter(function(task) {

                return task.moduleId === module.id;

            });


        const completed =
            moduleTasks.filter(function(task) {

                return task.completed;

            }).length;


        const percentage =
            moduleTasks.length === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        moduleTasks.length
                    ) * 100
                );


        const item =
            document.createElement("div");

        item.className =
            "module-item";


        item.innerHTML = `

            <div class="module-top">

                <div>

                    <div class="module-code">
                        ${escapeHTML(module.code)}
                    </div>

                    <div class="module-name">
                        ${escapeHTML(module.name)}
                    </div>

                </div>

                <button
                    class="delete-module"
                    data-id="${module.id}"
                    type="button"
                >
                    Delete
                </button>

            </div>


            <div class="module-stats">

                <span>
                    ${completed}/${moduleTasks.length}
                    tasks completed
                </span>

                <span>
                    ${percentage}%
                </span>

            </div>


            <div class="module-progress">

                <div
                    class="module-progress-fill"
                    style="width:${percentage}%"
                ></div>

            </div>

        `;


        moduleList.appendChild(item);

    });


    document
        .querySelectorAll(".delete-module")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const moduleId =
                        button.dataset.id;


                    const module =
                        modules.find(function(item) {

                            return item.id === moduleId;

                        });


                    if (!module) {
                        return;
                    }


                    const confirmed =
                        confirm(
                            `Delete ${module.code} and all its tasks?`
                        );


                    if (!confirmed) {
                        return;
                    }


                    tasks =
                        tasks.filter(function(task) {

                            return task.moduleId !== moduleId;

                        });


                    studySessions =
                        studySessions.filter(function(session) {

                            return session.moduleId !== moduleId;

                        });


                    modules =
                        modules.filter(function(item) {

                            return item.id !== moduleId;

                        });


                    saveModules();
                    saveTasks();
                    saveStudySessions();


                    displayModules();
                    displayTasks();
                    displayStudySessions();
                    updateAll();
                    displayCalendar();

                }
            );

        });


    updateModuleSelects();

}


/* =====================================================
   MODULE DROPDOWNS
===================================================== */

function updateModuleSelects() {

    const selects = [
        taskModuleSelect,
        studyModuleSelect
    ];


    selects.forEach(function(select) {

        if (!select) {
            return;
        }


        const currentValue =
            select.value;


        select.innerHTML = `

            <option value="">
                Select module
            </option>

        `;


        modules.forEach(function(module) {

            const option =
                document.createElement("option");


            option.value =
                module.id;


            option.textContent =
                module.code +
                " — " +
                module.name;


            select.appendChild(option);

        });


        const stillExists =
            modules.some(function(module) {

                return module.id === currentValue;

            });


        if (stillExists) {

            select.value =
                currentValue;

        }

    });

}


/* =====================================================
   ADD MODULE
===================================================== */

if (addModuleButton) {

    addModuleButton.addEventListener(
        "click",
        function() {

            const code =
                moduleCodeInput.value.trim();


            const name =
                moduleNameInput.value.trim();


            if (
                code === "" ||
                name === ""
            ) {

                alert(
                    "Please enter both the module code and module name."
                );

                return;

            }


            const duplicate =
                modules.some(function(module) {

                    return (
                        module.code.toLowerCase() ===
                        code.toLowerCase()
                    );

                });


            if (duplicate) {

                alert(
                    "A module with this code already exists."
                );

                return;

            }


            const newModule = {

                id:
                    Date.now().toString(),

                code:
                    code,

                name:
                    name

            };


            modules.push(newModule);

            saveModules();


            moduleCodeInput.value = "";
            moduleNameInput.value = "";


            displayModules();
            updateAll();
            displayCalendar();

        }
    );

}


/* =====================================================
   TASKS
===================================================== */

function displayTasks() {

    if (!taskList) {
        return;
    }


    taskList.innerHTML = "";


    if (tasks.length === 0) {

        taskList.innerHTML = `
            <li style="color:#555;">
                No tasks added yet.
            </li>
        `;

        return;

    }


    const sortedTasks =
        [...tasks].sort(function(a, b) {

            if (!a.date && !b.date) {
                return 0;
            }

            if (!a.date) {
                return 1;
            }

            if (!b.date) {
                return -1;
            }

            return a.date.localeCompare(b.date);

        });


    sortedTasks.forEach(function(task) {

        const li =
            document.createElement("li");


        const module =
            modules.find(function(item) {

                return item.id === task.moduleId;

            });


        const moduleName =
            module
                ? module.code +
                  " — " +
                  module.name
                : "No module";


        if (task.completed) {

            li.className =
                "completed";

        }


        li.innerHTML = `

            <div class="task-content">

                <span class="task-title">
                    ${escapeHTML(task.text)}
                </span>

                <span class="task-module">
                    ${escapeHTML(moduleName)}
                </span>

                <span class="task-due">
                    Deadline:
                    ${formatDate(task.date)}
                </span>

            </div>


            <button
                class="delete-button"
                data-id="${task.id}"
                type="button"
            >
                Delete
            </button>

        `;


        const title =
            li.querySelector(".task-title");


        title.addEventListener(
            "click",
            function() {

                task.completed =
                    !task.completed;


                saveTasks();


                displayTasks();
                displayModules();
                updateAll();
                displayCalendar();

            }
        );


        const deleteButton =
            li.querySelector(".delete-button");


        deleteButton.addEventListener(
            "click",
            function() {

                const confirmed =
                    confirm(
                        "Delete this task?"
                    );


                if (!confirmed) {
                    return;
                }


                tasks =
                    tasks.filter(function(item) {

                        return item.id !== task.id;

                    });


                saveTasks();


                displayTasks();
                displayModules();
                updateAll();
                displayCalendar();

            }
        );


        taskList.appendChild(li);

    });

}


/* =====================================================
   ADD TASK
===================================================== */

if (addTaskButton) {

    addTaskButton.addEventListener(
        "click",
        function() {

            const text =
                taskInput.value.trim();


            const moduleId =
                taskModuleSelect.value;


            const date =
                taskDateInput.value;


            if (text === "") {

                alert(
                    "Please enter a task."
                );

                return;

            }


            const newTask = {

                id:
                    Date.now().toString(),

                text:
                    text,

                moduleId:
                    moduleId,

                date:
                    date,

                completed:
                    false

            };


            tasks.push(newTask);

            saveTasks();


            taskInput.value = "";
            taskModuleSelect.value = "";
            taskDateInput.value = "";


            displayTasks();
            displayModules();
            updateAll();
            displayCalendar();

        }
    );

}


/* =====================================================
   DEADLINES
===================================================== */

function displayDeadlines() {

    const deadlineList =
        document.getElementById(
            "deadlineList"
        );


    if (!deadlineList) {
        return;
    }


    deadlineList.innerHTML = "";


    const deadlines =
        tasks
            .filter(function(task) {

                return (
                    task.date &&
                    !task.completed
                );

            })
            .sort(function(a, b) {

                return a.date.localeCompare(
                    b.date
                );

            });


    if (deadlines.length === 0) {

        deadlineList.innerHTML = `
            <div class="empty-deadlines">
                No upcoming deadlines.
            </div>
        `;

        return;

    }


    deadlines.forEach(function(task) {

        const module =
            modules.find(function(item) {

                return item.id === task.moduleId;

            });


        const moduleText =
            module
                ? module.code +
                  " — " +
                  module.name
                : "No module";


        const status =
            getDeadlineStatus(task.date);


        const item =
            document.createElement("div");


        item.className =
            "deadline-item";


        item.innerHTML = `

            <div class="deadline-top">

                <div>

                    <div class="deadline-title">
                        ${escapeHTML(task.text)}
                    </div>

                    <div class="deadline-module">
                        ${escapeHTML(moduleText)}
                    </div>

                </div>


                <span
                    class="deadline-status ${status.className}"
                >
                    ${status.text}
                </span>

            </div>


            <div class="deadline-date">
                📅 ${formatDate(task.date)}
            </div>

        `;


        deadlineList.appendChild(item);

    });

}


/* =====================================================
   STUDY SESSIONS
===================================================== */

function displayStudySessions() {

    if (!studySessionList) {
        return;
    }


    studySessionList.innerHTML = "";


    if (studySessions.length === 0) {

        studySessionList.innerHTML = `
            <div class="empty-sessions">
                No study sessions scheduled yet.
            </div>
        `;

        return;

    }


    const sortedSessions =
        [...studySessions].sort(
            function(a, b) {

                const first =
                    (a.date || "") +
                    (a.time || "");


                const second =
                    (b.date || "") +
                    (b.time || "");


                return first.localeCompare(second);

            }
        );


    sortedSessions.forEach(function(session) {

        const module =
            modules.find(function(item) {

                return item.id === session.moduleId;

            });


        const moduleText =
            module
                ? module.code
                : "General Study";


        const div =
            document.createElement("div");


        div.className =
            "study-session" +
            (
                session.completed
                    ? " session-completed"
                    : ""
            );


        div.innerHTML = `

            <div class="session-main">

                <div class="session-time">
                    ${escapeHTML(session.time || "--:--")}
                </div>


                <div class="session-details">

                    <div class="session-topic">
                        ${escapeHTML(session.topic)}
                    </div>


                    <div class="session-meta">

                        <span>
                            ${formatDate(session.date)}
                        </span>

                        <span class="session-module">
                            ${escapeHTML(moduleText)}
                        </span>

                        <span>
                            ${escapeHTML(session.duration)} min
                        </span>

                    </div>

                </div>

            </div>


            <div class="session-actions">

                ${
                    session.completed
                        ? `
                            <span class="completed-label">
                                COMPLETED
                            </span>
                        `
                        : `
                            <button
                                class="complete-session"
                                data-id="${session.id}"
                                type="button"
                            >
                                Complete
                            </button>
                        `
                }


                <button
                    class="delete-session"
                    data-id="${session.id}"
                    type="button"
                >
                    Delete
                </button>

            </div>

        `;


        studySessionList.appendChild(div);

    });


    document
        .querySelectorAll(".complete-session")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const sessionId =
                        button.dataset.id;


                    const session =
                        studySessions.find(function(item) {

                            return item.id === sessionId;

                        });


                    if (!session) {
                        return;
                    }


                    session.completed =
                        true;


                    saveStudySessions();

                    displayStudySessions();
                    displayCalendar();

                }
            );

        });


    document
        .querySelectorAll(".delete-session")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const sessionId =
                        button.dataset.id;


                    const confirmed =
                        confirm(
                            "Delete this study session?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    studySessions =
                        studySessions.filter(
                            function(session) {

                                return (
                                    session.id !==
                                    sessionId
                                );

                            }
                        );


                    saveStudySessions();

                    displayStudySessions();
                    displayCalendar();

                }
            );

        });

}


/* =====================================================
   ADD STUDY SESSION
===================================================== */

if (addStudyButton) {

    addStudyButton.addEventListener(
        "click",
        function() {

            const topic =
                studyTopicInput.value.trim();


            const moduleId =
                studyModuleSelect.value;


            const date =
                studyDateInput.value;


            const time =
                studyTimeInput.value;


            const duration =
                studyDurationSelect.value;


            if (
                topic === "" ||
                date === "" ||
                time === ""
            ) {

                alert(
                    "Please enter the study topic, date and time."
                );

                return;

            }


            const newSession = {

                id:
                    Date.now().toString(),

                topic:
                    topic,

                moduleId:
                    moduleId,

                date:
                    date,

                time:
                    time,

                duration:
                    duration,

                completed:
                    false

            };


            studySessions.push(newSession);

            saveStudySessions();


            studyTopicInput.value = "";
            studyModuleSelect.value = "";
            studyDateInput.value = "";
            studyTimeInput.value = "";


            studyDurationSelect.value =
                studyHQSettings.defaultDuration || "60";


            displayStudySessions();
            displayCalendar();

        }
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function percentageValue() {

    if (tasks.length === 0) {
        return 0;
    }


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    return Math.round(
        (
            completed /
            tasks.length
        ) * 100
    );

}


function updateStatistics() {

    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        tasks.length -
        completed;


    const percentage =
        percentageValue();


    const moduleCount =
        document.getElementById("moduleCount");

    const taskCount =
        document.getElementById("taskCount");

    const pendingCount =
        document.getElementById("pendingCount");

    const progressPercentage =
        document.getElementById("progressPercentage");


    if (moduleCount) {

        moduleCount.textContent =
            modules.length;

    }


    if (taskCount) {

        taskCount.textContent =
            tasks.length;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }


    if (progressPercentage) {

        progressPercentage.textContent =
            percentage + "%";

    }

}


/* =====================================================
   ACADEMIC OVERVIEW
===================================================== */

function updateOverview() {

    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        tasks.length -
        completed;


    const today =
        getToday();


    const upcoming =
        tasks.filter(function(task) {

            if (
                !task.date ||
                task.completed
            ) {

                return false;

            }


            const date =
                new Date(
                    task.date +
                    "T00:00:00"
                );


            return date >= today;

        }).length;


    const overdue =
        tasks.filter(function(task) {

            if (
                !task.date ||
                task.completed
            ) {

                return false;

            }


            const date =
                new Date(
                    task.date +
                    "T00:00:00"
                );


            return date < today;

        }).length;


    const completedElement =
        document.getElementById(
            "overviewCompleted"
        );


    const pendingElement =
        document.getElementById(
            "overviewPending"
        );


    const deadlinesElement =
        document.getElementById(
            "overviewDeadlines"
        );


    const overdueElement =
        document.getElementById(
            "overviewOverdue"
        );


    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (deadlinesElement) {

        deadlinesElement.textContent =
            upcoming;

    }


    if (overdueElement) {

        overdueElement.textContent =
            overdue;

    }


    const message =
        document.getElementById(
            "academicMessage"
        );


    if (!message) {
        return;
    }


    if (tasks.length === 0) {

        message.textContent =
            "You're ready to get started. Add some tasks to your dashboard.";

    }
    else if (percentageValue() === 100) {

        message.textContent =
            "Excellent work! You've completed all your current tasks.";

    }
    else if (overdue > 0) {

        message.textContent =
            "You have overdue work. Take care of your most urgent deadline first.";

    }
    else {

        message.textContent =
            "Keep going. Every completed task moves you closer to your goals.";

    }

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {

    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const percentage =
        percentageValue();


    const progressText =
        document.getElementById(
            "progressText"
        );


    const progressNumber =
        document.getElementById(
            "progressNumber"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressText) {

        progressText.textContent =
            completed +
            " of " +
            tasks.length +
            " tasks completed.";

    }


    if (progressNumber) {

        progressNumber.textContent =
            percentage +
            "%";

    }


    if (progressFill) {

        progressFill.style.width =
            percentage +
            "%";

    }

}


/* =====================================================
   CALENDAR
===================================================== */

function displayCalendar() {

    if (!todayScheduleList) {
        return;
    }


    const selectedDateKey =
        getDateKey(calendarSelectedDate);


    /* -----------------------------------------------
       HEADER
    ------------------------------------------------ */

    if (calendarTodayDate) {

        calendarTodayDate.textContent =
            formatCalendarDate(
                calendarSelectedDate
            );

    }


    if (calendarTodayMessage) {

        if (isToday(calendarSelectedDate)) {

            calendarTodayMessage.textContent =
                "Here's what's happening with your studies today.";

        }
        else {

            calendarTodayMessage.textContent =
                "Here's what's scheduled for this day.";

        }

    }


    /* -----------------------------------------------
       TASKS FOR SELECTED DAY
    ------------------------------------------------ */

    const selectedTasks =
        tasks.filter(function(task) {

            return task.date === selectedDateKey;

        });


    /* -----------------------------------------------
       STUDY SESSIONS FOR SELECTED DAY
    ------------------------------------------------ */

    const selectedSessions =
        studySessions.filter(function(session) {

            return session.date === selectedDateKey;

        });


    /* -----------------------------------------------
       COUNTS
    ------------------------------------------------ */

    const taskCount =
        selectedTasks.length;


    const deadlineCount =
        selectedTasks.filter(function(task) {

            return (
                task.date === selectedDateKey &&
                !task.completed
            );

        }).length;


    const studyCount =
        selectedSessions.length;


    const completedCount =
        selectedTasks.filter(function(task) {

            return task.completed;

        }).length;


    if (calendarTaskCount) {

        calendarTaskCount.textContent =
            taskCount;

    }


    if (calendarDeadlineCount) {

        calendarDeadlineCount.textContent =
            deadlineCount;

    }


    if (calendarStudyCount) {

        calendarStudyCount.textContent =
            studyCount;

    }


    if (calendarCompletedCount) {

        calendarCompletedCount.textContent =
            completedCount;

    }


    /* -----------------------------------------------
       CLEAR SCHEDULE
    ------------------------------------------------ */

    todayScheduleList.innerHTML = "";


    /* -----------------------------------------------
       NO EVENTS
    ------------------------------------------------ */

    if (
        selectedTasks.length === 0 &&
        selectedSessions.length === 0
    ) {

        todayScheduleList.innerHTML = `

            <div class="calendar-empty">

                <div class="calendar-empty-icon">
                    📅
                </div>

                <h3>
                    Nothing scheduled yet
                </h3>

                <p>
                    Your tasks, deadlines and study sessions
                    for this day will appear here.
                </p>

            </div>

        `;

        return;

    }


    /* -----------------------------------------------
       TASKS
    ------------------------------------------------ */

    selectedTasks.forEach(function(task) {

        const module =
            modules.find(function(item) {

                return item.id === task.moduleId;

            });


        const moduleText =
            module
                ? module.code +
                  " — " +
                  module.name
                : "No module";


        const item =
            document.createElement("div");


        item.className =
            "calendar-event calendar-task-event" +
            (
                task.completed
                    ? " calendar-event-completed"
                    : ""
            );


        item.innerHTML = `

            <div class="calendar-event-icon">
                ✓
            </div>


            <div class="calendar-event-content">

                <strong>
                    ${escapeHTML(task.text)}
                </strong>

                <span>
                    ${escapeHTML(moduleText)}
                </span>

                <small>
                    ${
                        task.completed
                            ? "Completed"
                            : "Task / Deadline"
                    }
                </small>

            </div>


            <div class="calendar-event-status">

                ${
                    task.completed
                        ? "COMPLETED"
                        : "PENDING"
                }

            </div>

        `;


        todayScheduleList.appendChild(item);

    });


    /* -----------------------------------------------
       STUDY SESSIONS
    ------------------------------------------------ */

    selectedSessions.forEach(function(session) {

        const module =
            modules.find(function(item) {

                return item.id === session.moduleId;

            });


        const moduleText =
            module
                ? module.code
                : "General Study";


        const item =
            document.createElement("div");


        item.className =
            "calendar-event calendar-study-event" +
            (
                session.completed
                    ? " calendar-event-completed"
                    : ""
            );


        item.innerHTML = `

            <div class="calendar-event-icon">
                ◷
            </div>


            <div class="calendar-event-content">

                <strong>
                    ${escapeHTML(session.topic)}
                </strong>

                <span>
                    ${escapeHTML(moduleText)}
                </span>

                <small>
                    ${escapeHTML(session.time || "--:--")}
                    •
                    ${escapeHTML(session.duration)} minutes
                </small>

            </div>


            <div class="calendar-event-status">

                ${
                    session.completed
                        ? "COMPLETED"
                        : "STUDY"
                }

            </div>

        `;


        todayScheduleList.appendChild(item);

    });

}


/* =====================================================
   CALENDAR NAVIGATION
===================================================== */

if (previousDayButton) {

    previousDayButton.addEventListener(
        "click",
        function() {

            calendarSelectedDate.setDate(
                calendarSelectedDate.getDate() - 1
            );


            displayCalendar();

        }
    );

}


if (nextDayButton) {

    nextDayButton.addEventListener(
        "click",
        function() {

            calendarSelectedDate.setDate(
                calendarSelectedDate.getDate() + 1
            );


            displayCalendar();

        }
    );

}


if (todayButton) {

    todayButton.addEventListener(
        "click",
        function() {

            calendarSelectedDate =
                new Date();


            displayCalendar();

        }
    );

}


/* =====================================================
   UPDATE EVERYTHING
===================================================== */

function updateAll() {

    updateStatistics();

    updateOverview();

    updateProgress();

    displayDeadlines();

    displayCalendar();

}


/* =====================================================
   WELCOME NAME
===================================================== */

function updateWelcomeName() {

    const welcomeHeading =
        document.querySelector(
            ".welcome h2"
        );


    if (!welcomeHeading) {
        return;
    }


    const name =
        escapeHTML(
            studyHQSettings.name
        );


    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    if (welcomeName) {

        welcomeName.textContent =
            studyHQSettings.name;

        return;

    }


    welcomeHeading.textContent =
        "Welcome back, " +
        name +
        ".";

}


/* =====================================================
   THEME
===================================================== */

function applyTheme(theme) {

    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );


        if (lightThemeButton) {

            lightThemeButton.classList.add(
                "active"
            );

        }


        if (darkThemeButton) {

            darkThemeButton.classList.remove(
                "active"
            );

        }

    }
    else {

        document.body.classList.remove(
            "light-theme"
        );


        if (darkThemeButton) {

            darkThemeButton.classList.add(
                "active"
            );

        }


        if (lightThemeButton) {

            lightThemeButton.classList.remove(
                "active"
            );

        }

    }

}


/* =====================================================
   LOAD SETTINGS
===================================================== */

function loadSettings() {

    if (settingsNameInput) {

        settingsNameInput.value =
            studyHQSettings.name;

    }


    if (studyModeToggle) {

        studyModeToggle.checked =
            studyHQSettings.studyMode;

    }


    if (notificationToggle) {

        notificationToggle.checked =
            studyHQSettings.notifications;

    }


    if (defaultDurationSelect) {

        defaultDurationSelect.value =
            studyHQSettings.defaultDuration;

    }


    if (studyDurationSelect) {

        studyDurationSelect.value =
            studyHQSettings.defaultDuration;

    }


    applyTheme(
        studyHQSettings.theme
    );


    updateWelcomeName();


    updateStudyModeStatus();

}


/* =====================================================
   SETTINGS SAVED MESSAGE
===================================================== */

function showSettingsSaved() {

    if (!settingsSavedMessage) {
        return;
    }


    settingsSavedMessage.textContent =
        "✓ Settings saved automatically";


    settingsSavedMessage.style.display =
        "block";


    setTimeout(
        function() {

            settingsSavedMessage.style.display =
                "none";

        },
        2500
    );

}


/* =====================================================
   STUDY MODE STATUS
===================================================== */

function updateStudyModeStatus() {

    const statusText =
        document.getElementById(
            "sidebarStudyStatus"
        );


    const statusDot =
        document.querySelector(
            ".status-dot"
        );


    if (studyHQSettings.studyMode) {

        if (statusText) {

            statusText.textContent =
                "Focus mode active";

        }


        if (statusDot) {

            statusDot.style.background =
                "var(--green)";

        }

    }
    else {

        if (statusText) {

            statusText.textContent =
                "Focus mode off";

        }


        if (statusDot) {

            statusDot.style.background =
                "#555";

        }

    }

}


/* =====================================================
   PROFILE NAME
===================================================== */

if (settingsNameInput) {

    settingsNameInput.addEventListener(
        "input",
        function() {

            const name =
                settingsNameInput.value.trim();


            if (name !== "") {

                studyHQSettings.name =
                    name;

            }


            saveSettings();

            updateWelcomeName();

            showSettingsSaved();

        }
    );

}


/* =====================================================
   DARK THEME
===================================================== */

if (darkThemeButton) {

    darkThemeButton.addEventListener(
        "click",
        function() {

            studyHQSettings.theme =
                "dark";


            applyTheme("dark");

            saveSettings();

            showSettingsSaved();

        }
    );

}


/* =====================================================
   LIGHT THEME
===================================================== */

if (lightThemeButton) {

    lightThemeButton.addEventListener(
        "click",
        function() {

            studyHQSettings.theme =
                "light";


            applyTheme("light");

            saveSettings();

            showSettingsSaved();

        }
    );

}


/* =====================================================
   STUDY MODE
===================================================== */

if (studyModeToggle) {

    studyModeToggle.addEventListener(
        "change",
        function() {

            studyHQSettings.studyMode =
                studyModeToggle.checked;


            updateStudyModeStatus();

            saveSettings();

            showSettingsSaved();

        }
    );

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

if (notificationToggle) {

    notificationToggle.addEventListener(
        "change",
        function() {

            studyHQSettings.notifications =
                notificationToggle.checked;


            saveSettings();

            showSettingsSaved();

        }
    );

}


/* =====================================================
   DEFAULT STUDY DURATION
===================================================== */

if (defaultDurationSelect) {

    defaultDurationSelect.addEventListener(
        "change",
        function() {

            studyHQSettings.defaultDuration =
                defaultDurationSelect.value;


            if (studyDurationSelect) {

                studyDurationSelect.value =
                    studyHQSettings.defaultDuration;

            }


            saveSettings();

            showSettingsSaved();

        }
    );

}


/* =====================================================
   CLEAR TASKS
===================================================== */

if (clearTasksButton) {

    clearTasksButton.addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "Are you sure you want to delete all tasks?"
                );


            if (!confirmed) {
                return;
            }


            tasks = [];

            saveTasks();


            displayTasks();
            displayModules();
            updateAll();


            alert(
                "All tasks have been cleared."
            );

        }
    );

}


/* =====================================================
   CLEAR STUDY SESSIONS
===================================================== */

if (clearSessionsButton) {

    clearSessionsButton.addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "Are you sure you want to delete all study sessions?"
                );


            if (!confirmed) {
                return;
            }


            studySessions = [];

            saveStudySessions();


            displayStudySessions();
            displayCalendar();


            alert(
                "All study sessions have been cleared."
            );

        }
    );

}


/* =====================================================
   RESET STUDYHQ
===================================================== */

if (resetStudyHQButton) {

    resetStudyHQButton.addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "This will delete your modules, tasks, study sessions and settings. Continue?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "studyHQModules"
            );

            localStorage.removeItem(
                "studyHQTasks"
            );

            localStorage.removeItem(
                "studyHQStudySessions"
            );

            localStorage.removeItem(
                "studyHQSettings"
            );

            localStorage.removeItem(
                "studyHQCurrentView"
            );


            modules = [];
            tasks = [];
            studySessions = [];


            location.reload();

        }
    );

}


/* =====================================================
   ENTER KEY SUPPORT
===================================================== */

if (moduleCodeInput) {

    moduleCodeInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                if (moduleNameInput) {

                    moduleNameInput.focus();

                }

            }

        }
    );

}


if (moduleNameInput) {

    moduleNameInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                addModuleButton.click();

            }

        }
    );

}


if (taskInput) {

    taskInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                addTaskButton.click();

            }

        }
    );

}


if (studyTopicInput) {

    studyTopicInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                addStudyButton.click();

            }

        }
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );


        const pageViews =
            document.querySelectorAll(
                ".page-view"
            );


        const quickButtons =
            document.querySelectorAll(
                "[data-go-view]"
            );


        const sidebar =
            document.getElementById(
                "sidebar"
            );


        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        function showView(viewName) {

            if (pageViews.length > 0) {

                pageViews.forEach(
                    function(view) {

                        view.classList.remove(
                            "active-view"
                        );

                    }
                );


                const selectedView =
                    document.getElementById(
                        "view-" +
                        viewName
                    );


                if (selectedView) {

                    selectedView.classList.add(
                        "active-view"
                    );

                }

            }


            navItems.forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );


                    if (
                        item.dataset.view ===
                        viewName
                    ) {

                        item.classList.add(
                            "active"
                        );

                    }

                }
            );


            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }


            localStorage.setItem(
                "studyHQCurrentView",
                viewName
            );


            if (viewName === "calendar") {

                calendarSelectedDate =
                    new Date();

                displayCalendar();

            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        navItems.forEach(
            function(item) {

                item.addEventListener(
                    "click",
                    function(event) {

                        if (item.dataset.view) {

                            event.preventDefault();

                            showView(
                                item.dataset.view
                            );

                        }

                    }
                );

            }
        );


        quickButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();


                        const viewName =
                            button.dataset.goView;


                        if (viewName) {

                            showView(
                                viewName
                            );

                        }

                    }
                );

            }
        );


        if (
            mobileMenuButton &&
            sidebar
        ) {

            mobileMenuButton.addEventListener(
                "click",
                function() {

                    sidebar.classList.toggle(
                        "open"
                    );

                }
            );

        }


        const savedView =
            localStorage.getItem(
                "studyHQCurrentView"
            );


        if (
            savedView &&
            pageViews.length > 0
        ) {

            const savedViewElement =
                document.getElementById(
                    "view-" +
                    savedView
                );


            if (savedViewElement) {

                showView(
                    savedView
                );

            }

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

displayModules();

displayTasks();

displayStudySessions();

loadSettings();

updateAll();


/* =====================================================
   AUTO REFRESH
===================================================== */

setInterval(
    function() {

        displayDeadlines();

        updateOverview();

        displayCalendar();

    },
    60000
);