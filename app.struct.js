module.exports = {
  // App directory
  rootLayout: 'app/_layout.tsx',
  
  // Auth group
  authLayout: 'app/(auth)/_layout.tsx',
  signInScreen: 'app/(auth)/sign-in.tsx',
  signUpScreen: 'app/(auth)/sign-up.tsx',
  
  // App group (protected routes)
  appLayout: 'app/(app)/_layout.tsx',
  homeScreen: 'app/(app)/index.tsx',
  rideScreen: 'app/(app)/ride.tsx',
  foodScreen: 'app/(app)/food.tsx',

  // Src directory
  store: 'src/store/store.ts',
  authSlice: 'src/store/authSlice.ts',
  authContext: 'src/contexts/auth.tsx',
  types: 'src/types/index.d.ts'
};

