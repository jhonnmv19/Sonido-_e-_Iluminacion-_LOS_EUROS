import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ujvcuuodacbtlvdnwafj.supabase.co'
    , 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdmN1dW9kYWNidGx2ZG53YWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTQ4MDYsImV4cCI6MjA3MzY5MDgwNn0.voYziriyh2ROHnekjhCnen0R6b3AGKdtNzqCa4llfBk')

// Suscribirse a cambios en la tabla usuarios
supabase
  .channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'usuarios' },
    (payload) => {
      console.log('Cambio detectado en usuarios:', payload)
    }
  )
  .subscribe()
