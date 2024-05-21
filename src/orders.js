$.getJSON = function(url, callback) {
    return jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'GET',
        'url': url,
        'dataType': 'json',
        'success': callback
    });
};

$.getJSON("http://localhost:8080/ingredients", function(ingredients) {
    $.getJSON("http://localhost:8080/dishes", function(dishes) {
        if (dishes.length > 0) {
            $("#title").css("display", "inline-block");
            $("#btn-order").css("display", "inline-block");
            dishes.forEach(function(dish) {
                const label = document.createElement("label");
                label.innerText = dish.name;
                label.htmlFor = dish.id;

                const inputCheckbox = document.createElement("input");
                inputCheckbox.type = "checkbox";
                inputCheckbox.id = dish.id;
                inputCheckbox.name = "dish-input";
                inputCheckbox.value = dish.id;

                const ingredientsDiv = document.createElement("div");
                ingredientsDiv.style.display = "none";
                ingredientsDiv.classList.add("ingredientsDiv");

                inputCheckbox.addEventListener("change", function(event) {
                    ingredientsDiv.style.display = event.target.checked ? "inline-block" : "none";
                });

                const ingredientDivH5 = document.createElement("h5").innerText = "Selecionar adicionais: ";
                ingredientsDiv.append(ingredientDivH5);
                ingredientsDiv.append(document.createElement("br"));
                ingredients.forEach(it => {
                    const label = document.createElement("label");
                    label.innerText = it.name;
                    label.htmlFor = dish.id+'-'+it.id;

                    const inputCheckboxIngredient = document.createElement("input");
                    inputCheckboxIngredient.type = "checkbox";
                    inputCheckboxIngredient.id = dish.id+'-'+it.id;
                    inputCheckboxIngredient.name = "ingredient-input"+dish.id;
                    inputCheckboxIngredient.value = dish.id+'-'+it.id;

                    const inputQuantity = document.createElement("input");
                    inputQuantity.type = "number";
                    inputQuantity.id = "quantity-"+dish.id+'-'+it.id;
                    inputQuantity.name = "quantity-"+dish.id;
                    inputQuantity.value = 0;
                    inputQuantity.style.display = "none";

                    inputCheckboxIngredient.addEventListener("change", function(event) {
                        inputQuantity.style.display = event.target.checked ? "inline-block" : "none";
                    });

                    const separatorDiv = document.createElement("div");
                    separatorDiv.classList.add("separatorDiv")

                    separatorDiv.append(label);
                    separatorDiv.append(inputCheckboxIngredient);
                    separatorDiv.append(inputQuantity);
                    ingredientsDiv.append(separatorDiv);
                });

                $("#dishes").append(`<br>`).append(label).append(inputCheckbox).append(`<br><br>`).append(ingredientsDiv);
            });
        }
    });
});

function submitForm() {
    const resultDiv = $('#result');
    resultDiv.empty();

    const data = $('input[type="checkbox"][name="dish-input"]:checked').map(function() {
        const dishId = $(this).val();
        const ingredientInputName = "ingredient-input"+this.value;
        return {
            dishId: Number(this.value),
            ingredients: $('input[type="checkbox"][name="'+ingredientInputName+'"]:checked').map(function() {
                const ingredientId = this.value.split('-')[1];
                return {
                    ingredientId,
                    quantity: $("#quantity-"+dishId+'-'+ingredientId).val(),
                }
            }).get()
        };
    }).get();

    $.postJSON = function(url, data, callback) {
        return jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'type': 'POST',
            'url': url,
            'data': JSON.stringify(data),
            'dataType': 'json',
            'success': callback
        });
    };

    $.postJSON("http://localhost:8080/orders", data, function(result) {
        const totalPrice = document.createElement("h1");
        totalPrice.innerText = "Preço Total: R$ "+(result.totalPrice / 100).toFixed(2);
        resultDiv.append(totalPrice);

        result.dishes.forEach(function(dish) {
            const dishDiv = document.createElement("div");
            const h3 = document.createElement("h3");
            h3.innerText = dish.name + ' - R$ ' + (dish.salePrice / 100).toFixed(2);
            dishDiv.append(h3);

            const p = document.createElement("p");
            let text = '';
            dish.ingredients.forEach((it, i) => {
                text += it.quantity + 'x ' + it.name + (i === dish.ingredients.length - 1 ? '' : ', ');
            });
            console.log('text: ', text)
            p.innerText = text;
            dishDiv.append(p);
            resultDiv.append(dishDiv);
        });
    });
}