import type {Node} from 'react';
import { Platform, StyleSheet, Text, Button, View, ScrollView, Image, Linking, ToastAndroid } from 'react-native';
import React from 'react';
import {Product, getProductQuery} from '../WooliesSearch.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addItem } from '../components/StateActions.js';


import Axios from 'axios';

import GreenRatingGraph from '../components/GreenRatingGraph.js'
//import components to display different product details
//info, picture, score, calculation details, recommendations

class ProductDetails extends React.Component {
  
  state = {
    productName: '', 
    productDetails: '', 
    productCost: 0.0, 
    productThumbnail: '', 
    productCategory: '', 
    productSize: '', 
    carbonRating: 0, 
    waterRating: 0, 
    landRating: 0};

    addToCart(){
      //Call reducer in StateActions
      this.props.addItem(this.props.route.params.itemId, this.state.productThumbnail, this.state.productName, this.state.productSize, 1, this.state.productCost, (+this.state.carbonRating + +this.state.waterRating + +this.state.landRating)/3);
      
      //Show a notification to user that item has been added
      ToastAndroid.show(this.state.productName + " has been added to your shopping list.", ToastAndroid.SHORT);
    }

    constructor(props) {
      super(props);

      //log itemID for QR codes
      console.log(props.route.params.itemId);
      //Query woolies database for price, image, description, category data
      getProductQuery(props.route.params.itemId).then(result => {
        this.setState({
          productName: result.products[0].name, 
          productDetails: result.products[0].longDescription, 
          productCost: result.products[0].price, 
          productThumbnail: result.products[0].thumbnail, 
          productCategory: result.products[0].subCategory, 
          productSize: result.products[0].packageSize
        });

        //query database for green rating
        Axios.post('http://localhost:3001/getProductData', {category: this.state.productCategory}).then((response) => 
        {
          if (response.data === "Error") {
            alert(response.data);
          } else if (response.data === "Product data category is not found in database!") {
            //category has no info in database yet, add empty category to fill later
            alert(response.data);
          } else {
            //update the ratings
            this.setState({carbonRating: response.data[0]["emissionRating"], waterRating: response.data[0]["waterRating"], landRating: response.data[0]["landRating"]})
          }

        }).catch((error)=>{
          alert(error);
        });
      });

      this.addToCart = this.addToCart.bind(this);
    }

    render() {
      var htmlString = this.state.productDetails;
      var detailText = htmlString.replace(/<[^>]+>/g, '');

      return (
          <ScrollView 
            style={styles.detailsView}
            alignItems="center">
              <Text style={styles.sectionTitle}>{this.state.productName}</Text>

              <Image source={this.state.productThumbnail ? {uri: this.state.productThumbnail } : null}
                      style={styles.thumbnail}/>
              <Text style={styles.priceText}>Price: ${this.state.productCost} / {this.state.productSize}</Text>
              <GreenRatingGraph
                  carbon={this.state.carbonRating}
                  water={this.state.waterRating}
                  land={this.state.landRating}
              />
              <View>
                <Button
                      title="Add to cart"
                      color="green"
                      onPress={this.addToCart}
                  />
              </View>
              <View>
                <Text style={styles.informationTitle}>Additional Information</Text>
                <Text style={styles.detailText}>{detailText}</Text>
              </View>
          </ScrollView>
                  );
    }
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    color: 'seagreen',
		fontWeight: '600',
    alignItems: "center",
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 10
	},
  informationTitle: {
    fontSize: 16,
    color: 'seagreen',
		fontWeight: '600',
    paddingTop: 30,
  },
  priceText : {
    color: 'seagreen',
    fontSize: 16,
    alignItems: "center",
    textAlign: 'center',
    padding: 10
  },
	detailText: {
    fontSize: 12,
    lineHeight: 17
    // paddingTop: 5,
    // alignSelf: 'center',
    // alignItems: "center",
	},
	detailsView: {
		flex: 1,
    paddingLeft: 30,
    paddingRight: 30
	},
  mainContentView: {
    flexDirection: "column",
    height: 600,
  },
	bottomBarView: {
    flex: 1,
    justifyContent: 'flex-end',
    // padding:50,
    marginBottom: 10,
	},
  thumbnail: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addItem,
    }, dispatch)
);

const mapStateToProps = (state) => {
    const { store } = state
    return { store }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
