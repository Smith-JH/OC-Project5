const api = 'http://localhost:3000/api/teddies/';

//get the data from the backend
makeRequest = () => {
  return new Promise((resolve, reject) => {
    let apiRequest = new XMLHttpRequest();
    apiRequest.open('GET', api);
    apiRequest.send();
    apiRequest.onreadystatechange = () => {
      if (apiRequest.readyState === 4) {
        if (apiRequest.status === 200 || apiRequest.status === 201) {
          resolve(JSON.parse(apiRequest.response));
        } else {
          reject('Problem retrieving data');
          document.querySelector('main').outerHTML= '<h1>Ooops, something went wrong, make sure you are connected to the server</h1>'
          }
      }
    };
  })
}


//create and insert the data receieved from the back end into individual product cards 
createProductCard = (response) => {
  const main = document.querySelector('main');
  for (let i in response) {
    const card = document.createElement('Article');
    const importImg = response[i].imageUrl;
    const titleDiv = document.createElement('div');
    const bearName = document.createElement('div');
    const bearPrice = document.createElement('div');
    const img = document.createElement('IMG');
    const aTag = document.createElement('a');
    const aTagBtn = document.createElement('a');

    //add classes to the elements
    card.classList.add('card','col-11','col-md-5', 'mx-auto', 'my-4');   
    titleDiv.classList.add('row');
    img.classList.add('image');
    aTagBtn.classList.add('more-info-btn');
    titleDiv.classList.add('card-title');

    //add the image and links to individual product pages
    img.setAttribute('src', importImg);
    aTag.setAttribute('href', './html/item.html?id=' + response[i]._id);
    aTagBtn.setAttribute('href', './html/item.html?id=' + response[i]._id);

    //add HTML for the name price and information button
    aTagBtn.innerHTML = '<a class="more-info-btn" id="link-text">More Information</a>';
    bearName.innerHTML += '<h2 class="col sub-heading">' + response[i].name + '</h2>';
    bearPrice.innerHTML += '<p class="col price h3">' + '$' + response[i].price * 0.01 + '</p>';
    
    //build all compoents together onto the page
    titleDiv.appendChild(bearName);
    titleDiv.appendChild(bearPrice);
    card.appendChild(titleDiv);
    card.innerHTML += '<p class="text">' + response[i].description + '</p>';
    aTag.appendChild(img);
    card.appendChild(aTag);
    card.appendChild(aTagBtn);
    main.appendChild(card);
  }
}

//Submits request to the API, wait for confirmation:
//if successful creates product cards, otherwise throws relevent error
loadCards = async () => {
  try {
    const requestPromise = makeRequest();
    const response = await requestPromise;
    createProductCard(response);
  } catch (error) {
    document.querySelector('main').outerHTML = '<h1>Oops, there was a ' + error + ' error. Please try again.<h2>';
  }
}

//run loadCards and by extension createProductCard functions
loadCards();