const data = [
    { "label": "Amazon Web Services is very very awesome and it works great", "value": "aws-1" },
    { "label": "Amazon Web Services", "value": "aws" },
    { "label": "Azure", "value": "azure" },
    { "label": "Google Cloud", "value": "gcp" },
    { "label": "Google Cloud2", "value": "gcp2" },
    { "label": "Google Cloud3", "value": "gcp3" },
    { "label": "Google Cloud4", "value": "gcp4" },
    { "label": "Google Cloud5", "value": "gcp5" },
];
let optionsData = [];
let optionItems = [];
let selectedValue;
let value = "";
let focusIdx = -1;
let container;

const input = document.querySelector('.ct_input');
input.addEventListener('keydown', keydownHandler);
input.addEventListener('blur', (event) => {
    // debugger;
    const selectedVal = event.target.value;
    const item = data.find( d => d.label === selectedVal);
    if(item) {
        value = item.value;
        event.target.value = item.label;
        selectedValue = item;
    } else if (selectedValue) {
        value = selectedValue.value || '';
        event.target.value = selectedValue.label || '';
    } else {
        value = '';
        event.target.value = '';
    }
    hideDropdown();
})


input.addEventListener('input', (event) => {
    const val = event.target.value;
    optionsData = data.filter(d => (d.label.toLowerCase().includes(val.toLowerCase()) || d.value.toLowerCase().includes(val.toLowerCase())));
    drawDropdown();
});

function showDropdown() {
    optionsData = data;
    drawDropdown();
}

function drawDropdown() {
    //check if value is set and set the focus idx to it else set it to 0 if any dataOpts[] or null if none
    fetchFocusIdx();

    if(focusIdx === -1) {
        return;
    }

    input.focus();
    // Append main container
    container = d3.select(".ct_listbox-container");
    container.on("click", () => {
        input.focus();
    })
    container.selectAll("*").remove();
    const listbox = container.append("div").attr("class", "ct_listbox");
    // Append options list
    const optionsContainer = listbox.append("div").attr("class", "ct_listbox-options");
    console.log('ListBox', optionsContainer._groups[0][0]);

    optionItems = optionsContainer.selectAll(".ct_listbox-opt-item")
        .data(optionsData)
        .enter()
        .append("div")
        .attr("class", (d, i) => `ct_listbox-opt-item ${d.value === value ? 'active' : ''} ${i === focusIdx ? 'ct_listbox-opt-focus' : ''}`)
        .on("mousedown", (event, d) => { event.preventDefault(); event.stopPropagation(); console.log(d); selectedValue = d; input.value = selectedValue.label; hideDropdown(); })
        .on("mouseenter", (event, d) => { optionItems._groups[0][focusIdx].classList.remove('ct_listbox-opt-focus'); focusIdx = optionsData.findIndex((data) => data.value === d.value); event.target?.classList.add('ct_listbox-opt-focus') })
        // .on("mouseleave", (event, d) => { event.target?.classList.remove('ct_listbox-opt-focus')})
        .html(d => `
      <span class="ct_listbox-tick">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.3332 1.43945L4.99984 8.77279L1.6665 5.43945" stroke="#6476FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span class="ct_listbox-option">${d.label}</span>
    `);
    if (focusIdx && value) {
        optionItems._groups[0][focusIdx].scrollIntoView();
    }
    console.log(optionItems._groups);
    // Append actions list
    const actionsContainer = listbox.append("div").attr("class", "ct_listbox-actions");
    actionsContainer.on("mousedown", (event) => { event.preventDefault(); event.stopPropagation(); })

    actionsContainer.selectAll(".ct_listbox-action-item")
        .data(optionsData.slice(0, 1)) // Example: just the first item for actions
        .enter()
        .append("div")
        .attr("class", "ct_listbox-action-item")
        .html(d => `
      <span class="ct_listbox-checkbox">
        <input type="checkbox" />
      </span>
      <span class="ct_listbox-action">${d.label}</span>
    `);

}


function keydownHandler(event) {
    if (event.keyCode == 38 && focusIdx > 0) { // UP KEY
        optionItems._groups[0][focusIdx].classList.remove('ct_listbox-opt-focus');
        focusIdx--;
        optionItems._groups[0][focusIdx].classList.add('ct_listbox-opt-focus');
        optionItems._groups[0][focusIdx].scrollIntoView();
    } else if (event.keyCode == 40 && focusIdx < optionItems._groups[0].length - 1) { //DOWN KEY
        optionItems._groups[0][focusIdx].classList.remove('ct_listbox-opt-focus');
        focusIdx++;
        optionItems._groups[0][focusIdx].classList.add('ct_listbox-opt-focus');
        console.log('OFFSET', (optionItems._groups[0][focusIdx].offsetParent === null));
        optionItems._groups[0][focusIdx].scrollIntoView();
    } else if (event.keyCode === 13) {
        selectedValue = optionsData[focusIdx];
        input.value = selectedValue.label;
        hideDropdown();
        console.log(optionsData[focusIdx]);
    }
}

function fetchFocusIdx() {
    if(value || optionsData.length >= 0) {
        const idx = optionsData.findIndex( opt => opt.value === value);
        focusIdx = idx === -1 ? 0 : idx;
    } else {
        focusIdx = -1;
    }
}

function hideDropdown() {
    if(container) {
        container.selectAll('*').remove();
        optionItems = [];
        optionsData = [];
        focusIdx = -1;
    }
}
