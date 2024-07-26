// change value of workout so when user opens popup to edit a workout, the initial values will be there
// and the . Then, store value of goal_id in hidden html element called goal_id
function changeWorkoutAndOpenPopup(workoutId, workoutTitle, workoutDescription, workout_exercises, formClassId, formId)
{
    // First, delete all previous form container elements
    const elementsCreated = document.getElementById('edit-workout-elements-created');
    elementsCreated.innerHTML = "";

    // Then create and insert new elements in form
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
    newTitleInput.setAttribute("maxlength", "50");
    newTitleInput.setAttribute("required", "true");
    newTitleInput.setAttribute("name", "edit-workout-title");
    newTitleInput.value = workoutTitle;

    elementsCreated.appendChild(newTitleLabel);
    elementsCreated.appendChild(newTitleInput);
    elementsCreated.appendChild(br.cloneNode());

    var newDescriptionLabel = document.createElement("label");
    newDescriptionLabel.textContent = "Workout Description: ";
    var newDescriptionInput = document.createElement("input");
    newDescriptionInput.setAttribute("type", "text");
    newDescriptionInput.setAttribute("placeholder", "Enter workout description");
    newDescriptionInput.setAttribute("data-validate", "true");
    newDescriptionInput.setAttribute("maxlength", "200");
    newDescriptionInput.setAttribute("required", "true");
    newDescriptionInput.setAttribute("name", "edit-workout-description");
    newDescriptionInput.value = workoutDescription;

    elementsCreated.appendChild(newDescriptionLabel);
    elementsCreated.appendChild(newDescriptionInput);
    elementsCreated.appendChild(br.cloneNode());

    // Create the add exercise button and add it to elements created
    const newBreakLine = document.createElement("br");
    const newBreakLine1 = document.createElement("br");
    var addExerciseButton = document.createElement("button");
    addExerciseButton.setAttribute("type", "button");
    addExerciseButton.setAttribute("class", "button");
    addExerciseButton.setAttribute("name", "add-workout");
    addExerciseButton.onclick = function() {
        addExerciseElement('edit-workout', 'edit-workout-form', 'edit', 'edit-workout-submit-button', 'edit-workout-elements-created');
    };

    var plusSign = document.createElement("img");
    plusSign.setAttribute("src", "/static/images/plus_sign.png")
    plusSign.setAttribute("alt", "Add")
    plusSign.setAttribute("width", "35")
    plusSign.setAttribute("class", "plus-sign")
    plusSign.setAttribute("style", "display: block;")
    var addExerciseButtonLabel = document.createElement("span");
    addExerciseButtonLabel.setAttribute("style", "display: inline-flex;");
    addExerciseButtonLabel.setAttribute("class", "add-workout");
    addExerciseButtonLabel.textContent = "Add Exercise";

    elementsCreated.appendChild(newBreakLine);
    addExerciseButton.appendChild(plusSign);
    elementsCreated.appendChild(addExerciseButton);
    elementsCreated.appendChild(addExerciseButtonLabel);
    elementsCreated.appendChild(newBreakLine1);

    const exercises = workout_exercises[workoutId];
    var exerciseNumber = 1;
    var submitButton = document.getElementById('edit-workout-submit-button');
    const form = document.getElementById(formId);
    for (const [title, description] of exercises)
    {
        var breakLines = [br.cloneNode(), br.cloneNode(), br.cloneNode(), br.cloneNode()];

        var newHeaderTag = document.createElement("h4");
        newHeaderTag.innerText = "Next Exercise";
        newHeaderTag.align = "center";
        elementsCreated.appendChild(breakLines[0]);
        elementsCreated.appendChild(newHeaderTag);

        newTitleLabel = document.createElement("label");
        newTitleLabel.textContent = "Title:";
        newTitleInput = document.createElement("input");
        newTitleInput.setAttribute("type", "text");
        newTitleInput.setAttribute("placeholder", "Enter title");
        newTitleInput.setAttribute("data-validate", "true");
        newTitleInput.setAttribute("maxlength", "50");
        newTitleInput.setAttribute("required", "true");
        newTitleInput.setAttribute("name", "edit-workout-" + String(workoutId) + "-exercise-" + String(exerciseNumber) + "-title");

        newTitleInput.value = title;

        elementsCreated.appendChild(newTitleLabel);
        elementsCreated.appendChild(newTitleInput);
        elementsCreated.appendChild(breakLines[1]);

        newDescriptionLabel = document.createElement("label");
        newDescriptionLabel.textContent = "Description: ";
        newDescriptionInput = document.createElement("input");
        newDescriptionInput.setAttribute("type", "text");
        newDescriptionInput.setAttribute("placeholder", "Enter description");
        newDescriptionInput.setAttribute("data-validate", "true");
        newDescriptionInput.setAttribute("maxlength", "200");
        newDescriptionInput.setAttribute("required", "true");
        newDescriptionInput.setAttribute("name", "edit-workout-" + String(workoutId) + "-" + "exercise-description-" + String(exerciseNumber));
        newDescriptionInput.value = description;

        // create the delete button
        var deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.innerHTML = "Delete";
        deleteButton.style.width = "80px";
        deleteButton.style.height = "30px";
        deleteButton.style.backgroundColor = "red";

        // delete the two title and description elements on top of the button when it is clicked (the corresponding elements created in this function call)
        (function (titleLabel, titleInput, descriptionLabel, descriptionInput, headerTag, breakLines, button) {
            deleteButton.onclick = function() {
                titleLabel.remove();
                titleInput.remove();
                descriptionLabel.remove();
                descriptionInput.remove();
                headerTag.remove();
                for (var breakLine of breakLines)
                {
                    breakLine.remove();
                }
                button.remove();

                // Update submit button if form has all elements filled in
                const formInputs = form.querySelectorAll('input');
                const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
                if (allFilled) {
                    submitButton.disabled = false;
                }
            };
            })(newTitleLabel, newTitleInput, newDescriptionLabel, newDescriptionInput, newHeaderTag, breakLines, deleteButton);

        elementsCreated.appendChild(newDescriptionLabel);
        elementsCreated.appendChild(newDescriptionInput);
        elementsCreated.appendChild(breakLines[2]);
        elementsCreated.appendChild(deleteButton);
        elementsCreated.appendChild(breakLines[3]);

        exerciseNumber++;
    }
    submitButton.disabled = false;
    const workoutIdElement = document.getElementById("workout-id");
    workoutIdElement.value = workoutId;

    openPopup(formClassId);
}

// Add html element for a new exercise
function addExerciseElement(formContainerId, formId, nameKeyword, submitButtonId, elementsCreatedContainerId)
{   
    const formContainer = document.getElementById(formContainerId);
    const form = document.getElementById(formId);
    const elementsCreatedContainer = document.getElementById(elementsCreatedContainerId);

    // Get next exercise number
    
    // Handle case where there are no exercise elements added
    if (Array.from(elementsCreatedContainer.getElementsByTagName('h4')).filter(h4 => h4.innerHTML.includes('Exercise')) == 0)
    {
        var newExerciseNumber = 1;
    }
    else
    {
        const inputElements = elementsCreatedContainer.getElementsByTagName("input");
        const lastInputElementName = inputElements[inputElements.length - 1].name;
        const exerciseNumber = Number(String(lastInputElementName).substring(String(lastInputElementName).lastIndexOf('-') + 1));
        var newExerciseNumber = exerciseNumber + 1;
    }

    // create two new label and input elements for: Title of exercise and its description and a header for next exercise
    var titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    var titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("placeholder", "Enter title");
    titleInput.setAttribute("data-validate", "true");
    titleInput.setAttribute("maxlength", "50");
    titleInput.setAttribute("required", "true");
    titleInput.setAttribute("name", nameKeyword + "-exercise-title-" + String(newExerciseNumber));
    var newHeaderTag = document.createElement("h4");
    newHeaderTag.innerText = "Next Exercise"
    newHeaderTag.align = "center";

    var descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description:";
    var descriptionInput = document.createElement("input");
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("placeholder", "Enter description");
    descriptionInput.setAttribute("data-validate", "true");
    descriptionInput.setAttribute("maxlength", "200");
    descriptionInput.setAttribute("required", "true");

    descriptionInput.setAttribute("name", "exercise-description-" + String(newExerciseNumber));

    // create the delete button
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.innerHTML = "Delete";
    deleteButton.style.width = "80px";
    deleteButton.style.height = "30px";
    deleteButton.style.backgroundColor = "red";

    // delete the two title and description elements on top of the button when it is clicked (the corresponding elements created in this function call)
    const submitButton = document.getElementById(submitButtonId);
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
        newHeaderTag.remove();
        deleteButton.remove();

        // Update submit button if form has all elements filled in
        const formInputs = form.querySelectorAll('input');
        const allFilled = Array.from(formInputs).every(input => input.value.trim() !== '');
        if (allFilled)
        {
            submitButton.disabled = false;
        }
    };

    var br = document.createElement("br");
    var br1 = br.cloneNode();
    var br2 = br.cloneNode();
    var br3 = br.cloneNode();
    var br4 = br.cloneNode();

    elementsCreatedContainer.appendChild(br1);
    elementsCreatedContainer.appendChild(newHeaderTag);
    elementsCreatedContainer.appendChild(titleLabel);
    elementsCreatedContainer.appendChild(titleInput);
    elementsCreatedContainer.appendChild(br2);
    elementsCreatedContainer.appendChild(descriptionLabel);
    elementsCreatedContainer.appendChild(descriptionInput);
    elementsCreatedContainer.appendChild(br3);
    elementsCreatedContainer.appendChild(deleteButton);
    elementsCreatedContainer.appendChild(br4);

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

// User must check at least one checkbox for schedule form to be enabled
function checkScheduleForm()
{
    function checkScheduleFormValidity(event)
    {
        const form = event.target.closest("form");
        if (form)
        {
            console.log(form.id);
            if (form.id === 'schedule-workout-form')
            {
                const submitButton = document.getElementById("schedule-submit-button");
                for (inputElement of form.querySelectorAll('input'))
                {
                    if (inputElement.checked)
                    {
                        submitButton.disabled = false;
                        return;
                    }
                }
                submitButton.disabled = true;
            }
        }
    }
    document.addEventListener("input", checkScheduleFormValidity);
    document.addEventListener("click", checkScheduleFormValidity);
}
document.addEventListener("DOMContentLoaded", checkScheduleForm);

// Adding content to view full workout
function addContentToViewWorkout(workoutTitle, workoutDescription, workoutExercises, workoutId)
{
    // First, remove previous content
    const elementsContainer = document.getElementById('view-full-workout-elements');
    elementsContainer.innerHTML = "";

    // Then, create and insert 'Full Workout' label, title and description
    const fullWorkoutLabel = document.createElement('h2');
    fullWorkoutLabel.innerHTML = "Full Workout"
    const workoutTitleElement = document.createElement('h3');
    workoutTitleElement.innerHTML = workoutTitle;
    const workoutDescriptionElement = document.createElement('p');
    workoutDescriptionElement.innerHTML = workoutDescription;
    const br = document.createElement('br');

    elementsContainer.appendChild(br.cloneNode());
    elementsContainer.appendChild(fullWorkoutLabel);
    elementsContainer.appendChild(workoutTitleElement);
    elementsContainer.appendChild(workoutDescriptionElement);
    elementsContainer.appendChild(br.cloneNode());

    // Then, create and append each exercise
    const exercises = workoutExercises[workoutId];

    for (const [title, description] of exercises)
    {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.setAttribute("class", "current-exercise")
        const exerciseLabel = document.createElement('h5');
        exerciseLabel.innerHTML = "Next Exercise";
        const exerciseTitle = document.createElement('h6');
        exerciseTitle.innerHTML = title;
        const exerciseDescription = document.createElement('h7');
        exerciseDescription.innerHTML = description;

        exerciseDiv.appendChild(exerciseLabel);
        exerciseDiv.appendChild(exerciseTitle);
        exerciseDiv.appendChild(exerciseDescription);
        elementsContainer.appendChild(exerciseDiv);
        elementsContainer.appendChild(br.cloneNode());
        elementsContainer.appendChild(br.cloneNode());
        elementsContainer.appendChild(br.cloneNode());
    }
}