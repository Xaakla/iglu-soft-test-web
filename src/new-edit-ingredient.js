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

$(document).ready(function () {
    id = getUrlParameter('id');

    $.getJSON("http://localhost:8080/ingredients/" + id, function (ingredient) {
        $("#name").val(ingredient.name);
        $("#salePrice").val(ingredient.salePrice);
    });
});

function submitForm() {
    const data = {
        id,
        name: $("#name").val(),
        salePrice: Number($("#salePrice").val())
    };

    $.postJSON = function (url, data, callback) {
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

    $.postJSON("http://localhost:8080/ingredients", data, function () {
        window.location.href = 'ingredients.html';
    });
}