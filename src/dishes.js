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

$.getJSON("http://localhost:8080/dishes", function(dishes) {
    const table = document.getElementById('table');
    if (dishes.length > 0) {
        table.style.display = "block";
        dishes.forEach(function(dish) {
            const tr = document.createElement("tr");

            const tdId = document.createElement("td");
            const tdName = document.createElement("td");
            const tdPrice = document.createElement("td");
            const tdMore = document.createElement("td");

            tdId.innerText = dish.id;
            tdName.innerText = dish.name;
            tdPrice.innerText = dish.totalPrice;
            const aEdit = document.createElement("a");
            aEdit.innerText = "Editar";
            aEdit.href = "new-edit-dish.html?id=" + dish.id;
            tdMore.append(aEdit);
            const buttonDelete = document.createElement("button");
            buttonDelete.innerText = "Remover";
            buttonDelete.addEventListener("click", function(event) {
                event.preventDefault();
                $.deleteJSON("http://localhost:8080/dishes/" + dish.id, function() {
                    location.reload();
                });
            });

            tdMore.append(buttonDelete);

            tr.id = "tr-"+dish.id;
            tr.append(tdId);
            tr.append(tdName);
            tr.append(tdPrice);
            tr.append(tdMore);

            $("#dishes-tbody").append(tr);
        });
    } else {
        table.style.display = "none";
    }
});