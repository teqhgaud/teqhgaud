import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, List, TextInput } from 'react-native-paper';
import { useDataStore } from '@/store/useDataStore';

export default function ProjectsScreen() {
  const { projects, createProject, deleteProject, init, initializing, loading } = useDataStore();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('planned');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initializing) {
      init();
    }
  }, [initializing, init]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 8 }}>
        <TextInput label="Project name" value={name} onChangeText={setName} mode="outlined" />
        <TextInput label="Status" value={status} onChangeText={setStatus} mode="outlined" />
        <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" />
        <Button
          mode="contained"
          loading={loading}
          disabled={!name.trim()}
          onPress={async () => {
            await createProject({ name: name.trim(), status: status.trim() || null, description: description.trim() || null });
            setName('');
            setStatus('planned');
            setDescription('');
          }}
        >
          Add Project
        </Button>
      </View>

      <List.Section title="Projects" style={{ marginTop: 16 }}>
        {projects.map((p) => (
          <List.Item
            key={p.id}
            title={p.name}
            description={p.status || p.description || undefined}
            right={() => (
              <Button onPress={() => deleteProject(p.id)} mode="text">
                Delete
              </Button>
            )}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}