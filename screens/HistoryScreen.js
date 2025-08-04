import type {Node} from 'react';
import {Platform, StyleSheet, Text, Button, ScrollView, Image, TextInput, View, TouchableOpacity} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import { login } from '../components/StateActions.js';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { NavigationContainer } from '@react-navigation/native';

class HistoryScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { history: [] , updates: 0};
    }

    componentDidMount() {
        Axios.get('http://localhost:3001/getUserHistory', { params:
            { userID: this.props.store.userId }
            }).then((response) => {
              // returns userID, timestamp, message
              if (response.data === "Error") {
                  alert("Error adding points");
                } else {
                  response.data.map((item, i) => {

                    this.state.history.push(item);
                  });
                console.log(this.state.history);
                this.setState({history: this.state.history, updates: this.state.updates+1});
                }
            }).catch((error)=>{
              alert("Password incorrect or user does not exist.");
            });
    }

    render () {
        
            return (
                <View>
                <Text style={styles.headerText}>Your EcoRewards History:</Text>
                    <ScrollView
                      style={styles.mainContentView}
                      alignItems="center">
                      {
                      this.state.history.map((item, i) => {
                          return <View key={i} style={styles.historyDisplay}>
                                      <Text style={styles.infoText}>{item["timestamp"].replace('.000Z','').replace('T',' ')}</Text>
                                      <Text style={styles.infoText}>{item["message"]}</Text>
                              </View>
                      })}
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          this.props.navigation.navigate("Home");
                          }}>
                        <Text style={styles.buttonTextStyling}>Back</Text>
                      </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
};

const styles = StyleSheet.create({
  headerText: {
    padding:20,
    textAlign: "center",
		fontSize: 24,
		fontWeight: '600',
		color: "green",
	},
	logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
	},
	historyDisplay: {
      padding: 10,
	},
	infoText: {
      fontSize: 16,
      textAlign: "center",
	},
	mainContentView: {
      flexDirection: "column",
      padding: 1,
  },
  button: {
    alignItems: "center",
    backgroundColor: "lightgreen",
    padding: 25,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    borderColor: '#fff',  
  },
  buttonTextStyling: {
    color: 'green', 
    fontSize: 18,
  }
});

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        login,
    }, dispatch)
);

const mapStateToProps = (state) => {
    const { store } = state
    return { store }
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);
