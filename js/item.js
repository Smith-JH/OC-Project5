const api = 'http://localhost:3000/api/teddies/';

//get data from backend
makeRequest = () => {
    return new Promise((resolve, reject) => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const id = urlSearchParams.get('id');
        //make api request of specific product using id
        let apiRequest = new XMLHttpRequest();
        apiRequest.open('GET', api + id);
        apiRequest.send();
        apiRequest.onreadystatechange = () => {
            if (apiRequest.readyState === 4) {
            if (apiRequest.status === 200 || apiRequest.status === 201) {
                resolve(JSON.parse(apiRequest.response));
            } else {
                document.querySelector('main').outerHTML= '<h1>Ooops, something went wrong, make sure you are connected to the server</h1>'
                }
            }
        };
    })
}

createCard = (response) => {
    const card = document.createElement('Article');
    const importImg = response.imageUrl;
    const img = document.createElement('IMG');
    const titleDiv = document.createElement('div');
    const bearName = document.createElement('div');
    const bearPrice = document.createElement('div');
    //make the elements for the buttons and colour selection
    const basketBtn = document.createElement('button');
    const form = document.createElement('form');
    const main = document.querySelector('main');
    const ddMenuLabels = document.createElement('label');
    const ddMenu = document.createElement('select');
    const newP = document.createElement('p');

    //add classes to the newly created elements
    card.classList.add('card', 'my-4');
    img.classList.add('image');
    titleDiv.classList.add('card-title');
    ddMenu.classList.add('dd-menu');
    basketBtn.classList.add('basket-btn', 'centered', 'mx-auto', 'mt-2', 'mb-4', 'alert-success');
    newP.classList.add('added-text');

    //attributing the imported image to the img element
    img.setAttribute('src', importImg);
    //adding HTML (text and classes) to product card elements
    bearName.innerHTML += '<h2 class="col mx-auto sub-heading h1">' + response.name + '</h2>';
    bearPrice.innerHTML += '<p class="col mx-auto price h2">' + '$' + response.price * 0.01 + '</p>';
    form.innerHTML = '<p class="text colour-select">Select a colour:<p>';
    basketBtn.innerHTML = 'Add to Basket';

    //set dropdown menu options
    for (let i in response.colors) {
        const option = document.createElement('option');
        option.innerHTML = response.colors[i];
        option.setAttribute('value', response.colors[i]);
        option.classList.add('dd-item');
        ddMenuLabels.appendChild(option);
    }
    
    //Button click listener - save teddy & colour selection to local storage & reveal success message.
    basketBtn.addEventListener('click', () => {
        const color = document.querySelector('select').value;
        const data = {id:response._id, name:response.name, colors:color, description:response.description, price:response.price};
        //add details to local storage
        localStorage.setItem(response._id + color, JSON.stringify(data));
        newP.innerHTML = `<p><solid>${response.name}</solid> the bear in <solid>${color}</solid> was successfully added to your basket.</p>`;
        card.appendChild(newP);
    });

    //building the above elements into the page
    titleDiv.appendChild(bearName);
    titleDiv.appendChild(bearPrice);
    card.appendChild(titleDiv);
    //insert HTML for the product's description text
    card.innerHTML += '<p class="text">' + response.description + '</p>';
    card.appendChild(img);
    form.appendChild(ddMenu);
    ddMenu.appendChild(ddMenuLabels);
    card.appendChild(form);
    //insert a view basket link
    card.innerHTML += '<a class="a-link-button centered mx-auto my-2 alert-warning" href="./cart.html">View Basket</a>';
    //add a link to continuing shopping
    card.innerHTML += '<a class="a-link-button centered mx-auto my-2 alert-primary" href="../index.html">Continue Shopping</a>';
    card.appendChild(basketBtn);
    main.appendChild(card);
}

init = async () => {
    try {
        //call makeRequest for api request and await response
        const requestPromise = makeRequest();
        const response = await requestPromise;
        //pass response to createCard function to display results
        createCard(response);
    } catch (error) {
        //add error message
        document.querySelector('main').outerHTML = '<h1>Oops, there was a ' + error + ' error. Please try again.<h2>';
    }
}

init(); 