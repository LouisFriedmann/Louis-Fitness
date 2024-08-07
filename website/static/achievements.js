// 'achievements.js' is responsible for all functions dedicated to achievements page

function addContentToViewAchievement(title, type, description, rate, duration, dateStarted, dateFinished)
{
    // Delete previous elements from container
    var elementsContainer = document.getElementById('view-full-achievement-elements');
    elementsContainer.innerHTML = "";

    // Add content to elements and append them to container
    var formHeader = document.createElement('h2');
    var br = document.createElement('br');
    var titleElement = document.createElement('h5');
    var otherAchievementInfoElement = document.createElement('h6');
    var descriptionElement = document.createElement('p');

    formHeader.innerHTML = "Full Goal Achieved";
    titleElement.innerHTML = title;
    if (type === 'Duration')
    {
        otherAchievementInfoElement.innerHTML = `Type: ${type} | Duration: ${duration} week | Rate: ${rate} days per week | Start date: ${dateStarted} | Date completed: ${dateFinished}`;
    }
    else
    {
        otherAchievementInfoElement.innerHTML = `Type: ${type} | Start date: ${dateStarted} | Date completed: ${dateFinished}`;
    }
    otherAchievementInfoElement.setAttribute("class", "other-achievement-info");
    descriptionElement.innerHTML = description;
    appendChildren(elementsContainer, [br.cloneNode(), formHeader, br.cloneNode(), titleElement, 
                   otherAchievementInfoElement, descriptionElement]);
}

// For the view achievement popup when it is clicked
function editFullAchievementDates()
{
    const achievementInfo = document.getElementById("view-full-achievement").querySelector(".other-achievement-info");
    const achievementInfoString = achievementInfo.innerHTML;
    const now = new Date();
    const timeZoneAbbreviation = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now)
    .find(part => part.type === 'timeZoneName').value;
    
    // Extract inner HTML of achievement info and replace its start dates and end dates in UTC with user's local time
    var startDateTimeString = null;
    startDateTimeString = achievementInfoString.substring(achievementInfoString.indexOf("Start date:") + 12, achievementInfoString.indexOf("Date completed:") - 3);
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