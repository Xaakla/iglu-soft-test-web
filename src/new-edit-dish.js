let id = null;

function getUrlParameter(name) {
    const results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results !== null ? decodeURIComponent(results[1]) : null;
}

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

$(document).ready(function () {
    id = getUrlParameter('id');

    $.getJSON("http://localhost:8080/ingredients", function(ingredients) {
        ingredients.forEach(function(ingredient) {
            var label = document.createElement("label");
            label.innerText = ingredient.name;
            label.htmlFor = ingredient.id;

            var inputCheckbox = document.createElement("input");
            inputCheckbox.type = "checkbox";
            inputCheckbox.id = ingredient.id;
            inputCheckbox.name = ingredient.id;
            inputCheckbox.value = ingredient.id;

            var inputQuantity = document.createElement("input");
            inputQuantity.type = "number";
            inputQuantity.id = "quantity-"+ingredient.id;
            inputQuantity.name = "quantity-"+ingredient.id;
            inputQuantity.value = 0;

            $("#ingredients").append(label).append(inputCheckbox).append(inputQuantity).append(`<br><br>`);
        });
    });

    $.getJSON("http://localhost:8080/dishes/" + id, function (dish) {
        dish.ingredients.forEach(function (ingredient) {
            console.log(ingredient)
            $("#"+ingredient.ingredient.id).prop("checked", true);
            $("#quantity-"+ingredient.ingredient.id).val(ingredient.quantity);
        });

        $("#name").val(dish.name);
    });
});

function submitForm() {
    const data = {
        id,
        name: $("#name").val(),
        ingredientsIds: $('input[type="checkbox"]:checked').map(function() {
            return {
                quantity: $('#quantity-'+this.value).val(),
                ingredientId: Number(this.value)
            };
        }).get()
    };

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

    $.postJSON("http://localhost:8080/dishes", data, function() {
        window.location.href = 'dishes.html';
    });
}