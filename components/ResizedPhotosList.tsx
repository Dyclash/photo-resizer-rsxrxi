
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { colors } from '../styles/commonStyles';
import { ResizedPhoto } from '../types/PhotoTypes';
import { IconSymbol } from './IconSymbol';

interface ResizedPhotosListProps {
  photos: ResizedPhoto[];
}

export function ResizedPhotosList({ photos }: ResizedPhotosListProps) {
  const [savingPhotoId, setSavingPhotoId] = useState<string | null>(null);

  if (photos.length === 0) {
    return null;
  }

  const saveImage = async (photo: ResizedPhoto) => {
    try {
      setSavingPhotoId(photo.id);

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = photo.uri;
        link.download = `resized-${photo.specification.replace(/[^a-z0-9]/gi, '-')}.jpg`;
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

      const fileUri = FileSystem.documentDirectory + `resized-${Date.now()}.jpg`;
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
        mimeType: 'image/jpeg',
        dialogTitle: 'Share resized image',
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image.');
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
        <Text style={styles.title}>Resized Photos</Text>
        <Text style={styles.subtitle}>{photos.length} variants</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {Object.entries(groupedPhotos).map(([originalId, resizedGroup], groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={styles.groupTitle}>Photo {groupIndex + 1}</Text>
            {resizedGroup.map((photo, index) => (
              <View key={index} style={styles.photoCard}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                <View style={styles.info}>
                  <Text style={styles.specLabel}>{photo.specification}</Text>
                  <Text style={styles.dimensions}>
                    {photo.width} × {photo.height}px
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => saveImage(photo)}
                    disabled={savingPhotoId === photo.id}
                  >
                    <IconSymbol
                      ios_icon_name={savingPhotoId === photo.id ? "arrow.down.circle.fill" : "arrow.down.circle"}
                      android_material_icon_name={savingPhotoId === photo.id ? "downloading" : "download"}
                      size={24}
                      color={savingPhotoId === photo.id ? colors.textSecondary : colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => shareImage(photo)}
                  >
                    <IconSymbol
                      ios_icon_name="square.and.arrow.up"
                      android_material_icon_name="share"
                      size={24}
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
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  group: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  photoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: colors.border,
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
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
});
