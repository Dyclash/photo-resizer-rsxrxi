
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/commonStyles';
import { ResizedPhoto } from '../types/PhotoTypes';
import { IconSymbol } from './IconSymbol';
import { exportPhotosAsZip } from '../utils/zipExporter';

interface ResizedPhotosListProps {
  photos: ResizedPhoto[];
}

export function ResizedPhotosList({ photos }: ResizedPhotosListProps) {
  const [savingPhotoId, setSavingPhotoId] = useState<string | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  if (photos.length === 0) {
    return null;
  }

  const saveImage = async (photo: ResizedPhoto) => {
    try {
      setSavingPhotoId(photo.id);

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = photo.uri;
        link.download = `resized-${photo.specification.replace(/[^a-z0-9]/gi, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Success', 'Image downloaded!');
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images to your library.');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `resized-${Date.now()}.png`;
      await FileSystem.copyAsync({
        from: photo.uri,
        to: fileUri,
      });

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('App Store Photos', asset, false);

      Alert.alert('Success', 'Image saved to your photo library!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    } finally {
      setSavingPhotoId(null);
    }
  };

  const shareImage = async (photo: ResizedPhoto) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Not Available', 'Sharing is not available on this device.');
        return;
      }

      await Sharing.shareAsync(photo.uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share resized image',
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image.');
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      await exportPhotosAsZip(photos);
    } catch (error) {
      console.error('Error exporting ZIP:', error);
      Alert.alert('Error', 'Failed to create ZIP file. Please try again.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.originalId]) {
      acc[photo.originalId] = [];
    }
    acc[photo.originalId].push(photo);
    return acc;
  }, {} as Record<string, ResizedPhoto[]>);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Resized Photos</Text>
          <Text style={styles.subtitle}>{photos.length} variants ready</Text>
        </View>
        <TouchableOpacity
          style={styles.zipButton}
          onPress={handleExportZip}
          disabled={isExportingZip}
        >
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.zipButtonGradient}
          >
            {isExportingZip ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <React.Fragment>
                <IconSymbol
                  ios_icon_name="arrow.down.doc.fill"
                  android_material_icon_name="folder_zip"
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.zipButtonText}>Download ZIP</Text>
              </React.Fragment>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(groupedPhotos).map(([originalId, resizedGroup], groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <View style={styles.groupHeader}>
              <IconSymbol
                ios_icon_name="photo.fill"
                android_material_icon_name="image"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.groupTitle}>Photo {groupIndex + 1}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{resizedGroup.length} sizes</Text>
              </View>
            </View>
            {resizedGroup.map((photo, index) => (
              <View key={index} style={styles.photoCard}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                <View style={styles.info}>
                  <Text style={styles.specLabel}>{photo.specification}</Text>
                  <Text style={styles.dimensions}>
                    {photo.width} × {photo.height} pixels
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.downloadButton]}
                    onPress={() => saveImage(photo)}
                    disabled={savingPhotoId === photo.id}
                  >
                    <IconSymbol
                      ios_icon_name={savingPhotoId === photo.id ? "arrow.down.circle.fill" : "arrow.down.circle"}
                      android_material_icon_name={savingPhotoId === photo.id ? "downloading" : "download"}
                      size={20}
                      color={savingPhotoId === photo.id ? colors.textSecondary : colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.shareButton]}
                    onPress={() => shareImage(photo)}
                  >
                    <IconSymbol
                      ios_icon_name="square.and.arrow.up"
                      android_material_icon_name="share"
                      size={20}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  zipButton: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
    elevation: 4,
  },
  zipButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  zipButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  group: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.cardLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  photoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dimensions: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  downloadButton: {
    backgroundColor: colors.backgroundLight,
    borderColor: colors.primary,
  },
  shareButton: {
    backgroundColor: colors.backgroundLight,
    borderColor: colors.secondary,
  },
});
