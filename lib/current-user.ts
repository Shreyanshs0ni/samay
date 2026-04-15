import { requireUser } from '@/lib/auth/requireUser';

export async function getCurrentUser() {
  try {
    return await requireUser();
  } catch {
    return null;
  }
}
