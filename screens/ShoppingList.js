import type {Node} from 'react';
import {Platform, StyleSheet, Text, Button, ScrollView, Image, TextInput, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';

import { login, addItem, removeItem, clearShoppingList } from '../components/StateActions.js';
//for swipe gestures on shopping list items
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import ShoppingItem from '../components/ShoppingListItem.js';

//Display user's current shopping list and allow them to add points by checkout button.
class ShoppingListScreen extends Component {
    //store items
    state = { items: [], ratingTotal: 0 };

    checkoutItems() {
        //send a query to the server to add points
        Axios.put('http://localhost:3001/updateUserPoints', {
              userID: this.props.store.userId,
              points: this.props.store.points
            }).then((response) => {
              if (response.data === "Error") {
                alert("Error adding points");
              } else {
                // success, now clear the cart
                alert(this.props.store.points + " points have been added to your rewards");
                this.props.login(this.props.store.userId, this.props.store.userName, (+this.props.store.userPoints + +this.props.store.points));
                this.props.clearShoppingList();
              }

            }).catch((error)=>{
              alert(error);
            });
    }

    constructor(props) {
        super(props);
        this.checkoutItems = this.checkoutItems.bind(this);
    }

    render() {
	//settings for swipe gestures to remove items
        const gestureConfig = {
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        };
        const renderList = () => {
	  //only render the list if there are items in it
          if ( typeof this.props.store.shoppingList != "undefined" && this.props.store.shoppingList.length > 0) {
              return (
              <View>
                <Text style={styles.sectionTitle}>Total green rating: {this.props.store.points}</Text>
                  <ScrollView>
                  <View style={styles.shoppingListView}>
                    {	
                      this.props.store.shoppingList.map((product, i) => {
			//map each item in shopping list to a touchable, swipeable shoppingItem component
                        return  (
                        <GestureRecognizer 
                          key={i}
                          onSwipeLeft={(state) => this.props.removeItem(product.name)}
                          onSwipeRight={(state) => this.props.removeItem(product.name)}
                          config={gestureConfig}>
                              <TouchableOpacity  
                                style={styles.listDisplay}
                                onPress={() => {
                                    this.props.navigation.push('Details', {itemId: product.itemId});
                                }}>
                                <ShoppingItem
                                  productId={product.itemId}
                                  thumbnail={product.thumbnail}
                                  productName={product.name}
                                  packageSize={product.size}
                                  count={product.count}
                                  price={product.price}
                                  rating={product.rating}
                                />
                              </TouchableOpacity>
                        </GestureRecognizer>);
                      })
                    }
                  </View>

                  </ScrollView>
              </View>);
          } else {
              return <Text style={styles.sectionTitle}>Your shopping list is empty</Text>;
          }
        }
        return (
            <View
            style={styles.mainContentView}
            >
                {renderList()}
                <Button
		      style={styles.buttonStyling}
                      title="Checkout"
                      color="green"
                      backgroundColor="white"
                      onPress={this.checkoutItems}
                  />
                <Button
                      title="Clear cart"
                      color="green"
                      backgroundColor="white"
                      onPress={this.props.clearShoppingList}
                  />
            </View>
        );
	};
}

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 18,
		fontWeight: '400',
        alignItems: "center",
        textAlign: 'center',
        padding : 10
	},
	mainContentView: {
         flexDirection: "column",
	    height:330,
    },
	bottomBarView: {
	    flex: 1,
	    justifyContent: 'flex-end',
	    padding: 50,
	},
	buttonStyling: {
	    marginTop: 10,
	    marginBottom: 10
	},
	shoppingListView: {
	    flex: 1,

	},
	listDisplay: {
	},
});

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        login,
        addItem,
        removeItem,
        clearShoppingList,
    }, dispatch)
);

const mapStateToProps = (state) => {
    const { store } = state
    return { store }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListScreen);
