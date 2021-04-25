import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Switch, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker } from 'react-native-maps';
import PubNubReact from 'pubnub-react';

function App() {

  constructor(props); {
    super(props)
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-cb6f2812-e059-43cc-b280-c14bd1f031f0',
      subscribeKey: 'sub-c-003e95d2-a46d-11eb-96f4-7e87b170c68c'
    });
    //Base State
    this.state = {
      currentLoc: { //Track user's current location
        latitude: 44.00431152582654,
        longitude: -73.17791110680493
      },
      numUsers: 0, //track number of users on the app
      username: "A Naughty Moose", //user's username
      fixedOnUUID: "",
      focusOnMe: false, //zoom map to user's current location if true
      users: new Map(), //store data of each user in a Map
      isFocused: false,
      allowGPS: true, //toggle the app's ability to gather GPS data of the user
    };
    this.pubnub.init(this);
  });

  this.pubnub.publish({
    message: {
      hideUser: true
    },
    channel: "Channel-rgoj33d09"
  };

  async componentDidMount() {
    this.setUpApp()
  };

  async setUpApp(){
    this.pubnub.getMessage("Channel-rgoj33d09", msg => {
      /*------------WE'LL IMPLEMENT THIS LATER------------*/

    });
    this.pubnub.subscribe({
      channels: ["Channel-rgoj33d09"],
    });
  };

  //Track motional Coordinates
  navigator.geolocation.watchPosition(
    position => {
      this.setState({
        currentLoc: position.coords
      });
      if (this.state.allowGPS) {
        this.pubnub.publish({
          message: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          channel: "Channel-rgoj33d09"
        });
      }
      //console.log(positon.coords);
    },
    error => console.log("Maps Error: ", error),
    {
      enableHighAccuracy: true,
      distanceFilter: 100 //grab the location whenever the user's location changes by 100 meters
    }
  );

  focusLoc = () => {
    if (this.state.focusOnMe || this.state.fixedOnUUID) {
      this.setState({
        focusOnMe: false,
        fixedOnUUID: ""
      });
    } else {
      region = {
        latitude: this.state.currentLoc.latitude,
        longitude: this.state.currentLoc.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      };
      this.setState({
        focusOnMe: true
      });
      this.map.animateToRegion(region, 2000);
    }
  };

  toggleGPS = () => {
    this.setState({
      allowGPS: !this.state.allowGPS
    });
  };

  this.pubnub.getMessage("Channel-rgoj33d09", msg => {
    let users = this.state.users;
  });

  if (msg.message.hideUser) {
    users.delete(msg.publisher);
    this.setState({
      users
    });
  } else {
    coord = [msg.message.latitude, msg.message.longitude]; //Format GPS Coordinates for Payload
    let oldUser = this.state.users.get(msg.publisher);
    let newUser = {
      uuid: msg.publisher,
      latitude: msg.message.latitude,
      longitude: msg.message.longitude,
    };
    if (msg.message.message) {
      Timeout.set(msg.publisher, this.clearMessage, 5000, msg.publisher);
      newUser.message = msg.message.message;
    } else if (oldUser) {
      newUser.message = oldUser.message
    }
    users.set(newUser.uuid, newUser);
    this.setState({
      users
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.allowGPS != this.state.allowGPS) { //check whether the user just toggled their GPS settings
      if (this.state.allowGPS) { //if user toggled to show their GPS data, we add them to the user Map once again
        if (this.state.focusOnMe) { //if user toggled to focus map view on themselves
          this.animateToCurrent(this.state.currentLoc, 1000);
        }
        let users = this.state.users; //make a copy of the users array to manipulate

        //create a new user object with updated user values to replace the old user
        let tempUser = {
          uuid: this.pubnub.getUUID(),
          latitude: this.state.currentLoc.latitude,
          longitude: this.state.currentLoc.longitude,
          image: this.state.currentPicture,
          username: this.state.username
        };
        users.set(tempUser.uuid, tempUser);
        this.setState( //quickly update the user Map locally
          {
            users
          },
          () => {
            this.pubnub.publish({ //publish updated user to update everyone's user Map
              message: tempUser,
              channel: "Channel-rgoj33d09"
            });
          }
        );
      } else { //if user toggled to hide their GPS data
        let users = this.state.users;
        let uuid = this.pubnub.getUUID();
        users.delete(uuid); //delete this user from the user Map
        this.setState({ //update the userMap
          users,
        });
        this.pubnub.publish({ //let everyone else's user Map know this user wants to be hidden
          message: {
            hideUser: true
          },
          channel: "Channel-rgoj33d09"
        });
      }
    }
  };

  let usersArray = Array.from(this.state.users.values());

  const styles = StyleSheet.create({
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    marker: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: Platform.OS === "android" ? 100 : 0,
    },
    topBar: {
      top: Platform.OS === "android" ? hp('2%') : hp('5%'),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: wp("2%"),
    },
    rightBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center"
    },
    leftBar: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    locationSwitch: {
      left: 300,
    },
    container: {
      flex: 1
    },
    bottom: {
      position: "absolute",
      flexDirection: 'column',
      bottom: 0,
      justifyContent: "center",
      alignSelf: "center",
      width: "100%",
      marginBottom: hp("4%"),
    },
    focusLoc: {
      width: hp("4.5%"),
      height: hp("4.5%"),
      marginRight: wp("2%"),
      left: 15
    },
    userCount: {
      marginHorizontal: 10
    },
    map: {
      ...StyleSheet.absoluteFillObject
    },
    profile: {
      width: hp("4.5%"),
      height: hp("4.5%")
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <View style={styles.container}  >
          <MapView
            style={styles.map}
            ref={ref => (this.map = ref)}
            onMoveShouldSetResponder={this.draggedMap}
            initialRegion={{
              latitude: 36.81808,
              longitude: -98.640297,
              latitudeDelta: 60.0001,
              longitudeDelta: 60.0001
            }}
          >
            <Marker
              style={styles.marker}
              key={item.uuid} //distinguish each user's marker by their UUID
              coordinate={{ //user's coordinates 
                latitude: item.latitude,
                longitude: item.longitude
              }}
              ref={marker => {
                this.marker = marker;
              }}
            >
              <Image
                style={styles.profile}
                source={require('./LOCATION OF YOUR USER IMAGE PROFILES')} //User's image 
              />
            </Marker>

          </MapView>
          <View style={styles.topBar}>
            <View style={styles.rightBar}>
              <Switch
                value={this.state.allowGPS}
                style={styles.locationSwitch}
                onValueChange={this.toggleGPS}
              />
            </View>
          </View>

          <View style={styles.bottom}>
            <View style={styles.bottomRow}>
              <TouchableOpacity onPress={this.focusLoc}>
                <Image style={styles.focusLoc} source={require('./heart.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

};

export default App;
