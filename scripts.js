const buttons = document.querySelectorAll("[data-vowel-or-consonant-mode]");
const sections = document.querySelectorAll('[id$="-section"]');
let cluster, coarseValidity, fineFeatures, isIdaiyinamSubAppearing, pos;

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


    sections.forEach(section => uncheckRadios(section));

    hideIdaiyinamSubOptions();
    document.querySelectorAll(".fine-fieldset").forEach(section => section.hidden = true);
}

function uncheckRadios(section)
{
    section.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
}

function appearIdaiyinamSubOptions()
{
    const idaiyinamOptions = document.getElementById("idaiyinam-nested-options");
    idaiyinamOptions.hidden = false;
}

function hideIdaiyinamSubOptions()
{
    const idaiyinamOptions = document.getElementById("idaiyinam-nested-options");
    idaiyinamOptions.hidden = true;
}

async function appearFine(event, obj)
{
    // for validity lines
    cluster = event.target.value;
    if (event.target.name === "consonant-coarse-position")
    {
        const { rewriteClusterPosition, findCoarseValidity } = await import("./js/consonant.js");
        // Phase: ACCUMULATING-1, cluster state updated
        const coarsePositions = rewriteClusterPosition(cluster);
        // Phase: VALIDATING-1
        coarseValidity = findCoarseValidity(coarsePositions);
        // Will the sub-options of Idaiyinam appear if the user selects it?
        // Prep for VALIDATING-3
        // also, c_i becoming 10 is what we want only
        isIdaiyinamSubAppearing = coarseValidity.c_i1 == true && coarseValidity.c_i0 == false;
        // If Idaiyinam sub options appeared for the previous cluster 
        // but won't appear for this one, hide it
        if (!isIdaiyinamSubAppearing)
            hideIdaiyinamSubOptions();
    }
    else if (event.target.name === "vowel-coarse-position")
    {
        const { rewriteVowelGroupPosition, findCoarseValidity } = await import("./js/vowel.js");
        // Phase: ACCUMULATING-1, vowel group state updated
        const coarsePositions = rewriteVowelGroupPosition(cluster);
        // Phase: VALIDATING-1
        coarseValidity = findCoarseValidity(coarsePositions);
    }

    // In case someone selects only "Idaiyinam" in a case where there are sub-options,
    // then goes for another cluster
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
            appearIdaiyinamSubOptions();
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
    const diacriticValue = Number(event.target.value);
    const world = {
       features: fineFeatures,
       validity: coarseValidity,
       xi: diacriticValue
    };
    const { evalV } = await import("./js/vowel.js");
    pos = evalV(false, world);
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
    }
    if (event.target.name === "consonant-extended-letters")
    {
        const { evalD } = await import("./js/consonant.js");
        pos = evalD(true, world);
    }
}
