import type {Node} from 'react';
import React, {Component} from 'react';
import Axios from 'axios';

import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  Button,
  Linking,
  View,
  Image
} from 'react-native';

import defaultImage from './icons/defaultThumbnail.png';

class ShoppingItem extends Component {
    state = {rating: 0}

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
      if(typeof this.props.rating == "undefined" || this.props.rating == 0) {
          const response = await Axios.post('http://localhost:3001/getProductData', {category: this.props.category});

          // console.log("data being searched ====")
          // console.log(response.data);
          if (response.data === "Error") {
            alert(response.data);
          } else if (response.data === "Product data category is not found in database!") {
            //category has no info in database yet, add empty category
            alert(response.data);
          } else {
            //update the ratings
            const newRating = Math.round((+response.data[0]["emissionRating"] + +response.data[0]["waterRating"] + +response.data[0]["landRating"])/3);

            if (newRating > 0) {
                this.setState({rating: Math.round((+response.data[0]["emissionRating"] + +response.data[0]["waterRating"] + +response.data[0]["landRating"])/3 * 100) / 100});
            } else {
                this.setState({rating: "no data available"});
            }
          }
        } else if (this.props.rating != 0) {
            this.setState({rating: this.props.rating});
        }
        
        if(this.state.rating == 0 && this.props.rating == 0) {
            this.setState({rating: " no data available"});
        }
    }

    componentDidUpdate() {
      if(typeof this.props.rating == "undefined" || this.props.rating == 0) {
        const response = Axios.post('http://localhost:3001/getProductData', {category: this.props.category});

        setTimeout(function() {
          const emission = response["_W"]["data"][0]["emissionRating"];
          const water = response["_W"]["data"][0]["waterRating"];
          const land = response["_W"]["data"][0]["landRating"];

          if (response.data === "Error") {
            alert(response.data);
          } else if (response.data === "Product data category is not found in database!") {
            //category has no info in database yet, add empty category
            alert(response.data);
          } else {
            //update the ratings
            const newRating = Math.round((emission + water + land) * 100/3) / 100;

            if (newRating > 0) {
                this.setState({rating: newRating});
            } else {
                this.setState({rating: "no data available"});
            }
          }
        }.bind(this), 1000)
      }
    }

    render() {
      // multiple ways for ratings to be loaded into component. This accounts for either way
      // rating of items is always kept isolated in store so internally and externally, rating
      // for each item will be the same
      var rating = 0;
      if (this.props.rating) {
        rating = Math.round(this.props.rating * 100) / 100;
      } else {
        rating = this.state.rating;
      }

      return (
        <View style={styles.itemView}>
            <Image
              source={this.props.thumbnail ? {uri: this.props.thumbnail } : null}
              style={styles.thumbnail}
            />
            <View style={styles.contentView}>
              <Text style={styles.headingText}>{this.props.productName}</Text>
              <View style={styles.detailView}>
                <Text style={styles.infoText}>
                  Package Size: {this.props.packageSize}
                </Text>
                <Text style={styles.infoText}>
                  Qty: {this.props.count}
                </Text>

                <Text style={styles.infoText}>
                  Price: ${this.props.price*this.props.count}
                </Text>
                
                <Text style={styles.ratingText}>
                  Green Rating: {rating}
                </Text>
              </View>
            </View>
        </View>
      );
    };
}

const styles = StyleSheet.create({
    headingText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    infoText: {
      fontSize: 12,
    },
    ratingText: {
      fontSize: 14,
      paddingTop: 15
    },
    thumbnail: {
      width: 100,
      height: 100,
    },
    headerView: {
      flex: 1,
    },
    contentView: {
      flexDirection: "column",
      flex: 2,
      paddingLeft: 10,
    },
    itemView: {
      flexDirection: "row",
      paddingBottom: 30,
    },
    detailView: {
      flexDirection: "column",
      paddingTop: 10
    },
});

export default ShoppingItem;
