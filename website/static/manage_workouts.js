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
   var br1 = br.cloneNode();
   var br2 = br.cloneNode();
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
   newDescriptionInput.setAttribute("maxlength", "130");
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

    // create the delete button
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.innerHTML = "Delete";
    deleteButton.style.width = "80px";
    deleteButton.style.height = "30px";
    deleteButton.style.backgroundColor = "red";

    // delete the two title and description elements on top of the button when it is clicked (the corresponding elements created in this function call)
    deleteButton.onclick = function()
    {
        newTitleLabel.remove();
        newTitleInput.remove();
        newDescriptionLabel.remove();
        newDescriptionInput.remove();
        deleteButton.remove();
        br.remove();
        br1.remove();
        br2.remove();

        // Update submit button if form has all elements filled in
        const formInputs = form.querySelectorAll('input');
        const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
        if (allFilled)
        {
            submitButton.disabled = false;
        }
    };

        formContainer.insertBefore(newDescriptionLabel, submitButton);
        formContainer.insertBefore(newDescriptionInput, submitButton);
        formContainer.insertBefore(br, submitButton);
        formContainer.insertBefore(deleteButton, submitButton);
        formContainer.insertBefore(br1, submitButton);
        formContainer.insertBefore(br2, submitButton);

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
    const exerciseNumber = Number(String(lastInputElementName).charAt(lastInputElementName.length - 1));
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

    // create the delete button
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.innerHTML = "Delete";
    deleteButton.style.width = "80px";
    deleteButton.style.height = "30px";
    deleteButton.style.backgroundColor = "red";

    // delete the two title and description elements on top of the button when it is clicked (the corresponding elements created in this function call)
    deleteButton.onclick = function()
    {
        titleLabel.remove();
        titleInput.remove();
        descriptionLabel.remove();
        descriptionInput.remove();
        br1.remove();
        br2.remove();
        br3.remove();
        br4.remove();
        deleteButton.remove();

        // Update submit button if form has all elements filled in
        const formInputs = form.querySelectorAll('input');
        const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
        if (allFilled)
        {
            submitButton.disabled = false;
        }
    };

    // Append them to form before the submit button, adding a break line afterwards
    const buttons = form.getElementsByTagName("button");
    const submitButton = buttons[buttons.length - 1]; // submit button is last button in form

    var br = document.createElement("br");
    var br1 = br.cloneNode();
    var br2 = br.cloneNode();
    var br3 = br.cloneNode();
    var br4 = br.cloneNode();
    formContainer.insertBefore(titleLabel, submitButton);
    formContainer.insertBefore(titleInput, submitButton);
    formContainer.insertBefore(br1, submitButton);
    formContainer.insertBefore(descriptionLabel, submitButton);
    formContainer.insertBefore(descriptionInput, submitButton);
    formContainer.insertBefore(br2, submitButton);
    formContainer.insertBefore(deleteButton, submitButton);
    formContainer.insertBefore(br3, submitButton);
    formContainer.insertBefore(br4, submitButton);

    // Insert a space between the label and the input element

}

// Add hidden scheduled workout id to schedule workout form
function addScheduledWorkoutId(scheduleFormId, workoutId)
{
    form = document.getElementById(scheduleFormId);

    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', "scheduled-workout");
    hiddenInput.setAttribute('value', workoutId);

    form.appendChild(hiddenInput);


}