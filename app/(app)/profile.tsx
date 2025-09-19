import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Divider, Avatar } from 'react-native-paper';
import { Button } from '@/components/ui/Button';
import { useGetMeQuery, useLogoutMutation } from '@/store/auth/api';
import { getAuth } from '@/store/auth/select';
import { useAppSelector } from '@/hooks/useRedux';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { UpdateProfile } from '@/components/UpdateProfile';
import { UpdatePasswordProfile } from '@/components/UpdatePasswordProfile';

export default function Profile() {
  const router = useRouter();
  useGetMeQuery();
  const [logout, { isLoading: logouting }] = useLogoutMutation();

  const { user } = useAppSelector(getAuth);

  const handleLogout = async () => {
    try {
      logout();
      router.dismissAll();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={user.name.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLogin}>@{user.login}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
      </Card>

      <UpdateProfile />
      <UpdatePasswordProfile />

      <Card style={styles.actionsCard}>
        <View style={styles.actionsContent}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Login:</Text>
            <Text style={styles.infoValue}>{user.login}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{user.role}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since:</Text>
            <Text style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <Button
            title="Sign Out"
            onPress={handleLogout}
            mode="outlined"
            loading={logouting}
            style={[styles.logoutButton, { borderColor: '#f44336' }]}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#6200EE',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLogin: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  actionsContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  logoutButton: {
    borderWidth: 1,
  },
});
