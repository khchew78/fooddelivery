function outputMenus(category_id) {
   let menus_section = document.getElementById("menus");
   let url = "api/menus";
   if (menus_section) {
       if (category_id) {
         url = `api/menus?category_id=${category_id}`;
       }
       
      let xhttp = new XMLHttpRequest();
      
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let menus = JSON.parse(this.responseText);
          let output = "";
          for (let i=0; i < menus.length; i++) {
          
            output += `<tr>
                        <td><img src="${menus[i].image_url}" width="100" height="100"></td> 
                        <td>${menus[i].name}</td>
                        <td>${menus[i].price}</td>
                        <td><input type="text" data-menu_id="${menus[i].id}"></td>
                        <td><button class="addToCartButton">Add To Cart</button></td>
                      </tr>`;
          }
          menus_section.innerHTML = output;
          addEventToButtons();
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send(); 
    }
}

// testing
function addToCart(ele) {
    let data = new FormData();
    let target = ele.parentElement.previousElementSibling.firstElementChild
    let quantity = target.value
    let menu_id = target.getAttribute("data-menu_id")
    if (quantity) {
      data.append('quantity', quantity);
      data.append('menu_id', menu_id);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'api/menus', true);
       
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      xhr.onload = function () {
        
        let result = JSON.parse(this.responseText);
        
        if (this.status == 200) {
          // let message_section = document.getElementById("flash_messages")
          // message_section.innerHTML = `<p style="text-align:center; font-size:15px; background-color:#99ff33">${result.message}</p>`
          var node = document.createElement("P");     
          node.classList = ["notice_message"]
          var textnode = document.createTextNode(result.message); 
          node.appendChild(textnode);
          document.getElementById("flash_messages").appendChild(node); 
          window.scrollTo(0, 0);
          target.value = ""
          
          
          
        } else if (this.status == 401) {
          var node = document.createElement("P");     
          node.classList = ["alert_message"]
          var textnode = document.createTextNode(result.message); 
          node.appendChild(textnode);
          document.getElementById("flash_messages").appendChild(node); 
          window.scrollTo(0, 0);
        }
      };
      xhr.send(data);
       
    }
}

function addEventToButtons() {
  let buttons = document.getElementsByClassName("addToCartButton")
  for(let i=0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function() {
          addToCart(buttons[i]);
      });
  }
}

function addEventToCategories() {
 let links = document.getElementsByClassName("filteringByCategory");
 for(let i=0; i < links.length; i++) {
     links[i].addEventListener("click", function() {
         filterMenuItemsByCategory(links[i]);
     });
 }
}

function filterMenuItemsByCategory(ele) {
   let category_id = ele.getAttribute("data-category-id");
   outputMenus(category_id);
}

document.addEventListener("DOMContentLoaded", function(event) {
   // Your code to run since DOM is loaded and ready
   outputMenus(0);
   addEventToCategories()
});

// document.addEventListener("DOMContentLoaded", function(event) {
//   console.log("document loaded")
//   outputMenus();
// });

