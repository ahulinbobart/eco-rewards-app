import type {Node} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {Component} from 'react';
import five_star from './icons/5star.png';
import four_star from './icons/4star.png';
import three_star from './icons/3star.png';
import two_star from './icons/2star.png';
import one_star from './icons/1star.png';

//TODO: change rating to stars
const Separator = () => (
  <View style={styles.separator} />
);

class StarRating extends Component {
    render() {
        if(this.props.rating >= 95) {
            return <View style={styles.arrangeRatings}>
              <Text>
                {this.props.ratingType} Rating:
              </Text>
              <Image
                style={styles.starGraph}
                source={five_star}
              />
            </View>;
        } else if(this.props.rating >= 81) {
           return <View style={styles.arrangeRatings}>
              <Text>
                {this.props.ratingType} Rating:
              </Text>
              <Image
                style={styles.starGraph}
                source={four_star}
              />
            </View>;
       } else if(this.props.rating >= 61) {
           return <View style={styles.arrangeRatings}>
              <Text>
                {this.props.ratingType} Rating:
              </Text>
              <Image
                style={styles.starGraph}
                source={three_star}
              />
            </View>;
       } else if(this.props.rating >= 31) {
           return <View style={styles.arrangeRatings}>
              <Text>
                {this.props.ratingType} Rating:
              </Text>
              <Image
                style={styles.starGraph}
                source={two_star}
              />
            </View>;
       } else {
           return <View style={styles.arrangeRatings}>
              <Text>
                {this.props.ratingType} Rating:
              </Text>
              <Image
                style={styles.starGraph}
                source={one_star}
              />
            </View>;
       }
    };
}

class GreenRatingGraph extends Component {
    state = { showDetailedView: false };

    constructor (props) {
        /*
        this.carbonScore = this.props.carbon;
        this.waterScore = this.props.water;
        this.landScore = this.props.land;
        this.totalScore = this.carbonScore + this.waterScore + this.landScore;
        */
        super(props);
    }

    render() {
        if (this.state.showDetailedView) {
            //render detailed graphs
            return (
                <View style={styles.chart}>
                  <Text>Aggregated Green Rating: {Math.round((+this.props.carbon + +this.props.water + +this.props.land)/3 * 100) / 100} points</Text>
                  <StarRating rating={Math.round((+this.props.carbon + +this.props.water + +this.props.land)/3)} ratingType="Overall"/>
                  <Separator/>
                  <Text style={styles.contributionTitle}>Rating Contribution</Text>
                  <StarRating rating={+this.props.carbon} ratingType="Carbon"/>
                  <Text style={styles.explanationText}>Food production accounts for 26% of global greenhouse gas emissions. Choosing low-emissions foods can help to reduce your global warming footprint.</Text>
                  <Separator/>
                  <StarRating rating={+this.props.water} ratingType="Water"/>
                  <Text style={styles.explanationText}>Food production accounts for 70% of global freshwater use. Choosing foods that use less water can help preserve this valuable resource for drinking.</Text>
                  <Separator/>
                  <StarRating rating={+this.props.land} ratingType="Land"/>
                  <Text style={styles.explanationText}>Food production uses up 50% of all habitable land on Earth. Choosing foods with a smaller footprint can help to prevent biodiversity loss.</Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({showDetailedView: false});
                    }}
                  >
                  <Separator/>
                  <Text style={styles.showDetailButton}>Show less</Text>
                  </TouchableOpacity>
                </View>
            );
        } else {
            if((+this.props.carbon + +this.props.water + +this.props.land) == 0) {
                //rating info not available
                return (
                <View style={styles.container}>   
                    <Text>Green rating data is not available for this product yet.</Text>
                </View>
                );
            } else {
                //only render star rating and show details button
                return (
                    <View style={styles.chart}>
                        <StarRating rating={(+this.props.carbon + +this.props.water + +this.props.land)/3} ratingType="Overall"/>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({showDetailedView: true});
                            }}
                        >
                            <Text style={styles.showDetailButton}>How is this calculated?</Text>
                        </TouchableOpacity>

                    </View>
                );
            }
        }
    };
};

const styles = StyleSheet.create ({
    chart: {
        // alignItems: "center",
        // justifyContent: "center",
        flex: 1,
    },
    explanationText: {
        fontSize: 12,
        paddingTop: 5,
        lineHeight: 17
    },
    chartTitle: {
        fontSize: 12,
        fontWeight: "400",
    },
    showDetailButton: {
        fontSize: 12,
        color: "blue",
        textDecorationLine: "underline",
        paddingTop: 10,
        paddingBottom: 20
    },
    starGraph : {
        height: 34,
        width: 200,
    },
    missingInfoText : { 
        fontSize: 12,
        // alignItems: "center",
        // textAlign: 'center',
        // alignSelf: 'center',
    },
    container: {
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    arrangeRatings: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 5
    },
    separator: {
      marginVertical: 10,
    },
    contributionTitle: {
    fontSize: 16,
    color: 'seagreen',
		fontWeight: '600',
    paddingTop: 20,
  },
});

export default GreenRatingGraph;
