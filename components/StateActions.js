export const login = (userId, userName, userPoints) => ({
    type: 'LOGIN',
    payload: { id: userId, name: userName, points: userPoints },
});

export const logout = () => ({
    type: 'LOGOUT',
    payload: {},
});

export const clearShoppingList = () => ({
    type: 'CLEAR_LIST',
    payload: {},
});

export const addItem = (productId, thumbnail, productName, packageSize, qty, productPrice, greenRating) => ({
    type: 'ADD_ITEM',
    payload: { name: productName, count: qty, itemId: productId, thumbnail: thumbnail, size: packageSize, price: productPrice, rating: greenRating },
});

export const removeItem = itemName => ({
    type: 'REMOVE_ITEM',
    payload: { name: itemName },
});
