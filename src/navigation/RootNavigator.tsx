import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Hexagon, ClipboardList, Bell } from 'lucide-react-native';

import { Colors } from '../theme/colors';
import { TabParamList, HiveStackParamList, InspectionsStackParamList, RemindersStackParamList } from './types';

// Hive screens
import HiveListScreen from '../screens/hives/HiveListScreen';
import HiveDetailScreen from '../screens/hives/HiveDetailScreen';
import HiveFormScreen from '../screens/hives/HiveFormScreen';
import QueenFormScreen from '../screens/hives/QueenFormScreen';

// Inspection screens
import InspectionsListScreen from '../screens/inspections/InspectionsListScreen';
import InspectionFormScreen from '../screens/inspections/InspectionFormScreen';
import InspectionDetailScreen from '../screens/inspections/InspectionDetailScreen';

// Reminder screens
import RemindersListScreen from '../screens/reminders/RemindersListScreen';
import ReminderFormScreen from '../screens/reminders/ReminderFormScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const HiveStack = createNativeStackNavigator<HiveStackParamList>();
const InspectionsStack = createNativeStackNavigator<InspectionsStackParamList>();
const RemindersStack = createNativeStackNavigator<RemindersStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: Colors.background },
  headerShadowVisible: false,
  headerTintColor: Colors.textPrimary,
  headerTitleStyle: { fontFamily: 'Inter_300Light', fontSize: 18 },
  contentStyle: { backgroundColor: Colors.background },
};

function HiveStackNavigator() {
  return (
    <HiveStack.Navigator screenOptions={screenOptions}>
      <HiveStack.Screen name="HiveList" component={HiveListScreen} options={{ title: 'Hives' }} />
      <HiveStack.Screen name="HiveDetail" component={HiveDetailScreen} options={{ title: '' }} />
      <HiveStack.Screen name="HiveForm" component={HiveFormScreen} options={{ title: 'Hive' }} />
      <HiveStack.Screen name="InspectionForm" component={InspectionFormScreen} options={{ title: 'Inspection' }} />
      <HiveStack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: '' }} />
      <HiveStack.Screen name="QueenForm" component={QueenFormScreen} options={{ title: 'Queen' }} />
    </HiveStack.Navigator>
  );
}

function InspectionsStackNavigator() {
  return (
    <InspectionsStack.Navigator screenOptions={screenOptions}>
      <InspectionsStack.Screen name="InspectionsList" component={InspectionsListScreen} options={{ title: 'Inspections' }} />
      <InspectionsStack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: '' }} />
    </InspectionsStack.Navigator>
  );
}

function RemindersStackNavigator() {
  return (
    <RemindersStack.Navigator screenOptions={screenOptions}>
      <RemindersStack.Screen name="RemindersList" component={RemindersListScreen} options={{ title: 'Reminders' }} />
      <RemindersStack.Screen name="ReminderForm" component={ReminderFormScreen} options={{ title: 'Reminder' }} />
    </RemindersStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.border,
            borderTopWidth: 0.5,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: Colors.tabBarActive,
          tabBarInactiveTintColor: Colors.tabBarInactive,
          tabBarLabelStyle: { fontFamily: 'Inter_300Light', fontSize: 11 },
        }}
      >
        <Tab.Screen
          name="HivesTab"
          component={HiveStackNavigator}
          options={{
            tabBarLabel: 'Hives',
            tabBarIcon: ({ color, size }) => <Hexagon color={color} size={size} strokeWidth={1.5} />,
          }}
        />
        <Tab.Screen
          name="InspectionsTab"
          component={InspectionsStackNavigator}
          options={{
            tabBarLabel: 'Inspections',
            tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} strokeWidth={1.5} />,
          }}
        />
        <Tab.Screen
          name="RemindersTab"
          component={RemindersStackNavigator}
          options={{
            tabBarLabel: 'Reminders',
            tabBarIcon: ({ color, size }) => <Bell color={color} size={size} strokeWidth={1.5} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
