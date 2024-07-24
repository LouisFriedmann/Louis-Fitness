// Disable all input elements' required attributes
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

// function allows target elements to be shown and required when the selected option is equal to 'duration', otherwise, they won't be shown nor required
function toggleAttributeBasedOnOption(selectId, targetElementIDs)
{
    const selectElement = document.getElementById(selectId);
    const selectedValue = selectElement.value;

    if (selectedValue === 'Duration')
    {
        for (let i = 0; i < targetElementIDs.length; i++)
        {
            const nextTargetElement = document.getElementById(targetElementIDs[i]);
            nextTargetElement.removeAttribute('hidden');

            const inputElement = nextTargetElement.querySelector('input[type="number"]');
            inputElement.required = true;
        }
    }
    else
    {
        for (let i = 0; i < targetElementIDs.length; i++)
        {
            const nextTargetElement = document.getElementById(targetElementIDs[i]);
            nextTargetElement.setAttribute('hidden', '');

            const inputElement = nextTargetElement.querySelector('input[type="number"]');
            inputElement.required = false;
        }
    }
}

// change value of goal so when user opens popup to edit a goal, the initial values of title and description will be there
// and the. Then, store value of goal_id in hidden html element called goal_id
function changeGoalAndOpenPopup(title, description, formClassId, formId, goalFormId, goalId)
{
   const goal_title = document.getElementById("edit-goal-title");
   goal_title.value = title;
   const goal_description = document.getElementById("edit-goal-description");
   goal_description.value = description;

   const form = document.getElementById(formId);

   const buttons = form.getElementsByTagName("button");
   const submitButton = buttons[buttons.length - 1]; // submit button is last button in form
   submitButton.disabled = false;
   openPopup(formClassId)

   const goalIdElement = document.getElementById(goalFormId);
   goalIdElement.value = goalId;
}

// timers for duration goals
setInterval(goalTimer, 1000);

// controls the timer for all of the duration based goals
function goalTimer()
{
    var goalElements = document.getElementsByClassName("current-goal");
    for (let i = 0; i < goalElements.length; i++)
    {
        // Edit clock for duration goal only. (clock only appears for duration goal)
        if (goalElements[i].getElementsByClassName("clock").length > 0)
        {
            // Get local start date (originally in UTC) and local current date of the user 
            var startDateString = goalElements[i].querySelector('h5[name="hidden-start-datetime"]').innerHTML.replace(" ", "T") + "Z";
            var localStartDate = UTCToLocal(startDateString);
            var localUserDate = new Date();

            // Display clocks based on if the duration goal is finished for the week is finished or not and handle when timer goes off
            timeDifference = getTimeInWeek(localStartDate, localUserDate)
            if (goalElements[i].getElementsByClassName("week-finished").length > 0)
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
    var hiddenStartDatetimeElement = fullGoalForm.querySelector('h5[name="hidden-start-datetime"]');
    if (hiddenStartDatetimeElement)
    {
        startDateString = hiddenStartDatetimeElement.innerHTML.replace(" ", "T") + "Z";
        localStartDate = UTCToLocal(startDateString);
        localUserDate = new Date();

        timeDifference = getTimeInWeek(localStartDate, localUserDate)
        if (fullGoalForm.getElementsByClassName("week-finished").length > 0)
        {
            fullGoalForm.getElementsByClassName("clock")[0].innerHTML = "Week is finished! Time until next week: " + timeDifference;
        }
        else
        {
            fullGoalForm.getElementsByClassName("clock")[0].innerHTML = "Time left to finish week: " + timeDifference;
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
    
    // Handle negative time remaining (if date2 is before date1 in the same week)
    if (timeRemainingInMs < 0)
    {
        timeRemainingInMs += MS_PER_WEEK;
    }

    // Calculate the time components
    const days = Math.floor(timeRemainingInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemainingInMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemainingInMs / (1000 * 60)) % 60);
    const seconds = Math.floor((timeRemainingInMs / 1000) % 60);

    // Create the result string
    const result = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    return result;
}

// Handle enter key press for submitting manage goals form

// Add event listener for keydown event on the form
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

function addContentToViewGoal(title, type, description, rate, duration, dateStarted, endDate, isWeekFinished)
{
    var elementsContainer = document.getElementById('view-full-goal-elements');
    elementsContainer.innerHTML = "";

    var formHeader = document.createElement('h2');
    var br = document.createElement('br');
    var titleElement = document.createElement('h5');
    var otherGoalInfoElement = document.createElement('h6');
    var descriptionElement = document.createElement('p');
    var hiddenStartDatetimeElement = document.createElement('h5');
    var hiddenIsWeekFinishedElement = document.createElement('h5');
    var clockElement = document.createElement('h5');

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
    descriptionElement.innerHTML = description;
    hiddenStartDatetimeElement.innerHTML = dateStarted;
    hiddenStartDatetimeElement.setAttribute("name", "hidden-start-datetime");
    hiddenStartDatetimeElement.setAttribute("hidden", "true");
    clockElement.setAttribute("class", "clock");
    hiddenIsWeekFinishedElement.setAttribute("class", "week-finished");

    elementsContainer.appendChild(formHeader);
    elementsContainer.appendChild(br);
    elementsContainer.appendChild(titleElement);
    if (type === "Duration")
    {
        elementsContainer.appendChild(clockElement);
    }
    elementsContainer.appendChild(otherGoalInfoElement);
    elementsContainer.appendChild(descriptionElement);
    elementsContainer.appendChild(hiddenStartDatetimeElement);
    if (isWeekFinished)
    {
        elementsContainer.appendChild(hiddenIsWeekFinishedElement);
    }
}