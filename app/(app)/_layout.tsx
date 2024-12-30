import React from 'react';
import { Redirect, Slot } from 'expo-router';
import { Box } from '@/src/components/ui/box';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

export default function AppLayout() {
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Redirect href={'/sign-in'} />
  }
  return (
    <Box className="flex-1">
      <Slot />
    </Box>
  );
}

