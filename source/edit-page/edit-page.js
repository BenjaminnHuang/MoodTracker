window.addEventListener('DOMContentLoaded', init);

//-----------------------------Variable Declarations-----------------------------
/**
 * Either "edit" or "read"
 * @type {string}
 */
let mode = "";

/**
 * Retrieved from localStorage to define the selected entry's date
 * @type {string}
 */
let currentState = "";

/**
 * Holds the selected entry's data
 * @type {{rating: string, comment: string, edited: boolean}}
 */
let entry = {};

/**
 * Holds color corresponding to each rating
 * @type {{terrible: string, bad: string, neutral: string, good: string, great: string}}
 */
let colors = {};

//---------------Button and Datafield constants for element reference---------------
/**
 * In read mode, plain text that shows current rating
 * @type {Element}
 */
const ratingRead = document.querySelector("#ratingRead");

/**
 * In edit mode, editable select that has all of the possible ratings
 * @type {Element}
 */
const ratingEdit = document.querySelector("#ratingEdit");

/**
 * In read mode, plain text that shows the comment
 * @type {Element}
 */
const commentRead = document.querySelector("#commentRead");

/**
 * In edit mode, editable textarea that has the comment
 * @type {Element}
 */
const commentEdit = document.querySelector("#commentEdit");

/**
 * "update" button that updates the entry with the new values
 * @type {Element}
 */
const updateButton = document.querySelector("#updateButton");

/**
 * "edit" button that switches page to edit mode
 * @type {Element}
 */
const editButton = document.querySelector("#editButton");

/**
 * "X" button that takes user back to calendar
 * @type {Element}
 */
const exitButton = document.querySelector("#exitButton");

/**
 * Div containing all of the components of the edit page
 * @type {Element}
 */
const editBox = document.querySelector(".edit-box");

/**
 * Div containing the date, rating, and comment.
 * @type {Element}
 */
const mainEdit = document.querySelector("#mainEdit");

/**
 * "Yes" button in delete prompt
 * @type {Element}
 */
const deleteYes = document.querySelector("#deleteYes");

/**
 * "No" button in delete prompt
 * @type {Element}
 */
const deleteNo = document.querySelector("#deleteNo");

/**
 * Asks user "Are you sure you want to delete?"
 * @type {Element}
 */
const deletePrompt = document.querySelector("#deletePrompt");

const deleteToday = document.querySelector("#deleteToday");
const deleteNotToday = document.querySelector("#deleteNotToday");

let dateObj = new Date();
let date = dateObj.getDate();
let month = dateObj.getMonth() + 1;
let year = dateObj.getFullYear();
let today = `${year}-${month}-${date}`;

//---------------------------------Event Listeners----------------------------------
editButton.addEventListener("click", editMode);
ratingEdit.addEventListener("change", updateBackColor);
updateButton.addEventListener("click", updateThenReadMode );
exitButton.addEventListener("click", exitToCalendar );
deleteYes.addEventListener("click", yesDelete);
deleteNo.addEventListener("click", dontDelete );


//-------------------------------Function Definitions-------------------------------
/**
 * Switches the page from read mode to edit mode, 
 * where the rating and comment are now editable.
 * If already in edit mode, delete current entry.
 * @return {void} Nothing
 * @function
 */
function editMode(){
    //Button pressed during the default "read only" mode
    if(mode == "read"){
        //Change to edit mode
        mode = "edit";

        //Change Buttons
        editButton.innerHTML = "delete";            //Turn edit button into delete
        updateButton.style.visibility = "visible";  //Show update button
        
        //Make inputs editable
        //Turn rating into a select element
        ratingRead.style.display = "none";
        ratingEdit.value = entry["rating"];
        ratingEdit.style.display = "inline";
        
        //Turn comment into a textarea
        commentRead.style.display = "none";
        commentEdit.style.display = "inline";
        commentEdit.value = entry["comment"];
    }

    //In edit mode, "edit-button" currently is the "delete" button
    else if(mode == "edit"){
        //Display "Are you sure you want to delete?"
        if(today == JSON.parse(window.localStorage.getItem("currentState"))){
            deleteToday.style.display = "flex";
            deleteNotToday.style.display = "none";
        }
        else{
            deleteToday.style.display = "none";
            deleteNotToday.style.display = "flex";
        }
        deletePrompt.style.display = "flex";
        updateButton.style.visibility = "hidden";
    }
}


/**
 * Changes the background color to correspond with
 * the new value for rating that has been selected
 * @return {void} Nothing
 * @function
 */
 function updateBackColor(){
    entry["rating"] = ratingEdit.value;
    editBox.style.backgroundColor = colors[entry["rating"]];
}

/**
 * Updates localStorage with the new values for rating and comment
 * and switches back to read mode, making the rating and comment not editable
 * @return {void} Nothing
 * @function
 */
function updateThenReadMode(){

    //Return to read only mode
    mode = "read";

    //Update Buttons
    editButton.innerHTML = "edit";
    updateButton.style.visibility = "hidden";

    //Make data read only
    //Remove rating select element
    ratingRead.style.display = "inline";
    ratingEdit.style.display = "none";
    
    //Remove comment textarea
    commentRead.style.display = "inline";
    commentEdit.style.display = "none";

    //Update entry
    entry["rating"] = ratingEdit.value;
    entry["comment"] = commentEdit.value;
    entry["edited"] = true;

    //Update localStorage with edited entry
    window.localStorage.setItem(currentState, JSON.stringify(entry));

    //Setup updated page for read mode
    ratingRead.innerHTML = entry["rating"];
    commentRead.innerHTML = entry["comment"];

}

/**
 * Go back to calendar
 * @return {void} Nothing
 * @function
 */
function exitToCalendar(){
    //Reset mode
    mode = "read";
    //Go to Calendar
    window.location.href = "../calendar/index.html";
}

/**
 * Delete currently viewed entry then go back to the calendar
 * @return {void} Nothing
 * @function
 */
function yesDelete(){
    //delete entry from localStorage
    window.localStorage.removeItem(currentState);
    //Go back to read mode
    mode = "read";
    //Go back to calendar
    window.location.href = "../calendar/index.html";
}

/**
 * Do not delete the currently viewed entry then go back to the edit page
 * @return {void} Nothing
 * @function
 */
function dontDelete(){
    
    deletePrompt.style.display = "none";
    updateButton.style.visibility = "visible";
    
}

/**
 * Reset the current state to null
 * @return {void} Nothing
 * @function
 */
function resetState(){
    window.localStorage.setItem('currentState', null);
}

//-------------------------------Initialization-------------------------------
/**
 * Set up the initial page in read mode with the values of the selected entry
 * @return {void} Nothing
 * @function
 */
function init() {
    //toggle between read-only and edit mode
    mode = "read"; 
    
    //get the selected date and it's entry
    currentState = JSON.parse(window.localStorage.getItem("currentState")); //year-month-day
    entry = JSON.parse(window.localStorage.getItem(currentState)); //{"rating": , "comment": , "editted": }

    //setup the color dictionary
    colors = JSON.parse(window.localStorage.getItem("colors")); 
    editBox.style.backgroundColor = colors[entry["rating"]];

    //setup starting value display
    const rating = document.querySelector("#ratingRead");
    rating.innerHTML = entry["rating"];
    const comment = document.querySelector("#commentRead");
    comment.innerHTML = entry["comment"];
    const date = document.querySelector("#date");
    date.innerHTML = "date : " + currentState.substring(5,10)+ "-" + currentState.substring(0,4);
}
init();
