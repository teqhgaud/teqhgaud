import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, List, TextInput } from 'react-native-paper';
import { useDataStore } from '@/store/useDataStore';

export default function SoftwareScreen() {
  const { software, createSoftware, deleteSoftware, init, initializing, loading } = useDataStore();
  const [name, setName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initializing) {
      init();
    }
  }, [initializing, init]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 8 }}>
        <TextInput label="Software name" value={name} onChangeText={setName} mode="outlined" />
        <TextInput label="Repo URL" value={repoUrl} onChangeText={setRepoUrl} mode="outlined" />
        <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" />
        <Button
          mode="contained"
          loading={loading}
          disabled={!name.trim()}
          onPress={async () => {
            await createSoftware({ name: name.trim(), repoUrl: repoUrl.trim() || null, description: description.trim() || null });
            setName('');
            setRepoUrl('');
            setDescription('');
          }}
        >
          Add Software
        </Button>
      </View>

      <List.Section title="Software" style={{ marginTop: 16 }}>
        {software.map((s) => (
          <List.Item
            key={s.id}
            title={s.name}
            description={s.repoUrl || s.description || undefined}
            right={() => (
              <Button onPress={() => deleteSoftware(s.id)} mode="text">
                Delete
              </Button>
            )}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}