import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvcydeyeunqgpsdgibxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y3lkZXlldW5xZ3BzZGdpYnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzgyNDQsImV4cCI6MjA2MTM1NDI0NH0.2wxK_SQkO-dw7GxKsvvFDcy4E5Js-2GEaMRWyk-ICZ4';

export const supabase = createClient(supabaseUrl, supabaseKey);
