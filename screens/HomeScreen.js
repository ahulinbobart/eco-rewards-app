import type {Node} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, SectionList, StatusBarPlatform, Button} from 'react-native';
import React, {Component} from 'react';
import ProgressCircle from 'react-native-progress-circle'
import {getUserID} from './LoginScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { login, logout, clearShoppingList } from '../components/StateActions.js';
import Axios from 'axios';

const styles = StyleSheet.create({
	container: {
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: 500,
    },
    bottomText: {
      color: 'seagreen',
      paddingLeft: 10,
      paddingRight:10,
      paddingTop: 30,
      paddingBottom: 30,
      fontSize: 24,
      alignItems: "center",
      textAlign: 'center',
    } ,  
    topText: {
      paddingLeft: 10,
      paddingRight:10,
      paddingBottom: 30,
      fontSize: 28,
      color: 'seagreen',
      fontWeight: 'bold',
      alignItems: "center",
      textAlign: 'center',
    },
    button: {
      alignItems: "center",
      backgroundColor: "lightgreen",
      padding: 25,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 10,
      borderWidth: 1,
      width: 200,
      borderColor: '#fff',  
    },
    buttonContainer: {
      marginTop: 40,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonArrangement: {
      flexDirection: "row"
    },
    buttonTextStyling: {
      color: 'green', 
      fontSize: 18,
      paddingLeft: 10
    }
})

// 1 Point gained for each dollar spent on 3 Star Groceries
// 2 Points gained for each dollar spent on 4 Star Groceries
// 5 Points gained for each dollar spent on 5 Star Groceries
// At 1000 Points can redeem voucher for $10 next purchase. 

//Homescreen for the App. User can see point balance and redeem points.
class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state= {isPointsHigher: false};
        this.RedeemPoints = this.RedeemPoints.bind(this);
    }

    RedeemPoints() {
    //Updates points for user in database (removes 1000 points)
        if(this.props.store.userPoints < 1000) {
            alert("You do not have enough points to redeem");
        } else {
            Axios.put('http://localhost:3001/updateUserPoints', {
              userID: this.props.store.userId,
              points: -1000
            }).then((response) => {
              if (response.data === "Error") {
                alert("Error redeeming reward");
              } else {
                // success, now clear the cart
                alert("You have redeemed a $10 reward voucher");
                this.props.login(this.props.store.userId, this.props.store.userName, (+this.props.store.userPoints - 1000));
              }

            }).catch((error)=>{
              alert(error);
            });
        }
    }

    render () {
        var isPointsHigher = this.state.isPointsHigher;
        // Checks if points can be redeemed and sets the state
        if (pointDiff > 0) {
            isPointsHigher = false;
        } else { 
            isPointsHigher = true;
        }



        // If points can be redeemed -> button is pressable allow for redemption
        // Else show number of more points needed
        let rewardsButton
        if (this.props.store.userPoints >= 1000) {
            rewardsButton = 
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={styles.button}
                  onPress={this.RedeemPoints}>
                  <View style={styles.buttonArrangement}>
                    <MaterialCommunityIcons name="tag-outline" color="seagreen" size={20}/>
                    <Text style={styles.buttonTextStyling}>Redeem Points</Text>
                  </View>
              </TouchableOpacity>
            </View>
        } else {
            rewardsButton = <Text style={styles.bottomText}>{Math.floor(1000-this.props.store.userPoints)} more points until your next reward</Text>
        }
        

        return (
            <ScrollView>
              <View style={styles.container}>
                <Text style={styles.topText}> Hello {this.props.store.userName}! </Text>
                <ProgressCircle
                    percent={this.props.store.userPoints/10}
                    radius={100}
                    borderWidth={15}
                    color="palegreen"
                    shadowColor="#999"
                    bgColor="#fff"
                >
                    <Text style={styles.bottomText}> {Math.floor(this.props.store.userPoints)} Points</Text>
                </ProgressCircle>
                {rewardsButton}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.props.navigation.navigate("History");
                    }}>
                <View style={styles.buttonArrangement}>
                  <MaterialCommunityIcons 
                    name="history" 
                    color="seagreen" 
                    size={20}/>
                  <Text style={styles.buttonTextStyling}>History</Text>
                </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
        );
    }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        login,
        logout,
        clearShoppingList,
    }, dispatch)
);

const mapStateToProps = (state) => {
    const { store } = state
    return { store }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
