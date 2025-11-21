// Normal Event Handling

  document.getElementById("child1").addEventListener("click", function() {
    console.log("Child 1 clicked");
  });

  document.getElementById("child2").addEventListener("click", function() {
    console.log("Child 2 clicked");
  });

//Event Delegation

document.getElementById("parent2").addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
      console.log(e.target.id + " clicked");
    }
  });