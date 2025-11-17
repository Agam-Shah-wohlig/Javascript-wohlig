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


outer: for(let i=0; i<3;i++){
    console.log(i);
    
    for(let j=0;j<3;j++){
        if(i===1 && j===1){
            continue outer;
        }
        console.log(`i = ${i}, j = ${j}`);
    }
}
