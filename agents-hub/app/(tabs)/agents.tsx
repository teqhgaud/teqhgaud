import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, List, TextInput } from 'react-native-paper';
import { useDataStore } from '@/store/useDataStore';

export default function AgentsScreen() {
  const { agents, createAgent, deleteAgent, init, initializing, loading } = useDataStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initializing) {
      init();
    }
  }, [initializing, init]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 8 }}>
        <TextInput label="Agent name" value={name} onChangeText={setName} mode="outlined" />
        <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" />
        <Button
          mode="contained"
          loading={loading}
          disabled={!name.trim()}
          onPress={async () => {
            await createAgent({ name: name.trim(), description: description.trim() || null, status: 'active' });
            setName('');
            setDescription('');
          }}
        >
          Add Agent
        </Button>
      </View>

      <List.Section title="Agents" style={{ marginTop: 16 }}>
        {agents.map((a) => (
          <List.Item
            key={a.id}
            title={a.name}
            description={a.description ?? undefined}
            right={() => (
              <Button onPress={() => deleteAgent(a.id)} mode="text">
                Delete
              </Button>
            )}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}