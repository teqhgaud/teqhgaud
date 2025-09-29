import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useDataStore } from '@/store/useDataStore';

export default function SettingsScreen() {
  const { refreshAll, init, initializing, loading } = useDataStore();

  useEffect(() => {
    if (initializing) {
      init();
    }
  }, [initializing, init]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <List.Section title="Data">
        <List.Item
          title="Refresh"
          description="Reload all data from the database"
          right={() => (
            <Button mode="contained-tonal" loading={loading} onPress={refreshAll}>
              Refresh
            </Button>
          )}
        />
      </List.Section>
    </ScrollView>
  );
}