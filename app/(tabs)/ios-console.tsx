
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useTheme } from "@react-navigation/native";

export default function IOSConsoleScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.container}>
        {Platform.OS === 'web' ? (
          <View style={styles.webContainer}>
            <Text style={[styles.webText, { color: theme.colors.text }]}>
              Opening App Store Connect in a new window...
            </Text>
            <Text style={[styles.webLink, { color: theme.colors.primary }]}>
              https://appstoreconnect.apple.com/login
            </Text>
          </View>
        ) : (
          <WebView
            source={{ uri: 'https://appstoreconnect.apple.com/login' }}
            style={styles.webview}
            startInLoadingState={true}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  webLink: {
    fontSize: 14,
    textAlign: 'center',
  },
});
