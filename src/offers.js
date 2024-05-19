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

$.getJSON("http://localhost:8080/offers", function(offers) {
    offers.forEach(function(offer) {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        const tdName = document.createElement("td");
        const tdDiscountType = document.createElement("td");
        const tdDiscountAmount = document.createElement("td");
        const tdRequired = document.createElement("td");
        const tdExcluded = document.createElement("td");
        const tdMore = document.createElement("td");

        tdId.innerText = offer.id;
        tdName.innerText = offer.name;
        tdDiscountType.innerText = offer.discountType;
        tdDiscountAmount.innerText = offer.discountAmount;
        tdRequired.innerText = offer.requiredIngredients.map(it => {
            return it.ingredient.name;
        });
        tdExcluded.innerText = offer.excludedIngredients.map(it => {
            return it.ingredient.name;
        });
        const aEdit = document.createElement("a");
        aEdit.innerText = "Editar";
        aEdit.href = "new-edit-offer.html?id=" + offer.id;
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

        tr.id = "tr-"+offer.id;
        tr.append(tdId);
        tr.append(tdName);
        tr.append(tdDiscountType);
        tr.append(tdDiscountAmount);
        tr.append(tdRequired);
        tr.append(tdExcluded);
        tr.append(tdMore);

        $("#offers-tbody").append(tr);
    })
});