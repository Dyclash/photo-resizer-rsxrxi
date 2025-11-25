
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";

export default function ProfileScreen() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);
  const [isDataSharingEnabled, setIsDataSharingEnabled] = useState(false);

  const handleDarkModeToggle = async (value: boolean) => {
    setIsDarkMode(value);
    try {
      // Update system UI background color based on theme
      await SystemUI.setBackgroundColorAsync(value ? '#0F0F1E' : '#FFFFFF');
      Alert.alert(
        'Theme Changed',
        `${value ? 'Dark' : 'Light'} mode activated. Please restart the app for full effect.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('Error updating system UI:', error);
    }
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy & Security',
      'Your data is stored locally on your device. We do not collect or share any personal information without your explicit consent.',
      [
        {
          text: 'Learn More',
          onPress: () => {
            Alert.alert(
              'Data Privacy',
              '• All photos are processed locally on your device\n• No data is sent to external servers\n• Your app descriptions and generated content are stored locally\n• You have full control over your data',
              [{ text: 'OK' }]
            );
          }
        },
        { text: 'OK' }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will remove all your saved photos, descriptions, and generated content. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'App data has been cleared.');
          }
        }
      ]
    );
  };

  const stats = [
    { label: 'Photos Resized', value: '127', icon: 'photo.fill', androidIcon: 'image' },
    { label: 'Apps Published', value: '8', icon: 'app.badge', androidIcon: 'apps' },
    { label: 'Downloads', value: '2.4K', icon: 'arrow.down.circle', androidIcon: 'download' },
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
          {stats.map((stat, index) => (
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
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="moon.fill" 
                android_material_icon_name="dark_mode" 
                size={20} 
                color={colors.secondary} 
              />
              <Text style={styles.preferenceText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDarkMode ? colors.primaryLight : colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <TouchableOpacity style={styles.preferenceCard} onPress={handlePrivacySettings}>
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="lock.fill" 
                android_material_icon_name="lock" 
                size={20} 
                color={colors.accent} 
              />
              <Text style={styles.preferenceText}>Privacy Policy</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron_right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="chart.bar.fill" 
                android_material_icon_name="analytics" 
                size={20} 
                color={colors.highlight} 
              />
              <Text style={styles.preferenceText}>Analytics</Text>
            </View>
            <Switch
              value={isAnalyticsEnabled}
              onValueChange={setIsAnalyticsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isAnalyticsEnabled ? colors.primaryLight : colors.textSecondary}
            />
          </View>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="square.and.arrow.up.fill" 
                android_material_icon_name="share" 
                size={20} 
                color={colors.success} 
              />
              <Text style={styles.preferenceText}>Data Sharing</Text>
            </View>
            <Switch
              value={isDataSharingEnabled}
              onValueChange={setIsDataSharingEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDataSharingEnabled ? colors.primaryLight : colors.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.preferenceCard} onPress={handleClearData}>
            <View style={styles.preferenceLeft}>
              <IconSymbol 
                ios_icon_name="trash.fill" 
                android_material_icon_name="delete" 
                size={20} 
                color={colors.error} 
              />
              <Text style={[styles.preferenceText, { color: colors.error }]}>Clear App Data</Text>
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
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
});
