
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/commonStyles';
import { APP_STORE_SPECS, AppStoreSpec } from '../types/PhotoTypes';
import { IconSymbol } from './IconSymbol';

interface SpecSelectorProps {
  selectedSpecs: AppStoreSpec[];
  onSpecsChange: (specs: AppStoreSpec[]) => void;
}

export function SpecSelector({ selectedSpecs, onSpecsChange }: SpecSelectorProps) {
  const isAllSelected = selectedSpecs.length === APP_STORE_SPECS.length;

  const toggleSpec = (spec: AppStoreSpec) => {
    const isSelected = selectedSpecs.some(
      s => s.width === spec.width && s.height === spec.height
    );

    if (isSelected) {
      onSpecsChange(
        selectedSpecs.filter(s => !(s.width === spec.width && s.height === spec.height))
      );
    } else {
      onSpecsChange([...selectedSpecs, spec]);
    }
  };

  const toggleAll = () => {
    if (isAllSelected) {
      onSpecsChange([]);
    } else {
      onSpecsChange([...APP_STORE_SPECS]);
    }
  };

  const isSpecSelected = (spec: AppStoreSpec) => {
    return selectedSpecs.some(
      s => s.width === spec.width && s.height === spec.height
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol
            ios_icon_name="rectangle.stack.fill"
            android_material_icon_name="layers"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.title}>Select Specifications</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {selectedSpecs.length}/{APP_STORE_SPECS.length}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.selectAllButton}
        onPress={toggleAll}
        activeOpacity={0.7}
      >
        {isAllSelected ? (
          <LinearGradient
            colors={[colors.gradient1, colors.gradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selectAllGradient}
          >
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={20}
              color={colors.text}
            />
            <Text style={styles.selectAllTextSelected}>All Selected</Text>
          </LinearGradient>
        ) : (
          <View style={styles.selectAllDefault}>
            <IconSymbol
              ios_icon_name="circle"
              android_material_icon_name="radio_button_unchecked"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.specsList}>
        {APP_STORE_SPECS.map((spec, index) => {
          const selected = isSpecSelected(spec);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.specItem, selected && styles.specItemSelected]}
              onPress={() => toggleSpec(spec)}
              activeOpacity={0.7}
            >
              <View style={styles.specContent}>
                <View style={styles.specInfo}>
                  <Text style={[styles.specLabel, selected && styles.specLabelSelected]}>
                    {spec.label}
                  </Text>
                  <Text style={[styles.specDimensions, selected && styles.specDimensionsSelected]}>
                    {spec.width} × {spec.height} pixels
                  </Text>
                </View>
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={16}
                      color={colors.text}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedSpecs.length === 0 && (
        <View style={styles.warningCard}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={20}
            color={colors.warning}
          />
          <Text style={styles.warningText}>
            Please select at least one specification to resize
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.cardLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  selectAllButton: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  selectAllDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
    backgroundColor: colors.card,
  },
  selectAllTextSelected: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  selectAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  specsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  specItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  specItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.cardLight,
  },
  specContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  specInfo: {
    flex: 1,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  specLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  specDimensions: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  specDimensionsSelected: {
    color: colors.primary,
    opacity: 0.8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: colors.warning,
    fontWeight: '600',
    lineHeight: 18,
  },
});
