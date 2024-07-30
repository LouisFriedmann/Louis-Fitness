// 'manage_workouts.js' is responsible for all functions dedicated to manage workouts page

// change value of workout so when user opens popup to edit a workout, the initial values will be there
// Then, store value of workout_id in hidden html element called workoutId
function changeWorkoutAndOpenPopup(workoutId, workoutTitle, workoutDescription, workoutExercises, formClassId, formId)
{
    // First, delete all previous form container elements
    const elementsCreated = document.getElementById('edit-workout-elements-created');
    elementsCreated.innerHTML = "";

    // Create title, description, and add exercise element(s)
    var workoutTitleElement = document.createElement("input");
    var workoutDescriptionElement = document.createElement("input");
    var br = document.createElement("br");
    var newTitleLabel = document.createElement("label");
    var newTitleInput = document.createElement("input");
    var newDescriptionLabel = document.createElement("label");
    var newDescriptionInput = document.createElement("input");
    var addExerciseButton = document.createElement("button");
    var plusSign = document.createElement("img");
    var addExerciseButtonLabel = document.createElement("span");

    // Add content to them
    workoutTitleElement.value = workoutTitle;
    workoutDescriptionElement.value = workoutDescription;
    newTitleLabel.textContent = "Workout Title:";
    setAttributes(newTitleInput, {"type": "text", "placeholder": "Enter workout title", 
                 "data-validate": "true", "maxlength": "50", "required": "true", "name": "edit-workout-title", "value": workoutTitle});
    newDescriptionLabel.textContent = "Workout Description: ";
    setAttributes(newDescriptionInput, {"type": "text", "placeholder": "Enter workout description",
                  "data-validate": "true", "maxlength": "200", "required": "true", "name": "edit-workout-description", "value": workoutDescription});
    setAttributes(addExerciseButton, {"type": "button", "class": "add-button", "name": "add-workout"});
    addExerciseButton.onclick = function()
    {
        addExerciseElement('edit-workout-form', 'edit', 'edit-workout-submit-button', 'edit-workout-elements-created', 'edit-workout');
    };
    setAttributes(plusSign, {"src": "/static/images/plus_sign.png", "alt": "add", "width": "35",
                 "class": "plus-sign", "style": "display: block;"});
    setAttributes(addExerciseButtonLabel, {"style": "display: inline-flex;", "class": "plus-sign-button-label"});
    addExerciseButtonLabel.textContent = "Add Exercise";
    
    // Append them to container
    addExerciseButton.appendChild(plusSign);
    appendChildren(elementsCreated, [newTitleLabel, newTitleInput, br.cloneNode(), newDescriptionLabel, newDescriptionInput, br.cloneNode(),
                   br.cloneNode(), addExerciseButton, addExerciseButtonLabel, br.cloneNode()]);

    // To the same thing (create, add content, append to container) with each exercise
    const exercises = workoutExercises[workoutId];
    var exerciseNumber = 1;
    var submitButton = document.getElementById('edit-workout-submit-button');
    const form = document.getElementById(formId);

    for (const [title, description] of exercises)
    {
        // create the elements
        newHeaderTag = document.createElement("h4");
        newTitleLabel = document.createElement("label");
        newTitleInput = document.createElement("input");
        newDescriptionLabel = document.createElement("label");
        newDescriptionInput = document.createElement("input");
        var deleteButton = document.createElement("button");
        var breakLines = [br.cloneNode(), br.cloneNode(), br.cloneNode(), br.cloneNode()];

        // Edit their contents
        newHeaderTag.innerText = "Next Exercise";
        newHeaderTag.align = "center";
        newTitleLabel.textContent = "Title:";
        setAttributes(newTitleInput, {"type": "text", "placeholder": "Enter title",
                     "data-validate": "true", "maxlength": "50", "required": "true", "name": "edit-workout-" + String(workoutId) + "-exercise-" + String(exerciseNumber) + "-title", 
                     "value": title});
        newDescriptionLabel.textContent = "Description: ";
        setAttributes(newDescriptionInput, {"type": "text", "placeholder": "Enter description",
                    "data-validate": "true", "maxlength": "200", "required": "true", "name": "edit-workout-" + String(workoutId) + "-" + "exercise-description-" + String(exerciseNumber), 
                    "value": description});
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
        
        // Append them to form
        appendChildren(elementsCreated, [breakLines[0], newHeaderTag, newTitleLabel, newTitleInput,
                      breakLines[1], newDescriptionLabel, newDescriptionInput, breakLines[2], deleteButton, breakLines[3]]);

        exerciseNumber++;
    }
    submitButton.disabled = false;
    const workoutIdElement = document.getElementById("workout-id");
    workoutIdElement.value = workoutId;

    openPopup(formClassId);
}

// Add html element for a new exercise
function addExerciseElement(formId, nameKeyword, submitButtonId, elementsCreatedContainerId, popupContainerId)
{   
    const form = document.getElementById(formId);
    const elementsCreatedContainer = document.getElementById(elementsCreatedContainerId);

    // Get next exercise number to add to name of title and description inputs
    
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

    // create, add content, append to container: two new label and input elements for: Title of exercise and its description and a header for next exercise
    // and a button for deleting exercises
    var titleLabel = document.createElement("label");
    var titleInput = document.createElement("input");
    var newHeaderTag = document.createElement("h4");
    var descriptionLabel = document.createElement("label");
    var descriptionInput = document.createElement("input");
    var deleteButton = document.createElement("button");
    var br = document.createElement("br");
    const breakLines = [br.cloneNode(), br.cloneNode(), br.cloneNode(), br.cloneNode()];

    titleLabel.textContent = "Title:";
    setAttributes(titleInput, {"type": "text", "placeholder": "Enter title",
                "data-validate": "true", "maxlength": "50", "required": "true", "name": nameKeyword + "-exercise-title-" + String(newExerciseNumber)});
    titleInput.setAttribute("name", nameKeyword + "-exercise-title-" + String(newExerciseNumber));
    newHeaderTag.innerText = "Next Exercise"
    newHeaderTag.align = "center";
    descriptionLabel.textContent = "Description:";
    setAttributes(descriptionInput, {"type": "text", "placeholder": "Enter description",
        "data-validate": "true", "maxlength": "200", "required": "true", "name": "exercise-description-" + String(newExerciseNumber)});
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
        for (var breakLine of breakLines)
        {
            breakLine.remove();
        }
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

    appendChildren(elementsCreatedContainer, [breakLines[0], newHeaderTag, titleLabel, titleInput, breakLines[1],
                  descriptionLabel, descriptionInput, breakLines[2], deleteButton, breakLines[3]]);
    
    // Move popup back into border if its going off bottom border
    const margin = 10;
    const viewportHeight = window.innerHeight;
    const popupContainer = document.getElementById(popupContainerId);
    const popupRect = popupContainer.getBoundingClientRect();

    if (popupRect.bottom > viewportHeight)
    {
        popupContainer.style.top = `${window.scrollY + viewportHeight - popupContainer.offsetHeight - margin}px`;
    }

}

// Add hidden scheduled workout id to schedule workout form
function addScheduledWorkoutId(scheduleFormId, workoutId)
{
    form = document.getElementById(scheduleFormId);

    var hiddenInput = document.createElement('input');
    setAttributes(hiddenInput, {"type": "hidden", "name": "scheduled-workout", "value": workoutId});
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
            if (form.id === 'schedule-workout-form')
            {
                const submitButton = document.getElementById("schedule-submit-button");

                for (var inputElement of form.querySelectorAll('input'))
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
function addContentToViewWorkout(workoutTitle, workoutDescription, workoutExercises, workoutId, dayScheduled)
{
    // First, remove previous content
    const elementsContainer = document.getElementById('view-full-workout-elements');
    elementsContainer.innerHTML = "";

    // Then, create, insert, and append to container the 'Full Workout' label, title and description
    const header = document.createElement('h2');
    const workoutTitleElement = document.createElement('h3');
    const workoutDescriptionElement = document.createElement('p');
    const br = document.createElement('br');

    if (dayScheduled)
    {
        header.innerHTML = dayScheduled;
    }
    else
    {
        header.innerHTML = "Full Workout";
    }
    workoutTitleElement.innerHTML = workoutTitle;
    workoutDescriptionElement.innerHTML = workoutDescription;

    appendChildren(elementsContainer, [br.cloneNode(), header, workoutTitleElement, workoutDescriptionElement,
                  br.cloneNode()]);

    // Then, create, add content to, and append each exercise
    const exercises = workoutExercises[workoutId];

    for (const [title, description] of exercises)
    {
        const exerciseDiv = document.createElement('div');
        const exerciseLabel = document.createElement('h5');
        const exerciseTitle = document.createElement('h6');
        const exerciseDescription = document.createElement('h7');

        exerciseDiv.setAttribute("class", "current-exercise")
        exerciseLabel.innerHTML = "Next Exercise";
        exerciseTitle.innerHTML = title;
        exerciseDescription.innerHTML = description;
        
        appendChildren(exerciseDiv, [exerciseLabel, exerciseTitle, exerciseDescription]);
        appendChildren(elementsContainer, [exerciseDiv, br.cloneNode(), br.cloneNode(), br.cloneNode()]);
    }
}

// Set multiple attributes on an element at once
function setAttributes(element, attributesValues)
{
    for (const [attribute, value] of Object.entries(attributesValues))
    {
        element.setAttribute(attribute, value);
    }
}