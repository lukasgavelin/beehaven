import { NavigatorScreenParams } from '@react-navigation/native';

export type HiveStackParamList = {
  HiveList: undefined;
  HiveDetail: { hiveId: number };
  HiveForm: { hiveId?: number };
  InspectionForm: { hiveId: number; inspectionId?: number };
  InspectionDetail: { inspectionId: number; hiveId: number };
  QueenForm: { hiveId: number };
};

export type InspectionsStackParamList = {
  InspectionsList: undefined;
  InspectionDetail: { inspectionId: number; hiveId: number };
};

export type RemindersStackParamList = {
  RemindersList: undefined;
  ReminderForm: { reminderId?: number };
};

export type OptionsStackParamList = {
  OptionsHome: undefined;
};

export type TabParamList = {
  HivesTab: NavigatorScreenParams<HiveStackParamList>;
  InspectionsTab: NavigatorScreenParams<InspectionsStackParamList>;
  RemindersTab: NavigatorScreenParams<RemindersStackParamList>;
  OptionsTab: NavigatorScreenParams<OptionsStackParamList>;
};
