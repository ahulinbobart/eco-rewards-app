import type {Node} from 'react';
import {Platform, StyleSheet, Text, Button, View, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import { getProductQuery, Product } from '../WooliesSearch.js';
import ShoppingItem from '../components/ShoppingListItem.js';
const MAX_PRODUCTS = 5;

const SearchScreen = ({route, navigation}) => {
    return (
        <View>
            <SearchBox navigation={navigation}/>
        </View>
    );

}

class SearchBox extends Component {
    state = {
      searchString: '', 
      productList: []};

    updateSearchString(text) {
      var products = [];
      getProductQuery(text).then(result => {
        //create shoppinglistitems
        products = result.products;
      
        //uncomment below to limit number of products displayed, if showing too many products causes lag
        //products = result.products.splice(MAX_PRODUCTS);
        this.setState({searchString: text, productList: products});
      }).catch(err => this.setState({
        searchString: text, productList: products}));
    }

    render() {
      return (
          <View
            style={styles.mainContentView}>
            <Text style={styles.sectionTitle}>Product search:</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Search for a product"
                onSubmitEditing = {(e: any) => this.updateSearchString(e.nativeEvent.text)}
                // onEndEditing={(e: any) => this.updateSearchString(e.nativeEvent.text)}
            />
            <ScrollView>
              <View style={styles.productsView}>
                {
                  this.state.productList.map((product, i) => {
			//map returned products to touchable ShoppingItem components for display in the scrollview
                    return <TouchableOpacity key={i} style={styles.productDisplay}
                            onPress={() => {
                              this.props.navigation.push('Details', {itemId: product.productCode});
                            }}>
                              <ShoppingItem
                              productId={product.productCode}
                              thumbnail={product.thumbnail}
                              productName={product.name}
                              description={product.description}
                              packageSize={product.packageSize}
                              count={1}
                              price={product.price}
                              category={product.subCategory}
                              />
                            </TouchableOpacity>
                  })
                }
              </View>
            </ScrollView>
          </View>
      );
	};
};

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 30,
		color: "green",
		fontWeight: '600',
	},
	mainContentView: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding:20,
    },
	bottomBarView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
    padding:50,
	},
	productsView: {
	  flex: 1,
		paddingBottom: 200,
	},
	textInput: {
    borderWidth: 1,
    marginBottom: 20
	},
	productDisplay: {
	}
});

export default SearchScreen;
