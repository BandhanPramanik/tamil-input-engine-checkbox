const buttons = document.querySelectorAll("[data-vowel-or-consonant-mode]");
const sections = document.querySelectorAll('[id$="-section"]');


function setMode(vowelOrConsonantMode)
{
	if (vowelOrConsonantMode === "vowel-mode" && buttons[0].getAttribute("aria-pressed") === "true" ||
		vowelOrConsonantMode === "consonant-mode" && buttons[1].getAttribute("aria-pressed") === "true")
		return;

	buttons[0].setAttribute(
			"aria-pressed",
			buttons[0].dataset.vowelOrConsonantMode === vowelOrConsonantMode
		);
	buttons[1].setAttribute(
			"aria-pressed",
			buttons[1].dataset.vowelOrConsonantMode === vowelOrConsonantMode
		);


	const vowel_section = document.querySelector("#vowel-section");
	const consonant_section = document.querySelector("#consonant-section");
	vowel_section.hidden = vowelOrConsonantMode !== "vowel-mode";
	consonant_section.hidden = vowelOrConsonantMode !== "consonant-mode";


	sections.forEach(section => {
		section.querySelectorAll('input[type="radio"]')
		.forEach(radio => radio.checked = false);
	});

	document.querySelectorAll(".fine-fieldset").forEach(section => section.hidden = true);
}

function appearFine(event, obj)
{
	// might not occur if 
	// we are selecting coarse again after making fine appear
	obj.nextElementSibling.hidden = false; 

	// for validity lines
	const cluster = Number(event.target.value);
}


function processFine(event, obj)
{
    const fineRadios = document.getElementsByName(event.target.name);
    if (event.target.name === "consonant-fine-position")
    {
        if(event.target.id === "consonant-fine-idaiyinam")
            return;
        // here
    }
    if (event.target.name === "fine-idaiyinam-position")
    {
        // here
    }
    if (event.target.name === "vowel-fine-position")
    {
        // here
    }   
}