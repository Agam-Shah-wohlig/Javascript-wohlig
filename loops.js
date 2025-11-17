let i,j;
for (i=0;i<5;i++)
    {
        let star = "";
    for (j=0;j<=i;j++)
        {
        star = star + "*";
    }

    console.log(`${star}`);
    document.getElementById("loops").innerHTML += star + "<br>";
}

