const peopleCount = document.getElementById("peopleCount");
peopleCount.addEventListener("input", function () {
    // Hide all name inputs and make not-required
    Array.from(document.getElementsByClassName("name-input")).forEach(function (item) {
        item.style.display = "none";
        item.removeAttribute("required");
    })

    document.getElementById("peopleCountInvalid").style.display = "block";

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
            document.getElementById("peopleCountInvalid").style.display = "none";
    }
});

function submitForm() {
    $.ajax({
        type: "POST",
        url: "api/plan",
        data: $("#form").serialize(), // serializes the form's elements.
        success: function(data) {
            $("#formSection").slideUp();

            data = JSON.parse(data);

            document.getElementById("costumeImg").setAttribute("src", data.costumeImg);
            document.getElementById("costumeText").innerText = data.costume + "!";
            document.getElementById("storyBlock").innerText = data.story;

            $("#plan").slideDown();
        }
    });
}

const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (form.checkValidity()) {
        // empty any name fields which aren't included in the number of participants
        switch (peopleCount.value) {
            case "1":
                document.getElementById("name1").value = "";
            case "2":
                document.getElementById("name2").value = "";
            case "3":
                document.getElementById("name3").value = "";
            case "4":
                document.getElementById("name4").value = "";
            case "5":
                document.getElementById("name5").value = "";
        }

        submitForm();
    }
});

document.getElementById("regenerate").addEventListener("click", submitForm);

// Initialise timepicker interface
$('.timepicker').timepicker({
    timeFormat: 'HH:mm',
    defaultTime: '18',
    dynamic: true,
    dropdown: true,
    scrollbar: true
});