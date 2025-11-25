
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
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
      <View style={styles.headerRow}>
        <IconSymbol
          ios_icon_name="text.bubble.fill"
          android_material_icon_name="description"
          size={24}
          color={colors.primary}
        />
        <Text style={styles.title}>Describe Your App</Text>
      </View>
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
        style={styles.button}
        onPress={handleGenerate}
        disabled={description.trim().length < 10}
      >
        <LinearGradient
          colors={description.trim().length < 10 ? [colors.border, colors.border] : [colors.gradient1, colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <IconSymbol
            ios_icon_name="sparkles"
            android_material_icon_name="auto_awesome"
            size={20}
            color={colors.text}
          />
          <Text style={styles.buttonText}>Generate Content</Text>
        </LinearGradient>
      </TouchableOpacity>

      {metadata && (
        <ScrollView style={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <IconSymbol
                  ios_icon_name="megaphone.fill"
                  android_material_icon_name="campaign"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.resultTitle}>Promotional Text</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(metadata.promotionalText, 'Promotional Text')}
              >
                <IconSymbol
                  ios_icon_name="doc.on.doc"
                  android_material_icon_name="content_copy"
                  size={18}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{metadata.promotionalText}</Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <IconSymbol
                  ios_icon_name="doc.text.fill"
                  android_material_icon_name="description"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={styles.resultTitle}>Description</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(metadata.description, 'Description')}
              >
                <IconSymbol
                  ios_icon_name="doc.on.doc"
                  android_material_icon_name="content_copy"
                  size={18}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{metadata.description}</Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <IconSymbol
                  ios_icon_name="tag.fill"
                  android_material_icon_name="label"
                  size={18}
                  color={colors.accent}
                />
                <Text style={styles.resultTitle}>Keywords (10)</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard(metadata.keywords.join(', '), 'Keywords')}
              >
                <IconSymbol
                  ios_icon_name="doc.on.doc"
                  android_material_icon_name="content_copy"
                  size={18}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.keywordsContainer}>
              {metadata.keywords.map((keyword, index) => (
                <LinearGradient
                  key={index}
                  colors={[colors.gradient1, colors.gradient2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.keywordChip}
                >
                  <Text style={styles.keywordText}>{keyword}</Text>
                </LinearGradient>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
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
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 24,
    maxHeight: 600,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  resultText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  keywordText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
});
