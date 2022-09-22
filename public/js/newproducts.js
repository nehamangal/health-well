let products = {
    data: [
      {
        productName: "Carboplatin Systemic",
        category: "Medicine",
        quantity: "30",
        price: "25000",
        image: "../assets/images/carboplatin.jpg",
      },
      {
        productName: "dactinomycin",
        category: "Medicine",
        quantity: "49",
        price: "25000",
        image: "../assets/images/dactinomycin.webp",
      },
      {
        productName: "ifosfamide",
        category: "Medicine",
        quantity: "99",
        price: "25000",
        image: "../assets/images/ifosfamide.webp",
      },
      {
        productName: "vincristine systemic",
        category: "Medicine",
        quantity: "29",
        price: "25000",
        image: "../assets/images/vincristine.jpg",
      },
      {
        productName: "Tepadina",
        category: "Medicine",
        quantity: "129",
        price: "25000",
        image: "../assets/images/tepadina.jpg",
      },
      {
        productName: "walkers",
        category: "Appliances",
        quantity: "89",
        price: "25000",
        image: "../assets/images/walkers.jpg",
      },
      {
        productName: "zolgensma",
        category: "Medicine",
        quantity: "189",
        price: "25000",
        image: "../assets/images/zolgensma.jpg",
      },
      {
        productName: "Oxygen concentrators",
        category: "Appliances",
        quantity: "49",
        price: "25000",
        image: "../assets/images/oxygen.jpg",
      },
      {
        productName: "WheelChair",
        category: "Appliances",
        quantity: "49",
        price: "25000",
        image: "../assets/images/wheelchair.jpg",
      },
    ],
  };
  
  for (let i of products.data) {
    let card = document.createElement("div");
    //Card should have category and should stay hidden initially
    card.classList.add("card", i.category, "hide");
    //image div
    let imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");
    //img tag
    let image = document.createElement("img");
    image.setAttribute("src", i.image);
    imgContainer.appendChild(image);
    card.appendChild(imgContainer);
    //container
    let container = document.createElement("div");
    container.classList.add("container1");
    //product name
    let name = document.createElement("h5");
    name.classList.add("product-name");
    name.innerText = i.productName.toUpperCase();
    container.appendChild(name);
    let quantity = document.createElement("h6");
    quantity.innerText = "Available Quantity: " + i.quantity;
    container.appendChild(quantity);
    let price = document.createElement("h6");
    price.innerText = "Rs. " + i.price;
    container.appendChild(price);
  
    card.appendChild(container);
    document.getElementById("products").appendChild(card);
  }
  
  //parameter passed from button (Parameter same as category)
  function filterProduct(value) {
    //Button class code
    let buttons = document.querySelectorAll(".button-value");
    buttons.forEach((button) => {
      //check if value equals innerText
      if (value.toUpperCase() == button.innerText.toUpperCase()) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  

    let elements = document.querySelectorAll(".card");

    elements.forEach((element) => {

      if (value == "all") {
        element.classList.remove("hide");
      } else {
        //Check if element contains category class
        if (element.classList.contains(value)) {
          //display element based on category
          element.classList.remove("hide");
        } else {
          //hide other elements
          element.classList.add("hide");
        }
      }
    });
  }
  
  //Search button click
  document.getElementById("search").addEventListener("click", () => {
    //initializations
    let searchInput = document.getElementById("search-input").value;
    let elements = document.querySelectorAll(".product-name");
    let cards = document.querySelectorAll(".card");
  
    //loop through all elements
    elements.forEach((element, index) => {
      //check if text includes the search value
      if (element.innerText.includes(searchInput.toUpperCase())) {
        //display matching card
        cards[index].classList.remove("hide");
      } else {
        //hide others
        cards[index].classList.add("hide");
      }
    });
  });
  
  //Initially display all products
  window.onload = () => {
    filterProduct("all");
  };