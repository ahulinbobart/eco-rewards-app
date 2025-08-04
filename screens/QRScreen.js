import type {Node} from 'react';
import React, {Component, useState} from 'react';

import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  Button,
  Linking,
  View
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

//The component containing a QR scanner and its associated behaviours
class ScannerPage extends Component {

	//called when scanner detectts a qr code on camera, show productinfo screen
	onSuccess = e => {
		this.props.navigator.push('Details', {itemId: e.data});
	};


	render() {
		return (
		<View
		    alignItems="center"
		    style={{flex:1, padding: 10}}
		>
			<QRCodeScanner
				onRead={this.onSuccess}
				flashMode={this.props.flashMode}
				reactivate={true}
				reactivateTimeout={1000}
				cameraStyle={styles.cameraBox}

			/>
	    </View>
		);
	};
}

//The screen which contains a Scanner component
//Split into separate components for easier styling
const QRScreen = ({route, navigation}) => {
    const [cameraFlash, setCameraFlash] = useState(RNCamera.Constants.FlashMode.off);

	return (
	    <View style={styles.mainContentView}>
		    <ScannerPage
		        navigator={navigation}
		        flashMode={cameraFlash}
		    />

            <View
                style={styles.bottomContent}
                >
                <Text style={styles.infoText}>
                    Scanning the QR code will provide you with more information about the product or search for code ID.
                </Text>
                <View
                    flexDirection='row'
                    >
                        <Button
                            onPress={() => {
                                navigation.goBack();
                            }}
                            title="Back"
                            backgroundColor= "#ffffff"
                            color= "green"
                        />
                        <Button
                            onPress={() => {
                                cameraFlash == RNCamera.Constants.FlashMode.off ? setCameraFlash(RNCamera.Constants.FlashMode.torch) : setCameraFlash(RNCamera.Constants.FlashMode.off)
                            }}
                            title="Flashlight"
                            backgroundColor= "#ffffff"
                            color= "green"
                        />
                </View>
            </View>
        </View>
	);
}

const styles = StyleSheet.create({
	topText: {
		flex: 1,
		fontSize: 18,
		padding: 32,
	},
	infoText: {
        fontSize: 10,
        top: 0,
	},
	bottomContent: {
	    paddingVertical: 30,
	    alignItems: "center",
	    top: 180
	},
	cameraBox: {
	    top: 50,
	    width: 300,
	    height: 240,
	    alignSelf: "center",
	},
	mainContentView: {
         flexDirection: "column",
         height: 350,
    },
	bottomBarView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default QRScreen;
