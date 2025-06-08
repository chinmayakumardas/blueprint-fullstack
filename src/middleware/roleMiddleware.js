// // middleware/roleMiddleware.js
// import { NextResponse } from 'next/server';

// const rolePermissions = {
//   '/dashboard': ['cpc', 'pc', 'teamlead', 'employee'],
//   '/project': ['cpc', 'pc', 'employee'],
//   '/task': ['cpc', 'pc', 'teamlead', 'employee'],
//   '/client': ['cpc', 'pc'],
//   '/bug': ['cpc', 'pc', 'employee'],
// };

// export function roleMiddleware(req) {
//   const role = req.cookies.get('role')?.value; // You can switch to session/jwt
//   const path = req.nextUrl.pathname;

//   const allowedRoles = rolePermissions[path] || [];

//   if (!allowedRoles.includes(role)) {
//     return NextResponse.redirect(new URL('/unauthorized', req.url));
//   }

//   return NextResponse.next();
// }





import { NextResponse } from 'next/server';
import { rolePermissions } from '@/lib/rolePermissions';

export function roleMiddleware(request) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value;

  const matchedRoute = Object.keys(rolePermissions).find(route =>
    pathname.startsWith(route)
  );

  const allowedRoles = rolePermissions[matchedRoute];

  if (matchedRoute && (!role || !allowedRoles.includes(role))) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return null;
}
