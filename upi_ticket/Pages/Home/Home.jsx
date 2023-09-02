import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, FlatList, Pressable } from "react-native";
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TicketTile from './TicketTile';

import { MapIcon } from '../../Vector';

const Home = ({ navigation }) => {

    const address = "http://192.168.0.102:4242/"

    const [ticketState, setTicketState] = useState(true);
    const [userTickets, setUserTickets] = useState([]);
    const [ticketData, setTicketData] = useState([
        {
            name: "Sakthi",
            route: "104",
            startingStop: "Nolambur service road",
            destinationStop: "Tambaram",
            state : "Valid",
            position : []
        }
    ]);


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


    // const ticketData = [
    //     {
    //         name: "Sakthi",
    //         route: "104",
    //         startingStop: "Nolambur service road",
    //         destinationStop: "Tambaram",
    //         state: "Valid"
    //     },
    //     {
    //         name: "Sakthi",
    //         route: "104",
    //         startingStop: "Nolambur service road",
    //         destinationStop: "Tambaram",
    //         state: "Valid"
    //     },
    //     {
    //         name: "Sakthi",
    //         route: "104",
    //         startingStop: "Nolambur service road",
    //         destinationStop: "Tambaram",
    //         state: "Valid"
    //     },
    //     {
    //         name: "Sakthi",
    //         route: "104",
    //         startingStop: "Nolambur service road",
    //         destinationStop: "Tambaram",
    //         state: "Valid"
    //     },
    // ]

    const generateTickets = () => {
        var newTickets = []
        setTicketData(userTickets.map((val, index, array) => {
            return {
                name : "Sakthi",
                route : routeNumber[val[3]],
                startingStop: mtcRoutes[routeNumber[val[3]]][val[1]],
                destinationStop: mtcRoutes[routeNumber[val[3]]][val[2]],
                state: (val[4] ? "Valid" : "Invalid"),
                position: val,
            }
        }))
    }

    const getTickets = async () => {
        const response = await fetch(`${address}/get-tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const { tickets } = await response.json();
        // console.log(tickets)
        setUserTickets(tickets)
        generateTickets();
        console.log(ticketData)
    }


    useEffect(() => {
        getTickets();
    }, []);


    return (

        <View style={[styles.container, { flexDirection: "column" }, { backgroundColor: "#FFFFFF" }, { textAlign: 'center' }]}>

            <View style={[{ flex: 0.5 }, { textAlign: "center" }, { paddingLeft: 35 }, { paddingTop: 35 }]}>
                <Image source={require('./dashboard.png')} />
            </View>

            <View style={[{ flex: 1 }, { textAlign: "center" }]}>
                <Text style={styles.header}>
                    Hello Sakthi
                </Text>

                <Text style={styles.description}>
                    Have a nice day.
                </Text>
            </View>

            <View style={[{ flex: 8 }, { textAlign: 'center' }, { padding: 25 }]}>


                <View style={[{ padding: 15 }]}>
                    <Text style={[styles.header, { fontSize: 18 }]}>
                        Valid Tickets
                    </Text>
                </View>


                <View style={[{ flex: 1 }, { flexDirection: "row" }, { justifyContent: "space-evenly" }]}>

                    <FlatList
                        data={ticketData}
                        horizontal={true}
                        renderItem={
                            ({ item }) => <TicketTile Name={item.name} Route={item.route} source={item.startingStop} destination={item.destinationStop} state={item.state} Position={item.position}/>
                        }
                    />
                </View>

                <View style={[{ flex: 1 }, { justifyContent: "space-evenly" }]}>

                    <View style={[{ flex: 1 }]}>
                        <Text style={[styles.header]}>
                            Check Nearby Routes
                        </Text>
                    </View>

                    <View style={[{ flex: 2 }]}>
                        <TouchableWithoutFeedback>
                            <Pressable onPress={() => { console.log("pressed here!") }}>
                                <View style={styles.tab}>
                                    <MapIcon />
                                    <Text style={[{ paddingLeft: 12 }, { fontSize: 18 }, { fontWeight: 600 }]}>
                                        Live Tracking
                                    </Text>
                                    <Text style={[{ paddingLeft: 15 }, { fontSize: 14 }, { fontWeight: 200 }]}>
                                        View nearby stops and current location here
                                    </Text>

                                </View>
                            </Pressable>
                        </TouchableWithoutFeedback>

                    </View>


                </View>

            </View>

        </View>
    )
}


const styles = StyleSheet.create({
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
        elevation: 3,
    }
});


export default Home;

// export default function Home() {
//   return (
//     <View>
//       <Text>Home</Text>
//     </View>
//   )
// }
