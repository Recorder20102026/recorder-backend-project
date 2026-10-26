import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

@Module({
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: () => {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
          throw new Error(
            'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured',
          );
        }

        return createClient<Database>(url, key, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      },
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
