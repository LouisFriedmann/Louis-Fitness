// change value of workout so when user opens popup to edit a workout, the initial values will be there
// and the . Then, store value of goal_id in hidden html element called goal_id
function changeWorkoutAndOpenPopup(workoutId, workoutTitle, workoutDescription, workouts, formClassId, formId)
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
    newTitleInput.setAttribute("maxlength", "100");
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
    newDescriptionInput.setAttribute("maxlength", "130");
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
    var plusSign = document.createElement("span");
    plusSign.setAttribute("class", "align-with-button")
    plusSign.textContent = "+";
    var addExerciseButtonLabel = document.createElement("span");
    addExerciseButtonLabel.setAttribute("style", "display: inline;");
    addExerciseButtonLabel.setAttribute("class", "add-workout");
    addExerciseButtonLabel.textContent = "Add Exercise";

    elementsCreated.appendChild(newBreakLine);
    addExerciseButton.appendChild(plusSign);
    elementsCreated.appendChild(addExerciseButton);
    elementsCreated.appendChild(addExerciseButtonLabel);
    elementsCreated.appendChild(newBreakLine1);

    const exercises = workouts[workoutTitle][1];
    var exerciseNumber = 1;
    var submitButton = document.getElementById('edit-workout-submit-button');
    const form = document.getElementById(formId);
    for (let key2 in exercises)
    {
        var breakLines = [br.cloneNode(), br.cloneNode(), br.cloneNode(), br.cloneNode()];

        var newHeaderTag = document.createElement("h4");
        newHeaderTag.innerText = "Exercise " + String(exerciseNumber);
        newHeaderTag.align = "center";
        elementsCreated.appendChild(breakLines[0]);
        elementsCreated.appendChild(newHeaderTag);

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

        elementsCreated.appendChild(newTitleLabel);
        elementsCreated.appendChild(newTitleInput);
        elementsCreated.appendChild(breakLines[1]);

        newDescriptionLabel = document.createElement("label");
        newDescriptionLabel.textContent = "Description: ";
        newDescriptionInput = document.createElement("input");
        newDescriptionInput.setAttribute("type", "text");
        newDescriptionInput.setAttribute("placeholder", "Enter description");
        newDescriptionInput.setAttribute("data-validate", "true");
        newDescriptionInput.setAttribute("maxlength", "100");
        newDescriptionInput.setAttribute("required", "true");
        newDescriptionInput.setAttribute("name", "edit-workout" + String(workoutId) + "-" + "exercise-description-" + String(exerciseNumber));
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
    titleInput.setAttribute("maxlength", "100");
    titleInput.setAttribute("required", "true");
    titleInput.setAttribute("name", nameKeyword + "-exercise-title-" + String(newExerciseNumber));
    titleInput.setAttribute("pattern", "[^0-9]*"); // only allow non-numeric characters
    titleInput.setAttribute("title", "Numeric characters are NOT allowed here");
    var newHeaderTag = document.createElement("h4");
    newHeaderTag.innerText = "Exercise " + String(newExerciseNumber);
    newHeaderTag.align = "center";

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