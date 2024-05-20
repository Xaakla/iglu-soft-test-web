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
        dishes.forEach(function(dish) {
            var label = document.createElement("label");
            label.innerText = dish.name;
            label.htmlFor = dish.id;

            var inputCheckbox = document.createElement("input");
            inputCheckbox.type = "checkbox";
            inputCheckbox.id = dish.id;
            inputCheckbox.name = "dish-input";
            inputCheckbox.value = dish.id;

            var inputQuantity = document.createElement("input");
            inputQuantity.type = "number";
            inputQuantity.id = "quantity-"+dish.id;
            inputQuantity.name = "quantity-"+dish.id;
            inputQuantity.value = 0;

            const ingredientsDiv = document.createElement("div");
            const ingredientDivH5 = document.createElement("h5").innerText = "Selecionar adicionais: ";
            ingredientsDiv.append(ingredientDivH5);
            ingredientsDiv.append(document.createElement("br"));
            ingredients.forEach(it => {
                var label = document.createElement("label");
                label.innerText = it.name;
                label.htmlFor = it.id;

                var inputCheckbox = document.createElement("input");
                inputCheckbox.type = "checkbox";
                inputCheckbox.id = it.id;
                inputCheckbox.name = "ingredient-input"+dish.id;
                inputCheckbox.value = it.id;

                var inputQuantity = document.createElement("input");
                inputQuantity.type = "number";
                inputQuantity.id = "quantity-"+it.id;
                inputQuantity.name = "quantity-"+it.id;
                inputQuantity.value = 0;

                ingredientsDiv.append(label);
                ingredientsDiv.append(inputCheckbox);
                ingredientsDiv.append(inputQuantity);
            });


            $("#dishes").append(label).append(inputCheckbox).append(inputQuantity).append(`<br><br>`)
                .append(ingredientsDiv);
        });
    });
});

function submitForm() {
    const data = $('input[type="checkbox"][name="dish-input"]:checked').map(function() {
        const ingredientInputName = "ingredient-input"+this.value;
        return {
            dishId: Number(this.value),
            ingredients: $('input[type="checkbox"][name="'+ingredientInputName+'"]:checked').map(function() {
                return {
                    ingredientId: Number(this.value),
                    quantity: Number($("#quantity-"+this.value).val()),
                }
            }).get()
        };
    }).get();

    console.log(data)

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

    $.postJSON("http://localhost:8080/orders", data, function() {
        // window.location.href = 'dishes.html';
    });
}