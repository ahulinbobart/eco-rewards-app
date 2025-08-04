import React from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';



const TutorialScreen = ({navigation}) => {
  return (
    <Onboarding 
      onSkip={() => navigation.navigate("Home")}
      onDone={()=> navigation.navigate("Home")}
      pages={[
        {
          backgroundColor: 'forestgreen',
          image: <Image style= {styles.imageStyle}
            source={require("./logo.png")} />,
          title: "Welcome to Eco Rewards",
          subtitle: "Track your emissions of the food you buy and get rewarded by buying eco-friendly products",
        },
        {
          title: "QR Code Scanner",
          backgroundColor: 'forestgreen',
          image: <Image style= {styles.imageStyle}
            source={require("../components/images/scan_qr.png")} />,
          subtitle: "Use the QR code scanner in-store to get detailed information on demand",
        },
        {
          backgroundColor: 'forestgreen',
          image: <Image style= {styles.imageStyle}
            source={require("../components/images/product_info.png")} />,
          title: "More Detailed Product Information",
          subtitle: "Learn more about the product you buy, including ratings based on emissions, water and land usage",
        },
        {
          backgroundColor: 'forestgreen',
          image: <Image style= {styles.imageStyle}
            source={require("../components/images/reward_image.png")} />,
          title: "Get Rewarded",
          subtitle: "Earn points for buying more eco-friendly products to gain $10 off your next purchase",
        },
        {
          backgroundColor: 'forestgreen',
          image: <Image style= {styles.imageStyle}
            source={require("../components/images/shopping_list_image.png")} />,
          title: "Shopping List",
          subtitle: "Plan your shops using the shopping list and reduce your impact on the planet",
        },
      ]}
    />
  )
}


export default TutorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle : {
            resizeMode: "contain",
            height: 300,
            width: 600
          }
});

