import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import QRCode from 'react-native-qrcode-svg';

const TicketTile = ({ Name, Route, source, destination, state, Position }) => {

  const [ticketState, setTicketState] = useState(true);
  const [expiryState, setExpiryState] = useState("");



  
  const [ticketColor, setTicketColor] = useState((state == "Valid") ? "#6D2ADF" : "red")

  // console.log(Route, ticketState)
  const address = "http://192.168.0.102:4242/"

  const verifyTicketState = async () => {
    const response = await fetch(`${address}/get-ticket-state`, {
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
    const {ticket_state} = await response.json();
    setExpiryState(ticket_state ? "Valid" : "Invalid")
    setTicketColor(ticket_state ? "#6D2ADF" : "red")
    console.log(Route, ticket_state)

  }


  const validateTicket = async () => {
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

    const { state_response } = await response.json();
    console.log("state here ... ", state_response)
    if (state_response) {
      setExpiryState("Invalid")
    }
    else {
      setExpiryState("Expired")
    }
  }

  useEffect(() => {
    setExpiryState(state)
  }, []);

  if (ticketState) {

    

    return (
      <TouchableOpacity activeOpacity={1} onPress={() => { setTicketState(!ticketState); }}>
        <View style={[styles.container, {backgroundColor : ticketColor}]}>
          <View style={styles.box}>

            <Text style={styles.Route}>Route No - {Route}</Text>
            <Text style={styles.name} numberOfLines={1}>From, {source}</Text>
            <Text style={styles.name}>Till {destination}</Text>

            <Text style={styles.date}> {expiryState} Till {'\n'} 05/03/2003</Text>


          </View>
        </View>
      </TouchableOpacity>
    )
  }
  else {

    var digest = String(Position[0]) + '?' + String(Position[1]) + '?' + String(Position[2]) + '?' + String(Position[3])   

    return (
      <TouchableOpacity activeOpacity={1} onPress={() => {verifyTicketState();setTicketState(!ticketState); }}>
        <View style={[styles.container2, {backgroundColor : ticketColor}]}>
          <View style={styles.box2}>

            {/* <Text style={styles.Route}>Route Not - {Route}</Text>
            <Text style={styles.name} numberOfLines={1}>From, {source}</Text>
            <Text style={styles.name}>Till {destination}</Text>

            <Text style={styles.date}> Valid Till {'\n'} 05/03/2003</Text>
 */}
            <QRCode
              value={digest}
              size={150}
            />

          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  box2 : {
    flex : 1,
    alignSelf : 'center',
    justifyContent : 'center',
  },
  Route: {
    fontWeight: 500,
    fontSize: 18,
    color: "#FFFFFF",
    // paddingLeft : 15,
    // paddingTop : 15,
    padding: 15,

  },
  container: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    width: 190,
    height: 200,
    backgroundColor: "#6D2ADF",
    borderColor: "#306944"
  },
  container2: {
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    width: 190,
    height: 200,
    backgroundColor: "#6D2ADF",
    borderColor: "#306944"
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: '#FFFFFF',
    paddingLeft: 20,
    // paddingBottom: 5,

  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#418B5B',
    // top : "-30%",
    // left : "90%",
  },
  desc: {
    color: '#A29EB6',
    fontSize: 12,
    // left : "12%",
    top: "30%",
    textAlign: 'center',
  },
  box: {
    position: 'absolute',
    width: "110%",
    height: "100%",

  },
  data: {
    flex: 1,
    justifyContent: 'space-between',
    left: '10%',
    top: "15%",
    paddingTop: 7,
    paddingBottom: 7,
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    color: "#FFFFFF",
    paddingLeft: 20,
  }
})

export default TicketTile;