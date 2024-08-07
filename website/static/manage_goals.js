// 'manage_goals.js' is responsible for all functions dedicated to manage goals page

// Disable all input elements' required attributes in a form
function disableInputRequired(formId)
{
    var form = document.getElementById(formId);
    var inputElements = form.querySelectorAll("input");
    for (let i = 0; i < inputElements.length; i++)
    {
        var element = inputElements[i];
        element.required = false;
    }
}

// function allows target elements to be shown and required when the selected option is equal to 'Duration', otherwise, they won't be shown nor required
function toggleAttributeBasedOnOption(selectId, targetElementIDs)
{
    const selectElement = document.getElementById(selectId);
    const selectedValue = selectElement.value;

    for (let i = 0; i < targetElementIDs.length; i++)
    {
        const nextTargetElement = document.getElementById(targetElementIDs[i]);
        const inputElement = nextTargetElement.querySelector('input[type="number"]');

        if (selectedValue === 'Duration')
        {
            nextTargetElement.removeAttribute('hidden');
            inputElement.required = true;
        }
        else
        {
            nextTargetElement.setAttribute('hidden', '');
            inputElement.required = false;
        }
    }
}

// Change value of goal so when user opens popup to edit a goal, the initial values of title and description will be there
// Then, open the popup and store value of goal_id in hidden html element called 'goalId'
function changeGoalAndOpenPopup(title, description, formClassId, goalFormId, goalId)
{
   const goal_title = document.getElementById("edit-goal-title");
   goal_title.value = title;
   const goal_description = document.getElementById("edit-goal-description");
   goal_description.value = description;

   const submitButton = document.getElementById("edit-goal-submit-button");
   submitButton.disabled = false;
   openPopup(formClassId);

   const goalIdElement = document.getElementById(goalFormId);
   goalIdElement.value = goalId;
}

// Clock for duration goal updates every second
setInterval(goalTimer, 1000);

// controls the timer for the clock for all of the duration based goals and popups
function goalTimer()
{
    let goalElements = document.querySelectorAll('.rectangle.current-goal');
    for (let i = 0; i < goalElements.length; i++)
    {
        // Edit clock for duration goal only. (clock only appears for duration goal)
        if (goalElements[i].querySelector(".clock") !== null)
        {
            // Get local start date (originally in UTC) and local current date of the user 
            var startDateString = goalElements[i].querySelector('h5[name="hidden-start-datetime"]').innerHTML.replace(" ", "T") + "Z";
            var localStartDate = UTCToLocal(startDateString);
            var localUserDate = new Date();

            // Display time left for week or time until next week using start and current date
            const timeDifference = getTimeInWeek(localStartDate, localUserDate);
            const isWeekFinished = goalElements[i].querySelector(".week-finished") !== null;
            if (isWeekFinished)
            {
                goalElements[i].getElementsByClassName("clock")[0].innerHTML = "Week is finished! Time until next week: " + timeDifference;
            }
            else
            {
                goalElements[i].getElementsByClassName("clock")[0].innerHTML = "Time left to finish week: " + timeDifference;
            }
        }
    }

    // Edit time for view full goal popup
    editViewGoalClock();
}

function editViewGoalClock()
{
    var fullGoalForm = document.getElementById('view-full-goal');
    if (fullGoalForm)
    {
        var hiddenStartDatetimeElement = fullGoalForm.querySelector('h5[name="hidden-start-datetime"]');

        if (hiddenStartDatetimeElement)
        {
            // Get local start date (originally in UTC) and local current date of the user 
            const startDateString = hiddenStartDatetimeElement.innerHTML.replace(" ", "T") + "Z";
            const localStartDate = UTCToLocal(startDateString);
            const localUserDate = new Date();

            // Display time left for week or time until next week using start and current date
            const timeDifference = getTimeInWeek(localStartDate, localUserDate);
            const isWeekFinished = fullGoalForm.getElementsByClassName("week-finished")[0].getAttribute("data-value");
            if (isWeekFinished == "True")
            {
                fullGoalForm.getElementsByClassName("clock")[0].innerHTML = "Week is finished! Time until next week: " + timeDifference;
            }
            else
            {
                fullGoalForm.getElementsByClassName("clock")[0].innerHTML = "Time left to finish week: " + timeDifference;
            }
        }
    }
}

function getTimeInWeek(date1, date2)
{
    // Calculate the total milliseconds in a week
    const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

    // Calculate the difference in milliseconds between the two dates
    const diffInMs = date2.getTime() - date1.getTime();

    // Calculate the time remaining until the next occurrence of the same time of the week
    let timeRemainingInMs = MS_PER_WEEK - (diffInMs % MS_PER_WEEK);

    // Calculate the time components
    const days = Math.floor(timeRemainingInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemainingInMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemainingInMs / (1000 * 60)) % 60);
    const seconds = Math.floor((timeRemainingInMs / 1000) % 60);

    // Reload page when clock hits zero so server can tell the user they failed their goal or they can move onto the next one
    if ((days == 0 && hours == 0 && minutes == 0 && seconds == 0) || (days == 6 && hours == 23 && minutes == 59 && seconds == 59))
    {
        setTimeout(() => location.reload(), 1000);
    }

    // Format string
    const result = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    return result;
}

// Handle enter key press for submitting manage goals form

// Add event listener for keydown event on the form
const addGoalsForm = document.getElementById('add-goals-form')
if (addGoalsForm)
{
    document.getElementById('add-goals-form').addEventListener("keypress",
        function(event)
        {
            if (event.key == "Enter")
            {
                event.preventDefault();

                // check if all input elements are filled in before clicking submit button
                var addGoalsFormInputs = document.getElementById('add-goals-form').querySelectorAll("input");
                for (let i = 0; i < addGoalsFormInputs.length; i++)
                {
                    if (!addGoalsFormInputs[i].value && addGoalsFormInputs[i].required)
                    {
                        return;
                    }
                }
                var submitButton = document.getElementById("goal-submit-button");
                submitButton.click();
            }
        }
    );
}

function addContentToViewGoal(title, type, description, rate, duration, dateStarted, endDate, isWeekFinished)
{
    // First, delete previous elements in container
    var elementsContainer = document.getElementById('view-full-goal-elements');
    elementsContainer.innerHTML = "";

    // Create elements
    var formHeader = document.createElement('h2');
    var br = document.createElement('br');
    var titleElement = document.createElement('h5');
    var otherGoalInfoElement = document.createElement('h6');
    var descriptionElement = document.createElement('p');
    var hiddenStartDatetimeElement = document.createElement('h5');
    var hiddenIsWeekFinishedElement = document.createElement('h5');
    var clockElement = document.createElement('h5');

    // Set their content
    formHeader.innerHTML = "Full Goal";
    titleElement.innerHTML = title;
    if (type === 'Duration')
    {
        otherGoalInfoElement.innerHTML = `Type:  ${type} | Duration: ${duration} weeks | Rate: ${rate} days per week | Start date: ${dateStarted} | End date: ${endDate}`;
    }
    else
    {
        otherGoalInfoElement.innerHTML = `Type: ${type} | Start date: ${dateStarted}`;
    }
    otherGoalInfoElement.setAttribute("class", "other-goal-info");
    descriptionElement.innerHTML = description;
    hiddenStartDatetimeElement.innerHTML = dateStarted;
    hiddenStartDatetimeElement.setAttribute("name", "hidden-start-datetime");
    hiddenStartDatetimeElement.setAttribute("hidden", "true");
    clockElement.setAttribute("class", "clock");
    hiddenIsWeekFinishedElement.setAttribute("class", "week-finished");
    hiddenIsWeekFinishedElement.setAttribute("data-value", isWeekFinished);

    // Add to form in specific order
    appendChildren(elementsContainer, [br.cloneNode(), formHeader, br.cloneNode(), titleElement]);
    if (type === "Duration")
    {
        elementsContainer.appendChild(clockElement);
    }
    appendChildren(elementsContainer, [otherGoalInfoElement, descriptionElement, hiddenStartDatetimeElement]);
    if (isWeekFinished)
    {
        elementsContainer.appendChild(hiddenIsWeekFinishedElement);
    }
}

// For the view goal popup when it is clicked
function editFullGoalDates(goalType)
{
    const goalInfo = document.getElementById("view-full-goal").querySelector(".other-goal-info");
    const goalInfoString = goalInfo.innerHTML;
    const now = new Date();
    const timeZoneAbbreviation = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now)
    .find(part => part.type === 'timeZoneName').value;
    
    // Convert start datetime from HTML to local user time
    var startDateTimeString = null;
    if (goalType === "Duration")
    {
        startDateTimeString = goalInfoString.substring(goalInfoString.indexOf("Start date:") + 12, goalInfoString.indexOf("End date:") - 3);
    }
    else
    {
        startDateTimeString = goalInfoString.substring(goalInfoString.indexOf("Start date:") + 12);
    }
    const startDateTimeStringUTC = startDateTimeString.replace(" ", "T") + "Z";
    const localStartDate = UTCToLocal(startDateTimeStringUTC);
    const formattedLocalStartDate = `${String(localStartDate.getMonth() + 1).padStart(2, '0')}-${String(localStartDate.getDate()).padStart(2, '0')}-${localStartDate.getFullYear()} ${timeZoneAbbreviation}`;
    goalInfo.innerHTML = goalInfo.innerHTML.replace(startDateTimeString, formattedLocalStartDate);

    // Edit end date for duration goal only.
    if (goalType === "Duration")
    {
        const endDateTimeString = goalInfoString.substring(goalInfoString.indexOf("End date:") + 10);
        const endDateTimeStringUTC = endDateTimeString.replace(" ", "T") + "Z";
        const localEndDate = UTCToLocal(endDateTimeStringUTC);
        const formattedLocalEndDate = `${String(localEndDate.getMonth() + 1).padStart(2, '0')}-${String(localEndDate.getDate()).padStart(2, '0')}-${localEndDate.getFullYear()} ${timeZoneAbbreviation}`;
        goalInfo.innerHTML = goalInfo.innerHTML.replace(endDateTimeString, formattedLocalEndDate);
    }
}