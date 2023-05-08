let myLeads=[];
let dlEl=document.getElementById('dl-el');
const inputEl=document.getElementById('input-el');
const inputBtn= document.getElementById('input-btn');
const deleteBtn=document.getElementById('delete-btn');
const saveTab=document.getElementById('save-tab');
const leadsFromLocalStorage=JSON.parse(localStorage.getItem("myLeads"))
function keymaker(key){
    const newKey=key.split(" ").join('-')
    return newKey
}

if (leadsFromLocalStorage){
    myLeads=leadsFromLocalStorage
    renderLeads(myLeads);
}

deleteBtn.ondblclick=()=>{
    localStorage.clear()
    myLeads=[];
    renderLeads(myLeads);
}

saveTab.onclick=()=>{
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads",JSON.stringify(myLeads));
        renderLeads(myLeads)


    })
}




inputBtn.addEventListener("click",()=>
    {   
        if (inputEl.value){
        myLeads.push(keymaker(inputEl.value));
        inputEl.value='';
        localStorage.setItem("myLeads",JSON.stringify(myLeads))
        renderLeads(myLeads);
        }
    
})

function renderLeads(leads){
    let leadItems=""
    for (i=0;i<leads.length;i++){
        leadItems +=`
        <div><dt>
            <a href="${leads[i]}" target="_blank">
                ${leads[i]}
            </a>
            </dt>
                <button id=${leads[i]} class="delete-each option">
                    X
                </button height="10px" width="10px">
                <button id=${i} class="edit-each option">
                    <img height="10px" width="10px" src="Edit-Icon.png">
                </button>
        </div>
        <div id=line${i}>
        </div>`
    } 


    dlEl.innerHTML=leadItems
    for (let i=0;i<leads.length;i++){
        let line=document.getElementById(`line${i}`)
        let deleteEach=document.getElementById(leads[i])
        line.textContent=localStorage.getItem(leads[i])
        deleteEach.onclick=()=>{
            const newLeads=leads.filter(l => l!== leads[i])
            localStorage.setItem("myLeads",JSON.stringify(newLeads))
            localStorage.removeItem(leads[i])
            myLeads=newLeads
            renderLeads(newLeads)
        
        }
        let editEach=document.getElementById(i)
        editEach.onclick=()=>{
            
            line.textContent='';
            const define=document.createElement("input");
            define.style.width=300;
            define.value=localStorage.getItem(leads[i])
            const doneBtn=document.createElement("button");
            define.className="inp";
            doneBtn.className="inp";
            doneBtn.innerText="Done";
            line.appendChild(define);
            line.appendChild(doneBtn)
            doneBtn.onclick=()=>{
                definition=define.value;
                line.textContent=definition;
                localStorage.setItem(leads[i],definition);
                definition='';

            }
            

        }
    }
}
