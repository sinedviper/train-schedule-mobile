import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenService {
  async setToken(
    token: string,
    type: 'accessToken' | 'refreshToken',
  ): Promise<boolean> {
    try {
      if (!token) {
        throw new Error('Missing tokens');
      }

      await AsyncStorage.setItem(type, token);

      const savedAccess = await this.getToken(type);

      if (!savedAccess) {
        throw new Error('Token verification failed after save');
      }

      return true;
    } catch (error) {
      console.error(
        'Error setting tokens:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async getToken(type: 'accessToken' | 'refreshToken'): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(type);
      return token;
    } catch (error) {
      console.error(
        'Error getting access token:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return null;
    }
  }

  async removeTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } catch (error) {
      console.error(
        'Error removing tokens:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw error;
    }
  }

  async isAuthenticated(
    type: 'accessToken' | 'refreshToken',
  ): Promise<boolean> {
    try {
      const token = await this.getToken(type);
      return !!token;
    } catch (error) {
      console.error(
        'Error checking authentication:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return false;
    }
  }
}

export default new TokenService();
