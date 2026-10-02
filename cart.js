const carditem = document.getElementById("carditem");
const maincart = document.getElementById("maincart");
const subtotal = document.getElementById("subtotal");
const arrow = document.getElementById("arrow");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const couponcontainer = document.getElementById("couponcontainer");
const inputcontainer = document.getElementById("inputcontainer");
const message = document.getElementById("message");
const productcontent = document.getElementById("productcontent");
const quantity = document.getElementById("quantity");

let product = [
  { name: "Naan Burger", price: "$1.85", image: "assets/img/pr-1.png" },
  { name: "Butter Chicken Taco", price: "$1.15", image: "assets/img/pr-2.png" },
  { name: "Chicken Burger", price: "$2.00" ,image: "assets/img/pr-3.png"},
  { name: "Cheese Chicken Naan", price: "$2.50",image: "assets/img/pr-4.png" },
  { name: "3 Layer Burger", price: "$4.99" ,image: "assets/img/pr-5.png"},
  { name: "Sandwich", price: "$2.80",image: "assets/img/pr-6.png" },
  {name : "Spicy Beef Taco",price: "$1.45", image: "assets/img/pr-6.png"},
  {name : "Crispy Fish Taco",price: "$2.70", image: "assets/img/pr-3.png"},
  {name : "Tandoori Paneer Roll",price: "$1.95", image: "assets/img/pr-4.png"}
];

let cart = [];
let coupon = "TASEEN45";
let total = 0;
let discount = 0;

//========================productcontent======================//
function renderproduct(){



product.forEach(function(product,indexx){
      productcontent.innerHTML += `<div
                class="bg-[#191919] max-w-370 w-full px-20 py-20 rounded-br12 lg:w-[48%]"
              >
                <div>
                  <img src="${product.image}" alt="" />
                </div>
                <div>
                  <h3 class="font-bold text-[24px] leading-34 pb-10">
                    ${product.name}
                  </h3>
                  <span class="leading-26 block pb-10"
                    >Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.</span
                  >
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[24px] leading-34">${product.price}</span>
                    <div
                    onclick="addtocart(${indexx})"
                      class="border border-solid border-white w-40 h-40 py-10 px-10 rounded-full flex justify-center items-center hover:bg-red-400 hover:border-red-400"
                    >
                      <img src="./assets/img/shopping-cart.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>`;
});


}

if(productcontent){
  renderproduct();
}


//========================Add to Card=========================//

function addtocart(index) {
  let cart = JSON.parse(localStorage.getItem("carditems")) || [];
  cart.push(product[index]);
  localStorage.setItem("carditems", JSON.stringify(cart));
  if(carditem){
      rendercard();
  }
}

//========================Remove Card=========================//

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("carditems")) || [];

  cart.splice(index, 1);
  localStorage.setItem("carditems", JSON.stringify(cart));
  rendercard();
}

//========================Render Card=========================//

function rendercard() {
  total = 0;
  let savedata = JSON.parse(localStorage.getItem("carditems")) || [];

  carditem.innerHTML = "";

  if (savedata.length === 0) {
    carditem.innerHTML = `<div class="flex flex-col items-center mt-30 bg-white px-40 py-90 rounded-md mx-330">
      <h3 class="pb-20 font-semibold text-[21px]">Empty Cart</h3>
      <a href="index.html"><button class="bg-black border-0 outline-0 py-10 px-20 text-white rounded-md">Continue Shopping</button></a>
    </div>`;
    maincart.style.display = "none";
    subtotal.style.display = "none";
    couponcontainer.classList.add("hidden");
    return;
  }

  savedata.forEach(function (item, index) {
    carditem.innerHTML += `<div class="grid grid-cols-3 items-center bg-white px-20 py-15 border-b border-gray-200">
    
    <div class="flex items-center gap-15">
        <div><img class="w-50 h-50 object-cover rounded" src="${item.image}" alt="${item.name}"></div>
        <div class="flex flex-col">
            <h3 class="font-semibold text-[15px]">${item.name}</h3>
            <span class="text-gray-500 text-[13px]">${item.price}</span>
            <a href="javascript:void(0)" onclick="removeFromCart(${index})" class="text-red-500 text-[12px] hover:underline">Remove</a>
        </div>
    </div>

    <div class="flex justify-center">
        <div class="border border-gray-400 rounded">
            <input class="w-50 h-30 outline-none text-center" type="number" value="${item.quantity || 1}" onchange="updateQuantity(${index}, this.value)" id="quantity">
        </div>
    </div>

    <div class="text-right">
        <span class="font-bold text-[16px]">${item.price}</span>
    </div>

</div>`;
    let priceNumber = parseFloat(item.price.replace("$", ""));
    let itemqty = item.quantity || 1;
    total += itemqty * priceNumber;
  });
  rendersummery();
}

//==========================quantity=====================================//

function updateQuantity(index,newqty){
  let cart = JSON.parse(localStorage.getItem("carditems")) || []; 
  let qty = parseInt(newqty);

  if(isNaN(qty) || qty < 1){
    qty =1;
  }

  cart[index].quantity = qty;

  localStorage.setItem('carditems' , JSON.stringify(cart));
  rendercard();
}

//========================Coupon Expand/collapse=========================//
if(arrow){
arrow.addEventListener("click", function () {
  if (inputcontainer.classList.contains("hidden")) {
    arrow.style.transform = "rotate(180deg)";
    arrow.style.transition = "0.4s all";
    inputcontainer.classList.remove("hidden");
    inputcontainer.style.display = "block";
    couponcontainer.style.height = "105px";
  } else {
    arrow.style.transform = "rotate(0deg)";
    inputcontainer.classList.add("hidden");
    inputcontainer.style.display = "none";
    couponcontainer.style.height = "43px";
  }
});
}

//========================Coupon =========================//
if(submit){
  let cart = JSON.parse(localStorage.getItem("carditems")) || [];
  
submit.addEventListener("click", function () {
  if (input.value.trim() === "") {
    message.innerHTML = `<span>Please Input Your Coupon Code</span>`;
    return;
  }

  if (input.value.trim() === coupon) {
    localStorage.setItem("appliedcoupon","TASEEN45")
  
    rendersummery();
    message.innerHTML = `<span>Coupon Applied Successfully</span>`;
    input.value = "";
  } else {
    message.innerHTML = `<span>Wrong Code</span>`;
    discount = 0;
    rendersummery();
  }
});
}



//========================Render Summery =========================//

function rendersummery() {

  let savecoupon = localStorage.getItem('appliedcoupon');
    if(savecoupon === coupon){
    discount = total * 0.10;
    } else {
      discount =0;
    }
  let totals = total - discount;

  subtotal.innerHTML = `<div class="border-t border-gray-200 pt-15 mt-20">
            <div class="flex justify-between items-center px-20 py-5">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">$${total.toFixed(2)}</span>
            </div>
          <div class="${discount > 0 ? "" : "hidden"}">
            <div class="flex justify-between items-center px-20 py-5 text-green-600">
                <span>Discount (Coupon)<a onclick="getremove()" href="">remove</a></span>
                <span>-$${discount.toFixed(2)}</span>
            </div>
          </div>

            <span class="block bg-gray-200 h-1 my-10"></span>

            <div class="flex justify-between items-center px-20 py-5 font-bold text-[18px]">
                <span>Total</span>
                <span>$${totals.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function getremove(){
    localStorage.removeItem('appliedcoupon');
    rendersummery();
    message.innerHTML ="";
}

if (carditem) {
  rendercard();
}