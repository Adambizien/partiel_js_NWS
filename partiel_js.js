document.addEventListener('DOMContentLoaded', function () {
    const newRecipeNameInput = document.getElementById('recipeName');
    const newRecipeIngredientsInput = document.getElementById('recipeIngredients');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const recipeList = document.getElementById('recipeList');
    const kitchenOrdersList = document.getElementById('kitchenOrders');

    const recipes = [];
    const kitchenOrders = [];

    addRecipeBtn.addEventListener('click', function () {
        addRecipe();
    });

    async function addRecipe() {
        const recipeName = newRecipeNameInput.value;
        const recipeIngredients = newRecipeIngredientsInput.value;

        if (recipeName.trim() === '' || recipeIngredients.trim() === '') {
            alert('Veuillez saisir le nom et les ingrédients de la recette.');
            return;
        }
        const data = await fetch('https://worldtimeapi.org/api/timezone/Europe/paris');
        const time = await data.json();
       
        const recipe = {
            id: Date.parse(time.utc_datetime),
            name: recipeName,
            ingredients: recipeIngredients
        };
        recipes.push(recipe);
        renderRecipes();
        newRecipeNameInput.value = '';
        newRecipeIngredientsInput.value = '';
    }

    function renderRecipes() {
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.innerHTML = `
                    <div class="bg-white p-4 mb-4 rounded shadow">
                        <p class="font-bold text-lg">${recipe.name}</p>
                        <p class="text-gray-700">${recipe.ingredients}</p>
                        <button class="sendToKitchenBtn mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-id="${recipe.id}">Envoyer en cuisine</button>
                        <button class="deleteRecipeBtn mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id="${recipe.id}">Supprimer</button>
                    </div>
                `;
            recipeList.appendChild(li);
        });

        const sendToKitchenBtns = document.querySelectorAll('.sendToKitchenBtn');
        sendToKitchenBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const recipeId = parseInt(btn.dataset.id);
                sendToKitchen(recipeId);
            });
        });

        const deleteRecipeBtns = document.querySelectorAll('.deleteRecipeBtn');
        deleteRecipeBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const recipeId = parseInt(btn.dataset.id);
                deleteRecipe(recipeId);
            });
        });
    }

    async function sendToKitchen(recipeId) {
        const data = await fetch('https://worldtimeapi.org/api/timezone/Europe/paris');
        const time = await data.json();

        const sauce = prompt("Sauce de la commande :");
        const recipe = recipes.find(recipe => recipe.id === recipeId);
        const order = {
            id: Date.parse(time.utc_datetime),
            recipe,
            sauce,
            timestamp: Date.parse(time.utc_datetime)
        };
        kitchenOrders.push(order);
        renderKitchenOrders();
    }

    function renderKitchenOrders() {
        kitchenOrdersList.innerHTML = '';
        kitchenOrders.forEach(  async order => {
            const li = document.createElement('li');
            const elapsed = await getTimeElapsed(order.timestamp);
            li.innerHTML = `
                    <div class="bg-white p-4 mb-4 adbz rounded shadow">
                        <p class="font-bold text-lg">${order.recipe.name}</p>
                        <p class="text-gray-700">${order.recipe.ingredients}</p>
                        <p class="text-gray-700">Sauce: ${order.sauce}</p>
                        <p class="text-gray-700">Temps écoulé: <span class="elapsed-time">${elapsed}</span></p>
                        <button class="validateOrderBtn mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" data-id="${order.id}">Valider la commande</button>
                    </div>
                `;
            kitchenOrdersList.appendChild(li);

            const elapsedTimeSpan = li.querySelector('.elapsed-time');
            setInterval(async () => {
                const updatedElapsed = await getTimeElapsed(order.timestamp);
                elapsedTimeSpan.textContent = updatedElapsed;
            }, 1000);

            const validateOrderBtns = document.querySelectorAll('.validateOrderBtn');
            validateOrderBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const orderId = parseInt(btn.dataset.id);
                    validateOrder(orderId);
                });
            });
        });
    }

    function deleteRecipe(recipeId) {
        const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
        const orderIndex = kitchenOrders.findIndex(order => order.id === recipeId);
        recipes.splice(recipeIndex, 1);
        kitchenOrders.splice(orderIndex, 1);
        renderRecipes();
        renderKitchenOrders();
    }

    function validateOrder(orderId) {
        const orderIndex = kitchenOrders.findIndex(order => order.id === orderId);
        kitchenOrders.splice(orderIndex, 1);
        renderKitchenOrders();
    }

    function getTimeElapsed(timestamp) {
        return fetch('https://worldtimeapi.org/api/timezone/Europe/Paris')
        .then(response => response.json())
        .then(time => {
            const now = Date.parse(time.utc_datetime);
            const elapsed = now - timestamp;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = ((elapsed % 60000) / 1000).toFixed(0);
            return `${minutes.toString().padStart(2, "0")}m${seconds.toString().padStart(2, "0")}s`;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la date :', error);
            throw error; 
        });
    }

    renderRecipes();
});













































































































































































//adamus sama 