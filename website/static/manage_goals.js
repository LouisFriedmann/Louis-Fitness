// Disable all input elements' required attributes
function disableInputRequired(formId)
{
    const form = document.getElementById(formId);
    const inputElements = form.querySelectorAll("input");
    for (let i = 0; i < inputElements.length; i++)
    {
        const element = inputElements[i];
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
            const startDateString = goalElements[i].querySelector('h5[name="hidden-start-datetime"]').innerHTML.replace(" ", "T") + "Z";
            const localStartDate = UTCToLocal(startDateString);
            const localUserDate = new Date();

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
            goalElements[i].style.height = 130 + "px";
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