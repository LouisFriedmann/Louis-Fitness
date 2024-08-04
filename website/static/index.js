// 'index.js' is responsible for having functions to be used across multiple files

// Note: Any function used in or is an event listener for: two or more files will be in this file

function openPopup(id)
{
    const popup = document.getElementById(id);
    popup.style.display = "block";

    // Wait a second for content to load if popup is view full goal to give time for c
    const viewFullGoalElements = document.getElementById('view-full-goal-elements');
    if (viewFullGoalElements)
    {
        // Display clock immediately for view goal popup
        if (id == 'view-full-goal')
        {
            if (popup.querySelector('.clock'))
            {
                editViewGoalClock(); // Height of the form takes into account the height of the clock
            }

        }
    }

    // Center the popup at the mouse position
    const adjustedY = mouseY - popup.offsetHeight / 2;
    popup.style.top = `${adjustedY}px`;

    // Adjust popup position if it goes out of the viewport
    const margin = 10;
    const viewportHeight = window.innerHeight;
    const popupRect = popup.getBoundingClientRect();
    
    // Check if the popup is going past the bottom of the viewport
    if (popupRect.bottom > viewportHeight)
    {
        popup.style.top = `${window.scrollY + viewportHeight - popup.offsetHeight - margin}px`;
    }
    
    // Check if the popup is going past the top of the viewport
    if (popupRect.top < 0)
    {
        popup.style.top = `${window.scrollY + margin}px`;
    }
}

// Update mouse vertical position for when openPopup is called
let mouseY;
document.addEventListener('mousemove', function(event)
{
    mouseY = event.clientY + window.scrollY;
});

function closePopup(id)
{
    document.getElementById(id).style.display = "none";
}

// this EXCLUDES the sign up and login forms
function checkPopupForm()
{
     function checkPopupFormValidity(event)
     {
          
        const form = event.target.closest("form");
        if (form && form.id != "sign-up-form" && form.id != "login-form")
        {
            // Ensure all required input elements are filled out before allowing form submission
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

function UTCToLocal(datetimeString)
{
    const utcStartDate = new Date(datetimeString);
    const localStartDate = new Date(utcStartDate.toLocaleString());
    return localStartDate;
}

// Change dates to reflect local times
document.addEventListener('DOMContentLoaded', function()
{
    const now = new Date();
    const timeZoneAbbreviation = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now)
    .find(part => part.type === 'timeZoneName').value;

    // First in 'manage_goal.html'
    let goalElements = document.querySelectorAll('.rectangle.current-goal');
    for (let i = 0; i < goalElements.length; i++)
    {
        // Get goalInfo string
        const goalInfo = goalElements[i].getElementsByClassName("goal-info")[0];
        const goalInfoString = goalInfo.innerHTML;
        
        // Extract datetime string from what is being originally displayed in HTML based on if goal if duration or not.
        // End date only appears for duration goals (clock only appears for duration goal)
        var startDateTimeString = null;
        if (goalElements[i].getElementsByClassName("clock").length > 0)
        {
            startDateTimeString = goalInfoString.substring(goalInfoString.indexOf("Start date:") + 12, goalInfoString.indexOf("End date:") - 3);
        }
        else
        {
            startDateTimeString = goalInfoString.substring(goalInfoString.indexOf("Start date:") + 12);
        }

        // Convert the datetime string extracted from UTC to the user's local timezone,
        // format it, and replace the HTML accordingly
        const startDateTimeStringUTC = startDateTimeString.replace(" ", "T") + "Z";
        const localStartDate = UTCToLocal(startDateTimeStringUTC);
        const formattedLocalStartDate = `${String(localStartDate.getMonth() + 1).padStart(2, '0')}-${String(localStartDate.getDate()).padStart(2, '0')}-${localStartDate.getFullYear()} ${timeZoneAbbreviation}`;
        goalInfo.innerHTML = goalInfo.innerHTML.replace(startDateTimeString, formattedLocalStartDate);

        // Do the same for end date but only if the goal is of type duration
        if (goalElements[i].getElementsByClassName("clock").length > 0)
        {
            const endDateTimeString = goalInfoString.substring(goalInfoString.indexOf("End date:") + 10);
            const endDateTimeStringUTC = endDateTimeString.replace(" ", "T") + "Z";
            const localEndDate = UTCToLocal(endDateTimeStringUTC);
            const formattedLocalEndDate = `${String(localEndDate.getMonth() + 1).padStart(2, '0')}-${String(localEndDate.getDate()).padStart(2, '0')}-${localEndDate.getFullYear()} ${timeZoneAbbreviation}`;
            goalInfo.innerHTML = goalInfo.innerHTML.replace(endDateTimeString, formattedLocalEndDate);
        }
    }

    // Then in 'achievements.html'
    let achievementElements = document.querySelectorAll('.rectangle.goal-achieved-rectangle');
    for (let i = 0; i < achievementElements.length; i++)
    {
        // Get achievement info string
        const achievementInfo = achievementElements[i].getElementsByClassName("achievement-info")[0];
        const achievementInfoString = achievementInfo.innerHTML;
        
        // Convert start date and end date from UTC to user's local timezone from extracted HTML, then replace HTML with user's local time
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

});

// Confirm deletion with delete buttons
function confirmDelete(event, name)
{
    // Show a confirmation dialog
    if (!confirm(`Are you sure you want to delete this ${name}?`)) {
        // Prevent the default action (navigation) if the user clicks "Cancel"
        event.preventDefault();
    }
}

// Append multiple children to a container in the order that they appear in the list
function appendChildren(container, children)
{
    for (const child of children)
    {
        container.appendChild(child);
    }
}