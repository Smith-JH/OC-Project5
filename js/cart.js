const api = 'http://localhost:3000/api/teddies/order';

//set totalPrice and define products
let totalPrice = 0;
const products = [];

//call main and style, build table element
const main = document.querySelector('main');
main.classList.add('background-styling', 'my-4');
const table = document.createElement('table');

//Make API request for the relevant data
makeRequest = (data) => {
    return new Promise((resolve, reject) => {
        let apiRequest = new XMLHttpRequest();
        apiRequest.open('POST', api);
        apiRequest.setRequestHeader('Content-Type', 'application/json');
        apiRequest.send(JSON.stringify(data));
        apiRequest.onreadystatechange = () => {
            if (apiRequest.readyState === 4) {
                if (apiRequest.status === 200 || apiRequest.status === 201) {
                    resolve(JSON.parse(apiRequest.response));
                } else if (apiRequest.status === 400) {
                    reject('Problem retrieving data');
                } else {   
                    document.querySelector('main').outerHTML= '<h1>Ooops, something went wrong with the API request, make sure you are connected to the server.</h1>'
                }
            }
        };
    })
}

//if there are items in the basket build table headings, otherwise display empty basket message
displayHeadings = () => {
    const subHeading = document.createElement('h2');
    subHeading.setAttribute('class', 'my-4 sub-heading pl-3');
    const trHeader = document.createElement('tr');
    if (localStorage.length == 0) {
        var removeOrder = document.getElementById('order');
        removeOrder.parentNode.removeChild(removeOrder);
        main.innerHTML = '<h2 class="centered alert-warning my-4">It looks like your basket is empty</h2>';
    } else {
        main.appendChild(subHeading);
        subHeading.innerHTML = 'Items in your basket:';
        trHeader.innerHTML = '<th>Name</th>' + '<th>Colour</th>' + '<th>Price</th>' + '<th>Remove Item</th>';
        table.appendChild(trHeader);
    }
}

//display procucts in basket on the table
displayProducts = () => {
    //create total and style
    const total = document.createElement('h3');
    total.setAttribute('class', 'my-4 text-center cursive-text');

    //display products saved in local storage
    for (let i = 0; i < localStorage.length; i++) {
        //retrieve products from local storage
        let data = JSON.parse(localStorage.getItem(localStorage.key(i)));
        
        //create table elements
        const tableRow = document.createElement('tr');
        const name = document.createElement('td');
        const colour = document.createElement('td');
        const price = document.createElement('td');
        const remove = document.createElement('td');
        const removeButton = document.createElement('button');
        //style table elements, add each product's name, colour and price to the table
        table.setAttribute('id', 'table');
        table.classList.add('table', 'col-md-11', 'mx-auto');
        remove.setAttribute('class', 'py-2');
        removeButton.classList.add('btn', 'btn-danger', 'py-1');
        name.innerHTML = '<p class="cursive-text"><span class="font-weight-bold">' + data.name + '</span>' + ' the bear</p>';
        colour.innerHTML += '<p class="cursive-text">in <span class="font-weight-bold">' + data.colors + '</span>' + '</p>';
        price.innerHTML = '<p class="cursive-text">$<span class="font-weight-bold">' + data.price * 0.01 + '</span>' + '</p>';
        removeButton.innerHTML = 'X';
        products[i] = data.id;

        //Remove items click listener
        removeButton.addEventListener('click', () => {
            localStorage.removeItem(localStorage.key(i));
            removeButton.parentElement.remove();
            location.reload();
        });
 
        //Calculate and save total price
        totalPrice += data.price;
        total.innerHTML = 'Total Price = $' + totalPrice * 0.01;
        sessionStorage.setItem('price', JSON.stringify(totalPrice));

        //Build all table elements together and onto page
        main.appendChild(table);
        main.appendChild(total);
        remove.appendChild(removeButton);
        tableRow.appendChild(name);
        tableRow.appendChild(colour);
        tableRow.appendChild(price);
        tableRow.appendChild(remove);
        table.appendChild(tableRow);
    }
}

//check form submission input
checkUserFormSubmission = () => {
    //retreive html fields
    const orderButton = document.getElementById('order-button');
    const firstName = document.getElementById('firstName');
    const surname = document.getElementById('surname');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
    const submissionFailed = document.getElementById('error-message');
    
    //set field validity to false
    let validFirstName = false;
    let validSurname = false;
    let validAddress = false;
    let validCity = false;
    let validEmail = false;
    
    //Field validity check - regex
    const inputText = /^[A-Z a-z]{2,32}$/;
    const inputAddress = /^[A-Z a-z 0-9]{3,32}$/;
    const inputEmail = /^[a-z0-9._%&'+-]+@[a-z0-9.-]+\.[a-z]{2,64}$/;

    //change field appearence based on input validity
    validSubmission = ($errorMessage, $fieldId) => {
        $errorMessage.classList.add('d-none');
        $fieldId.classList.remove('border-danger');
        $fieldId.classList.add('border-success');
        submissionFailed.classList.add('d-none');
    }
    invalidSubmission = ($errorMessage, $fieldId) => {
        $errorMessage.classList.remove('d-none'),
        $fieldId.classList.remove('border-success'),
        $fieldId.classList.add('border-danger');
    }

    //check firstName... email fields
    firstName.addEventListener('blur', () => {
        if (inputText.test(firstName.value)) {
            validFirstName = true;
            validSubmission(invalidFirstName, firstName);
        } else {
            validFirstName = false;
            invalidSubmission(invalidFirstName, firstName);
        }
    });
    surname.addEventListener('blur', () => {
        if (inputText.test(surname.value)) {
            validSurname = true;
            validSubmission(invalidSurname, surname);
        } else {
            validSurname = false;
            invalidSubmission(invalidSurname, surname);
        }
    });
    address.addEventListener('blur', () => {
        if (inputAddress.test(address.value)) {
            validAddress = true;
            validSubmission(invalidAddress, address);
        } else {
            validAddress = false;
            invalidSubmission(invalidAddress, address);
        }
    });
    city.addEventListener('blur', () => {
        if (inputText.test(city.value)) {
            validCity = true;
            validSubmission(invalidCity, city);
        } else {
            validCity = false;
            invalidSubmission(invalidCity, city);
        }
    });
    email.addEventListener('blur', () => {
        if (inputEmail.test(email.value)) {
            validEmail = true;
            validSubmission(invalidEmail, email);
        } else {
            validEmail = false;
            invalidSubmission(invalidEmail, email);
        }
    });

    //order-button - check all fields are valid, if so call "submitForm" to submit
    //the order (comprised of contact form and ordered products).
    orderButton.addEventListener('click', ($event) => {
        $event.preventDefault();
        const contact = {
            firstName: firstName.value,
            lastName: surname.value,
            address: address.value,
            city: city.value,
            email: email.value,
        };
        const orderTeddies = {
            contact, products,
        };
        //submitForm only if all input fields valid, else pass error
        if ((validFirstName) && (validSurname) && (validAddress) && (validCity) && (validEmail)) {
            submissionFailed.classList.add('d-none');
            submitForm(orderTeddies);
        } else {
            submissionFailed.classList.remove('d-none');
        };
    });    
};

//Submit order to the API, waits for confirmation:
//confirms if successful, throws relevent error if fails.
submitForm = async (orderTeddies) => {
    try {
        const requestPromise = makeRequest(orderTeddies);
        const response = await requestPromise;
        displayConfirmation(response);
    } catch (error) {
        document.querySelector('form').innerHTML = '<p class="alert-danger centered"><strong>' + error + '</strong><p>';
    }
}

//display confirmation page (clear localStorage and save data to sessionStorage)
displayConfirmation = (response) => {
    localStorage.clear();
    sessionStorage.setItem('data', JSON.stringify(response));
    location = 'order-confirmation.html';
}

//Run the above functions:
displayHeadings();
displayProducts();
checkUserFormSubmission();