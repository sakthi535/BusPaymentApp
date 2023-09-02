import { StyleSheet, Text, View, TouchableWithoutFeedback, Pressable, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import PaymentScreen from './PaymentScreen'

import { useStripe } from '@stripe/stripe-react-native'
import { StripeProvider } from '@stripe/stripe-react-native'

export default function Ticket({ r, navigate }) {

  const address = "http://192.168.0.102:4242/"

  const generatePrice = () => {
    console.log(Math.abs(destination-source)*5)
    return Math.abs(destination-source)*5
  }

  const routeNumber = ["5G", "18A", "27C", "29C", "40B", "47D", "70D", "121", "M117", "M51", "104"]
  const mtcRoutes = {
    "5G": ["Vadapalani", "Koyambedu", "Anna Nagar", "Thirumangalam", "Kilpauk", "Choolai", "Mint", "Broadway", "Parrys", "Fort St. George"],
    "18A": ["Tambaram", "Perungalathur", "Vandalur", "Urapakkam", "Guduvancheri", "Maraimalai Nagar", "Singaperumal Koil", "Chengalpattu", "Melmaruvathur", "Tindivanam"],
    "27C": ["Broadway", "Central Station", "Perambur", "Villivakkam", "Ambattur Estate", "Avadi", "Poonamallee", "Porur", "Guindy", "Saidapet"],
    "29C": ["Mandaveli", "Alwarpet", "Teynampet", "Saidapet", "Guindy", "Pallavaram", "Chrompet", "Tambaram", "Perungalathur", "Vandalur"],
    "40B": ["Vadapalani", "Ashok Nagar", "K.K. Nagar", "Saidapet", "Guindy", "Pallavaram", "Chrompet", "Tambaram", "Perungalathur", "Vandalur"],
    "47D": ["T. Nagar", "Kodambakkam", "Vadapalani", "Valasaravakkam", "Kundrathur", "Poonamallee", "Avadi", "Ambattur Estate", "Villivakkam", "Perambur"],
    "70D": ["Anna Square", "Marina Beach", "Mandaveli", "Alwarpet", "T. Nagar", "Saidapet", "Guindy", "Pallavaram", "Chrompet", "Tambaram"],
    "121": ["Broadway", "Central Station", "Park Town", "Vepery", "Aminjikarai", "Shenoy Nagar", "Anna Nagar", "Thirumangalam", "Koyambedu", "Vadapalani"],
    "M117": ["Tambaram", "Perungalathur", "Vandalur", "Urapakkam", "Guduvancheri", "Maraimalai Nagar", "Singaperumal Koil", "Chengalpattu", "Melmaruvathur", "Tindivanam"],
    "M51": ["Vadapalani", "Ashok Nagar", "K.K. Nagar", "Saidapet", "Guindy", "Pallavaram", "Chrompet", "Tambaram", "Perungalathur", "Vandalur"],
    "104": ["Broadway", "Central", "Central Railway Station", "Egmore", "Egmore Railway Station", "Chetpet", "Poonamallee High Road", "Kilpauk", "Ayanavaram", "Anna Arch", "Villivakkam", "Padi", "Korattur", "Pattravakkam", "Avadi", "Pattabiram", "Pattabiram Military Siding"],
  };

  const [route, setRoute] = useState(0);
  const [source, setSource] = useState(0);
  const [destination, setDestination] = useState(0);

  const [ticketPrice, setTicketPrice] = useState(0)

  // Payment stuff 

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // User Ticket data
  const [userTickets, setUserTickets] = useState([]);


  const addTicket = async () => {
    const response = await fetch(`${address}/add-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        route : route,
        source : source,
        destination : destination
      })
    });
    // const { paymentIntent, ephemeralKey, customer } = await response.json();
  }

  const fetchPaymentSheetParams = async () => {
    console.log("atleast price : ", ticketPrice)
    const response = await fetch(`${address}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        price: ticketPrice,

      })
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    // setTicketPrice(generatePrice());
    console.log("ticket price here : ", ticketPrice)
    const { error } = presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      addTicket();
      Alert.alert(`Route : ${route},  Source : ${source}, Destination : ${destination}`);
    }
  };

  const getTickets = async () => {
    const response = await fetch(`${address}/get-tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const {tickets} = await response.json();
    console.log(tickets)
    setUserTickets(tickets)
  }

  useEffect(() => {
    initializePaymentSheet();
    getTickets();
  }, []);




  const handleSubmit = () => {
    console.log("hello");
    openPaymentSheet();
  }




  return (

    <StripeProvider
      publishableKey="pk_test_51MwjIqSGXC921HlEuJpzifXA235k4a2G5GlhAQxyYdyXm2YfuqVLlY74Pm3oDXfMZngpuizJ8mzmMHWNLarsCXWW00JwrSd0It"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.busGo" // required for Apple Pay
    >
    <View style={[styles.container, { flexDirection: "column" }, { backgroundColor: "#FFFFFF" }, { textAlign: 'center' }]}>


      <View style={[{ flex: 0.5 }, { textAlign: "center" }, { paddingLeft: 35 }, { paddingTop: 35 }]}>
        <Image source={require('./dashboard.png')} />
      </View>

      <View style={[{ flex: 1 }, { textAlign: "center" }]}>
        <Text style={styles.header}>
          Buy Tickets
        </Text>

        <Text style={styles.description}>
          Purchase tickets by selecting the route, source and destination
        </Text>
      </View>

      <View style={[{ flex: 5 }, { textAlign: 'center' }, { padding: 25 }]}>
        <View style={[{ padding: 15 }]}>
          <Text style={styles.headline}>
            Route Number
          </Text>

          <View style={[{ padding: 20 }]}>
            <SelectDropdown
              data={routeNumber}
              value={route}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, route)
                setTicketPrice(generatePrice());
                console.log("Ticket Price : ", ticketPrice)

                setRoute(index)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>


        </View>

        <View style={[{ paddingLeft: 20 }]}>
          <Text style={styles.headline}>
            Source Stop
          </Text>

          <View style={[{ padding: 20 }]}>
            <SelectDropdown
              data={mtcRoutes[routeNumber[route]]}
              onSelect={(selectedItem, index) => {
                setSource(index)
                setTicketPrice(generatePrice());
                
                console.log(selectedItem, source)
                console.log("Ticket Price : ", ticketPrice)

              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>

        <View style={[{ paddingLeft: 20 }]}>
          <Text style={styles.headline}>
            Destination Stop
          </Text>

          <View style={[{ padding: 20 }]}>
            <SelectDropdown
              data={mtcRoutes[routeNumber[route]]}
              onSelect={(selectedItem, index) => {
                setDestination(index)
                console.log(userTickets)
                console.log(selectedItem, destination)
                console.log("Ticket Price : ", ticketPrice)
                
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>


        <View style={[{ textAlign: 'center' }, { padding: 20 }, { paddingRight: 20 }, { flex: 1 }]}>
          <Pressable style={styles.button} onPress={openPaymentSheet}>
            <Text style={styles.text}>Purchase Ticket : {1+ticketPrice}</Text>
          </Pressable>
        </View>

      </View>

    </View>
    </StripeProvider>
  )
}


const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
  },
  tab: {
    width: "100%",
    height: 100,
    backgroundColor: "#EFEDED",
    borderRadius: 15,
  },
  container: {
    width: "100%",
    flex: 1,
    // paddingTop: 20,
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
  body: {
    width: '100%',
    flex: 5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    textAlign: 'center',
    justifyContent: "center",
    alignItems: "center",

  },
  header: {
    color: "#20462D",
    fontWeight: "600",
    fontSize: 27,
    textAlign: 'left',
    paddingTop: 20,
    paddingLeft: 26,
  },
  content: {
    padding: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  block: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#74BE8E",
    // flex: 1,

  },
  navbar: {
    flex: 1,
    // backgroundColor: "#DADADA",
  },
  tile: {
    // width: "156px",
    // margin: 10,
    backgroundColor: "#DCEFE3",
    height: "90%",
    width: "40%",
    borderRadius: 16,
    justifyContent: 'center',
    // flex:1,
  },
  headline: {
    color: "#2E3A59",
    fontWeight: "700",
    fontSize: 24,

  },
  description: {
    fontSize: 16,
    color: "#2E3A59",
    paddingLeft: 36,
    opacity: 0.5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 7,
    backgroundColor: "#2196F3",
    color: "#FFFFFF",
    // elevation: 1,
  },
  input: {
    height: 48,
    margin: 12,
    width: 160,
    borderWidth: 1,
    padding: 20,
    borderRadius: 16,
    borderColor: "#68B984",

    textAlign: 'center',
    fontSize: 18,
  }
});
