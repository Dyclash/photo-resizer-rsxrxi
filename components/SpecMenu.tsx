
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/commonStyles';
import { APP_STORE_SPECS, AppStoreSpec } from '../types/PhotoTypes';
import { IconSymbol } from './IconSymbol';

interface SpecMenuProps {
  selectedSpecs: AppStoreSpec[];
  onSpecsChange: (specs: AppStoreSpec[]) => void;
}

export function SpecMenu({ selectedSpecs, onSpecsChange }: SpecMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
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
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.menuButtonGradient}
        >
          <IconSymbol
            ios_icon_name="rectangle.stack.fill"
            android_material_icon_name="layers"
            size={20}
            color={colors.text}
          />
          {selectedSpecs.length > 0 && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{selectedSpecs.length}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Pressable 
            style={styles.menuContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.menuHeader}>
              <View style={styles.menuHeaderLeft}>
                <IconSymbol
                  ios_icon_name="rectangle.stack.fill"
                  android_material_icon_name="layers"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.menuTitle}>Select Specifications</Text>
              </View>
              <TouchableOpacity
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {selectedSpecs.length} of {APP_STORE_SPECS.length} selected
              </Text>
            </View>

            <ScrollView 
              style={styles.menuContent}
              showsVerticalScrollIndicator={false}
            >
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
            </ScrollView>

            <View style={styles.menuFooter}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setMenuVisible(false)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 1000,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.4)',
    elevation: 8,
  },
  menuButtonGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  menuBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    boxShadow: '0px -4px 24px rgba(0, 0, 0, 0.3)',
    elevation: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  selectionInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.cardLight,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  menuContent: {
    flex: 1,
    paddingTop: 16,
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
    paddingBottom: 16,
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
  menuFooter: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  doneButton: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(6, 182, 212, 0.3)',
    elevation: 4,
  },
  doneButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
