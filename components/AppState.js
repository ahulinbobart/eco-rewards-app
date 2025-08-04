import {combineReducers} from 'redux';

const initialState = {
    userId: -1,
    shoppingList: [],
    points: 0,
    userName: "testuser",
    userPoints: 0
};

function recalculateTotal(shoppingList) {
    var totalRating = 0;
    var numProducts = 0;
    shoppingList.map((product, i) => {
        // 1 Point gained for each dollar spent on 3 Star Groceries
        // 2 Points gained for each dollar spent on 4 Star Groceries
        // 5 Points gained for each dollar spent on 5 Star Groceries
              
        pointsPerDollar = 0;
        if (product.rating >= 95) {
            pointsPerDollar = 5;
        } else if (product.rating >= 81) {
            pointsPerDollar = 2;
        } else if (product.rating >= 61) {
            pointsPerDollar = 1;
        }
        totalRating += (pointsPerDollar * product.price * product.count);
        numProducts += product.count;
    });
    return totalRating;
}

const storeReducer = (state = initialState, action) => {
    const {
        userId,
        shoppingList,
        points,
        userName,
        userPoints
    } = state;
    switch (action.type) {
        case 'LOGIN':
            calculatedPoints = recalculateTotal(shoppingList);
            newState = { userId: action.payload.id, shoppingList: shoppingList, userName: action.payload.name, userPoints: action.payload.points, points: calculatedPoints };
            return newState;

        case 'LOGOUT':

            newState = {userId: -1, shoppingList: shoppingList};
            return newState;

        case 'CLEAR_LIST':
            newState = { userId, shoppingList: [], points: 0, userPoints: userPoints, userName: userName };
            return newState;

        case 'ADD_ITEM':

            index = shoppingList.findIndex(x => x.name === action.payload.name);

            if (index == -1) {
                shoppingList.push(action.payload);
            } else {
                shoppingList[index].count += +action.payload.count;
            }
            newPoints = recalculateTotal(shoppingList);
            newState = {userId, shoppingList, points: newPoints, userPoints: userPoints, userName: userName};
            return newState;

        case 'REMOVE_ITEM':

            index = shoppingList.findIndex(x => x.name === action.payload.name);
            if (index != -1) {
                shoppingList.splice(index, 1);
            }
            newPoints = recalculateTotal(shoppingList);
            newState = {userId, shoppingList, points: newPoints, userPoints: userPoints, userName: userName};
            return newState;
        default:
            return state;
    }
};

export default combineReducers({
    store: storeReducer
});
