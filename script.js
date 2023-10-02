document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-items");
    const totalExpenses = document.getElementById("total-expenses");

    let totalAmount = 0;

    function fetchExpenses() {
        fetch("http://localhost:8000/expenses")
            .then((response) => response.json())
            .then((data) => {
                if (data.total) {
                    totalAmount = data.total;
                    totalExpenses.textContent = `$${totalAmount.toFixed(2)}`;
                    expenseList.innerHTML = "";
                    data.transactions.forEach((transaction) => {
                        displayExpense(transaction);
                    });
                }
            })
            .catch((error) => console.error(error));
    }

    function displayExpense(expense) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${expense.category}:</strong> $${expense.amount.toFixed(2)} (${expense.datetime})
            <br>Description: ${expense.description || "N/A"}
            <button class="delete-button" data-id="${expense.id}">Delete</button>
        `;
        expenseList.appendChild(listItem);

        const deleteButtons = listItem.getElementsByClassName("delete-button");
        for (const deleteButton of deleteButtons) {
            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                const idToDelete = parseInt(e.target.getAttribute("data-id"));
                deleteExpense(idToDelete);
            });
        }
    }

    function deleteExpense(idToDelete) {
        fetch("http://localhost:8000/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: idToDelete,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    fetchExpenses();
                } else {
                    console.error(data.data.error_msg);
                }
            })
            .catch((error) => console.error(error));
    }

    expenseForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById("amount").value);
        const description = document.getElementById("description").value;
        const datetime = document.getElementById("datetime").value;
        const category = document.getElementById("category").value;

        fetch("http://localhost:8000/expenses", {
                        method: "POST",
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            amount,
                            description,
                            datetime,
                            category,
                        }),
                    })
                        .then((response) => response.json())
                        .then(() => {
                            fetchExpenses();
                            expenseForm.reset();
                        })
                        .catch((error) => console.error(error));
    });

    fetchExpenses();
});
