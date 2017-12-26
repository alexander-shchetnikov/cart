items = [];
cart = [];

[].forEach.call(document.querySelectorAll('#products li'),function(el){
    var itemObj = {
        name: el.querySelector('.name').innerHTML,
        price: +el.querySelector('.price span').innerHTML,
        count: +el.querySelector('.count span').innerHTML,
        id: +el.querySelector('button').dataset.itemId
    };

    items.push(itemObj);

    el.querySelector('button').addEventListener('click',function (e) {
        addToCart(this.parentNode,itemObj);
    });
    el.addEventListener('dragstart',function (e) {
        handleDragStart(e,this,itemObj);
    });
    el.addEventListener('dragend',handleDragEnd);
});

document.querySelector("#cart").addEventListener('dragover',handleDragOver,false);
document.querySelector("#cart").addEventListener('drop',handleDrop,false);

function addToCart(thisProduct,itemObj) {
    var itemId = itemObj.id,
        addCount = +thisProduct.querySelector('input').value,
        isCreate = false,
        updated = false;

    if(cart.length){
        cart.forEach(function (elem,i,arr){
            if(elem.name == itemObj.name){
                isCreate =!isCreate;
                if(addCount <= items[itemId].count){
                    updated = !updated;
                    cart[i].count += addCount;
                    items[itemId].count -= addCount;
                }
            }
        });
    }

    if(!isCreate){
        updated = !updated;
        items[itemId].count -= addCount;
        createCartElement(
            cart.push({
                name: itemObj.name,
                count: addCount,
                price: itemObj.price,
                itemId: itemId
            }) - 1
        );
    }

    if(updated) renderElements()
}
function renderElements() {
    updateItems();
    updateCart();
    updateResults();
}
function updateItems() {
    var i = 0;
    [].forEach.call(document.querySelectorAll('#products li'),function(el){
        el.querySelector('.count span').innerHTML = items[i].count;
        i++;
    });
}
function createCartElement(cartId) {
    var newCartElement =
        "<li>\n" +
        " <h3 class=\"name\">"+cart[cartId].name+"</h3>\n" +
        " <p class=\"count\">Количество:<span>"+cart[cartId].count+"</span></p>\n" +
        " <p class=\"price\">Цена:<span>"+cart[cartId].price+"</span></p>\n" +
        //" <button>Удалить из корзины</button>\n" +
        "</li>";
    document.querySelector('#cart ul').innerHTML += newCartElement;
}
function updateCart() {
    var i = 0;
    cart.forEach(function(el){
        document.querySelectorAll('#cart .count span')[i].innerHTML = el.count;
        i++;
    });
}
function updateResults() {
    var count = 0 ,sum = 0;
    cart.forEach(function (item) {
        count += item.count;
        sum += item.count * item.price;
    })
    document.querySelector("#cart .result_count").innerHTML = count;
    document.querySelector("#cart .result_price").innerHTML = sum;
}
function deleteItemFromCart(thisElem,cartId) {
    console.log(cartId);
    console.log(cart);
    console.log(items);
    items[cart[cartId].itemId].count += cart[cartId].count;
    delete cart[cartId];
    document.querySelector("#cart ul").removeChild(thisElem);
    renderElements();
}
function handleDragStart(e,thisElem,itemObj) {
    thisElem.classList.add('draged');
    e.dataTransfer.setData('obj',JSON.stringify(itemObj));
    e.dataTransfer.setData('thisElem',JSON.stringify(thisElem));
    document.querySelector("#cart").classList.add('drop_zone');
}
function handleDragEnd(e) {
    this.classList.remove('draged');
    document.querySelector("#cart").classList.remove('drop_zone');
}
function handleDrop(e) {
    var itemObj =JSON.parse(e.dataTransfer.getData('obj')),
        thisElem = document.querySelectorAll('#products li')[JSON.parse(e.dataTransfer.getData('obj')).id];
    addToCart(thisElem,itemObj);
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';

    return false
}