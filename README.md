# Louis Fitness
Welcome to Louis Fitness, the website that allows you to set new goals for yourself, create new workouts, and keep track of your progress! 

View the official website here: <a href="https://louisfit.pythonanywhere.com" target="_blank">https://louisfit.pythonanywhere.com</a>

## __Overview__
"Louis Fitness" is a free-to-use website, allowing its users to set fitness goals for themselves, make their own workouts, and view their achievements in a simple and organized way. 

## __Technologies/libraries__
Flask, django, flask-sqlalchemy.

## __After creating an account__
Once a user has signed up for an account (don't forget to try out our password generator) and agreed to our very important and __totally serious__ terms of use and privacy policy pages, they will be redirected to our fabulous homepage and there, greeted by the man, the myth, the legend: David Goggins, in order to inspire and motivate them.

## __Taking a look at the navbar__
After signing up/logging in, users will see our 3 main routes in our website:

__Manage goals__: In "manage goals," users can choose to click one of our built-in goals or they can make their own custom goal. They can make goals targeted to either setting a personal record, accomplishing a goal under a certain amount of time, or losing/gaining weight. Once they've made a goal, they can view its details to see it close up, or on smaller-width devices (mobile devices) to see the full goal since only the title of each goal will be displayed on these devices to conserve space on the website. They can also edit and delete their goals. Best of all, they can complete their goals and view their completed goals in one of our other pages: __Achievements__, or if the goal is time based, finish it for the week and click "finish" to say that they finished the requirements for the goal for the week (without cheating the system, obviously :)). After completing the required weeks, the goal will automatically be sent to __Achievements__. However, if the user doesn't finish the goal in the amount of time given for any week, the goal will automatically be deleted.

__Manage workouts__: In "manage workouts," users can create workouts and add exercises to them. Each time a request is sent to this route (ex: reload, submitting a form), a random motivational quote is displayed. They can also edit their workouts, schedule them for some amount of days of the week in order to stay organized, view details (just like manage goals, except the user can't see all the exercises on devices of bigger widths so they will need to push details button to see full workouts. Just workout titles are displayed on devices of smaller widths and details button allows user to view their full workout). And of course, users can delete their workouts.

__Achievements__: In "achievements," users can view the goals they have accomplished (same idea with the details button as __manage goals__) and if they have accomplished 3 or more goals of the same type, a built-in award will be displayed to showcase their accomplishment!
