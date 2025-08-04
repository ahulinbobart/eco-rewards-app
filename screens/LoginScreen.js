import type {Node} from 'react';
import {Platform, StyleSheet, Text, Button, ScrollView, Image, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import logoImage from './logo.png';
import nameImage from './eco_rewards.png'
import { bindActionCreators } from 'redux';
import { login, logout } from '../components/StateActions.js';
import Axios from 'axios';

import GreenRatingGraph from '../components/GreenRatingGraph.js'
import { NavigationContainer } from '@react-navigation/native';

const Separator = () => (
  <View style={styles.separator} />
);

class LoginScreen extends React.Component {

  // temporary local state for when user inputs text into text inputs
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userID: ""
    };

    this.registerUser = this.registerUser.bind(this);
    this.getUserID = this.getUserID.bind(this);
  }

  // registers user to database and get id if process is successful
  registerUser() {
    // end point that we want to make request - linked to app.post in index.js of server
    Axios.post('http://localhost:3001/register', {
      email: this.state.email,
      password: this.state.password
    }).then((response) => {
      if (response.data === "Values inserted") {
        this.getUserID();
      } else {
        // will alert user that email exists in database already
        alert(response.data);
      }

    }).catch((error)=>{
      alert(error);
    });
  };

  // get user ID from database once user is registered in database
  getUserID() {
    Axios.get('http://localhost:3001/getUserData', { params: 
    { email: this.state.email,
      password: this.state.password } 
    }).then((response) => {
      // this gives you email, id, password, points - for reference
      // if this is empty then user id does not exist in database
      if (!response.data[0]["id"]) {
        alert("Incorrect password or username does not exist in database");
      } else {
        this.state.userID = response.data[0]["id"];
        this.props.login(this.state.userID, response.data[0]["email"], response.data[0]["points"]);
        this.props.navigation.navigate("Home");
      }
    }).catch((error)=>{
      alert("Password incorrect or user does not exist.");
    });
  }
  
  render () {
          //show user login page
          return (
                  <ScrollView
                  style={styles.mainContentView}
                  alignItems="center"
                  justifyContent="center">
                      <Image
                          style={styles.name}
                          source={nameImage}
                      />
                      <Text style={styles.headerText}>
                          Shop Green and Be Rewarded
                      </Text>
                      <Image
                          style={styles.logo}
                          source={logoImage}
                      />
                      <Separator />
                      <TextInput
                          style={styles.textField}
                          placeholder="Username"
                          onChangeText = {text => this.setState({ email: text })}
                      />
                      <TextInput
                          style={styles.textField}
                          placeholder="Password"
                          secureTextEntry={true}
                          onChangeText = {text => this.setState({ password: text })}
                      />
                      <Separator />
                      <Separator />
                      <Separator />
                      <View 
                          style={styles.buttonStyling}>
                        <Button
                          title="Login"
                          color="green"
                          backgroundColor="white"
                          onPress= {this.getUserID}
                        />
                        <Separator />
                        <Button
                            title="Sign up"
                            color="green"
                            backgroundColor="white"
                            onPress={this.registerUser}
                        />
                      </View>
                      <Text style={styles.infoText}>
                          Studio Build 3 - Team HDRREL© 2021-2021
                      </Text>   
                  </ScrollView>
          );
	};
};

const styles = StyleSheet.create({
	headerText: {
    fontFamily: "roboto",
    fontStyle: "italic",
    textAlign: "center",
		fontSize: 24,
		fontWeight: '400',
		top: 10,
	},
  separator: {
    marginVertical: 5,
  },
  buttonStyling: {
    marginTop: 10,
    marginBottom: 10
  },
	name: {
    alignSelf: "center",
    top: 10,
	},
	logo: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 5
	},
	textField: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
	},
	infoText: {
    fontSize: 10,
    textAlign: "center",
	},
	mainContentView: {
    flexDirection: "column",
    padding: 1,
    top: 0,
    height: '100%'
    },
	bottomBarView: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 50,
    },
});

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        login,
        logout,
    }, dispatch)
);

const mapStateToProps = (state) => {
    const { store } = state
    return { store }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
