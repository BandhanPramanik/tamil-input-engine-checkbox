const buttons = document.querySelectorAll("[data-vowel-or-consonant-mode]");
const sections = document.querySelectorAll('[id$="-section"]');

function setMode(vowelOrConsonantMode)
{
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
}


