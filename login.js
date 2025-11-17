let Username = prompt("Wnter who you are?", "Null");
let isUserLoggedIn = false;

if (Username == "Admin"){
    let password = prompt("Enter the password", "Null");

    if (password == "TheMaster"){
        alert("Welcome");
        isUserLoggedIn = true;
    }
    else if (password== null || password == ""){
        alert("Cancelled");

    }
    else{
        alert("Wrong password");
    }
}

else if (Username == null || Username == ""){
    alert("Cancelled");    
}
else{
    alert("I don't know you");
}

if (isUserLoggedIn){
    document.getElementById("welcome").classList.remove("hidden");
}