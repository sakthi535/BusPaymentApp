import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {

  const address = "http://192.168.0.102:4242/"


  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const validateTicket = async (Position) => {
    const response = await fetch(`${address}/validate-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: Position[3],
        source: Position[1],
        destination: Position[2],
      })

      
    });

    const { ticket_state } = await response.json();
    console.log("earlier response : ", ticket_state)

    if(ticket_state == 1){
      alert("Ticket marked as done")
    }
    else{
      alert("Ticket expired")
    }

  }
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    var obj = data.split('?');
    let state_response = validateTicket(obj)

    console.log("response : ", state_response)

    

    // alert(`${data.split('?')}`);
  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
