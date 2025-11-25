
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { storage, AppStats } from "@/utils/storage";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<AppStats>({ photosResized: 0, appsPublished: 0, downloads: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const loadedStats = await storage.getStats();
      setStats(loadedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will remove all your saved photos, descriptions, and generated content. Your statistics will be preserved. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await storage.clearAllData();
              if (success) {
                console.log('App data cleared successfully');
                Alert.alert(
                  'Success',
                  'App data has been cleared. Your photos and content have been removed.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('User acknowledged data clear');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', 'Failed to clear app data. Please try again.');
              }
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'An error occurred while clearing data.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset App',
      'This will reset the app to its initial state, clearing ALL data including statistics and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const success = await storage.resetApp();
              if (success) {
                console.log('App reset successfully');
                setStats({ photosResized: 0, appsPublished: 0, downloads: 0 });
                Alert.alert(
                  'Success',
                  'App has been reset to initial state. All data has been cleared.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('User acknowledged app reset');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Error', 'Failed to reset app. Please try again.');
              }
            } catch (error) {
              console.error('Error resetting app:', error);
              Alert.alert('Error', 'An error occurred while resetting the app.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const statsData = [
    { label: 'Photos Resized', value: stats.photosResized.toString(), icon: 'photo.fill', androidIcon: 'image' },
    { label: 'Apps Published', value: stats.appsPublished.toString(), icon: 'app.badge', androidIcon: 'apps' },
    { label: 'Downloads', value: stats.downloads > 0 ? `${(stats.downloads / 1000).toFixed(1)}K` : '0', icon: 'arrow.down.circle', androidIcon: 'download' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol 
                ios_icon_name="person.fill" 
                android_material_icon_name="person" 
                size={48} 
                color={colors.text} 
              />
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
            </View>
          </View>
          <Text style={styles.name}>Photo Resizer Pro</Text>
          <Text style={styles.email}>Your App Store Assistant</Text>
        </LinearGradient>

        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <IconSymbol
                  ios_icon_name={stat.icon}
                  android_material_icon_name={stat.androidIcon}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={[styles.preferenceCard, isLoading && styles.disabledCard]} 
            onPress={handleClearData}
            disabled={isLoading}
          >
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="trash.fill" 
                android_material_icon_name="delete" 
                size={20} 
                color={colors.error} 
              />
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceText, { color: colors.error }]}>Clear App Data</Text>
                <Text style={styles.preferenceSubtext}>Remove photos and content</Text>
              </View>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron_right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.preferenceCard, isLoading && styles.disabledCard]} 
            onPress={handleReset}
            disabled={isLoading}
          >
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="arrow.counterclockwise.circle.fill" 
                android_material_icon_name="refresh" 
                size={20} 
                color={colors.warning} 
              />
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceText, { color: colors.warning }]}>Reset App</Text>
                <Text style={styles.preferenceSubtext}>Clear all data and statistics</Text>
              </View>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron_right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IconSymbol 
                ios_icon_name="info.circle.fill" 
                android_material_icon_name="info" 
                size={20} 
                color={colors.primary} 
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoText}>1.0.0</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <IconSymbol 
                ios_icon_name="hammer.fill" 
                android_material_icon_name="build" 
                size={20} 
                color={colors.secondary} 
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Build</Text>
                <Text style={styles.infoText}>2024.01.001</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    boxShadow: '0px 8px 24px rgba(124, 58, 237, 0.3)',
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.text,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  preferenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledCard: {
    opacity: 0.5,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  preferenceSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
