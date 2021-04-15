//get data from session storage and display confirmation
displayOrderTeddies = () => {
    //retrieve the orderID and price from sessionStorage
    const data = JSON.parse(sessionStorage.getItem('data'));
    const price = JSON.parse(sessionStorage.getItem('price'));
    
    //build the order confirmation page elements
    const main = document.querySelector('main');
    const div = document.createElement('div');
    const thanksMessage = document.createElement('h2');
    const orderConfirmationMessage = document.createElement('h2');
    const orderId = document.createElement('h3');
    const totalPrice = document.createElement('h3');
    
    //style order confiramtion page elements
    div.classList.add('background-styling', 'my-4');
    thanksMessage.classList.add('centered', 'pt-2', 'cursive-text');
    thanksMessage.innerHTML = '<span class="alert-success font-weight-bold">Thank you!</span>'; 
    orderConfirmationMessage.classList.add('centered', 'cursive-text');
    orderConfirmationMessage.innerHTML = '<span class="alert-success">Your order has been placed successfully.</span>'; 

    //add the orderID
    orderId.classList.add('cursive-text', 'my-4', 'mx-2', 'card');
    orderId.innerHTML = 'Order ID: <span class="font-weight-bold h4 my-1 centered">' + data.orderId + '</span>';
    //and the total price
    totalPrice.classList.add('cursive-text', 'my-4', 'mx-2', 'card');
    totalPrice.innerHTML = 'Total Price: <span class="font-weight-bold h4 my-1 centered"> $' + price * 0.01 + '</span>';

    //add all elements to the page
    main.appendChild(div);
    div.appendChild(thanksMessage);
    div.appendChild(orderConfirmationMessage);
    div.appendChild(orderId);
    div.appendChild(totalPrice);
}

testOrderConfirm = async () => {
    try {
        const requestPromise = displayOrderTeddies();
        const response = await requestPromise;
        //pass response to createCard function to display results
    } catch (error) {
        //add error message
        document.querySelector('main').outerHTML = '<h1 class="alert-danger my-4">Oops, it looks like an error occurred: <br>"' + error + '."<br> Please try again.<h2>';
    }
}

testOrderConfirm();