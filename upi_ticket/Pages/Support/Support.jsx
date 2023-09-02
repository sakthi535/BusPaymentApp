import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg';

export default function Support() {
  let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

  return (
    <View style ={[{padding : 50}]}>
      <QRCode
        value="just some value"
      />


    </View>
  )
}

const styles = StyleSheet.create({})