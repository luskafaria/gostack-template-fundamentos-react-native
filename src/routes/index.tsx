import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import AppRoutes from './app.routes';

import { useCart } from '../hooks/cart';

const Routes: React.FC = () => {
  const { loading } = useCart();

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  ) : (
    <AppRoutes />
  );
};

export default Routes;
