import React from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";

const prompts = [
  {
    id: "1",
    title: "Cinematic Portrait",
    text: "Turn this image into a cinematic portrait with soft lighting, realistic skin texture, and dramatic shadows."
  },
  {
    id: "2",
    title: "Anime Style",
    text: "Convert this photo into anime style with vibrant colors, clean outlines, and expressive lighting."
  },
  {
    id: "3",
    title: "Luxury Product Shot",
    text: "Transform this image into a high-end luxury product shot with glossy reflections and studio lighting."
  }
];

export default function App() {
  const copyText = async (text) => {
    await Clipboard.setStringAsync(text);
    alert("Prompt copied!");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>

      <TouchableOpacity style={styles.button} onPress={() => copyText(item.text)}>
        <Text style={styles.buttonText}>Copy Prompt</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>AI Prompt Library</Text>

      <FlatList
        data={prompts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  title: {
    color: "#38bdf8",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  text: {
    color: "#cbd5f5",
    marginBottom: 12
  },
  button: {
    backgroundColor: "#38bdf8",
    padding: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#0f172a",
    fontWeight: "bold"
  }
});
