
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../styles/commonStyles';
import { generateAppMetadata } from '../utils/textGenerator';
import { AppMetadata } from '../types/PhotoTypes';
import { IconSymbol } from './IconSymbol';

interface AppDescriptionInputProps {
  onGenerate: (metadata: AppMetadata) => void;
}

export function AppDescriptionInput({ onGenerate }: AppDescriptionInputProps) {
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState<AppMetadata | null>(null);

  const handleGenerate = () => {
    if (description.trim().length < 10) {
      console.log('Description too short');
      return;
    }

    const generated = generateAppMetadata(description);
    setMetadata(generated);
    onGenerate(generated);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', `${label} copied to clipboard`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Describe Your App</Text>
      <Text style={styles.subtitle}>
        Tell us about your app to generate promotional content
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E.g., A fitness tracking app that helps users monitor their daily activities..."
        placeholderTextColor={colors.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, description.trim().length < 10 && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={description.trim().length < 10}
      >
        <Text style={styles.buttonText}>Generate Content</Text>
      </TouchableOpacity>

      {metadata && (
        <ScrollView style={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Promotional Text</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(metadata.promotionalText, 'Promotional Text')}
              >
                <IconSymbol
                  ios_icon_name="doc.on.doc"
                  android_material_icon_name="content_copy"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{metadata.promotionalText}</Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Description</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(metadata.description, 'Description')}
              >
                <IconSymbol
                  ios_icon_name="doc.on.doc"
                  android_material_icon_name="content_copy"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{metadata.description}</Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Keywords (10)</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(metadata.keywords.join(', '), 'Keywords')}
              >
                <IconSymbol
                  ios_icon_name="doc.on.doc"
                  android_material_icon_name="content_copy"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.keywordsContainer}>
              {metadata.keywords.map((keyword, index) => (
                <View key={index} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>{keyword}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 24,
    maxHeight: 600,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  resultText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    fontSize: 13,
    color: colors.card,
    fontWeight: '600',
  },
});
