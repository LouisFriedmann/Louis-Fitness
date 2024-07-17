function saveSignUpData()
{
    var username = document.getElementById('sign-up-username').value;
    var password = document.getElementById('sign-up-password').value;
    var confirmPassword = document.getElementById('sign-up-confirm-password').value;

    localStorage.setItem('sign-up-username', username);
    localStorage.setItem('sign-up-password', password);
    localStorage.setItem('sign-up-confirm-password', confirmPassword);
}

function saveLoginData()
{
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    localStorage.setItem('login-username', username);
    localStorage.setItem('login-password', password);
}

function loadSignUpData()
{
    var username = localStorage.getItem('sign-up-username');
    var password = localStorage.getItem('sign-up-password');
    var confirmPassword = localStorage.getItem('sign-up-confirm-password');
    
    if (username)
    {
        document.getElementById('sign-up-username').value = username;
    }
    if (password && !document.getElementById('sign-up-password').value)
    {
        document.getElementById('sign-up-password').value = password;
    }
    if (confirmPassword && !document.getElementById('sign-up-confirm-password').value)
    {
        document.getElementById('sign-up-confirm-password').value = confirmPassword;
    }
}

function loadLoginData()
{
    var username = localStorage.getItem('login-username');
    var password = localStorage.getItem('login-password');

    if (username)
    {
        document.getElementById('login-username').value = username;
    }
    if (password)
    {
        document.getElementById('login-password').value = password;
    }
}

function loadAndSaveAuthData()
{
    if (document.getElementById('sign-up-form'))
    {
        // Only save password and confirm password if they aren't blank (this means a password was generated and needs to be saved)
        var password = document.getElementById('sign-up-password').value;
        var confirmPassword = document.getElementById('sign-up-confirm-password').value;
        if (password && confirmPassword)
        {
            localStorage.setItem('sign-up-password', password);
            localStorage.setItem('sign-up-confirm-password', confirmPassword);
        }
        
        loadSignUpData();
    }
    if (document.getElementById('login-form'))
    {
        loadLoginData();
    }
}
window.onload = loadAndSaveAuthData;