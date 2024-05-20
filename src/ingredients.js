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

$.deleteJSON = function(url, callback) {
    return jQuery.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'DELETE',
        'url': url,
        'dataType': 'json',
        'success': callback
    });
};

$.getJSON("http://localhost:8080/ingredients", function(ingredients) {
    const table = document.getElementById('table');
    if (ingredients.length > 0) {
        table.style.display = "block";
        ingredients.forEach(function(ingredient) {
            const tr = document.createElement("tr");

            const tdId = document.createElement("td");
            const tdName = document.createElement("td");
            const tdPrice = document.createElement("td");
            const tdMore = document.createElement("td");

            tdId.innerText = ingredient.id;
            tdName.innerText = ingredient.name;
            tdPrice.innerText = ingredient.salePrice;
            const aEdit = document.createElement("a");
            aEdit.innerText = "Editar";
            aEdit.href = "new-edit-ingredient.html?id=" + ingredient.id;
            tdMore.append(aEdit);
            const buttonDelete = document.createElement("button");
            buttonDelete.innerText = "Remover";
            buttonDelete.addEventListener("click", function(event) {
                event.preventDefault();
                $.deleteJSON("http://localhost:8080/ingredients/" + ingredient.id, function() {
                    location.reload();
                });
            });

            tdMore.append(buttonDelete);

            tr.id = "tr-"+ingredient.id;
            tr.append(tdId);
            tr.append(tdName);
            tr.append(tdPrice);
            tr.append(tdMore);

            $("#ingredients-tbody").append(tr);
        });
    } else {
        table.style.display = "none";
    }
});

