
import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { ResizedPhoto } from '../types/PhotoTypes';

interface ResizedPhotosListProps {
  photos: ResizedPhoto[];
}

export function ResizedPhotosList({ photos }: ResizedPhotosListProps) {
  if (photos.length === 0) {
    return null;
  }

  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.originalId]) {
      acc[photo.originalId] = [];
    }
    acc[photo.originalId].push(photo);
    return acc;
  }, {} as Record<string, ResizedPhoto[]>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resized Photos</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
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
});
