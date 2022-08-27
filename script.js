let addBtn = document.querySelector(".add-button");
let removeBtn = document.querySelector(".remove-button");
let modelCont = document.querySelector(".model-cont");
let mainCont = document.querySelector('.main-cont');
let textAreaCont = document.querySelector('.textarea-cont');
let flag = false;
let remFlag = false;
let color = ['yellow', 'green', 'purple', 'blue'];
let modelPriorityColor = color[color.length - 1]; // blue
let allPriorityColor = document.querySelectorAll('.priority-color');
let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open';
let toolBoxColor = document.querySelectorAll('.color');
let ticketArr = [];

// Get tickets from local storage
if(localStorage.getItem('tickets')){
    ticketArr = JSON.parse(localStorage.getItem('tickets')) ;
    ticketArr.forEach(function(ticket){
        createTicket(ticket.ticketColorClass, ticket.ticketTask, ticket.ticketId) ;
    })
}


//Filter tickets according to their colors
for (let i = 0; i < toolBoxColor.length; i++) {
    toolBoxColor[i].addEventListener('click', function (e) {
        let currentToolBoxColor = toolBoxColor[i].classList[0];
        // console.log(currentToolBoxColor) ;

        let filterTickets = ticketArr.filter(function (ticketObj) {
            return currentToolBoxColor === ticketObj.ticketColorClass;
        })

        // remove other tickets
        let alltickets = document.querySelectorAll('.ticket-cont') ;
        for(let i=0 ; i<alltickets.length ; i++){
            alltickets[i].remove() ;
        }

        // generatinting color filtered tickets
        filterTickets.forEach(function(filteredObj){
            createTicket(filteredObj.ticketColorClass, filteredObj.ticketTask, filteredObj.ticketId) ;
        })
    })

    // Doluble click color filter to get all tickets
    toolBoxColor[i].addEventListener('dblclick', function(){

        let alltickets = document.querySelectorAll('.ticket-cont') ;
        for(let i=0 ; i<alltickets.length ; i++){
            alltickets[i].remove() ;
        }

        // generatinting color filtered tickets
        ticketArr.forEach(function(ticketArrObj){
            createTicket(ticketArrObj.ticketColorClass, ticketArrObj.ticketTask, ticketArrObj.ticketId) ;
            
        })
    })

}


addBtn.addEventListener("click", function (e) {
    // Display a Model

    // addflag, true - Model Display
    // addflag, false - Model Hide

    flag = !flag;

    if (flag) {
        modelCont.style.display = "flex";

    } else {
        modelCont.style.display = "none";
    }
});

// Changing Color Priority

allPriorityColor.forEach(function (colorEle) {
    colorEle.addEventListener('click', function (e) {
        allPriorityColor.forEach(function (priorityColorEle) {
            priorityColorEle.classList.remove('active');
        })
        colorEle.classList.add('active');
        modelPriorityColor = colorEle.classList[0];
    })
})

// Add a Card

modelCont.addEventListener("keydown", function (e) {
    if (e.key == "Shift") {
        createTicket(modelPriorityColor, textAreaCont.value); // This function will create a ticket.
        modelCont.style.display = "none";
        textAreaCont.value = '';
        flag = false; // single click on add button ke liye after pressing shift
    }
});

function createTicket(ticketColorClass, ticketTask, ticketId) {
    let id = ticketId || shortid() ;
    let ticketContDiv = document.createElement("div");
    ticketContDiv.setAttribute("class", "ticket-cont");

    ticketContDiv.innerHTML = `<div class="ticket-color ${ticketColorClass}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>` ;

    mainCont.appendChild(ticketContDiv);


    handleRemoval(ticketContDiv, id);

    handleTicketColor(ticketContDiv, id); // TicketBand Color Change.

    handleLock(ticketContDiv, id);

    // Ticket elements are stored in ticketArr to create anew ticket for color filter.
    if(!ticketId){
        ticketArr.push({ ticketColorClass, ticketTask, ticketId: id }) ;
        localStorage.setItem('tickets', JSON.stringify(ticketArr)) ;
    }
    


}


removeBtn.addEventListener("click", function (e) {
    remFlag = !remFlag;
    if (remFlag) {
        removeBtn.style.color = '#d63031';
    }
    else {
        removeBtn.style.color = '#dcdde1';
    }
})

function handleRemoval(ticket, id) {
    ticket.addEventListener('click', function () {
        if (!remFlag) return 

        let idx = getTicketIdx(id) ;  // it will get us the index of the ticket is that id.

        // local Storage ticket removal ;
        ticketArr.splice(idx, 1) ;

        let stringTicketArr = JSON.stringify(ticketArr) ;

        localStorage.setItem('tickets',stringTicketArr) ;

        ticket.remove() ;  // UI ticket Removal
    })
}


// Lock and Unlock
function handleLock(ticket, id) {
    let idx = getTicketIdx(id) ;  // it will get us the index of the ticket is that id.
    let ticketLockEle = ticket.querySelector('.ticket-lock');
    let ticketLock = ticketLockEle.children[0];
    let ticketTaskArea = ticket.querySelector('.task-area');
    ticketLock.addEventListener('click', function (e) {
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute('contenteditable', 'true'); // textArea Edit
           
        }
        else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable', 'false');
        }

        ticketArr[idx].ticketTask = ticketTaskArea.innerText ;
        
        let stringTicketArr = JSON.stringify(ticketArr) ;

        localStorage.setItem('tickets',stringTicketArr) ;

    })
}


// Handle Ticket Color
function handleTicketColor(ticket, id) {
    let ticketColorDiv = ticket.querySelector('.ticket-color');
    ticketColorDiv.addEventListener('click', function (e) {
        let currentTicketColor = ticketColorDiv.classList[1];
        let currentTicketColorIdx = color.findIndex(function (color) {
            return currentTicketColor === color;
        })

        let idx = getTicketIdx(id) ;  // it will get us the index of the ticket with that id.
        currentTicketColorIdx++;
        let newColorIdx = currentTicketColorIdx % color.length;
        let newTicketColor = color[newColorIdx];

        ticketArr[idx].ticketColorClass = newTicketColor ;  // Updating ColorBand of the ticket in ticketArr.
        let stringTicketArr = JSON.stringify(ticketArr) ;   
        localStorage.setItem('tickets',stringTicketArr) ;   // Updating new colorBand in Local Storage.

        ticketColorDiv.classList.remove(currentTicketColor);
        ticketColorDiv.classList.add(newTicketColor);
    })

}

function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex(function(ticketArrObj){
        return ticketArrObj.ticketId === id ;
    })
    return ticketIdx ;
}

