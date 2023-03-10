import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";


export default class LoginScreen extends Component {
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
    };
    
      onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
    
            // Sign in with credential from the Google user.
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(function(result) {
                if (result.additionalUserInfo.isNewUser) {
                  firebase
                    .database()
                    .ref("/users/" + result.user.uid)
                    .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: "dark"
                    })
                    .then(function(snapshot) {});
                }
              })
              .catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
          } else {
            console.log("User already signed-in Firebase.");
          }
        });
      };

        signInWithEmailAndPassword = async () => {
            signIn = async (email,password) => {
            firebase
            .auth
            .signInWithEmailAndPassword(email,password)
            .then(() => {
            this.props.navigation.replace("PostScreen");
            })
            .catch(error => {
                Alert.alert(error.message);
            });
            
            };
        }

        render() {
            return (
            <View>
                    <TextInput
                        style={styles.inputFontUsername}
                        onChangeText={(title) => this.setState({ title })}
                        onPress={() => this.signInWithEmailAndPassword()}
                        placeholder={'Username'}
                        placeholderTextColor="grey"
                    />

                    <TextInput
                        style={styles.inputFontPassword}
                        onChangeText={(title) => this.setState({ title })}
                        onPress={() => this.signInWithEmailAndPassword()}
                        placeholder={'Password'}
                        placeholderTextColor="grey"
                    />
            </View>

            );
        
        }
    
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    inputFontPassword: {
        height: RFValue(40),
        borderColor: 'white',
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: 'white',
        marginTop: RFValue(20),
      },
      inputFontUsername: {
        height: RFValue(40),
        borderColor: 'white',
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: 'white',
        marginTop: RFValue(10),
      },
  });