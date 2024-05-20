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

            const ingredientsDiv = document.createElement("div");
            const ingredientDivH5 = document.createElement("h5").innerText = "Selecionar adicionais: ";
            ingredientsDiv.append(ingredientDivH5);
            ingredientsDiv.append(document.createElement("br"));
            ingredients.forEach(it => {
                var label = document.createElement("label");
                label.innerText = it.name;
                label.htmlFor = dish.id+'-'+it.id;

                var inputCheckbox = document.createElement("input");
                inputCheckbox.type = "checkbox";
                inputCheckbox.id = dish.id+'-'+it.id;
                inputCheckbox.name = "ingredient-input"+dish.id;
                inputCheckbox.value = dish.id+'-'+it.id;

                var inputQuantity = document.createElement("input");
                inputQuantity.type = "number";
                inputQuantity.id = "quantity-"+dish.id+'-'+it.id;
                inputQuantity.name = "quantity-"+dish.id;
                inputQuantity.value = 0;

                ingredientsDiv.append(label);
                ingredientsDiv.append(inputCheckbox);
                ingredientsDiv.append(inputQuantity);
            });


            $("#dishes").append(label).append(inputCheckbox).append(`<br><br>`).append(ingredientsDiv);
        });
    });
});

function submitForm() {
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
        result.dishes.forEach(function(dish) {
            const dishDiv = document.createElement("div");
            const h3 = document.createElement("h3");
            h3.innerText = dish.name + ' - ' + dish.salePrice;
            dishDiv.append(h3);

            const br = document.createElement("br");

            const p = document.createElement("p");
            let text = '';
            dish.ingredients.forEach((it, i) => {
                text += it.quantity + 'x ' + it.name + (i === dish.ingredients.length - 1 ? '' : ', ');
            });
            console.log('text: ', text)
            p.innerText = text;
            dishDiv.append(p);

            const resultDiv = $('#result');
            resultDiv.empty();
            resultDiv.append(dishDiv);
        });
    });
}