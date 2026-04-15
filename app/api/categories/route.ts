import { requireUser } from '@/lib/auth/requireUser';
import { parseCategoryInput } from '@/lib/validators/category';
import { createCategory, listCategories } from '@/lib/services/categoryService';
import { toErrorResponse } from '@/lib/utils/errors';
import { ok } from '@/lib/utils/api';

export async function GET() {
  try {
    const user = await requireUser();
    const categories = await listCategories(user.id);
    return ok(categories);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const payload = parseCategoryInput(await req.json());
    const category = await createCategory(user.id, payload);
    return ok(category, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
