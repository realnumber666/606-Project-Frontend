document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-items");
    const totalExpenses = document.getElementById("total-expenses");
    const monthPicker = document.getElementById('month-picker');

    let totalAmount = 0;

    function getCurrentYearMonth() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    monthPicker.value = getCurrentYearMonth();
    let currentYearMonth = getCurrentYearMonth();

    monthPicker.addEventListener('change', (e) => {
        currentYearMonth = e.target.value;
        fetchExpenses();
        fetchMonthlyBudget(currentYearMonth, 1);
    });
    

    function fetchExpenses() {
        fetch(`http://localhost:8000/expenses?month=${currentYearMonth}`)
            .then((response) => response.json())
            .then((data) => {
                totalAmount = data.total;
                totalExpenses.textContent = `$${totalAmount.toFixed(2)}`;
                expenseList.innerHTML = "";
                data.transactions.forEach((transaction) => {
                    displayExpense(transaction);
                });
            })
            .catch((error) => console.error(error));
    }

    function displayExpense(expense) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${expense.category}:</strong> $${expense.amount.toFixed(2)} (${expense.datetime})
            <br>Description: ${expense.description || "N/A"}
            <button class="delete-button" data-id="${expense.record_id}">Delete</button>
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
        fetch("http://localhost:8000/expense", {
            method: "DELETE",
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

    document.getElementById("edit-budget-btn").addEventListener("click", function() {
        document.getElementById("budgetModal").style.display = "block";
    });
    
    document.getElementById("save-budget-btn").addEventListener("click", function() {
        const newBudget = parseFloat(document.getElementById("budget-input").value);
        
        if (isNaN(newBudget)) {
            alert("Please enter a valid number.");
            return;
        }
        
        const userID = 1;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const data = {
            UserID: userID,
            Year: year,
            Month: month,
            TotalAmount: newBudget
        };

        fetch('http://localhost:8000/monthly_budget', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert(data.data.message);
                fetchMonthlyBudget(currentYearMonth, 1);
                // document.getElementById("monthly-budget").innerText = `$${newBudget.toFixed(2)}`;
            } else {
                alert('Failed to update the budget. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update the budget. Please try again.');
        });
    
        document.getElementById("budgetModal").style.display = "none";
    });
    

    window.onclick = function(event) {
        const modal = document.getElementById("budgetModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function fetchMonthlyBudget(currentYearMonth, user_id) {
        fetch(`http://localhost:8000/monthly_budget?month=${currentYearMonth}&user_id=${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    const monthlyBudgetElem = document.getElementById('monthly-budget');
                    monthlyBudgetElem.textContent = `$${data.data.toFixed(2)}`;
                }
            })
            .catch((error) => console.error(error));
    }

    fetchExpenses();
    fetchMonthlyBudget(currentYearMonth, 1);
});
