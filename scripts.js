const buttons = document.querySelectorAll("[data-vowel-or-consonant-mode]");
const sections = document.querySelectorAll('[id$="-section"]');
const textplace = document.querySelector("textarea");
const errorContainer = document.getElementById("error-message");
let group, coarseValidity, fineFeatures, isIdaiyinamSubAppearing, pos;

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

    clearOptions();
}

function clearOptions()
{
    sections.forEach(section => uncheckRadios(section));
    setVisibilityIdaiyinamSubOptions(false);
    uncheckExtended();
    document.querySelectorAll(".fine-fieldset").forEach(section => section.hidden = true);
}

function uncheckExtended()
{
    document.getElementById("vowel-alpha-checkbox").checked = false;
    document.getElementById("vowel-extended-section").hidden = true;
    document.getElementById("vowel-normal-section").hidden = false;

    document.getElementById("consonant-alpha-checkbox").checked = false;
    document.getElementById("consonant-extended-section").hidden = true;
    document.getElementById("consonant-normal-section").hidden = false;
}

function uncheckRadios(section)
{
    section.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
}

function setVisibilityIdaiyinamSubOptions(willBeVisible)
{
    const idaiyinamOptions = document.getElementById("idaiyinam-sub-options");
    idaiyinamOptions.hidden = !willBeVisible;
}

async function appearFine(event, obj)
{
    // for validity lines
    group = event.target.value;
    if (event.target.name === "consonant-coarse-position")
    {
        const { rewriteClusterPosition, findCoarseValidity } = await import("./js/consonant.js");
        // Phase: ACCUMULATING-1, varga state updated
        const coarsePositions = rewriteClusterPosition(group);
        // Phase: VALIDATING-1
        coarseValidity = findCoarseValidity(coarsePositions);
        // Will the sub-options of Idaiyinam appear if the user selects it?
        // Prep for VALIDATING-3
        // also, c_i becoming 10 is what we want only
        isIdaiyinamSubAppearing = coarseValidity.c_i1 == true && coarseValidity.c_i0 == false;
        // If Idaiyinam sub options appeared for the previous group / varga 
        // but won't appear for this one, hide it
        if (!isIdaiyinamSubAppearing)
            setVisibilityIdaiyinamSubOptions(false);
    }
    else if (event.target.name === "vowel-coarse-position")
    {
        const { rewriteVowelGroupPosition, findCoarseValidity } = await import("./js/vowel.js");
        // Phase: ACCUMULATING-1, vowel group / vowel class state updated
        const coarsePositions = rewriteVowelGroupPosition(group);
        // Phase: VALIDATING-1
        coarseValidity = findCoarseValidity(coarsePositions);
    }

    // In case someone selects only "Idaiyinam" in a case where there are sub-options,
    // then goes for another group / varga
    // writing outside consonant block in order to standardize the behaviour
    uncheckRadios(obj.nextElementSibling);
    // Phase: VALIDATING-2
    // might not occur if 
    // we are selecting coarse again after making fine appear
    obj.nextElementSibling.hidden = false; 
}

function processAlpha(event)
{
   if (event.target.id === "vowel-alpha-checkbox")
   {
       document.getElementById("vowel-normal-section").hidden = event.target.checked;
       document.getElementById("vowel-extended-section").hidden = !event.target.checked;
   } 
   if (event.target.id === "consonant-alpha-checkbox")
   {
       document.getElementById("consonant-normal-section").hidden = event.target.checked;
       document.getElementById("consonant-extended-section").hidden = !event.target.checked;
   } 
}

async function processFine(event)
{
    // Consonant
    if (event.target.name === "consonant-fine-position")
    {
        const fineRadios = document.getElementsByName(event.target.name);
        checked = [...fineRadios].map(radio => radio.checked);
        // Early return; Phase: VALIDATING-3, Conditional I_1 visibility
        if(event.target.id === "consonant-fine-idaiyinam" && isIdaiyinamSubAppearing)
        {
            setVisibilityIdaiyinamSubOptions(true);
            return;
        }
        // Phase: ACCUMULATING-2
        fineFeatures = {
           s: checked[3],
           i_1: false,
           i_0: checked[2],
           m: checked[1],
           v: checked[0]
       };
       world = {
           features: fineFeatures,
           validity: coarseValidity 
       }
       const { evalD } = await import("./js/consonant.js");
       pos = evalD(false, world);
       const { renderConsonant } = await import("./js/render.js"); 
       ;
       appendToTextarea(renderConsonant({ grp: group, pos: pos }));
   }
    // Consonant Idaiyinam
   if (event.target.name === "fine-idaiyinam-position")
   {
    const value = event.target.value === "true";
        // Phase: ACCUMULATING-2
    fineFeatures = {
       s: checked[3],
       i_1: value,
       i_0: checked[2], 
       m: checked[1],
       v: checked[0]
   };
   const world = {
       features: fineFeatures,
       validity: coarseValidity 
   }
   const { evalD } = await import("./js/consonant.js");
   pos = evalD(false, world);
   const { renderConsonant } = await import("./js/render.js"); 
   appendToTextarea(renderConsonant({ grp: group, pos: pos}));
}
    // Vowel
if (event.target.name === "vowel-fine-position")
{
    const value = event.target.value;
    const { rewriteFineFeatures } = await import("./js/vowel.js"); 
        // Phase: ACCUMULATING-2
    fineFeatures = rewriteFineFeatures(value);
}
}

async function processDiacritic(event)
{
    const diacriticValue = event.target.value === "1";
    const world = {
       features: fineFeatures,
       validity: coarseValidity,
       xi: diacriticValue
   };
   const { evalV } = await import("./js/vowel.js");
   pos = evalV(false, world);
   const { renderVowel } = await import("./js/render.js"); 
   appendToTextarea(renderVowel({ grp: group, pos: pos }));
}

async function processExtended(event)
{
    const extendedValue = Number(event.target.value);
    const world = {
        e1: ((extendedValue >> 1) & 1) == 1,
        e0: (extendedValue & 1) == 1
    }
    if (event.target.name === "vowel-extended-letters")
    {
        const { evalV } = await import("./js/vowel.js");
        pos = evalV(true, world);
        const { renderVowel } = await import("./js/render.js"); 
        appendToTextarea(renderVowel({ pos: pos }));
    }
    if (event.target.name === "consonant-extended-letters")
    {
        const { evalD } = await import("./js/consonant.js");
        pos = evalD(true, world);
        const { renderConsonant } = await import("./js/render.js"); 
        appendToTextarea(renderConsonant({ pos: pos }));
    }
}

function appendToTextarea(output)
{
    if (output !== undefined)
    {
        if (output === "INVALID")
        {
            handleInvalid(true);
            errorContainer.textContent = "Error: Invalid Fine Position.";
            uncheckRadios(document.querySelector(".diacritic-fieldset"));
        }
        else
        {
            handleInvalid(false);
            errorContainer.textContent = "";
            textplace.value += output;
            clearOptions();
        }
    }
    else
        throw new Error("Invalid locations accessed from the lookup table");
} 

function handleInvalid(isInvalid)
{
    const radios = document.querySelectorAll(
        "input[name='consonant-fine-position'], " +
        "input[name='fine-idaiyinam-position'], " +
        "input[name='vowel-fine-position']"
        );
    
    radios.forEach(radio => {
        if (radio.checked && isInvalid) 
        {
            radio.setAttribute("aria-invalid", "true"); 
            radio.setAttribute("aria-describedby", "error-message");
        }
        else
        {
            radio.removeAttribute("aria-invalid"); 
            radio.removeAttribute("aria-describedby");
        }
    });
}