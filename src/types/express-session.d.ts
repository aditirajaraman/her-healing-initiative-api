// src/types/express-session.d.ts

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    username?: string;
    // Add other properties you might be storing
    userId?: string;
  }
}

// Augment the Express module's global namespace.
// This is necessary to tell TypeScript that the `Request` object has a `session` property.
declare global {
  namespace Express {
    interface Request {
      // The `session` property is now a part of the Request object's type definition.
      // We combine the base `Session` type with our augmented `SessionData`.
      // The `& Partial<SessionData>` ensures we get both the base session properties
      // and our custom ones, but handles the case where our custom ones might be
      // missing on a new session.
      session: import('express-session').Session & Partial<import('express-session').SessionData>;
    }
  }
}