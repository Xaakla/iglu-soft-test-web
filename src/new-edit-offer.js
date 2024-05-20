let id = null;

function getUrlParameter(name) {
    const results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results !== null ? decodeURIComponent(results[1]) : null;
}

$.getJSON = function (url, callback) {
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

$(document).ready(function() {
    id = getUrlParameter('id');

    $.getJSON("http://localhost:8080/offers/" + id, function (ingredient) {
        $("#name").val(ingredient.name);
        $("#discount-type").val(ingredient.discountType);
        ingredient.requiredIngredients.forEach(it => {
            $("#required"+it.ingredient.id).prop("checked", true);
            $("#min-quantity-required"+it.ingredient.id).val(it.minQuantity);
            $("#paid-quantity-required"+it.ingredient.id).val(it.paidQuantity);
        });
        ingredient.excludedIngredients.forEach(it => {
            $("#excluded"+it.ingredient.id).prop("checked", true);
            $("#min-quantity-excluded"+it.ingredient.id).val(it.minQuantity);
            $("#paid-quantity-excluded"+it.ingredient.id).val(it.paidQuantity);
        });
        $("#required").val(ingredient.name);
        $("#discount-amount").val(ingredient.discountAmount);

        handleToggleInput();
    });

    // Chama a função quando o valor do select muda
    $('#discount-type').change(function() {
        handleToggleInput();
    });
});

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
    ingredients.forEach(function(ingredient) {
        createIngredientsElements("required", ingredient);
        createIngredientsElements("excluded", ingredient);

        handleToggleInput();
    })
});

function handleToggleInput() {
    if ($("#discount-type").val() === 'INGREDIENT_QUANTITY_DISCOUNT') {
        $('#discount-amount-container').css('display', 'none');
        $('.label-paid-qtd').css('display', 'inline-block');
        $('input[name="paid-quantity-required"]').css('display', 'inline-block');
        $('input[name="paid-quantity-excluded"]').css('display', 'inline-block');
    } else {
        $('#discount-amount-container').css('display', 'inline-block');
        $('.label-paid-qtd').css('display', 'none');
        $('input[name="paid-quantity-required"]').css('display', 'none');
        $('input[name="paid-quantity-excluded"]').css('display', 'none');
    }
}

function createIngredientsElements(type, ingredient) {
    var label = document.createElement("label");
    label.innerText = ingredient.name;
    label.htmlFor = type+"-label-"+ingredient.id;

    var inputCheckbox = document.createElement("input");
    inputCheckbox.type = "checkbox";
    inputCheckbox.id = type+ingredient.id;
    inputCheckbox.name = type;
    inputCheckbox.value = ingredient.id;

    var labelInputMinQuantity = document.createElement("label");
    labelInputMinQuantity.innerText = "Qtd Mínima";
    labelInputMinQuantity.htmlFor = "min-quantity-"+type+ingredient.id;
    var inputMinQuantity = document.createElement("input");
    inputMinQuantity.type = "number";
    inputMinQuantity.id = "min-quantity-"+type+ingredient.id;
    inputMinQuantity.name = "min-quantity-"+type;
    inputMinQuantity.value = 0;

    var labelInputPaidQuantity = document.createElement("label");
    labelInputPaidQuantity.innerText = "Qtd Paga";
    labelInputPaidQuantity.classList.add("label-paid-qtd");
    labelInputPaidQuantity.htmlFor = "paid-quantity-"+type+ingredient.id;
    var inputPaidQuantity = document.createElement("input");
    inputPaidQuantity.type = "number";
    inputPaidQuantity.id = "paid-quantity-"+type+ingredient.id;
    inputPaidQuantity.name = "paid-quantity-"+type;
    inputPaidQuantity.value = 0;

    $("#"+type).append(label).append(inputCheckbox)
        .append(labelInputMinQuantity).append(inputMinQuantity)
        .append(labelInputPaidQuantity).append(inputPaidQuantity)
        .append(`<br><br>`);
}

function submitForm() {
    const data = {
        id,
        name: $("#name").val(),
        requiredIngredients: $('input[type="checkbox"][name="required"]:checked').map(function() {
            return {
                ingredientId: Number(this.value),
                minQuantity: $("#min-quantity-required"+this.value).val(),
                paidQuantity: $("#paid-quantity-required"+this.value).val()
            };
        }).get(),
        excludedIngredients: $('input[type="checkbox"][name="excluded"]:checked').map(function() {
            return {
                ingredientId: Number(this.value),
                minQuantity: $("#min-quantity-excluded"+this.value).val(),
                paidQuantity: $("#paid-quantity-excluded"+this.value).val()
            };
        }).get(),
        discountType: $("#discount-type").val(),
        discountAmount: $("#discount-amount").val(),
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

    $.postJSON("http://localhost:8080/offers", data, function() {
        window.location.href = 'offers.html';
    });
}