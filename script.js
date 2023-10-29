document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-items");
    const totalExpenses = document.getElementById("total-expenses");

    let totalAmount = 0;

    const editFormOpen = new Set();

    function fetchExpenses() {
        fetch(`http://localhost:8000/expenses/${username}`)
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

    function createEditForm(expense) {
        const editForm = document.createElement("form");
        editForm.innerHTML = `
            <label for="edit-amount">Amount:</label>
            <input type="number" id="edit-amount" value="${expense.amount}" step="0.01" required>
            <label for="edit-description">Description:</label>
            <input type="text" id="edit-description" value="${expense.description}">
            <label for="edit-datetime">Date and Time:</label>
            <input type="datetime-local" id="edit-datetime" value="${expense.datetime}" required>
            <label for="edit-category">Category:</label>
            <select id="edit-category" required>
                <option value="Transportation">Transportation</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Gadget purchase">Gadget purchase</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Medical">Medical</option>
                <option value="Gifts">Gifts</option>
                <option value="Other">Other</option>
            </select>
            <input type="hidden" id="edit-expense-id" value="${expense.id}"> <!-- Hidden input for expense.id -->
            <button type="submit">Save</button>
        `;
    
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
    
            const updatedExpense = {
                id: parseInt(document.getElementById("edit-expense-id").value),
                amount: parseFloat(document.getElementById("edit-amount").value),
                description: document.getElementById("edit-description").value,
                datetime: document.getElementById("edit-datetime").value,
                category: document.getElementById("edit-category").value,
            };
    
            fetch(`http://localhost:8000/expenses/${updatedExpense.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedExpense),
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
        });
    
        return editForm;
    }
    
    

    function displayExpense(expense) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${expense.category}:</strong> $${expense.amount.toFixed(2)} (${expense.datetime})
            <br>Description: ${expense.description || "N/A"}
            <button class="edit-button" data-id="${expense.id}">Edit</button>
            <button class="delete-button" data-id="${expense.id}">Delete</button>
        `;
        expenseList.appendChild(listItem);
    
        const editButtons = listItem.getElementsByClassName("edit-button");
        for (const editButton of editButtons) {
            editButton.addEventListener("click", (e) => {
                e.preventDefault();
                const idToEdit = parseInt(e.target.getAttribute("data-id"));
    
                if (editFormOpen.has(idToEdit)) {
                    const editForm = listItem.querySelector("form");
                    editForm.remove();
                    editFormOpen.delete(idToEdit);
                } else {
                    const editForm = createEditForm(expense);
                    listItem.appendChild(editForm);
                    editFormOpen.add(idToEdit);
                }
            });
        }
    
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
        fetch(`http://localhost:8000/delete`, {
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

        fetch(`http://localhost:8000/expenses/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
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
