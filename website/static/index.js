function openPopup(id)
{
    document.getElementById(id).style.display = "block";
}

function closePopup(id)
{
    document.getElementById(id).style.display = "none";
}


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

// this EXCLUDES the sign up and login forms
function checkPopupForm()
{
     function checkPopupFormValidity(event)
     {
          const form = event.target.closest("form");
          if (form && form.id != "sign-up-form" && form.id != "login-form")
          {
              const inputElements = form.querySelectorAll('input');
              const buttons = form.getElementsByTagName("button");
              const submitButton = buttons[buttons.length - 1]; // submit button is last button in form
              for (let i = 0; i < inputElements.length; i++)
              {
                    const inputElement = inputElements[i];
                    if (inputElement.value === "" && inputElement.required)
                    {
                        submitButton.disabled = true;
                        return;
                    }
              }
              submitButton.disabled = false;
          }
     }

     document.addEventListener("input", checkPopupFormValidity);
     document.addEventListener("click", checkPopupFormValidity);
}
document.addEventListener("DOMContentLoaded", checkPopupForm);

// Validate default submission user enter for all forms (COMMENT FOR NOW AND RESOLVE LATER) FOR NOW, DISABLE ENTER FOR ALL FORMS
//function handleEnter()
//{
//     function handleEnterKeyPress(event)
//     {
//            if (event.keyCode === 13)
//            {
//                const formButtons = form.querySelectorAll("button");
//                const formSubmitButton = formButtons[formButtons.length - 1];
//                if (formSubmitButton.disabled)
//                {
//                    console.log("oof");
//                    event.preventDefault(); // Prevent default form submission
//                }
//            }
//     }
//
//        document.addEventListener("keydown", handleEnterKeyPress);
//}
//document.addEventListener("DOMContentLoaded", handleEnter);
const forms = document.querySelectorAll("form");

forms.forEach(form => {
  form.addEventListener("keydown", function(event)
  {
    if (event.key === "Enter")
    {
      event.preventDefault();
    }
  });
});

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
   openPopup(formClassId);

   const goalIdElement = document.getElementById(goalFormId);
   goalIdElement.value = goalId;
}

// change value of workout so when user opens popup to edit a workout, the initial values will be there
// and the . Then, store value of goal_id in hidden html element called goal_id
function changeWorkoutAndOpenPopup(workoutId, workoutTitle, workoutDescription, workouts, formClassId, formContainerId, formId)
{
   const formContainer = document.getElementById(formContainerId);

   // delete all previous form container elements
   for (let i = 0; i < formContainer.querySelectorAll("*").length; i++)
   {
        var nextFormElement = formContainer.querySelectorAll("*")[i];
        if ((nextFormElement.id != "workout-id") && (nextFormElement.tagName === "INPUT" || nextFormElement.tagName === "LABEL" || nextFormElement.tagName === "BR" || nextFormElement.tagName == "H4"))
        {
            nextFormElement.remove();
            i--;
        }
   }

   const workout = workouts[workoutTitle];
   const form = document.getElementById(formId);

   const buttons = form.getElementsByTagName("button");
   const submitButton = buttons[buttons.length - 1]; // submit button is last button in form

   const workoutTitleElement = document.createElement("input");
   workoutTitleElement.value = workoutTitle;

   const workoutDescriptionElement = document.createElement("input");
   workoutDescriptionElement.value = workoutDescription;

   var br = document.createElement("br");
   var newTitleLabel = document.createElement("label");
   newTitleLabel.textContent = "Workout Title:";
   var newTitleInput = document.createElement("input");
   newTitleInput.setAttribute("type", "text");
   newTitleInput.setAttribute("placeholder", "Enter workout title");
   newTitleInput.setAttribute("data-validate", "true");
   newTitleInput.setAttribute("maxlength", "100");
   newTitleInput.setAttribute("required", "true");
   newTitleInput.setAttribute("name", "edit-workout-title");
   newTitleInput.value = workoutTitle;

   formContainer.insertBefore(newTitleLabel, submitButton);
   formContainer.insertBefore(newTitleInput, submitButton);
   formContainer.insertBefore(br.cloneNode(), submitButton);

   var newDescriptionLabel = document.createElement("label");
   newDescriptionLabel.textContent = "Workout Description: ";
   var newDescriptionInput = document.createElement("input");
   newDescriptionInput.setAttribute("type", "text");
   newDescriptionInput.setAttribute("placeholder", "Enter workout description");
   newDescriptionInput.setAttribute("data-validate", "true");
   newDescriptionInput.setAttribute("maxlength", "100");
   newDescriptionInput.setAttribute("required", "true");
   newDescriptionInput.setAttribute("name", "edit-workout-description");
   newDescriptionInput.value = workoutDescription;

   formContainer.insertBefore(newDescriptionLabel, submitButton);
   formContainer.insertBefore(newDescriptionInput, submitButton);
   formContainer.insertBefore(br.cloneNode(), submitButton);
   const exercises = workouts[workoutTitle][1];

   var exerciseNumber = 1;
   for (let key2 in exercises)
   {
        var newHeaderTag = document.createElement("h4");
        newHeaderTag.innerText = "Exercise " + String(exerciseNumber);
        newHeaderTag.align = "center";
        formContainer.insertBefore(br.cloneNode(), submitButton);
        formContainer.insertBefore(newHeaderTag, submitButton);

        newTitleLabel = document.createElement("label");
        newTitleLabel.textContent = "Title:";
        newTitleInput = document.createElement("input");
        newTitleInput.setAttribute("type", "text");
        newTitleInput.setAttribute("placeholder", "Enter title");
        newTitleInput.setAttribute("data-validate", "true");
        newTitleInput.setAttribute("maxlength", "100");
        newTitleInput.setAttribute("required", "true");
        newTitleInput.setAttribute("name", "edit-workout" + String(workoutId) + "-" + "exercise" + String(exerciseNumber) + "-title");
        newTitleInput.setAttribute("pattern", "[^0-9]*"); // only allow non-numeric characters
        newTitleInput.setAttribute("title", "Numeric characters are NOT allowed here");

        newTitleInput.value = key2;

        // if there is a number at the end of an exercise title, delete it
        if (!isNaN(newTitleInput.value.charAt(newTitleInput.value.length - 1)))
        {
            newTitleInput.value = newTitleInput.value.slice(0, -1);
        }

        formContainer.insertBefore(newTitleLabel, submitButton);
        formContainer.insertBefore(newTitleInput, submitButton);
        formContainer.insertBefore(br.cloneNode(), submitButton);

        newDescriptionLabel = document.createElement("label");
        newDescriptionLabel.textContent = "Description: ";
        newDescriptionInput = document.createElement("input");
        newDescriptionInput.setAttribute("type", "text");
        newDescriptionInput.setAttribute("placeholder", "Enter description");
        newDescriptionInput.setAttribute("data-validate", "true");
        newDescriptionInput.setAttribute("maxlength", "100");
        newDescriptionInput.setAttribute("required", "true");
        newDescriptionInput.setAttribute("name", "edit-workout" + String(workoutId) + "-" + "exercise" + String(exerciseNumber) + "-description");
        newDescriptionInput.setAttribute("pattern", "[^0-9]*"); // only allow non-numeric characters
        newDescriptionInput.setAttribute("title", "Numeric characters are NOT allowed here");
        newDescriptionInput.value = exercises[key2];

        formContainer.insertBefore(newDescriptionLabel, submitButton);
        formContainer.insertBefore(newDescriptionInput, submitButton);
        formContainer.insertBefore(br.cloneNode(), submitButton);

        exerciseNumber++;
    }
    submitButton.disabled = false;
    openPopup(formClassId);

    const workoutIdElement = document.getElementById("workout-id");
    workoutIdElement.value = workoutId;
}

// Add html element for a new exercise
function addExerciseElement(formContainerId, formId)
{
    const formContainer = document.getElementById(formContainerId);
    const form = document.getElementById(formId);

    // Get the number of the last form element, then add one to it, store in variable. This is the new exercise number
    const inputElements = form.getElementsByTagName("input");
    const lastInputElementName = inputElements[inputElements.length - 1].name;
    console.log(lastInputElementName);
    const exerciseNumber = Number(String(lastInputElementName).charAt(lastInputElementName.length - 1));
    console.log(exerciseNumber);
    const newExerciseNumber = exerciseNumber + 1;

    // create two new label and input elements for: Title of exercise and its description
    var titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    var titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("placeholder", "Enter title");
    titleInput.setAttribute("data-validate", "true");
    titleInput.setAttribute("maxlength", "100");
    titleInput.setAttribute("required", "true");
    titleInput.setAttribute("name", "exercise-title-" + String(newExerciseNumber));
    titleInput.setAttribute("pattern", "[^0-9]*"); // only allow non-numeric characters
    titleInput.setAttribute("title", "Numeric characters are NOT allowed here");

    var descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description:";
    var descriptionInput = document.createElement("input");
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("placeholder", "Enter description");
    descriptionInput.setAttribute("data-validate", "true");
    descriptionInput.setAttribute("maxlength", "100");
    descriptionInput.setAttribute("required", "true");
    descriptionInput.setAttribute("pattern", "[^0-9]*"); // only allow non-numeric characters
    descriptionInput.setAttribute("title", "Numeric characters are NOT allowed here");

    descriptionInput.setAttribute("name", "exercise-description-" + String(newExerciseNumber));

    // Append them to form before the submit button, adding a break line afterwards
    const buttons = form.getElementsByTagName("button");
    const submitButton = buttons[buttons.length - 1]; // submit button is last button in form

    var br = document.createElement("br");
    formContainer.insertBefore(titleLabel, submitButton);
    formContainer.insertBefore(titleInput, submitButton);
    formContainer.insertBefore(br.cloneNode(), submitButton);
    formContainer.insertBefore(descriptionLabel, submitButton);
    formContainer.insertBefore(descriptionInput, submitButton);
    formContainer.insertBefore(br.cloneNode(), submitButton);
    formContainer.insertBefore(br.cloneNode(), submitButton);

    // Insert a space between the label and the input element
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

function UTCToLocal(datetimeString)
{
    const utcStartDate = new Date(datetimeString);
    const localStartDate = new Date(utcStartDate.toLocaleString());
    return localStartDate;
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

// Change dates to reflect local times
document.addEventListener('DOMContentLoaded', function()
{  
    const now = new Date();
    const timeZoneAbbreviation = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now)
    .find(part => part.type === 'timeZoneName').value;
    console.log(timeZoneAbbreviation)

    // First in 'manage_goal.html'
    var goalElements = document.getElementsByClassName("current-goal");
    for (let i = 0; i < goalElements.length; i++)
    {
        const goalInfoElements = goalElements[i].getElementsByClassName("goal-info");
        for (let j = 0; j < goalInfoElements.length; j++)
        {
            const goalInfo = goalElements[i].getElementsByClassName("goal-info")[j];
            const goalInfoString = goalInfo.innerHTML;

            const startDateTimeString = goalInfoString.substring(goalInfoString.indexOf("Start date:") + 12, goalInfoString.indexOf("End date:") - 3);
            const startDateTimeStringUTC = startDateTimeString.replace(" ", "T") + "Z";
            const localStartDate = UTCToLocal(startDateTimeStringUTC);
            const formattedLocalStartDate = `${String(localStartDate.getMonth() + 1).padStart(2, '0')}-${String(localStartDate.getDate()).padStart(2, '0')}-${localStartDate.getFullYear()} ${timeZoneAbbreviation}`;
            goalInfo.innerHTML = goalInfo.innerHTML.replace(startDateTimeString, formattedLocalStartDate);

            // Edit end date for duration goal only. (clock only appears for duration goal)
            if (goalElements[i].getElementsByClassName("clock").length > 0)
            {
                const endDateTimeString = goalInfoString.substring(goalInfoString.indexOf("End date:") + 10);
                const endDateTimeStringUTC = endDateTimeString.replace(" ", "T") + "Z";
                const localEndDate = UTCToLocal(endDateTimeStringUTC);
                const formattedLocalEndDate = `${String(localEndDate.getMonth() + 1).padStart(2, '0')}-${String(localEndDate.getDate()).padStart(2, '0')}-${localEndDate.getFullYear()} ${timeZoneAbbreviation}`;
                goalInfo.innerHTML = goalInfo.innerHTML.replace(endDateTimeString, formattedLocalEndDate);
            }
        }
    }

    // Then in 'achievements.html'
    var achievementElements = document.getElementsByClassName("goal-achieved");
    for (let i = 0; i < achievementElements.length; i++)
    {
        const achievementInfoElements = achievementElements[i].getElementsByClassName("achievement-info");
        for (let j = 0; j < achievementInfoElements.length; j++)
        {
            const achievementInfo = achievementElements[i].getElementsByClassName("achievement-info")[j];
            const achievementInfoString = achievementInfo.innerHTML;

            const startDateTimeString = achievementInfoString.substring(achievementInfoString.indexOf("Start date:") + 12, achievementInfoString.indexOf("Date completed:") - 3);
            const startDateTimeStringUTC = startDateTimeString.replace(" ", "T") + "Z";
            const localStartDate = UTCToLocal(startDateTimeStringUTC);
            const formattedLocalStartDate = `${String(localStartDate.getMonth() + 1).padStart(2, '0')}-${String(localStartDate.getDate()).padStart(2, '0')}-${localStartDate.getFullYear()} ${timeZoneAbbreviation}`;
            achievementInfo.innerHTML = achievementInfo.innerHTML.replace(startDateTimeString, formattedLocalStartDate);

            const endDateTimeString = achievementInfoString.substring(achievementInfoString.indexOf("Date completed:") + 16);
            const endDateTimeStringUTC = endDateTimeString.replace(" ", "T") + "Z";
            const localEndDate = UTCToLocal(endDateTimeStringUTC);
            const formattedLocalEndDate = `${String(localEndDate.getMonth() + 1).padStart(2, '0')}-${String(localEndDate.getDate()).padStart(2, '0')}-${localEndDate.getFullYear()} ${timeZoneAbbreviation}`;
            achievementInfo.innerHTML = achievementInfo.innerHTML.replace(endDateTimeString, formattedLocalEndDate);
    }
    }

});





