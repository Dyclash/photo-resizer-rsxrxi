
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="ios-console" name="ios-console">
        <Icon sf="apple.logo" />
        <Label>iOS</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="android-console" name="android-console">
        <Icon sf="play.rectangle.fill" />
        <Label>Android</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
