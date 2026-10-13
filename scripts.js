// Loading the modules early on
let consonantModule, vowelModule, renderModule;

loadModules().then(m => {
    ({ consonantModule, vowelModule, renderModule } = m);
});

async function loadModules()
{
    const consonantModule = await import("./ts/consonant.js");
    const vowelModule = await import("./ts/vowel.js");
    const renderModule = await import("./ts/render.js");
    return {consonantModule, vowelModule, renderModule};
}

// For the other methods
const buttons = document.querySelectorAll("[data-vowel-or-consonant-mode]");
const errorContainer = document.getElementById("error-message");
const granthaElements = document.querySelectorAll(".grantha-elements");
const sections = document.querySelectorAll('[id$="-section"]');
const textplace = document.querySelector("textarea");
// For keyboard navigation eventListener
const diacriticFieldset = document.querySelector('.diacritic-fieldset');
const vowelFineFieldset = document.querySelector('#vowel-normal-section > .fine-fieldset')
const consonantFineFieldset = document.querySelector('#consonant-normal-section > .fine-fieldset');
const idaiyinamDiv = document.getElementById("idaiyinam-sub-options");
let sentamizhToggle = false;
let group, coarseValidity, fineFeatures, isIdaiyinamSubAppearing, pos, checked;

// Keyboard navigation
// didn't even look at the docs for keyNavigation(), vibecoded the following eventListeners though
const ORDER = "VAFDSREWJKLUIXC";
const stroke = new Set();
const held = new Set();

window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.repeat || e.ctrlKey || e.metaKey || e.altKey)
       return;
    if (!e.code.startsWith('Key'))
        return;
    const k = e.code.slice(3);
    held.add(k); stroke.add(k);
});

window.addEventListener('keyup', (e) => {
    held.delete(e.code.slice(3));
    if(held.size === 0 && stroke.size)
    {
        [...stroke].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).forEach(keyNavigation);
        stroke.clear();
    }
});

// Clear keys if the browser window loses focus
window.addEventListener('blur', () => { held.clear(); stroke.clear(); });

textplace.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') textplace.blur();
});

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


function toggleSentamizh(event)
{
    if (event.target.checked && document.getElementById("consonant-alpha-checkbox").checked === true)
    {
        uncheckExtended(false); // Grantha
    }
    sentamizhToggle = event.target.checked;
    granthaElements.forEach(granthaElement => {
        granthaElement.disabled = event.target.checked;
        if (event.target.checked)
            granthaElement.setAttribute("aria-description", "Disabled because Sentamizh mode is active.");
        else
            granthaElement.removeAttribute("aria-description");
    });
}

function clearOptions()
{
    sections.forEach(section => uncheckRadios(section));
    setVisibilityIdaiyinamSubOptions(false);
    document.querySelector('.diacritic-fieldset').hidden = true;
    uncheckExtended(true); // Clear
    document.querySelectorAll(".fine-fieldset").forEach(section => section.hidden = true);
}

function uncheckExtended(isGranthaOrClear)
{
    if (isGranthaOrClear) // if clear is chosen
    {
        document.getElementById("vowel-alpha-checkbox").checked = false;
        document.getElementById("vowel-extended-section").hidden = true;
        document.getElementById("vowel-normal-section").hidden = false;
    }
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

function appearFine(event, obj)
{
    // for validity lines
    group = event.target.value;
    if (event.target.name === "consonant-coarse-position")
    {
        // Phase: ACCUMULATING-1, varga state updated
        const coarsePositions = consonantModule.rewriteCoarsePosition(group);
        // Phase: VALIDATING-1
        coarseValidity = consonantModule.findCoarseValidity(coarsePositions);
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
        // Phase: ACCUMULATING-1, vowel group / vowel class state updated
        const coarsePositions = vowelModule.rewriteCoarsePosition(group);
        // Phase: VALIDATING-1
        coarseValidity = vowelModule.findCoarseValidity(coarsePositions);
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

function processFine(event, obj)
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
       const world = {
           features: fineFeatures,
           validity: coarseValidity 
       }
       pos = consonantModule.evalD(false, world);
       appendToTextarea(renderModule.renderConsonant({ grp: group, pos: pos }));
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
   pos = consonantModule.evalD(false, world);
   appendToTextarea(renderModule.renderConsonant({ grp: group, pos: pos}));
}
// Vowel
if (event.target.name === "vowel-fine-position")
{
    const value = event.target.value;
    // Phase: ACCUMULATING-2
    fineFeatures = vowelModule.rewriteFineFeatures(value);
    obj.nextElementSibling.hidden = false;
}
}

function processDiacritic(event)
{
    const diacriticValue = event.target.value === "1";
    const world = {
       features: fineFeatures,
       validity: coarseValidity,
       xi: diacriticValue
   };
   pos = vowelModule.evalV(false, world);
   appendToTextarea(renderModule.renderVowel({ grp: group, pos: pos }));
}

function processExtended(event)
{
    const extendedValue = Number(event.target.value);
    const world = {
        e1: ((extendedValue >> 1) & 1) == 1,
        e0: (extendedValue & 1) == 1
    }
    if (event.target.name === "vowel-extended-letters")
    {
        pos = vowelModule.evalV(true, world);
        appendToTextarea(renderModule.renderVowel({ pos: pos }));
    }
    if (event.target.name === "consonant-extended-letters")
    {
        pos = consonantModule.evalD(true, world);
        appendToTextarea(renderModule.renderConsonant({ pos: pos }));
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
            textplace.setRangeText(output, textplace.selectionStart, textplace.selectionEnd, 'end');
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

function keyNavigation(keyUpper)
{
    // Mode selection
    if (keyUpper === 'V')
    {
        if (buttons[0].getAttribute("aria-pressed") === "false")
            setMode("vowel-mode");
        else
            setMode("consonant-mode");
    }
    // Vowels
    if (buttons[0].getAttribute("aria-pressed") === "true")
    {
        // Vowel extended toggle
        if (keyUpper === 'A')
        {
            pick("vowel-alpha-checkbox", true);
        }
        // Vowel extended select
        if (document.getElementById('vowel-alpha-checkbox').checked && "JKL".indexOf(keyUpper) >= 0)
        {
            const selection = "JKL".indexOf(keyUpper);
            pick("vowel-extended-letters", false, selection);
        }
        else
        // Vowel normal select
        {
            // Vowel coarse select
            if ("FDSRE".indexOf(keyUpper) >= 0)
            {
                const selection = "FDSRE".indexOf(keyUpper);
                pick("vowel-coarse-position", false, selection);
            }
            // Vowel fine select
            if ("JKL".indexOf(keyUpper) >= 0 && vowelFineFieldset.hidden === false)
            {
                const selection = "JKL".indexOf(keyUpper);
                pick("vowel-fine-position", false, selection);
            }
            // Vowel diacritic select
            if ('XC'.indexOf(keyUpper) >= 0 && diacriticFieldset.hidden === false)
            {
                const selection = "XC".indexOf(keyUpper);
                pick("vowel-diacritic", false, selection);
            }
        }
    }
    else
    // Consonants
    {
        // Consonant extended toggle
        if (keyUpper === 'A')
        {
            pick("consonant-alpha-checkbox", true);
        }
        // No need to think about sentamizhToggle if this is already selected
        // Consonant extended select
        if (document.getElementById('consonant-alpha-checkbox').checked && "JKL".indexOf(keyUpper) >= 0)
        { 
            const selection = "JKL".indexOf(keyUpper);
            pick("consonant-extended-letters", false, selection);
        }
        else
        // Consonant normal select
        {
            // Consonant coarse select
            if ("FDSREW".indexOf(keyUpper) >= 0)
            {
                const selection = "FDSREW".indexOf(keyUpper);
                pick("consonant-coarse-position", false, selection);
            }
            // Consonant fine select
            if ("JKLUI".indexOf(keyUpper) >= 0 && consonantFineFieldset.hidden === false)
            {
                const allFineLetters = {
                    'J': 0,
                    'K': 1,
                    'L': 2,
                    'U': 2,
                    'I': 3
                };
                const selection = allFineLetters[keyUpper];
                pick("consonant-fine-position", false, selection);
                if (idaiyinamDiv.hidden === true)
                    return;
                else
                {
                    const selection1 = "LU".indexOf(keyUpper);
                    pick("fine-idaiyinam-position", false, selection1);
                }
            }
        }
    }
}

// Keyboard navigation code, used to trigger events from keys
// recommended by Claude after seeing my repeating code
function pick(IdOrName, isToggleBlock, i)
{
    let collect;
    if (isToggleBlock)
        collect = document.getElementById(IdOrName);
    else
        collect = document.getElementsByName(IdOrName)[i];
    if (!collect) return;
    if (collect.disabled)
    {
        errorContainer.textContent = "Error: Not available in Sentamizh mode.";
        if (!isToggleBlock)
            clearOptions();
        return;
    }
    collect.checked = isToggleBlock ? !collect.checked : true;
    collect.dispatchEvent(new Event('change', { bubbles: true }));
}