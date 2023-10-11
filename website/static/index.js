process.stdin.setMaxListeners(15);

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

// change value of goal so when user opens popup to edit a goal, the initial values will be there
// and the . Same logic with the options. Then, store value of goal_id in hidden html element called goal_id
function changeGoalAndOpenPopup(title, description, type, formClassId, formId, goalFormId, goalId, durationAttributes)
{
   const goal_title = document.getElementById("edit-goal-title");
   goal_title.value = title;
   const goal_description = document.getElementById("edit-goal-description");
   goal_description.value = description;

   const form = document.getElementById(formId);

   // when a goal is of type duration, unhide the duration form elements and set their values appropriately
   if (durationAttributes != undefined)
   {
       const edit_goal_rate_div = document.getElementById("edit-goal-rate");
       const edit_goal_rate = document.getElementsByName("edit-goal-rate")[0];
       edit_goal_rate.value = durationAttributes[0];
       edit_goal_rate_div.hidden = false;

       const edit_goal_duration_div = document.getElementById("edit-goal-duration");
       const edit_goal_duration = document.getElementsByName("edit-goal-duration")[0];
       edit_goal_duration.value = durationAttributes[1];
       edit_goal_duration_div.hidden = false;
   }
   const goal_type = type;
   const selectElement = document.getElementById("edit-goal-type");
   for (let i = 0; i < selectElement.options.length; i++)
   {
        if (goal_type === selectElement.options[i].value)
        {
            selectElement.options[i].selected = true;
        }
   }

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
   newDescriptionLabel.textContent = "Workout Description:";
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

            console.log(newTitleInput.value.charAt(newTitleInput.value.length - 1));
            newTitleInput.value = newTitleInput.value.slice(0, -1);
            console.log("went through");
        }

        formContainer.insertBefore(newTitleLabel, submitButton);
        formContainer.insertBefore(newTitleInput, submitButton);
        formContainer.insertBefore(br.cloneNode(), submitButton);

        newDescriptionLabel = document.createElement("label");
        newDescriptionLabel.textContent = "Description:";
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
    // Here is the plan: we have the end date stored, so for the timer, subtract the time now from the end date
}







