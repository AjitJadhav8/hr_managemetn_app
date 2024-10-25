import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isLoggedIn = !!localStorage.getItem('loggedInHR') || !!localStorage.getItem('loggedInCEO');
  console.log('Is logged in:', isLoggedIn); // Debugging line

  if (isLoggedIn) {
    return true; // Allow access if authenticated
  } else {
    console.log('User not authenticated, redirecting to login.'); // Debugging line
    router.navigate(['/login']);
    return false; // Deny access
  }
};
