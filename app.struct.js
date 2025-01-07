module.exports = {
  // App directory
  'ROOT_LAYOUT': 'app/_layout.tsx',
  
  // Auth group
  'AUTH_LAYOUT': 'app/(auth)/_layout.tsx',
  'SIGN_IN_SCREEN': 'app/(auth)/sign-in.tsx',
  'SIGN_UP_SCREEN': 'app/(auth)/sign-up.tsx',
  
  // App group (protected routes)
  'APP_LAYOUT': 'app/(app)/_layout.tsx',
  'ROOT_GROUP_LAYOUT': 'app/(app)/(root)/_layout.tsx',
  'HOME_SCREEN': 'app/(app)/(root)/index.tsx',
  'RIDE_SCREEN': 'app/(app)/(root)/ride.tsx',
  'PROFILE_SCREEN': 'app/(app)/(root)/profile.tsx',
  'FOOD_SCREEN': 'app/(app)/food.tsx',

  // Src directory
  'STORE': 'src/store/store.ts',
  'AUTH_SLICE': 'src/store/authSlice.ts',
  'AUTH_CONTEXT': 'src/contexts/auth.tsx',
  'TYPES': 'src/types/index.d.ts'
};

