let peopleCount = document.getElementById("peopleCount");
peopleCount.addEventListener("input", function () {
    // Hide all name inputs and make not-required
    Array.from(document.getElementsByClassName("name-input")).forEach(function (item) {
        item.style.display = "none";
        item.removeAttribute("required");
    })

    function displayAndRequire(element) {
        element.style.display = "block";
        element.setAttribute("required", "");
    }

    switch (peopleCount.value) {
        case "6":
            displayAndRequire(document.getElementById("name5"));
        case "5":
            displayAndRequire(document.getElementById("name4"));
        case "4":
            displayAndRequire(document.getElementById("name3"));
        case "3":
            displayAndRequire(document.getElementById("name2"));
        case "2":
            displayAndRequire(document.getElementById("name1"));
        case "1":
            displayAndRequire(document.getElementById("name0"));
    }
});

// Initialise timepicker interface
$('.timepicker').timepicker({
    timeFormat: 'HH:mm',
    defaultTime: '18',
    dynamic: true,
    dropdown: true,
    scrollbar: true
});