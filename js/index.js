var addBtn = document.querySelector(".add-icon");
var closeBtn = document.querySelector(".close-icon");
var addContantModal = document.querySelector(".add-contact-modal");
var cancelBtn = document.querySelector(".cancel-btn");
var nameInput  = document.querySelector(".fullName");
var phoneInput = document.querySelector(".phoneNumber");
var emailInput = document.querySelector(".email");
var adressField = document.querySelector(".adress-field");
var nameError  = document.querySelector(".nameError");
var phoneError = document.querySelector(".phoneError");
var emailError = document.querySelector(".emailError");
var saveBtn = document.querySelector(".submit-btn");
var favoriteBody = document.querySelector(".favorite-body");
var emergencyBody = document.querySelector(".emergency-body");
var groupSelect = document.querySelector(".select-input-field");
var formTitleContact = document.querySelector(".form-title");
var avatarpp = document.querySelector(".pp-avatar");
var subMain = document.querySelector(".sub-main");
var counters = document.querySelectorAll(".card-count");
var contactsContainer = document.getElementById("contactsContainer");
var favCheck = document.getElementById("favCheck");
var emergencyCheck = document.getElementById("emergencyCheck");
var photoInput = document.getElementById("photoInput");
var searchInputField = document.getElementById("searchInput");
var selectedImagePath = null;
var contacts = [];
var editingContactId = null;


//Save in local storge
function saveToLocalStorage() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

//Load from local storage
function loadFromLocalStorage() {
    var data = localStorage.getItem("contacts");
    if (data) {
        contacts = JSON.parse(data);
        renderContacts();
        renderSideSections();
        updateCounters();
        updateSubMain();
    }
}

//Render all states of the contact grid
function renderContacts(list = contacts) {
    contactsContainer.innerHTML = "";

    //Empty state
    if (list.length === 0) {
        //row styles for empty
        contactsContainer.classList.remove("justify-content-between");
        contactsContainer.classList.add("justify-content-center", "gap-4");

        contactsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="empty-icon mx-auto mb-4 d-flex align-items-center justify-content-center rounded rounded-4">
                    <i class="fa-solid fa-address-book fs-3 empty-iconc"></i>
                </div>
                <p class="fw-medium mb-1 empty-title">No contacts found</p>
                <p class="small empty-sub-title">
                    Click "Add Contact" to get started
                </p>
            </div>
        `;

        updateCounters();
        return;
    }

    //Contact state
    contactsContainer.classList.remove("justify-content-center", "gap-4");
    contactsContainer.classList.add("justify-content-between");
    for (var i = 0; i < list.length; i++) {
        contactsContainer.insertAdjacentHTML(
            "beforeend",
            createContactCard(list[i])
        );
    }
    updateCounters();
}

//Render cards of the side section
function renderSideSections() {

    //Favorites
    var favorites = contacts.filter(c => c.favorite);
    favoriteBody.innerHTML = "";

    if (favorites.length === 0) {
        favoriteBody.innerHTML = `
            <div class="text-center no-fav">
                <p class="small fav-span">No favorites yet</p>
            </div>`;
    } else {
            for (var i = 0; i < favorites.length; i++) {
                favoriteBody.insertAdjacentHTML(
                "beforeend",
                createSideContact(favorites[i])
            );
        }
    }

    //Emergency
    var emergencies = contacts.filter(c => c.emergency);
    emergencyBody.innerHTML = "";

    if (emergencies.length === 0) {
        emergencyBody.innerHTML = `
            <div class="text-center no-emergency">
                <p class="small emergency-span">No emergency contacts</p>
            </div>`;
    } else {
        for (var i = 0; i < emergencies.length; i++) {
            emergencyBody.insertAdjacentHTML(
                "beforeend",
                createSideContact(emergencies[i])
            );
        }
    }
}

//All function Reusable
function refreshUI() {
    saveToLocalStorage();
    renderContacts();
    renderSideSections();
    updateCounters();
    updateSubMain();
}

//Create contacts cards
function createContactCard(contact) {

    var initials = contact.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return `
    <div class="col-md-6 col-sm-12 mb-4">
        <div class="bg-white rounded-4 shadow-sm p-2 h-100 overflow-hidden d-flex flex-column contact-info-card">

            <!-- Card Body -->
            <div class="p-2">
                <div class="d-flex gap-3 align-items-center position-relative">
                    <div class="rounded-4 img-span-icon overflow-hidden ">
                        ${
                            contact.image
                            ? `<img src="${contact.image}" class="w-100 h-100 object-fit-cover">`
                            : `<span class="d-flex w-100 h-100 align-items-center justify-content-center text-white fw-semibold">
                                ${initials}
                            </span>`
                        }
                        ${
                        contact.favorite ? `
                        <span class="fav-badge d-flex align-items-center justify-content-center rounded rounded-circle text-white position-absolute m-1">
                            <i class="fa-solid fa-star small"></i>
                        </span>
                    ` : ""}
                            
                        ${
                            contact.emergency ? `
                            <span class="emergency-badge-icon-avatar d-flex align-items-center justify-content-center rounded rounded-circle text-white position-absolute m-1">
                                <i class="fa-solid fa-heart-pulse small"></i>
                            </span>
                        ` : ""}
                    </div>

                    <div class="flex-grow-1">
                        <h3 class="mb-0 fw-semibold text-truncate fs-6 contact-name">
                            ${contact.name}
                        </h3>

                        <div class="d-flex align-items-center gap-2 mt-1">
                            <i class="fa-solid fa-phone rounded-3 d-flex align-items-center justify-content-center phone-contact-icon"></i>
                            <span class="text-truncate small contact-phone">
                                ${contact.phone}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Details -->
                <div class="mt-3">

                    ${contact.email ? `
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <i class="fa-solid fa-envelope rounded-3 d-flex align-items-center justify-content-center email-contact-icon"></i>
                        <span class="text-truncate small contact-email">
                            ${contact.email}
                        </span>
                    </div>` : ""}

                    ${contact.address ? `
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-location-dot rounded-3 d-flex align-items-center justify-content-center address-contact-icon"></i>
                        <span class="text-truncate small contact-address">
                            ${contact.address}
                        </span>
                    </div>` : ""}

                </div>

                <div class="mt-3 d-flex gap-2 flex-wrap">

                    ${contact.group ? `
                        <span class="d-inline-flex align-items-center justify-content-center
                            fw-medium rounded-3 text-capitalize selection-contact">
                            ${contact.group}
                        </span>
                    ` : ""}

                    ${contact.emergency ? `
                        <span class="d-inline-flex align-items-center justify-content-center
                            fw-medium rounded-3 emergency-badge">
                            Emergency
                        </span>
                    ` : ""}

                </div>
            </div>

            <!-- Actions -->
            <div class="d-flex justify-content-between pt-3 px-2 mt-2 action-contact-card">

                <div class="d-flex align-items-center gap-2">
                    <a href="tel:${contact.phone}" class="rounded-3 d-flex align-items-center justify-content-center call-contact">
                        <i class="fa-solid fa-phone"></i>
                    </a>

                    ${contact.email ? `
                    <a href="mailto:${contact.email}" class="rounded-3 d-flex align-items-center justify-content-center mail-contact">
                        <i class="fa-solid fa-envelope"></i>
                    </a>` : ""}
                </div>

                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm fav-contact-card-info ${contact.favorite ? "active-fav" : ""}"
                        onclick="toggleFavorite(${contact.id})">
                        <i class="fa-star ${contact.favorite ? "fa-solid" : "fa-regular"}"></i>
                    </button>
                    <button class="btn btn-sm heart-contact-card-info ${contact.emergency ? "active-emergency" : ""}"
                        onclick="toggleEmergency(${contact.id})">
                        <i class="${
                            contact.emergency 
                            ? "fa-solid fa-heart-pulse" 
                            : "fa-regular fa-heart"
                        }"></i>
                    </button>


                    <button class="btn btn-sm editation-contact-card-info"
                        onclick="editContact(${contact.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="btn btn-sm deletation-contact-card-info"
                        onclick="deleteContact(${contact.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

//Create side contacts cards
function createSideContact(contact) {

    var initials = contact.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    var callBtnClass = contact.emergency ? "side-call-btn-emergency" : "side-call-btn";
    return `
        <div class="d-flex align-items-center gap-3 p-2 mb-2 side-contact-item">

            <!-- Avatar -->
            <div class="flex-shrink-0">
                <div class="small text-white rounded rounded-3 d-flex align-items-center justify-content-center fw-bold side-avatar-gradient">
                    ${initials}
                </div>
            </div>

            <!-- Info -->
            <div class="flex-grow-1 overflow-hidden">
                <h6 class="mb-0 fw-semibold text-truncate small side-name">
                    ${contact.name}
                </h6>
                <small class="text-muted text-truncate d-block">
                    ${contact.phone}
                </small>
            </div>

            <!-- Call -->
            <a href="tel:${contact.phone}" class="${callBtnClass}">
                <i class="fa-solid fa-phone"></i>
            </a>
        </div>
    `;
}

//Function to update # of contacts in sub title in sontact grid
function updateSubMain() {
    var total = contacts.length;
    if (total === 0) {
        subMain.innerText = "Manage and organize your 0 contact";
    } else {
        subMain.innerText = "Manage and organize your " + total + " contacts";
    }
}

//Function to reset title to add mode
function resetModalUI() {
    formTitleContact.innerText = "Add Contact";
    editingContactId = null;
}

//Add Btn Event
addBtn.addEventListener("click",function addContantForm(){
    resetModalUI(); 
    resetAvatar();
   addContantModal.classList.remove("d-none");
})

//Close & Cancel Btn Event
closeBtn.addEventListener("click",closeContactForm)
cancelBtn.addEventListener("click",closeContactForm)

//Function to clean input field after amy process
function closeContactForm(){
    addContantModal.classList.add("d-none");
    editingContactId = null;
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    adressField.value = "";
    groupSelect.value = "";
    favCheck.checked = false;
    emergencyCheck.checked = false;
    photoInput.value = "";
    resetAvatar();
    selectedImagePath = null;
    formTitleContact.innerText = "Add Contact";
    nameError.classList.add("d-none");
    phoneError.classList.add("d-none");
    emailError.classList.add("d-none");
}

//Function to clean photo div
function resetAvatar() {
    avatarpp.style.backgroundImage = "";
    avatarpp.innerHTML = `<i class="fa-solid fa-user text-white fs-2"></i>`;
}

//Select image with right path event
photoInput.addEventListener("change", function () {

    var file = this.files[0];
    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        swal("Invalid File", "Please select an image file", "error");
        this.value = "";     
        return;
    }
    
    selectedImagePath = "./images/" + file.name;
    avatarpp.style.backgroundImage = `url(${selectedImagePath})`;
    avatarpp.style.backgroundSize = "cover";
    avatarpp.style.backgroundPosition = "center";
    avatarpp.style.backgroundRepeat = "no-repeat";
    avatarpp.innerHTML = ""; 
});

//Validation for name input
nameInput.addEventListener("input", function () {
    var value = nameInput.value.trim();
    var nameRegex = /^[A-Za-z\s]{2,50}$/;

    if (value.length === 0) {
        nameError.classList.add("d-none");
        return;
    }

    if (!nameRegex.test(value)) {
        nameError.classList.remove("d-none");
    } else {
        nameError.classList.add("d-none");
    }
});

//Validation for phone input
phoneInput.addEventListener("input", function () {
    var value = phoneInput.value.trim();
    var phoneRegex = /^(010|011|012|015)\d{8}$/;

    if (value.length === 0) {
        phoneError.classList.add("d-none");
        return;
    }

    if (!phoneRegex.test(value)) {
        phoneError.classList.remove("d-none");
    } else {
        phoneError.classList.add("d-none");
    }
});

//Validation for email input
emailInput.addEventListener("input", function () {
    var value = emailInput.value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

    if (value.length === 0) {
        emailError.classList.add("d-none");
        return;
    }

    if (!emailRegex.test(value)) {
        emailError.classList.remove("d-none");
    } else {
        emailError.classList.add("d-none");
    }
});

//Save Btn event
saveBtn.addEventListener("click", function (e) {
    e.preventDefault();

    var nameValue = nameInput.value.trim();
    var phoneValue = phoneInput.value.trim();
    var emailValue = emailInput.value.trim();
    var addressValue = adressField.value.trim();
    var nameRegex = /^[A-Za-z\s]{2,50}$/;
    var phoneRegex = /^(010|011|012|015)\d{8}$/;

    //Instance validation
    if (nameValue === "") {
        swal("Missing Name", "Please enter a name for the contact!", "error");
        return;
    }

    if (!nameRegex.test(nameValue)) {
        swal("Invalid Name", "Name should contain only letters and spaces (2-50 characters)", "error");
        return;
    }

    if (phoneValue === "") {
        swal("Missing Phone", "Please enter a phone number!", "error");
        return;
    }

    if (!phoneRegex.test(phoneValue)) {
        swal("Invalid Phone", "Please enter a valid Egyptian phone number", "error");
        return;
    }

    //Handel duplicate of phone
    var isDuplicate = contacts.some(c =>
        c.phone === phoneValue &&
        c.id !== editingContactId 
    );

    if (isDuplicate) {
        swal("Duplicate Phone", "This phone number already exists!", "warning");
        return;
    }

    //Add contacts mode
    if (editingContactId === null) {
        var contact = {
            id: Date.now(),
            name: nameValue,
            phone: phoneValue,
            email: emailValue,
            address: addressValue,
            group: groupSelect.value, 
            favorite: favCheck.checked,
            emergency: emergencyCheck.checked,
            image: selectedImagePath
        };

        contacts.push(contact);
        swal("Success ", "Contact added successfully", "success");
        
    }
    //Edit contact mode
    else {
        var c = contacts.find(x => x.id === editingContactId);
        c.name = nameValue;
        c.phone = phoneValue;
        c.email = emailValue;
        c.address = addressValue;
        c.group = groupSelect.value;
        c.favorite = favCheck.checked;
        c.emergency = emergencyCheck.checked;
        if (selectedImagePath !== null) {
            c.image = selectedImagePath;
        }
        swal("Updated", "Contact updated successfully", "success");
        editingContactId = null;
    }
    refreshUI();
    resetModalUI();
    closeContactForm();
});

//Function to set or reset fav icon
function toggleFavorite(id) {
    var c = contacts.find(x => x.id === id);
    c.favorite = !c.favorite;
    refreshUI();
}

//Function to set or reset emergency icon
function toggleEmergency(id) {
    var c = contacts.find(x => x.id === id);
    c.emergency = !c.emergency;
    refreshUI();
}

//Function to delete contacts fron contact grid
function deleteContact(id) {
    swal({
        title: "Delete Contact?",
        text: "Are you sure you want to delete This contact? ",
        icon: "warning",
        buttons: {
        cancel: {
            text: "Cancel",
            visible: true,
            className: "swal-btn-cancel"
        },
        confirm: {
            text: "Yes, Delete it!",
            className: "swal-btn-delete"
        }
    },
        dangerMode: true,
    }).then(ok => {
        if (ok) {
            contacts = contacts.filter(c => c.id !== id);
            refreshUI();
        }
    });
}

//Function to edit contacts fron contact grid
function editContact(id) {
    var c = contacts.find(x => x.id === id);
    editingContactId = id;
    nameInput.value = c.name;
    phoneInput.value = c.phone;
    emailInput.value = c.email;
    favCheck.checked = c.favorite;
    emergencyCheck.checked = c.emergency;
    groupSelect.value = c.group || "";
    adressField.value = c.address || "";
    formTitleContact.innerText = "Edit Contact";
    addContantModal.classList.remove("d-none");
}

//Search Event
searchInputField.addEventListener("input", function () {
    var term = this.value.toLowerCase();

    var filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.email.toLowerCase().includes(term)
    );

    renderContacts(filtered);
});

//Function to update all cards that count our contact cards
function updateCounters() {
    var totalCount = contacts.length;
    var favoriteCount = 0;
    var emergencyCount = 0;

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].favorite === true) {
            favoriteCount++;
        }

        if (contacts[i].emergency === true) {
            emergencyCount++;
        }
    }
    if (counters.length >= 3) {
        counters[0].innerText = totalCount;
        counters[1].innerText = favoriteCount;
        counters[2].innerText = emergencyCount;
    }
}

window.onload = loadFromLocalStorage;