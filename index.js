let myLeads = [];
let dlEl = document.getElementById("dl-el");
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const saveTab = document.getElementById("save-tab");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

function keymaker(key) {
  const newKey = key.split(" ").join("-");
  return newKey;
}

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  renderLeads(myLeads);
}

deleteBtn.ondblclick = () => {
  localStorage.clear();
  myLeads = [];
  renderLeads(myLeads);
};

saveTab.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads(myLeads);
  });
};

inputBtn.addEventListener("click", () => {
  if (inputEl.value) {
    myLeads.push(keymaker(inputEl.value));
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    renderLeads(myLeads);
  }
});

function renderLeads(leads) {
  let leadItems = "";
  for (i = 0; i < leads.length; i++) {
    leadItems += `
        <div class='mb-3'>
            <div>
                <dt class='flex justify-between'>
                    <div class='text-blue-600 text-lg overflow-hidden'>
                        <a href='${leads[i]}' target="_blank">
                            ${leads[i]}
                        </a>
                    </div>
                    <div class='flex gap-2'>
                        <button id=copy${i} class="border-[1px] border-white rounded-md text-white px-2 text-sm">
                            <img height="15px" width="15px" src="copy.png">
                        </button>
                        <button id=edit${i} class="border-[1px] border-white rounded-md text-white px-2 text-sm">
                            <img height="15px" width="15px" src="Edit-Icon.png">
                        </button>
                        <button id=delete${i} class="border-[1px] border-white rounded-md text-red-800 font-bold px-2 text-sm ">
                            X
                        </button>
                    </div>
                </dt>
            </div>
            <div id=line${i}>
            </div>
        </div>`;
  }

  dlEl.innerHTML = leadItems;

  for (let i = 0; i < leads.length; i++) {
    console.log(leads[i]);
    let line = document.getElementById(`line${i}`);
    line.className = "line";

    let deleteEach = document.getElementById(`delete${i}`);
    line.textContent = localStorage.getItem(leads[i]);

    deleteEach.onclick = () => {
      const newLeads = leads.filter((l) => l !== leads[i]);
      localStorage.setItem("myLeads", JSON.stringify(newLeads));
      localStorage.removeItem(leads[i]);
      myLeads = newLeads;
      renderLeads(newLeads);
    };

    let editEach = document.getElementById(`edit${i}`);

    editEach.onclick = () => {
      line.textContent = "";
      const define = document.createElement("input");
      define.style.width = 350;
      define.value = localStorage.getItem(leads[i]);
      const doneBtn = document.createElement("button");
      define.className = "inp";
      doneBtn.className = "done";
      doneBtn.innerText = "Done";
      line.appendChild(define);
      line.appendChild(doneBtn);
      doneBtn.onclick = () => {
        definition = define.value;
        line.textContent = definition;
        localStorage.setItem(leads[i], definition);
        definition = "";
      };
    };
    let copyIt = document.getElementById(`copy${i}`);

    copyIt.onclick = () => {
      const contentToCopy = document.getElementById(lead);
      const textToCopy = contentToCopy.textContent;

      const tempInput = document.createElement("input");
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    };
  }
}
