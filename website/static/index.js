// Any function used in or is an event listener for: two or more files will be in this file

function openPopup(id)
{
    document.getElementById(id).style.display = "block";
}

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
              console.log("went through");
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
            const startDateTimeStringUTC = startDateTimeString.replace(" ", "T") + "Z";
            const localStartDate = UTCToLocal(startDateTimeStringUTC);
            const formattedLocalStartDate = `${String(localStartDate.getMonth() + 1).padStart(2, '0')}-${String(localStartDate.getDate()).padStart(2, '0')}-${localStartDate.getFullYear()} ${timeZoneAbbreviation}`;
            goalInfo.innerHTML = goalInfo.innerHTML.replace(startDateTimeString, formattedLocalStartDate);

            // Edit end date for duration goal only. 
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




