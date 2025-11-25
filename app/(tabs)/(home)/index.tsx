
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { usePhotoResizer } from '@/hooks/usePhotoResizer';
import { PhotoGrid } from '@/components/PhotoGrid';
import { ResizedPhotosList } from '@/components/ResizedPhotosList';
import { AppDescriptionInput } from '@/components/AppDescriptionInput';
import { IconSymbol } from '@/components/IconSymbol';
import { AppMetadata } from '@/types/PhotoTypes';

export default function HomeScreen() {
  const { photos, resizedPhotos, isResizing, pickImages, removePhoto, resizeAllPhotos, clearAll } = usePhotoResizer();
  const [metadata, setMetadata] = useState<AppMetadata | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'resize' | 'describe'>('upload');

  const handlePickImages = async () => {
    try {
      await pickImages();
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const handleResize = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please upload at least one photo first.');
      return;
    }

    try {
      await resizeAllPhotos();
      setCurrentStep('describe');
    } catch (error) {
      console.error('Error resizing:', error);
      Alert.alert('Error', 'Failed to resize images. Please try again.');
    }
  };

  const handleMetadataGenerated = (generated: AppMetadata) => {
    setMetadata(generated);
  };

  const handleReset = () => {
    clearAll();
    setMetadata(null);
    setCurrentStep('upload');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <IconSymbol
              ios_icon_name="photo.stack"
              android_material_icon_name="collections"
              size={32}
              color={colors.text}
            />
          </LinearGradient>
          <Text style={styles.title}>iOS App Store Photo Resizer</Text>
          <Text style={styles.subtitle}>
            Upload photos, resize to App Store specs, and generate promotional content
          </Text>
        </View>

        {currentStep === 'upload' && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImages}>
              <LinearGradient
                colors={[colors.gradient1, colors.gradient2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.uploadButtonGradient}
              >
                <IconSymbol
                  ios_icon_name="photo.badge.plus"
                  android_material_icon_name="add_photo_alternate"
                  size={32}
                  color={colors.text}
                />
                <Text style={styles.uploadButtonText}>
                  {photos.length > 0 ? 'Add More Photos' : 'Upload Photos'}
                </Text>
                <Text style={styles.uploadButtonSubtext}>Up to 12 photos</Text>
              </LinearGradient>
            </TouchableOpacity>

            <PhotoGrid photos={photos} onRemove={removePhoto} />

            {photos.length > 0 && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleResize}>
                  <LinearGradient
                    colors={[colors.secondary, colors.secondaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryButtonText}>
                      Resize to App Store Specs
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
                  <Text style={styles.secondaryButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <IconSymbol
                  ios_icon_name="info.circle.fill"
                  android_material_icon_name="info"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.infoTitle}>App Store Specifications</Text>
              </View>
              <Text style={styles.infoText}>- 1242 × 2688px (6.5" Portrait)</Text>
              <Text style={styles.infoText}>- 2688 × 1242px (6.5" Landscape)</Text>
              <Text style={styles.infoText}>- 1284 × 2778px (6.7" Portrait)</Text>
              <Text style={styles.infoText}>- 2778 × 1284px (6.7" Landscape)</Text>
            </View>
          </View>
        )}

        {isResizing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Resizing images...</Text>
          </View>
        )}

        {currentStep === 'describe' && resizedPhotos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.successBanner}>
              <LinearGradient
                colors={[colors.success, '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.successGradient}
              >
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check_circle"
                  size={24}
                  color={colors.text}
                />
                <Text style={styles.successText}>
                  Successfully resized {photos.length} photo(s) to {resizedPhotos.length} variants!
                </Text>
              </LinearGradient>
            </View>

            <ResizedPhotosList photos={resizedPhotos} />

            <AppDescriptionInput onGenerate={handleMetadataGenerated} />

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <IconSymbol
                ios_icon_name="arrow.counterclockwise"
                android_material_icon_name="refresh"
                size={20}
                color={colors.text}
              />
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 8px 24px rgba(124, 58, 237, 0.4)',
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    width: '100%',
  },
  uploadButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(124, 58, 237, 0.4)',
    elevation: 8,
  },
  uploadButtonGradient: {
    padding: 32,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    color: colors.text,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(6, 182, 212, 0.3)',
    elevation: 4,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  successBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(16, 185, 129, 0.3)',
    elevation: 4,
  },
  successGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    gap: 8,
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
